import { dndzone as dndActionZone, overrideItemIdKeyNameBeforeInitialisingDndZones as overrideId, Options } from "svelte-dnd-action";
import {createEffect, createRenderEffect, onMount, onCleanup} from "solid-js";
export {
    TRIGGERS,
    SOURCES,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
    SHADOW_PLACEHOLDER_ITEM_ID,
    DRAGGED_ELEMENT_ID,
    alertToScreenReader,
    setDebugMode
} from "svelte-dnd-action";

type Flipper = {
    read: (ids: string[]) => void;
    flip: (ids: string[]) => void;
}
function createFlipper(node: HTMLElement, durationMS: number): Flipper {
    let idToRect = new Map();
    let idToAnim = new Map();

    function read(ids: string[]) {
        idToRect = new Map();
        Array.from(node.children).forEach((child, index) => {
            idToRect.set(ids[index], child.getBoundingClientRect());
        });
    }
    function flip(ids: string[]) {
        Array.from(node.children).forEach((child, index) => {
            const id = ids[index];
            const currentRect = child.getBoundingClientRect();
            const prevRect = idToRect.get(id);
            if (prevRect) {
                const transformX = prevRect.left - currentRect.left;
                const transformY = prevRect.top - currentRect.top;
                if (transformX || transformY) {
                    const keyFrames = [
                        {transform: `translate3d(${transformX}px, ${transformY}px, 0)`},
                        {transform: 'translate3d(0, 0, 0)'}
                    ];
                    const animationObj = child.animate(keyFrames, {duration: durationMS, easing: "ease-out"});
                    idToAnim.set(id, animationObj);
                    animationObj.onfinish = () => idToAnim.delete(id);
                    animationObj.oncancel = () => idToAnim.delete(id);
                }
            }
        });
    }

    return {read, flip};
}


const DEFAULT_FLIP_DURATION_MS = 150;
let ID_KEY = "id";
export function overrideItemIdKeyNameBeforeInitialisingDndZones(newId:string) {
    overrideId(newId);
    ID_KEY = newId;
}

type SolidOptions = {
    items: () => Array<Record<string, any>>; /**a getter the list of items (SIGNAL or a getter to STORE value) that was used to generate the children of the given node (the list used in the `<For>` block*/
    type?: string | (() => string); /**the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type*/
    flipDurationMs?: number | (() => number); /**the duration of the flip animation. zero means no animation*/
    dragDisabled?: boolean | (() => boolean);
    morphDisabled?: boolean | (() => boolean); /**whether dragged element should morph to zone dimensions*/
    dropFromOthersDisabled?: boolean | (() => boolean);
    zoneTabIndex?: number | (() => number); /**set the tabindex of the list container when not dragging*/
    dropTargetStyle?: Record<string, string> | (() => Record<string, string>);
    dropTargetClasses?: string[] | (() => string[]);
};

export function dndzone(node: HTMLElement, optionsGetter: () => SolidOptions) {
    const options = optionsGetter();
    validateOptions(options);
    const optionsAsGetters = addDefaultOptions(optionsToGetters(options));
    const {flipDurationMs: getFlipDurationMs} = optionsAsGetters;
    const getItems = optionsAsGetters.items as () => Array<Record<string, any>>;
    let flipper: (Flipper | undefined) = undefined;

    onMount(() => {
        const {update, destroy} = dndActionZone(node, gettersToOptions(optionsAsGetters));
        onCleanup(destroy);
        createEffect(function updateOptionsAndTriggerFlip() {
            update(gettersToOptions(optionsAsGetters));
            flipper?.flip(getItems().map(item => item[ID_KEY]));
        });
    });
    createEffect(function updateFlipperWhenFipDurationChanges() {
        flipper = createFlipper(node, getFlipDurationMs())
    })
    createRenderEffect(function storeFlipInformation() {
        function adaptConsider() {
            flipper?.read(getItems().map(item => item[ID_KEY]));
        }
        function adaptFinalize() {
            flipper?.read(getItems().map(item => item[ID_KEY]));
        }
        node.addEventListener('consider', adaptConsider);
        node.addEventListener('finalize', adaptFinalize);
        onCleanup(() => {
            node.removeEventListener('consider', adaptConsider);
            node.removeEventListener('finalize', adaptFinalize)
        })
    });
}

/* Helper functions */
function makeGetter(option: any) {
    return (typeof option === "function") ? option : () => option;
}

/**
 * Converts an object with either getters or values to an object of getters so that all of the element can be treated the same
 */
function optionsToGetters(options: Record<string, any>) {
    return Object.keys(options).reduce((res:Record<string, any>, optName) => {res[optName] = makeGetter(options[optName]); return res;}, {}) as Record<string, () => any>;
}
function validateOptions(options: SolidOptions) {
    if(typeof options.items !== "function") {
        throw new Error(`dndzone didn't get an items getter, which is a mandatory option in ${JSON.stringify(options)}`);
    }
}
function addDefaultOptions(optionGetters: Record<string, () => any>) {
    if (typeof optionGetters.flipDurationMs !== "function") {
        return {...optionGetters, flipDurationMs: () => DEFAULT_FLIP_DURATION_MS}
    }
    return  optionGetters;
}

/**
 * Calls each getter and maps it to its value (so it can be given to the lib
 */
function gettersToOptions(optionGetters: Record<string, () => any>) : Options {
    return Object.keys(optionGetters).reduce((res:Record<string, any>, optName) => {res[optName] = optionGetters[optName](); return res;}, {}) as Options;
}
