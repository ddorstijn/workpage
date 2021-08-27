
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            if (info.blocks[i] === block) {
                                info.blocks[i] = null;
                            }
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}
function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
        child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
        child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

var lovefield_min = {exports: {}};

(function (module) {
if(!self.window){window=self;}
(function(){function aa(){return function(){}}function ba(a){return function(b){this[a]=b;}}function g(a){return function(){return this[a]}}function k(a){return function(){return a}}var m,da=this;function n(a){return void 0!==a}function ea(){}
function fa(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return "array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return "object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return "array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return "function"}else return "null";
else if("function"==b&&"undefined"==typeof a.call)return "object";return b}function ga(a){return null!=a}function ha(a){var b=fa(a);return "array"==b||"object"==b&&"number"==typeof a.length}function ia(a){return "string"==typeof a}function ja(a){return "function"==fa(a)}function ka(a){return a[la]||(a[la]=++ma)}var la="closure_uid_"+(1E9*Math.random()>>>0),ma=0;function na(a,b,c){return a.call.apply(a.bind,arguments)}
function oa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function pa(a,b,c){pa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?na:oa;return pa.apply(null,arguments)}
function qa(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}function q(a,b){a=a.split(".");var c=da;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&n(b)?c[d]=b:c=c[d]&&Object.prototype.hasOwnProperty.call(c,d)?c[d]:c[d]={};}
function r(a,b){function c(){}c.prototype=b.prototype;a.hb=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Vg=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)};}function ra(a){if(Error.captureStackTrace)Error.captureStackTrace(this,ra);else {var b=Error().stack;b&&(this.stack=b);}a&&(this.message=String(a));}r(ra,Error);ra.prototype.name="CustomError";var ta=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
function ua(a,b){var c=0;a=ta(String(a)).split(".");b=ta(String(b)).split(".");for(var d=Math.max(a.length,b.length),e=0;0==c&&e<d;e++){var f=a[e]||"",h=b[e]||"";do{f=/(\d*)(\D*)(.*)/.exec(f)||["","","",""];h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];if(0==f[0].length&&0==h[0].length)break;c=va(0==f[1].length?0:parseInt(f[1],10),0==h[1].length?0:parseInt(h[1],10))||va(0==f[2].length,0==h[2].length)||va(f[2],h[2]);f=f[3];h=h[3];}while(0==c)}return c}function va(a,b){return a<b?-1:a>b?1:0}function wa(a,b,c){this.pg=c;this.Of=a;this.Kg=b;this.qd=0;this.fd=null;}wa.prototype.get=function(){var a;0<this.qd?(this.qd--,a=this.fd,this.fd=a.next,a.next=null):a=this.Of();return a};wa.prototype.put=function(a){this.Kg(a);this.qd<this.pg&&(this.qd++,a.next=this.fd,this.fd=a);};var xa=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(ia(a))return ia(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return -1},ya=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c);}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a);},za=Array.prototype.map?function(a,b,c){return Array.prototype.map.call(a,
b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=ia(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));return e},Aa=Array.prototype.reduce?function(a,b,c,d){d&&(b=pa(b,d));return Array.prototype.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;ya(a,function(c,h){e=b.call(d,e,c,h,a);});return e},Ba=Array.prototype.some?function(a,b,c){return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return !0;return !1};
function Ca(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)}function Da(a){for(var b=[],c=0;c<a;c++)b[c]=0;return b}function Ea(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];if("array"==fa(d))for(var e=0;e<d.length;e+=8192)for(var f=Ea.apply(null,Ca(d,e,e+8192)),h=0;h<f.length;h++)b.push(f[h]);else b.push(d);}return b}function Fa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}var Ga;a:{var Ha=da.navigator;if(Ha){var Ia=Ha.userAgent;if(Ia){Ga=Ia;break a}}Ga="";}function t(a){return -1!=Ga.indexOf(a)}function Ja(){return t("Safari")&&!(Ka()||t("Coast")||t("Opera")||t("Edge")||t("Silk")||t("Android"))}function Ka(){return (t("Chrome")||t("CriOS"))&&!t("Edge")}function La(a){da.setTimeout(function(){throw a;},0);}var Ma;
function Oa(){var a=da.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!t("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=pa(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage();},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d);}};});if("undefined"!==typeof a&&!t("Trident")&&!t("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(n(c.next)){c=c.next;var a=c.Fe;c.Fe=null;a();}};return function(a){d.next={Fe:a};d=d.next;b.port2.postMessage(0);}}return "undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null;};document.documentElement.appendChild(b);}:function(a){da.setTimeout(a,0);}}function Pa(){this.Bd=this.oc=null;}var Ra=new wa(function(){return new Qa},function(a){a.reset();},100);Pa.prototype.add=function(a,b){var c=Ra.get();c.set(a,b);this.Bd?this.Bd.next=c:this.oc=c;this.Bd=c;};Pa.prototype.remove=function(){var a=null;this.oc&&(a=this.oc,this.oc=this.oc.next,this.oc||(this.Bd=null),a.next=null);return a};function Qa(){this.next=this.scope=this.Td=null;}Qa.prototype.set=function(a,b){this.Td=a;this.scope=b;this.next=null;};
Qa.prototype.reset=function(){this.next=this.scope=this.Td=null;};function Sa(a,b){Ta||Ua();Va||(Ta(),Va=!0);Wa.add(a,b);}var Ta;function Ua(){if(-1!=String(da.Promise).indexOf("[native code]")){var a=da.Promise.resolve(void 0);Ta=function(){a.then(Xa);};}else Ta=function(){var a=Xa;!ja(da.setImmediate)||da.Window&&da.Window.prototype&&!t("Edge")&&da.Window.prototype.setImmediate==da.setImmediate?(Ma||(Ma=Oa()),Ma(a)):da.setImmediate(a);};}var Va=!1,Wa=new Pa;function Xa(){for(var a;a=Wa.remove();){try{a.Td.call(a.scope);}catch(b){La(b);}Ra.put(a);}Va=!1;}function u(a,b){this.Ta=0;this.nf=void 0;this.Vc=this.dc=this.D=null;this.ed=this.Rd=!1;if(a!=ea)try{var c=this;a.call(b,function(a){Ya(c,2,a);},function(a){Ya(c,3,a);});}catch(d){Ya(this,3,d);}}function Za(){this.next=this.context=this.ic=this.Ic=this.child=null;this.Ed=!1;}Za.prototype.reset=function(){this.context=this.ic=this.Ic=this.child=null;this.Ed=!1;};var $a=new wa(function(){return new Za},function(a){a.reset();},100);function ab(a,b,c){var d=$a.get();d.Ic=a;d.ic=b;d.context=c;return d}
function v(a){if(a instanceof u)return a;var b=new u(ea);Ya(b,2,a);return b}function bb(a){return new u(function(b,c){c(a);})}function cb(a,b,c){db(a,b,c,null)||Sa(qa(b,a));}function eb(a){return new u(function(b,c){var d=a.length,e=[];if(d)for(var f=function(a,c){d--;e[a]=c;0==d&&b(e);},h=function(a){c(a);},l=0,p;l<a.length;l++)p=a[l],cb(p,qa(f,l),h);else b(e);})}function w(){var a,b,c=new u(function(c,e){a=c;b=e;});return new fb(c,a,b)}
u.prototype.then=function(a,b,c){return gb(this,ja(a)?a:null,ja(b)?b:null,c)};u.prototype.then=u.prototype.then;u.prototype.$goog_Thenable=!0;u.prototype.ve=function(a,b){return gb(this,null,a,b)};function hb(a,b){a.dc||2!=a.Ta&&3!=a.Ta||ib(a);a.Vc?a.Vc.next=b:a.dc=b;a.Vc=b;}
function gb(a,b,c,d){var e=ab(null,null,null);e.child=new u(function(a,h){e.Ic=b?function(c){try{var e=b.call(d,c);a(e);}catch(L){h(L);}}:a;e.ic=c?function(b){try{var e=c.call(d,b);!n(e)&&b instanceof jb?h(b):a(e);}catch(L){h(L);}}:h;});e.child.D=a;hb(a,e);return e.child}u.prototype.Qg=function(a){this.Ta=0;Ya(this,2,a);};u.prototype.Rg=function(a){this.Ta=0;Ya(this,3,a);};
function Ya(a,b,c){0==a.Ta&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.Ta=1,db(c,a.Qg,a.Rg,a)||(a.nf=c,a.Ta=b,a.D=null,ib(a),3!=b||c instanceof jb||kb(a,c)));}function db(a,b,c,d){if(a instanceof u)return hb(a,ab(b||ea,c||null,d)),!0;var e;if(a)try{e=!!a.$goog_Thenable;}catch(h){e=!1;}else e=!1;if(e)return a.then(b,c,d),!0;e=typeof a;if("object"==e&&null!=a||"function"==e)try{var f=a.then;if(ja(f))return lb(a,f,b,c,d),!0}catch(h){return c.call(d,h),!0}return !1}
function lb(a,b,c,d,e){function f(a){l||(l=!0,d.call(e,a));}function h(a){l||(l=!0,c.call(e,a));}var l=!1;try{b.call(a,h,f);}catch(p){f(p);}}function ib(a){a.Rd||(a.Rd=!0,Sa(a.Vf,a));}function mb(a){var b=null;a.dc&&(b=a.dc,a.dc=b.next,b.next=null);a.dc||(a.Vc=null);return b}
u.prototype.Vf=function(){for(var a;a=mb(this);){var b=this.Ta,c=this.nf;if(3==b&&a.ic&&!a.Ed){var d;for(d=this;d&&d.ed;d=d.D)d.ed=!1;}if(a.child)a.child.D=null,nb(a,b,c);else try{a.Ed?a.Ic.call(a.context):nb(a,b,c);}catch(e){ob.call(null,e);}$a.put(a);}this.Rd=!1;};function nb(a,b,c){2==b?a.Ic.call(a.context,c):a.ic&&a.ic.call(a.context,c);}function kb(a,b){a.ed=!0;Sa(function(){a.ed&&ob.call(null,b);});}var ob=La;function jb(a){ra.call(this,a);}r(jb,ra);jb.prototype.name="cancel";
function fb(a,b,c){this.ha=a;this.resolve=b;this.reject=c;}function pb(a,b,c,d){c=c||function(a,b){return a==b};d=d||function(b){return a[b]};for(var e=a.length,f=b.length,h=[],l=0;l<e+1;l++)h[l]=[],h[l][0]=0;for(var p=0;p<f+1;p++)h[0][p]=0;for(l=1;l<=e;l++)for(p=1;p<=f;p++)c(a[l-1],b[p-1])?h[l][p]=h[l-1][p-1]+1:h[l][p]=Math.max(h[l-1][p],h[l][p-1]);for(var L=[],l=e,p=f;0<l&&0<p;)c(a[l-1],b[p-1])?(L.unshift(d(l-1,p-1)),l--,p--):h[l-1][p]>h[l][p-1]?l--:p--;return L}function qb(a){return Aa(arguments,function(a,c){return a+c},0)}
function rb(a){return qb.apply(null,arguments)/arguments.length}function sb(a){var b=arguments.length;if(2>b)return 0;var c=rb.apply(null,arguments);return qb.apply(null,za(arguments,function(a){return Math.pow(a-c,2)}))/(b-1)}function tb(a){return Math.sqrt(sb.apply(null,arguments))}var ub="StopIteration"in da?da.StopIteration:{message:"StopIteration",stack:""};function vb(){}vb.prototype.next=function(){throw ub;};vb.prototype.pc=function(){return this};function wb(a){if(a instanceof vb)return a;if("function"==typeof a.pc)return a.pc(!1);if(ha(a)){var b=0,c=new vb;c.next=function(){for(;;){if(b>=a.length)throw ub;if(b in a)return a[b++];b++;}};return c}throw Error("Not implemented");}
function xb(a,b){if(ha(a))try{ya(a,b,void 0);}catch(c){if(c!==ub)throw c;}else {a=wb(a);try{for(;;)b.call(void 0,a.next(),void 0,a);}catch(c){if(c!==ub)throw c;}}}function yb(a){if(Ba(arguments,function(a){return !a.length})||!arguments.length)return new vb;var b=new vb,c=arguments,d=Da(c.length);b.next=function(){if(d){for(var a=za(d,function(a,b){return c[b][a]}),b=d.length-1;0<=b;b--){if(d[b]<c[b].length-1){d[b]++;break}if(0==b){d=null;break}d[b]=0;}return a}throw ub;};return b}function zb(a,b){this.l={};this.a=[];this.Ua=this.Eb=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1]);}else a&&this.addAll(a);}m=zb.prototype;m.zc=g("Eb");m.qa=function(){Ab(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.l[this.a[b]]);return a};function Bb(a){Ab(a);return a.a.concat()}m.Pa=function(a){return Eb(this.l,a)};m.jd=function(){return 0==this.Eb};
m.clear=function(){this.l={};this.Ua=this.Eb=this.a.length=0;};m.remove=function(a){return Eb(this.l,a)?(delete this.l[a],this.Eb--,this.Ua++,this.a.length>2*this.Eb&&Ab(this),!0):!1};function Ab(a){if(a.Eb!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];Eb(a.l,d)&&(a.a[c++]=d);b++;}a.a.length=c;}if(a.Eb!=a.a.length){for(var e={},c=b=0;b<a.a.length;)d=a.a[b],Eb(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c;}}m.get=function(a,b){return Eb(this.l,a)?this.l[a]:b};
m.set=function(a,b){Eb(this.l,a)||(this.Eb++,this.a.push(a),this.Ua++);this.l[a]=b;};m.addAll=function(a){var b;if(a instanceof zb)b=Bb(a),a=a.qa();else {b=[];var c=0,d;for(d in a)b[c++]=d;a=Fa(a);}for(c=0;c<b.length;c++)this.set(b[c],a[c]);};m.forEach=function(a,b){for(var c=Bb(this),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this);}};m.clone=function(){return new zb(this)};
m.pc=function(a){Ab(this);var b=0,c=this.Ua,d=this,e=new vb;e.next=function(){if(c!=d.Ua)throw Error("The map has changed since the iterator was created");if(b>=d.a.length)throw ub;var e=d.a[b++];return a?e:d.l[e]};return e};function Eb(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function Fb(){return t("iPhone")&&!t("iPod")&&!t("iPad")}function Gb(a,b){var c=Hb;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)}var Ib=t("Opera"),Jb=t("Trident")||t("MSIE"),Kb=t("Edge"),Lb=t("Gecko")&&!(-1!=Ga.toLowerCase().indexOf("webkit")&&!t("Edge"))&&!(t("Trident")||t("MSIE"))&&!t("Edge"),Mb=-1!=Ga.toLowerCase().indexOf("webkit")&&!t("Edge"),Nb=t("Macintosh"),Ob=t("Windows"),Pb=t("Android"),Qb=Fb(),Rb=t("iPad"),Sb=t("iPod"),Tb;
a:{var Ub="",Vb=function(){var a=Ga;if(Lb)return /rv\:([^\);]+)(\)|;)/.exec(a);if(Kb)return /Edge\/([\d\.]+)/.exec(a);if(Jb)return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Mb)return /WebKit\/(\S+)/.exec(a);if(Ib)return /(?:Version)[ \/]?(\S+)/.exec(a)}();Vb&&(Ub=Vb?Vb[1]:"");if(Jb){var Wb,Xb=da.document;Wb=Xb?Xb.documentMode:void 0;if(null!=Wb&&Wb>parseFloat(Ub)){Tb=String(Wb);break a}}Tb=Ub;}var Yb=Tb,Hb={};function Zb(a){return Gb(a,function(){return 0<=ua(Yb,a)})}var $b=function(){var a;return Ob?(a=/Windows NT ([0-9.]+)/,(a=a.exec(Ga))?a[1]:"0"):Nb?(a=/10[_.][0-9_.]+/,(a=a.exec(Ga))?a[0].replace(/_/g,"."):"10"):Pb?(a=/Android\s+([^\);]+)(\)|;)/,(a=a.exec(Ga))?a[1]:""):Qb||Rb||Sb?(a=/(?:iPhone|CPU)\s+OS\s+(\S+)/,(a=a.exec(Ga))?a[1].replace(/_/g,"."):""):""}();var ac=Fb()||t("iPod"),bc=t("iPad");/*

 Copyright 2015 The Lovefield Project Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function cc(){var a;!(a=Ja()&&!Zb(10))&&(a=bc||ac)&&(a=!(0<=ua($b,10)));this.ae=a;this.fg=!(this.ae||Jb&&!Zb(10));!Jb||Zb(11);this.Ug=Ka()||Ja();this.ug=n(window.Map)&&n(window.Map.prototype.values)&&n(window.Map.prototype.forEach)&&!this.ae;this.vg=n(window.Set)&&n(window.Set.prototype.values)&&n(window.Set.prototype.forEach)&&!this.ae;}var dc;function ec(){n(dc)||(dc=new cc);return dc}function x(){this.l=new zb;Object.defineProperty(this,"size",{get:function(){return this.l.zc()}});}x.prototype.clear=function(){this.l.clear();};x.prototype.clear=x.prototype.clear;x.prototype.delete=function(a){return this.l.remove(a)};x.prototype["delete"]=x.prototype.delete;x.prototype.forEach=function(a,b){return this.l.forEach(a,b)};x.prototype.forEach=x.prototype.forEach;x.prototype.get=function(a){return this.l.get(a)};x.prototype.get=x.prototype.get;x.prototype.has=function(a){return this.l.Pa(a)};
x.prototype.has=x.prototype.has;x.prototype.set=function(a,b){return this.l.set(a,b)};x.prototype.set=x.prototype.set;var fc=ec().ug;function y(){return fc?new window.Map:new x}function gc(a){if(a instanceof x)return Bb(a.l);var b=0,c=Array(a.size);a.forEach(function(a,e){c[b++]=e;});return c}function z(a){if(a instanceof x)return a.l.qa();var b=0,c=Array(a.size);a.forEach(function(a){c[b++]=a;});return c}function hc(a,b){this.sa=a;this.m=b||this.Ke();}var ic=0;m=hc.prototype;m.id=g("sa");m.Ke=function(){return {}};m.wf=g("m");m.Ja=function(){return {id:this.sa,value:this.wf()}};m.nb=function(a){return "#"==a.substr(-1)?this.sa:null};function jc(a){return new hc(a.id,a.value)}function kc(a){return new hc(ic++,a||{})}function lc(a){if(null==a)return null;a=new Uint8Array(a);for(var b="",c=0;c<a.length;++c)var d=a[c].toString(16),b=b+(2>d.length?"0"+d:d);return b}var mc={};q("lf.TransactionType",mc);mc.READ_ONLY=0;mc.READ_WRITE=1;function A(a,b,c,d,e){this.wd=a;this.jg=b;this.Tg=c;this.Qf=d;this.Jf=e;}q("lf.TransactionStats",A);A.prototype.Og=g("wd");A.prototype.success=A.prototype.Og;A.prototype.ig=g("jg");A.prototype.insertedRowCount=A.prototype.ig;A.prototype.Sg=g("Tg");A.prototype.updatedRowCount=A.prototype.Sg;A.prototype.Pf=g("Qf");A.prototype.deletedRowCount=A.prototype.Pf;A.prototype.If=g("Jf");A.prototype.changedTableCount=A.prototype.If;function nc(a,b){this.yd=a;this.Ra=b||null;this.S=w();this.wd=!1;this.za=null;}nc.prototype.ka=function(){return (0==this.yd?this.sc():oc(this)).then(function(a){this.wd=!0;return a}.bind(this))};function oc(a){try{pc(a.Ra);}catch(b){return bb(b)}return qc(a).then(function(a){this.Ra.ka();return a}.bind(a))}function qc(a){rc(a);sc(a);return a.sc()}
function rc(a){a.Ra.ib.forEach(function(a,c){c=this.Ra.da().get(c);c=this.I(c.getName(),c.kb.bind(c),0);var b=z(a.xa).map(function(a){return a.id()});0<b.length&&c.remove(b).ve(this.Te,this);a=z(a.la).map(function(a){return a[1]}).concat(z(a.wa));c.put(a).ve(this.Te,this);},a);}function sc(a){tc(a.Ra).forEach(function(a){var b=this.I(a.getName(),jc,1);b.remove([]);b.put(a.Ja());},a);}nc.prototype.Te=function(a){this.S.reject(a);};
nc.prototype.Y=function(){if(null===this.za)if(this.wd)if(0==this.yd)this.za=new A(!0,0,0,0,0);else {var a=0,b=0,c=0,d=0;this.Ra.ib.forEach(function(e){d++;a+=e.wa.size;c+=e.la.size;b+=e.xa.size;});this.za=new A(!0,a,c,b,d);}else this.za=new A(!1,0,0,0,0);return this.za};function uc(a){this.Lg=a;}uc.prototype.toString=g("Lg");var vc=new uc("backstore"),wc=new uc("cache"),xc=new uc("indexstore"),yc=new uc("engine"),zc=new uc("runner"),Ac=new uc("observerregistry"),Bc=new uc("schema");function Cc(a){if(a.qa&&"function"==typeof a.qa)return a.qa();if(ia(a))return a.split("");if(ha(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Fa(a)}function Dc(a){this.l=new zb;a&&this.addAll(a);}function Ec(a){var b=typeof a;return "object"==b&&a||"function"==b?"o"+ka(a):b.substr(0,1)+a}m=Dc.prototype;m.zc=function(){return this.l.zc()};m.add=function(a){this.l.set(Ec(a),a);};m.addAll=function(a){a=Cc(a);for(var b=a.length,c=0;c<b;c++)this.add(a[c]);};m.remove=function(a){return this.l.remove(Ec(a))};m.clear=function(){this.l.clear();};m.jd=function(){return this.l.jd()};m.contains=function(a){return this.l.Pa(Ec(a))};m.qa=function(){return this.l.qa()};
m.clone=function(){return new Dc(this)};m.pc=function(){return this.l.pc(!1)};function Fc(a){this.Xb=new Dc(a);Object.defineProperty(this,"size",{get:function(){return this.Xb.zc()}});}Fc.prototype.add=function(a){this.Xb.add(a);};Fc.prototype.add=Fc.prototype.add;Fc.prototype.clear=function(){this.Xb.clear();};Fc.prototype.clear=Fc.prototype.clear;Fc.prototype.delete=function(a){return this.Xb.remove(a)};Fc.prototype["delete"]=Fc.prototype.delete;Fc.prototype.forEach=function(a,b){this.Xb.qa().forEach(a,b);};Fc.prototype.has=function(a){return this.Xb.contains(a)};
Fc.prototype.has=Fc.prototype.has;var Gc=ec().vg;function B(a){return Gc?n(a)?new window.Set(a):new window.Set:new Fc(a)}function C(a){if(a instanceof Fc)return a.Xb.qa();var b=0,c=Array(a.size);a.forEach(function(a){c[b++]=a;});return c}function Hc(a,b){if(b.size>a.size)return !1;var c=!0;b.forEach(function(b){c=c&&a.has(b);});return c}function Ic(a,b){this.sa=a;this.m=b||{};}function Jc(a){var b=B();a.forEach(function(a){b.add(a>>9);});return C(b)}Ic.prototype.W=g("sa");function Kc(a,b){b.forEach(function(a){this.m[a.id()]=a.Ja();},a);}function Lc(a,b){b.forEach(function(a){delete this.m[a];},a);}Ic.prototype.Ja=function(){return {id:this.sa,value:JSON.stringify(this.m)}};function Mc(a){return new Ic(a.id,JSON.parse(a.value))}function Nc(a,b,c){this.Z=a;this.Gb=b;this.pf=c;}m=Nc.prototype;m.get=function(a){if(0==a.length)return this.Vd();var b=this.Gb;return Oc(this,a).then(function(c){return a.map(function(a){var d=c.get(a>>9);return b(d.m[a])})})};function Oc(a,b){var c=y(),d=w();a=Jc(b).map(function(a){return new u(function(b,d){var e;try{e=this.Z.get(a);}catch(p){d(p);return}e.onerror=d;e.onsuccess=function(a){a=Mc(a.target.result);c.set(a.W(),a);b();};},this)},a);eb(a).then(function(){d.resolve(c);});return d.ha}
m.Vd=function(){return new u(function(a,b){var c=[],d;try{d=this.Z.openCursor();}catch(e){b(e);return}d.onerror=b;d.onsuccess=function(){var b=d.result;if(b){var f=Mc(b.value).m,h;for(h in f)c.push(this.Gb(f[h]));b.continue();}else a(c);}.bind(this);},this)};m.Tb=function(a){return new u(function(b,c){var d;try{d=a();}catch(e){c(e);return}d.onsuccess=b;d.onerror=c;},this)};
m.put=function(a){if(0==a.length)return v();var b=y();a.forEach(function(a){var c=a.id()>>9,e=b.get(c)||null;null===e&&(e=this.pf(this.Z.name,c));Kc(e,[a]);b.set(c,e);},this);a=z(b).map(function(a){return this.Tb(function(){return this.Z.put(a.Ja())}.bind(this))},this);return eb(a)};
m.remove=function(a){if(0==a.length)return this.Tb(function(){return this.Z.clear()}.bind(this));var b=y();a.forEach(function(a){var c=a>>9,e=b.get(c)||null;null===e&&(e=this.pf(this.Z.name,c));Lc(e,[a]);b.set(c,e);},this);a=z(b).map(function(a){return this.Tb(function(){return 0==Object.keys(a.m).length?this.Z.delete(a.W()):this.Z.put(a.Ja())}.bind(this))},this);return eb(a)};function Pc(a,b,c){a=a.b(wc);var d=[c<<9,(c+1<<9)-1];b=a.Va(b,d[0],d[1]);c=new Ic(c);Kc(c,b);return c}
function Qc(a,b){return new Ic(b)}function Rc(a){this.V=a.b(wc);this.C=a.b(xc);this.g=a.b(Bc);}Rc.prototype.update=function(a){a.forEach(function(a){Sc(this,a);Uc(this,a);},this);};function Uc(a,b){var c=b.getName();b.xa.forEach(function(a,b){this.V.remove(c,b);},a);b.wa.forEach(function(a){this.V.set(c,a);},a);b.la.forEach(function(a){this.V.set(c,a[1]);},a);}function Sc(a,b){var c=a.g.table(b.getName());Vc(b).forEach(function(a){Wc(this,c,a);},a);}
function Wc(a,b,c){var d=a.C.lc.get(b.getName())||[],e=0;d.forEach(function(a){try{Xc(a,c),e++;}catch(h){throw d.slice(0,e).forEach(function(a){Xc(a,[c[1],c[0]]);},this),h;}},a);}function Xc(a,b){var c=null===b[1]?void 0:b[1].nb(a.getName()),d=null===b[0]?void 0:b[0].nb(a.getName());if(!n(d)&&n(c))a.add(c,b[1].id());else if(n(d)&&n(c)){if(null===c||null===d){if(c==d)return}else if(0==a.jb().compare(d,c))return;a.add(c,b[1].id());a.remove(d,b[0].id());}else n(d)&&!n(c)&&a.remove(d,b[0].id());}var Yc={};q("lf.ConstraintAction",Yc);Yc.RESTRICT=0;Yc.CASCADE=1;var Zc={};q("lf.ConstraintTiming",Zc);Zc.IMMEDIATE=0;Zc.DEFERRABLE=1;var $c={};q("lf.Order",$c);$c.DESC=0;$c.ASC=1;var ad={};q("lf.Type",ad);ad.ARRAY_BUFFER=0;ad.BOOLEAN=1;ad.DATE_TIME=2;ad.INTEGER=3;ad.NUMBER=4;ad.STRING=5;ad.OBJECT=6;var bd={0:null,1:!1,2:Object.freeze(new Date(0)),3:0,4:0,5:"",6:null};q("lf.type.DEFAULT_VALUES",bd);function D(a,b){this.code=a;this.message="http://google.github.io/lovefield/error_lookup/src/error_lookup.html?c="+a;if(1<arguments.length)for(var c=1;c<=Math.min(4,arguments.length-1);++c)this.message+="&p"+(c-1)+"="+encodeURIComponent(String(arguments[c]).slice(0,64));}r(D,Error);function cd(){this.l=y();this.size=0;}m=cd.prototype;m.has=function(a){return this.l.has(a)};m.set=function(a,b){var c=this.l.get(a)||null;null===c&&(c=B(),this.l.set(a,c));c.has(b)||(c.add(b),this.size++);return this};m.Wb=function(a,b){var c=this.l.get(a)||null;null===c&&(c=B(),this.l.set(a,c));b.forEach(function(a){c.has(a)||(c.add(a),this.size++);},this);return this};m.be=function(a){a.keys().forEach(function(b){var c=a.get(b);this.Wb(b,c);},this);return this};
m.delete=function(a,b){var c=this.l.get(a)||null;if(null===c)return !1;if(b=c.delete(b))--this.size,0==c.size&&this.l.delete(a);return b};m.get=function(a){a=this.l.get(a)||null;return null===a?null:C(a)};m.clear=function(){this.l.clear();this.size=0;};m.keys=function(){return gc(this.l)};m.values=function(){var a=[];this.l.forEach(function(b){a.push.apply(a,C(b));});return a};function dd(a){this.C=a.b(xc);this.g=a.b(Bc);this.V=a.b(wc);this.$c=null;}function ed(a,b,c){var d=b.Mb.xg;c.forEach(function(a){d.forEach(function(b){if(null==a.m[b.getName()])throw new D(202,b.j());},this);},a);}function fd(a,b,c,d){b.Mb.Ud.forEach(function(a){a.timing==d&&gd(this,a,c);},a);}function gd(a,b,c){var d=hd(a,b);c.forEach(function(a){if(id(a[0],a[1],b.name)&&(a=a[1].nb(b.name),null!==a&&!d.Pa(a)))throw new D(203,b.name);},a);}
function hd(a,b){null===a.$c&&(a.$c=y());var c=a.$c.get(b.name)||null;null===c&&(c=a.g.table(b.Xa)[b.Jc].Ca(),c=a.C.get(c.j()),a.$c.set(b.name,c));return c}function id(a,b,c){return (null===a?null!==b:null===b)||a.nb(c)!=b.nb(c)}function jd(a,b,c,d){b=kd(a.g.info(),b.getName(),0);null!==b&&(b=b.filter(function(a){return a.timing==d}),0!=b.length&&ld(a,b,c,function(a,b,c){if(b.Pa(c))throw new D(203,a.name);}));}
function md(a,b,c){b=kd(a.g.info(),b.getName(),1);if(null===b)return null;var d=new cd;ld(a,b,c,function(a,b,c){b=b.get(c);0<b.length&&d.Wb(a.Ge,b);});return d}function nd(a,b,c){var d=new cd;ld(a,c,b,function(a,b,c,l){b.get(c).forEach(function(b){d.set(b,{Sd:a,Cg:l[1]});});});return d}function ld(a,b,c,d){b.forEach(function(a){var b=this.C.get(a.name),e=hd(this,a);c.forEach(function(c){if(id(c[0],c[1],e.getName())){var f=c[0].nb(e.getName());d(a,b,f,c);}},this);},a);}
function od(a,b,c,d){0!=c.length&&(c=c.map(function(a){return [null,a]}),fd(a,b,c,d));}function pd(a,b,c,d){0!=c.length&&(fd(a,b,c,d),jd(a,b,c,d));}function qd(a,b,c,d){0!=c.length&&(c=c.map(function(a){return [a,null]}),jd(a,b,c,d));}
function rd(a,b,c){var d={ue:[],rf:new cd},e=new cd;e.Wb(b.getName(),c.map(function(a){return a.id()}));do{var f=new cd;e.keys().forEach(function(a){var b=this.g.table(a);a=e.get(a).map(function(a){return [this.V.get(a),null]},this);b=md(this,b,a);null!==b&&(d.ue.unshift.apply(d.ue,b.keys()),f.be(b));},a);e=f;d.rf.be(e);}while(0<e.size);return d}function sd(a){this.wa=y();this.la=y();this.xa=y();this.A=a;}m=sd.prototype;m.getName=g("A");m.add=function(a){if(this.xa.has(a.id())){var b=[this.xa.get(a.id()),a];this.la.set(a.id(),b);this.xa.delete(a.id());}else this.wa.set(a.id(),a);};m.modify=function(a){var b=a[1],c=a[0].id();this.wa.has(c)?this.wa.set(c,b):(this.la.has(c)&&(a=[this.la.get(a[0].id())[0],b]),this.la.set(c,a));};
m.delete=function(a){if(this.wa.has(a.id()))this.wa.delete(a.id());else if(this.la.has(a.id())){var b=this.la.get(a.id())[0];this.la.delete(a.id());this.xa.set(a.id(),b);}else this.xa.set(a.id(),a);};m.be=function(a){a.wa.forEach(function(a){this.add(a);},this);a.la.forEach(function(a){this.modify(a);},this);a.xa.forEach(function(a){this.delete(a);},this);};
function Vc(a){var b=[];a.wa.forEach(function(a){b.push([null,a]);});a.la.forEach(function(a){b.push(a);});a.xa.forEach(function(a){b.push([a,null]);});return b}m.toString=function(){return "["+gc(this.wa).toString()+"], ["+gc(this.la).toString()+"], ["+gc(this.xa).toString()+"]"};function td(a){var b=new sd(a.A);a.wa.forEach(function(a){b.delete(a);});a.xa.forEach(function(a){b.add(a);});a.la.forEach(function(a){b.modify([a[1],a[0]]);});return b}
m.jd=function(){return 0==this.wa.size&&0==this.xa.size&&0==this.la.size};function ud(a,b){this.aa=y();b.forEach(function(a){this.aa.set(a.getName(),a);},this);this.g=a.b(Bc);this.V=a.b(wc);this.C=a.b(xc);this.Aa=new dd(a);this.gd=new Rc(a);this.ib=y();}function tc(a){var b=[];gc(a.ib).map(function(a){return this.aa.get(a)},a).forEach(function(a){a.Cb()&&(a.Da().forEach(function(a){b.push(this.C.get(a.j()));},this),b.push(this.C.get(a.getName()+".#")));},a);return b}m=ud.prototype;m.da=g("aa");
m.Ab=function(a,b){vd(this,a);ed(this.Aa,a,b);od(this.Aa,a,b,0);for(var c=0;c<b.length;c++)wd(this,a,[null,b[c]]);};function wd(a,b,c){var d=b.getName(),e=a.ib.get(d)||new sd(d);a.ib.set(d,e);try{Wc(a.gd,b,c);}catch(h){throw h;}b=c[0];var f=c[1];null===b&&null!==f?(a.V.set(d,f),e.add(f)):null!==b&&null!==f?(a.V.set(d,f),e.modify(c)):null!==b&&null===f&&(a.V.remove(d,b.id()),e.delete(b));}
m.update=function(a,b){vd(this,a);ed(this.Aa,a,b);b=b.map(function(a){return [this.V.get(a.id()),a]},this);xd(this,a,b);pd(this.Aa,a,b,0);b.forEach(function(b){wd(this,a,b);},this);};m.Wd=function(a,b){vd(this,a);ed(this.Aa,a,b);for(var c=0;c<b.length;c++){var d=b[c],e=null,f,h=a.Mb.sd;if(null===h)f=null;else {f=this.Aa;var h=h.j(),l=d.nb(h);f=f.C.get(h).get(l);f=0==f.length?null:f[0];}null!=f?(e=this.V.get(f),d.sa=f,pd(this.Aa,a,[[e,d]],0)):od(this.Aa,a,[d],0);wd(this,a,[e,d]);}};
m.remove=function(a,b){vd(this,a);yd(this,a,b);qd(this.Aa,a,b,0);for(var c=0;c<b.length;c++)wd(this,a,[b[c],null]);};function xd(a,b,c){b=kd(a.g.info(),b.getName(),1);if(null!==b){var d=nd(a.Aa,c,b);d.keys().forEach(function(a){d.get(a).forEach(function(b){var c=this.g.table(b.Sd.Ge),d=this.V.get(a),e=c.kb(d.Ja());e.m[b.Sd.vb]=b.Cg.m[b.Sd.Jc];wd(this,c,[d,e]);},this);},a);}}
function yd(a,b,c){if(null!==kd(a.g.info(),b.getName(),1)){b=rd(a.Aa,b,c);var d=b.rf;b.ue.forEach(function(a){var b=this.g.table(a);a=d.get(a).map(function(a){return this.V.get(a)},this);qd(this.Aa,b,a,0);a.forEach(function(a){wd(this,b,[a,null]);},this);},a);}}function pc(a){a.ib.forEach(function(a){var b=this.aa.get(a.getName());od(this.Aa,b,z(a.wa),1);qd(this.Aa,b,z(a.xa),1);pd(this.Aa,b,z(a.la),1);},a);}m.ka=aa();m.Jb=function(){var a=z(this.ib).map(function(a){return td(a)});this.gd.update(a);};
function vd(a,b){if(!a.aa.has(b.getName()))throw new D(106,b.getName());}function E(a,b,c,d){this.from=a;this.o=b;this.ea=this.from==F?!1:c;this.na=this.o==F?!1:d;}var F=new (aa());E.prototype.toString=function(){return (this.ea?"(":"[")+(this.from==F?"unbound":this.from)+", "+(this.o==F?"unbound":this.o)+(this.na?")":"]")};function zd(a){if(Ad(a))return [];var b=null,c=null;a.from==F||(b=new E(F,a.from,!1,!a.ea));a.o==F||(c=new E(a.o,F,!a.na,!1));return [b,c].filter(function(a){return null!==a})}E.prototype.reverse=function(){return new E(this.o,this.from,this.na,this.ea)};
function Bd(a,b){var c=Cd(a.from,b.from,!0,a.ea,b.ea);if(0==c)return !0;var d=-1==c?a:b;a=1==c?a:b;return d.o==F||d.o>a.from||d.o==a.from&&!d.na&&!a.ea}function Dd(){return new E(F,F,!1,!1)}function Ad(a){return a.from==F&&a.o==F}function Ed(a){return a.from==a.o&&a.from!=F&&!a.ea&&!a.na}E.prototype.contains=function(a){var b=this.o==F||a<this.o||a==this.o&&!this.na;return (this.from==F||a>this.from||a==this.from&&!this.ea)&&b};
function Cd(a,b,c,d,e){function f(a){return c?a:1==a?-1:1}d=d||!1;e=e||!1;return a==F?b==F?(d?!e:e)?d?f(1):f(-1):0:f(-1):b==F?f(1):a<b?-1:a==b?(d?!e:e)?d?f(1):f(-1):0:1}function Fd(a,b){var c=Cd(a.from,b.from,!0,a.ea,b.ea);0==c&&(c=Cd(a.o,b.o,!1,a.na,b.na));return c}function Gd(a){if(0==a.length)return [];a.sort(Fd);for(var b=Array(a.length+1),c=0;c<b.length;c++)b[c]=0==c?new E(F,a[c].from,!1,!0):c==b.length-1?new E(a[c-1].o,F,!0,!1):new E(a[c-1].o,a[c].from,!0,!0);return b}function Hd(a){this.kc=[];n(a)&&this.add(a);}Hd.prototype.toString=function(){return this.kc.map(function(a){return a.toString()}).join(",")};Hd.prototype.Pa=function(a){return this.kc.some(function(b){return b.contains(a)})};Hd.prototype.qa=g("kc");
Hd.prototype.add=function(a){if(0!=a.length)if(a=this.kc.concat(a),1==a.length)this.kc=a;else {a.sort(Fd);for(var b=[],c=a[0],d=1;d<a.length;++d)if(Bd(c,a[d])){var e=a[d],f=Dd();if(c.from!=F&&e.from!=F){var h=Cd(c.from,e.from,!0);1!=h?(f.from=c.from,f.ea=0!=h?c.ea:c.ea&&e.ea):(f.from=e.from,f.ea=e.ea);}c.o!=F&&e.o!=F&&(h=Cd(c.o,e.o,!1),-1!=h?(f.o=c.o,f.na=0!=h?c.na:c.na&&e.na):(f.o=e.o,f.na=e.na));c=f;}else b.push(c),c=a[d];b.push(c);this.kc=b;}};
function Id(a,b){var c=[];a.qa().map(function(a){return b.qa().map(function(b){var c;if(Bd(a,b)){c=Dd();var d=Cd(a.from,b.from,!0),d=0==d?a.ea?a:b:-1!=d?a:b;c.from=d.from;c.ea=d.ea;a.o==F||b.o==F?b=a.o==F?b:a:(d=Cd(a.o,b.o,!1),b=0==d?a.na?a:b:-1==d?a:b);c.o=b.o;c.na=b.na;}else c=null;return c})}).forEach(function(a){c=c.concat(a);});return new Hd(c.filter(function(a){return null!==a}))}function G(a,b){this.entries=a;this.M=B(b);this.$a=null;}G.prototype.u=function(){return C(this.M)};function Jd(a){return a.entries.map(function(a){return a.va.m})}function Kd(a){return a.entries.map(function(a){return a.va.id()})}function Ld(a,b){return a.$a.get(b.j())}var Md=null;function Nd(){null===Md&&(Md=new G([],[]));return Md}
function Od(a){if(0==a.length)return Nd();for(var b=a.reduce(function(a,b){return a+b.entries.length},0),c=Array(b),d=0,b=a.map(function(a){var b=y();a.entries.forEach(function(a){c[d++]=a;b.set(a.id,a);});return b}),e=y(),f=0;f<c.length;f++)b.every(function(a){return a.has(c[f].id)})&&e.set(c[f].id,c[f]);return new G(z(e),C(a[0].M))}function Pd(a){if(0==a.length)return Nd();var b=y();a.forEach(function(a){a.entries.forEach(function(a){b.set(a.id,a);});});return new G(z(b),C(a[0].M))}
function Qd(a,b){var c=1<b.length;a=a.map(function(a){return new Rd(a,c)});return new G(a,b)}function Rd(a,b){this.va=a;this.id=Sd++;this.Yd=b;}var Sd=0;function H(a,b){var c=b.Ka;return null!==c&&a.va.m.hasOwnProperty(c)?a.va.m[c]:a.Yd?a.va.m[Td(b.I())][b.getName()]:a.va.m[b.getName()]}function Ud(a,b,c){var d=b.Ka;if(null!=d)a.va.m[d]=c;else if(a.Yd){var d=Td(b.I()),e=a.va.m[d];null==e&&(e={},a.va.m[d]=e);e[b.getName()]=c;}else a.va.m[b.getName()]=c;}
function Vd(a,b,c,d){function e(a,b){if(a.Yd){a=a.va.m;for(var c in a)f[c]=a[c];}else f[b[0]]=a.va.m;}var f={};e(a,b);e(c,d);a=new hc(-1,f);return new Rd(a,!0)}q("lf.bind",function(a){return new Wd(a)});function Wd(a){this.fa=a;}q("lf.Binder",Wd);Wd.prototype.Ca=g("fa");function Xd(){this.Ze=Yd();var a=Zd();this.Ob=y();this.Ob.set(1,$d());this.Ob.set(2,ae());this.Ob.set(4,a);this.Ob.set(3,a);this.Ob.set(5,be());this.Ob.set(6,ce());}var de;function ee(){null!=de||(de=new Xd);return de}function fe(a,b,c){a=a.Ob.get(b)||null;if(null===a)throw new D(550);c=a.get(c)||null;if(null===c)throw new D(550);return c}
function Yd(){function a(a){return a}var b=y();b.set(1,function(a){return null===a?null:a?1:0});b.set(2,function(a){return null===a?null:a.getTime()});b.set(3,a);b.set(4,a);b.set(5,a);return b}function $d(){var a=y();a.set("eq",function(a,c){return a==c});a.set("neq",function(a,c){return a!=c});return a}
function Zd(){var a=$d();a.set("between",function(a,c){return null===a||null===c[0]||null===c[1]?!1:a>=c[0]&&a<=c[1]});a.set("gte",function(a,c){return null===a||null===c?!1:a>=c});a.set("gt",function(a,c){return null===a||null===c?!1:a>c});a.set("in",function(a,c){return -1!=c.indexOf(a)});a.set("lte",function(a,c){return null===a||null===c?!1:a<=c});a.set("lt",function(a,c){return null===a||null===c?!1:a<c});return a}
function be(){var a=Zd();a.set("match",function(a,c){return null===a||null===c?!1:(new RegExp(c)).test(a)});return a}function ce(){var a=y();a.set("eq",function(a,c){if(null!==c)throw new D(550);return null===a});a.set("neq",function(a,c){if(null!==c)throw new D(550);return null!==a});return a}
function ae(){var a=y();a.set("between",function(a,c){return null===a||null===c[0]||null===c[1]?!1:a.getTime()>=c[0].getTime()&&a.getTime()<=c[1].getTime()});a.set("eq",function(a,c){return (null===a?-1:a.getTime())==(null===c?-1:c.getTime())});a.set("gte",function(a,c){return null===a||null===c?!1:a.getTime()>=c.getTime()});a.set("gt",function(a,c){return null===a||null===c?!1:a.getTime()>c.getTime()});a.set("in",function(a,c){return c.some(function(b){return b.getTime()==a.getTime()})});a.set("lte",
function(a,c){return null===a||null===c?!1:a.getTime()<=c.getTime()});a.set("lt",function(a,c){return null===a||null===c?!1:a.getTime()<c.getTime()});a.set("neq",function(a,c){return (null===a?-1:a.getTime())!=(null===c?-1:c.getTime())});return a}function I(){this.h=this.D=null;}var ge=[];I.prototype.getParent=g("D");I.prototype.bb=function(){for(var a=this;null!==a.getParent();)a=a.getParent();return a};function he(a){for(var b=0;null!==a.getParent();)b++,a=a.getParent();return b}function J(a){return a.h||ge}function ie(a,b){return J(a)[b]||null}function je(a,b,c){b.D=a;null===a.h?a.h=[b]:a.h.splice(c,0,b);}function K(a,b){b.D=a;null===a.h?a.h=[b]:a.h.push(b);}
function ke(a,b){var c=a.h&&a.h[b];return c?(c.D=null,a.h.splice(b,1),0==a.h.length&&(a.h=null),c):null}I.prototype.removeChild=function(a){return ke(this,J(this).indexOf(a))};function le(a,b,c){ie(a,c).D=null;b.D=a;a.h[c]=b;}function me(a,b,c){!1!==b.call(c,a)&&J(a).forEach(function(a){me(a,b,c);});}function ne(){I.call(this);this.sa=pe++;}r(ne,I);var pe=0;ne.prototype.W=g("sa");function qe(a,b,c){ne.call(this);this.J=a;this.value=b;this.F=c;this.vc=fe(ee(),this.J.G(),this.F);this.Wa=!1;this.cc=b;}r(qe,ne);m=qe.prototype;m.Nb=function(){var a=new qe(this.J,this.value,this.F);a.cc=this.cc;a.vd(this.Wa);var b=this.W();a.sa=b;return a};m.lb=function(a){return null!=a?(a.push(this.J),a):[this.J]};m.u=function(a){a=null!=a?a:B();a.add(this.J.I());return a};m.vd=ba("Wa");
function re(a){var b=!1;a.value instanceof Wd||(b="array"==fa(a.value)?!a.value.some(function(a){return a instanceof Wd}):!0);if(!b)throw new D(501);}m.eval=function(a){re(this);if("in"==this.F)return se(this,a);var b=a.entries.filter(function(a){return this.vc(H(a,this.J),this.value)!=this.Wa},this);return new G(b,a.u())};
m.bind=function(a){if(this.cc instanceof Wd){var b=this.cc.Ca();if(a.length<=b)throw new D(510);this.value=a[b];}else "array"==fa(this.cc)&&(this.value=this.cc.map(function(b){if(b instanceof Wd){var c=b.Ca();if(a.length<=c)throw new D(510);return a[b.Ca()]}return b}));};function se(a,b){var c=B(a.value),d=function(a){return null===a?!1:c.has(a)!=this.Wa}.bind(a);a=b.entries.filter(function(a){return d(H(a,this.J))},a);return new G(a,b.u())}
m.toString=function(){return "value_pred("+this.J.j()+" "+this.F+(this.Wa?"(complement)":"")+" "+this.value+")"};m.ld=function(){re(this);return null!==this.value&&("between"==this.F||"in"==this.F||"eq"==this.F||"gt"==this.F||"gte"==this.F||"lt"==this.F||"lte"==this.F)};
m.we=function(){var a=null;if("between"==this.F)a=new E(te(this,this.value[0]),te(this,this.value[1]),!1,!1);else {if("in"==this.F)return a=this.value.map(function(a){return new E(a,a,!1,!1)}),new Hd(this.Wa?Gd(a):a);a=te(this,this.value);a="eq"==this.F?new E(a,a,!1,!1):"gte"==this.F?new E(a,F,!1,!1):"gt"==this.F?new E(a,F,!0,!1):"lte"==this.F?new E(F,a,!1,!1):new E(F,a,!1,!0);}return new Hd(this.Wa?zd(a):[a])};function te(a,b){return 2==a.J.G()?b.getTime():b}function ue(a){this.ba=a;this.Wc=this.Ga=null;}function ve(a,b){null===a.Ga&&null!=a.w&&(a.Ga=we(a.w));return a.Ga.get(b)||null}function we(a){var b=y();me(a,function(a){b.set(a.W(),a);});return b}function xe(a,b){b.w&&(a.w=b.w.Nb());a.Wc=b;}ue.prototype.bind=function(){return this};function ye(a,b){a=a.w;null!=a&&me(a,function(a){a instanceof qe&&a.bind(b);});}function ze(a){ue.call(this,a);}r(ze,ue);function Ae(a){var b="";a.forEach(function(c,d){b+=c.J.j()+" ";b+=1==c.order?"ASC":"DESC";d<a.length-1&&(b+=", ");});return b}ze.prototype.da=function(){return B(this.from)};ze.prototype.clone=function(){var a=new ze(this.ba);xe(a,this);this.f&&(a.f=this.f.slice());this.from&&(a.from=this.from.slice());a.X=this.X;a.L=this.L;this.N&&(a.N=this.N.slice());this.ra&&(a.ra=this.ra.slice());this.Sb&&(a.Sb=this.Sb);this.Zb&&(a.Zb=this.Zb);a.eb=this.eb;return a};
ze.prototype.bind=function(a){ze.hb.bind.call(this,a);null!=this.Sb&&(this.X=a[this.Sb.Ca()]);null!=this.Zb&&(this.L=a[this.Zb.Ca()]);ye(this,a);return this};function Be(a,b){this.Ha=a;this.aa=b;}Be.prototype.bb=g("Ha");Be.prototype.da=g("aa");function Ce(a){var b=B();a.forEach(function(a){a.da().forEach(b.add.bind(b));});return b}function De(a,b){this.global=a;this.Oa=a.b(vc);this.td=b.map(function(a){return a.context});this.jf=b.map(function(a){return a.je});this.Md=Ce(this.jf);this.xe=Ee(this);this.Db=w();}function Ee(a){return a.td.some(function(a){return !(a instanceof ze)})?1:0}m=De.prototype;
m.exec=function(){function a(){var f=d.shift();if(f){var h=e[c.length];return f.bb().exec(b,h).then(function(b){c.push(b[0]);return a()})}return v()}var b=0==this.xe?void 0:new ud(this.global,this.Md),c=[],d=this.jf.slice(),e=this.td;return a().then(function(){this.ja=this.Oa.Fb(this.xe,C(this.Md),b);return this.ja.ka()}.bind(this)).then(function(){this.ge(c);return c}.bind(this),function(a){null!=b&&b.Jb();throw a;})};m.G=g("xe");m.da=g("Md");m.W=function(){return ka(this)};m.ge=aa();
m.Y=function(){var a=null;null!=this.ja&&(a=this.ja.Y());return null===a?new A(!1,0,0,0,0):a};function Fe(a,b){De.call(this,a,b);this.Ib=a.b(Ac);}r(Fe,De);Fe.prototype.getPriority=k(0);Fe.prototype.ge=function(a){this.td.forEach(function(b,c){Ge(this.Ib,b,a[c]);},this);};function He(a,b){this.c=a;this.Ib=a.b(Ac);this.Ia=a.b(zc);this.gd=new Rc(a);this.ib=b;var c=a.b(Bc);a=this.ib.map(function(a){return c.table(a.getName())});this.aa=B(a);this.Db=w();}m=He.prototype;m.exec=function(){this.gd.update(this.ib);this.Mc();return v()};m.G=k(1);m.da=g("aa");m.W=function(){return ka(this)};m.getPriority=k(1);m.Mc=function(){var a=Ie(this.Ib,this.aa);0!=a.length&&(a=new Fe(this.c,a),Je(this.Ia,a));};function Ke(a){this.c=a;this.Oa=a.b(vc);this.Ia=a.b(zc);}Ke.prototype.ee=function(a){a=new He(this.c,a);Je(this.Ia,a);};function M(a,b){this.Ua=a;this.i=b;this.Za=y();}q("lf.backstore.FirebaseRawBackStore",M);M.prototype.cd=g("i");M.prototype.dd=function(){throw new D(351);};function Le(a,b){var c=w(),d=a;b.length&&(d=a.child(b));d.once("value",function(a){c.resolve(a.val());},function(a){c.reject(a);});return c.ha}function Me(a,b,c){function d(a){a?e.reject(a):e.resolve();}c=c||!1;var e=w();c?a.set(b,d):a.update(b,d);return e.ha}
M.prototype.Ea=function(a){return Le(this.i,"@rev/R").then(function(a){this.Sa=a;return Le(this.i,"@table")}.bind(this)).then(function(b){var c=0,d;for(d in b)this.Za.set(d,b[d]),b[d]>c&&(c=b[d]);a.oa().forEach(function(a){this.Za.has(a.getName())||(b[a.getName()]=++c);},this);d=this.i.child("@table");return Me(d,b)}.bind(this))};
function Ne(a,b,c){var d=a.Za.get(b);return null!=d?function(){var a={},b=w();this.i.orderByChild("T").equalTo(d).once("value",function(d){d.forEach(function(b){var d=c(b.val());a[parseInt(b.key(),10)]=d;});b.resolve(a);});return b.ha}.call(a).then(function(a){a["@rev"]={R:++this.Sa};return Me(this.i,a)}.bind(a)):v()}M.prototype.tc=function(a){return Ne(this,a,k(null)).then(function(){this.Za.delete(a);return Me(this.i.child("@table/"+a),null,!0)}.bind(this))};M.prototype.dropTable=M.prototype.tc;
M.prototype.qc=function(a,b,c){return Ne(this,a,function(a){var d=a.P;d[b]=c;return {R:this.Sa+1,T:a.T,P:d}}.bind(this))};M.prototype.addTableColumn=M.prototype.qc;M.prototype.uc=function(a,b){return Ne(this,a,function(a){var c=a.P;delete c[b];return {R:this.Sa+1,T:a.T,P:c}}.bind(this))};M.prototype.dropTableColumn=M.prototype.uc;M.prototype.Lc=function(a,b,c){return Ne(this,a,function(a){var d=a.P;d[c]=d[b];delete d[b];return {R:this.Sa+1,T:a.T,P:d}}.bind(this))};M.prototype.renameTableColumn=M.prototype.Lc;
M.prototype.xb=function(){throw new D(351);};M.prototype.createRow=M.prototype.xb;M.prototype.Cc=g("Ua");M.prototype.getVersion=M.prototype.Cc;M.prototype.ec=function(a){var b=w();a=this.Za.get(a);this.i.orderByChild("T").equalTo(a).once("value",function(a){var c=[];a.forEach(function(a){c.push(a.val().P);});b.resolve(c);});return b.ha};M.prototype.dump=function(){var a={},b=gc(this.Za).map(function(b){return this.ec(b).then(function(c){a[b]=c;})}.bind(this));return eb(b).then(function(){return a})};
M.prototype.dump=M.prototype.dump;function Oe(a,b,c){nc.call(this,b,c);this.i=a;}r(Oe,nc);Oe.prototype.I=function(a){return this.i.Ac(a)};
Oe.prototype.sc=function(){if(0==this.yd)return this.S.resolve(),this.S.ha;var a=this.Ra.ib;if(0==a.size)this.S.resolve();else {var b=this.i.Sa+1;this.i.Sa=b;var c={"@rev":{R:b}};a.forEach(function(a,e){var d=this.i.Za.get(e);a.wa.forEach(function(a,e){c[e]={R:b,T:d,P:a.m};});a.la.forEach(function(a,e){c[e]={R:b,T:d,P:a[1].m};});a.xa.forEach(function(a,b){c[b]=null;});},this);this.i.i.update(c,function(c){null===c?this.S.resolve():(this.i.Sa=b-1,c=z(a).map(function(a){return Pe(this.i,a.getName())},this),
eb(c).then(this.S.reject.bind(this.S),this.S.reject.bind(this.S)));}.bind(this));}return this.S.ha};function Qe(){this.Ba=y();}function Re(a,b){if(0==b.length)return z(a.Ba);var c=[];b.forEach(function(a){a=this.Ba.get(a)||null;null===a||c.push(a);},a);return c}Qe.prototype.getData=g("Ba");Qe.prototype.get=function(a){return v(Re(this,a))};function Se(a,b){b.forEach(function(a){this.Ba.set(a.id(),a);},a);}Qe.prototype.put=function(a){Se(this,a);return v()};function Te(a,b){0==b.length||b.length==a.Ba.size?a.Ba.clear():b.forEach(function(a){this.Ba.delete(a);},a);}
Qe.prototype.remove=function(a){Te(this,a);return v()};function Ue(a){return 0==a.Ba.size?0:gc(a.Ba).reduce(function(a,c){return a>c?a:c},0)}function Ve(a,b){this.g=a;this.Df=b;this.Kc=y();this.Sa=-1;this.M=y();this.Za=y();this.Jd=null;}m=Ve.prototype;
m.Ea=function(a){this.i=this.Df.child(this.g.name());var b=a||function(){return v()};return Le(this.i,"@db/version").then(function(a){return null===a?Me(this.i,We(this),!0).then(function(){var a=new M(0,this.i);return b(a)}.bind(this)).then(function(){return this.Ea()}.bind(this)):a==this.g.version()?Le(this.i,"@rev/R").then(function(a){this.Sa=a;return Le(this.i,"@table")}.bind(this)).then(function(a){for(var b in a)this.Za.set(b,a[b]);a=this.g.oa().map(function(a){return Pe(this,a.getName())},this);
return eb(a)}.bind(this)).then(function(){Xe(this);Ye(this);return v()}.bind(this)):this.he(a,b).then(function(){return this.Ea()}.bind(this))}.bind(this))};m.he=function(a,b){var c=new M(a,this.i);return c.Ea(this.g).then(function(){return v()}.bind(this)).then(function(){return b(c)}).then(function(){var a=this.i.child("@db");return Me(a,{version:this.g.version()},!0)}.bind(this))};
function Ye(a){a.i.off();a.i.on("child_removed",a.zg.bind(a));a.Kd&&(a.Kd.off(),a.Kc.clear());a.Kd=a.i.orderByChild("R").startAt(a.Sa+1);a.Kd.on("value",a.ee.bind(a));}function Xe(a){ic=z(a.M).map(function(a){return Ue(a)}).reduce(function(a,c){return a>c?a:c},0)+1;}m.zg=function(a){var b=a.val(),c=this.Kc.get(b.T)||null;null===c&&(c=B(),this.Kc.set(b.T,c));c.add(parseInt(a.key(),10));};
m.ee=function(a){var b=a.child("@rev/R").val();null!=b&&b!=this.Sa&&(this.Sa=b,a=Ze(this,a),a.forEach(function(a){var b=this.M.get(a.getName()),c=gc(a.xa);0<c.length&&Te(b,c);var f=z(a.wa);a.la.forEach(function(a){f.push(a[1]);});Se(b,f);},this),0<a.length&&this.Gc(a),Ye(this));};
function Ze(a,b){var c=B(),d=y();a.Za.forEach(function(a,b){var e=this.M.get(b),f=new sd(b);this.Kc.has(a)&&(b=C(this.Kc.get(a)),b.forEach(function(a){c.add(a);}),Re(e,b).forEach(function(a){f.delete(a);}));d.set(a,f);}.bind(a));b.forEach(function(a){if("@rev"!=a.key()){var b=parseInt(a.key(),10);if(!c.has(b)){var e=a.val();a=d.get(e.T);var l=this.M.get(a.getName()),e=this.g.table(a.getName()).kb({id:b,value:e.P});l.getData().has(b)?a.modify([Re(l,[b])[0],e]):a.add(e);}}}.bind(a));return z(d).filter(function(a){return !a.jd()})}
function Pe(a,b){var c=w(),d=a.Za.get(b),e=a.g.table(b);a.i.orderByChild("T").equalTo(d).once("value",function(a){var d=new Qe,f=[];a.forEach(function(a){f.push(e.kb({id:parseInt(a.key(),10),value:a.val().P}));});Se(d,f);this.M.set(b,d);c.resolve();}.bind(a));return c.ha}function We(a){var b={};b["@db"]={version:a.g.version()};b["@rev"]={R:1};a.Sa=1;b["@table"]={};a.g.oa().forEach(function(a,d){a=a.getName();b["@table"][a]=d;this.M.set(a,new Qe);this.Za.set(a,d);},a);return b}
m.Fb=function(a,b,c){return new Oe(this,a,c)};m.Ac=function(a){var b=this.M.get(a)||null;if(null!==b)return b;throw new D(101,a);};m.close=aa();m.subscribe=ba("Jd");m.Gc=function(a){null!=this.Jd&&this.Jd(a);};function N(a,b,c,d){this.i=b;this.ja=c;this.Ua=a;this.Uc=d;}q("lf.backstore.IndexedDBRawBackStore",N);N.prototype.cd=g("i");N.prototype.getRawDBInstance=N.prototype.cd;N.prototype.dd=g("ja");N.prototype.getRawTransaction=N.prototype.dd;N.prototype.tc=function(a){return new u(function(b,c){try{this.i.deleteObjectStore(a);}catch(d){c(d);return}b();},this)};N.prototype.dropTable=N.prototype.tc;
function $e(a,b,c,d){return new u(function(a,f){var e;try{var l=this.ja.objectStore(b);e=l.openCursor();}catch(p){f(p);return}e.onsuccess=function(){var b=e.result;b?(c(b),b.continue()):(d(l),a());};e.onerror=f;},a)}function af(a){return a instanceof ArrayBuffer?lc(a):a instanceof Date?a.getTime():a}
function bf(a,b,c){function d(a){var b=Mc(a.value),d=b.m,e;for(e in d){var f=jc(d[e]);c(f);d[e]=f.Ja();}a.update(b.Ja());}function e(a){var b=jc(a.value);c(b);a.update(b.Ja());}return $e(a,b,a.Uc?d:e,aa())}N.prototype.qc=function(a,b,c){var d=af(c);return bf(this,a,function(a){a.m[b]=d;})};N.prototype.addTableColumn=N.prototype.qc;N.prototype.uc=function(a,b){return bf(this,a,function(a){delete a.m[b];})};N.prototype.dropTableColumn=N.prototype.uc;
N.prototype.Lc=function(a,b,c){return bf(this,a,function(a){a.m[c]=a.m[b];delete a.m[b];})};N.prototype.renameTableColumn=N.prototype.Lc;function cf(a,b){var c=[];return new u(function(a,e){var d;try{d=this.ja.objectStore(b).openCursor();}catch(h){e(h);return}d.onsuccess=function(){var b=d.result;if(b){if(this.Uc){var e=Mc(b.value).m,f;for(f in e)c.push(e[f]);}else c.push(b.value);b.continue();}else a(c);}.bind(this);d.onerror=e;},a)}N.prototype.xb=function(a){var b={},c;for(c in a)b[c]=af(a[c]);return kc(b)};
N.prototype.createRow=N.prototype.xb;N.prototype.Cc=g("Ua");N.prototype.getVersion=N.prototype.Cc;N.prototype.dump=function(){for(var a=this.i.objectStoreNames,b=[],c=0;c<a.length;++c){var d=a.item(c);b.push(this.ec(d));}return eb(b).then(function(b){var c={};b.forEach(function(b,d){c[a.item(d)]=b;});return c})};N.prototype.dump=N.prototype.dump;N.prototype.ec=function(a){return cf(this,a).then(function(a){return a.map(function(a){return a.value})})};function df(a,b){this.Z=a;this.Gb=b;}df.prototype.get=function(a){if(0==a.length)return null!=this.Z.getAll?ef(this):ff(this);a=a.map(function(a){return new u(function(b,d){var c;try{c=this.Z.get(a);}catch(f){d(f);return}c.onerror=d;c.onsuccess=function(a){b(this.Gb(a.target.result));}.bind(this);},this)},this);return eb(a)};
function ff(a){return new u(function(a,c){var b=[],e;try{e=this.Z.openCursor();}catch(f){c(f);return}e.onerror=c;e.onsuccess=function(){var c=e.result;c?(b.push(this.Gb(c.value)),c.continue()):a(b);}.bind(this);},a)}function ef(a){return new u(function(a,c){var b;try{b=this.Z.getAll();}catch(e){c(e);return}b.onerror=c;b.onsuccess=function(){var c=b.result.map(function(a){return this.Gb(a)},this);a(c);}.bind(this);},a)}
df.prototype.Tb=function(a){return new u(function(b,c){var d;try{d=a();}catch(e){c(e);return}d.onsuccess=b;d.onerror=c;},this)};df.prototype.put=function(a){if(0==a.length)return v();a=a.map(function(a){return this.Tb(function(){return this.Z.put(a.Ja())}.bind(this))},this);return eb(a)};
df.prototype.remove=function(a){return new u(function(b,c){var d=this.Z.count();d.onsuccess=function(d){if(0==a.length||d.target.result==a.length)return this.Tb(function(){return this.Z.clear()}.bind(this)).then(b,c);d=a.map(function(a){return this.Tb(function(){return this.Z.delete(a)}.bind(this))},this);eb(d).then(b,c);}.bind(this);d.onerror=c;},this)};function gf(a,b,c,d,e){nc.call(this,c,e);this.c=a;this.ja=b;this.Uc=d;this.ja.oncomplete=this.S.resolve.bind(this.S);this.ja.onabort=this.S.reject.bind(this.S);}r(gf,nc);gf.prototype.I=function(a,b,c){return this.Uc?(c=null!=c?c:0,a=this.ja.objectStore(a),new Nc(a,b,0==c?qa(Pc,this.c):Qc)):new df(this.ja.objectStore(a),b)};gf.prototype.sc=function(){return this.S.ha};function hf(a,b){this.c=a;this.g=b;this.Gd=b.ke.Sf||!1;}m=hf.prototype;
m.Ea=function(a){var b=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(null==b)throw new D(352);var c=a||function(){return v()};return new u(function(a,e){var d;try{d=b.open(this.g.name(),this.g.version());}catch(h){e(h);return}d.onerror=function(a){a=a.target.error;e(new D(361,a.name,a.message));};d.onupgradeneeded=function(a){jf(this,c,a).then(aa(),e);}.bind(this);d.onsuccess=function(b){this.i=b.target.result;this.qe().then(function(b){ic=Math.max(ic,b+1);a(this.i);}.bind(this));}.bind(this);},
this)};function jf(a,b,c){var d=c.target.result;c=new N(c.oldVersion,d,c.target.transaction,a.Gd);kf(d);a.g.oa().forEach(qa(a.Lf,d),a);return b(c)}function kf(a){for(var b=[],c=0;c<a.objectStoreNames.length;++c){var d=a.objectStoreNames.item(c);-1!=d.indexOf(".")&&b.push(d);}b.forEach(function(b){try{a.deleteObjectStore(b);}catch(f){}});}
m.Lf=function(a,b){a.objectStoreNames.contains(b.getName())||a.createObjectStore(b.getName(),{keyPath:"id"});b.Cb()&&(b.Da().forEach(function(b){mf(a,b.j());},this),mf(a,nf(b)));};function mf(a,b){a.objectStoreNames.contains(b)||a.createObjectStore(b,{keyPath:"id"});}m.Fb=function(a,b,c){b=this.i.transaction(of(b),0==a?"readonly":"readwrite");return new gf(this.c,b,a,this.Gd,c)};
function of(a){var b=B();a.forEach(function(a){b.add(a.getName());a.Cb()&&(a.Da().forEach(function(a){b.add(a.j());}),b.add(nf(a)));});return C(b)}
m.qe=function(a){function b(){if(0==d.length)return v();var a=d.shift();return c(a).then(b)}function c(b){return new u(function(c,d){var l;try{l=(a||e.transaction([b])).objectStore(b).openCursor(null,"prev");}catch(ca){d(ca);return}l.onsuccess=function(a){(a=a.target.result)&&(f=Math.max(f,h(a)));c(f);};l.onerror=function(){c(f);};})}var d=this.g.oa().map(function(a){return a.getName()}),e=this.i,f=0,h=function(a){return this.Gd?(a=Mc(a.value),Object.keys(a.m).reduce(function(a,b){return Math.max(a,b)},
0)):a.key}.bind(this);return new u(function(a){b().then(function(){a(f);});})};m.close=function(){this.i.close();};m.Ac=function(){throw new D(511);};m.subscribe=aa();m.Gc=aa();function pf(a,b,c){nc.call(this,b,c);this.Z=a;0==b&&this.S.resolve();}r(pf,nc);pf.prototype.I=function(a){return this.Z.Ac(a)};pf.prototype.sc=function(){this.S.resolve();return this.S.ha};function qf(a){this.g=a;this.M=y();}m=qf.prototype;m.Ea=function(){this.g.oa().forEach(this.gg,this);return v()};m.Ac=function(a){var b=this.M.get(a)||null;if(null===b)throw new D(101,a);return b};m.Fb=function(a,b,c){return new pf(this,a,c)};function rf(a,b){if(!a.M.has(b)){var c=new Qe;a.M.set(b,c);}}m.gg=function(a){rf(this,a.getName());a.Cb()&&(a.Da().forEach(function(a){rf(this,a.j());},this),rf(this,nf(a)));};m.close=aa();m.subscribe=aa();m.Gc=aa();function sf(a){qf.call(this,a);this.pd=null;}r(sf,qf);sf.prototype.subscribe=function(a){null===this.pd&&(this.pd=a);};sf.prototype.Gc=function(a){null===this.pd||this.pd(a);};function tf(a,b,c){this.ja=a;this.A='"'+b+'"';this.Gb=c;}tf.prototype.get=function(a){var b=this.Gb;return uf(this.ja,"SELECT id, value FROM "+this.A+" "+(0==a.length?"":"WHERE id IN ("+a.join(",")+")"),[],function(a){for(var c=a.rows.length,e=Array(c),f=0;f<c;++f)e[f]=b({id:a.rows.item(f).id,value:JSON.parse(a.rows.item(f).value)});return e})};
tf.prototype.put=function(a){if(0==a.length)return v();var b="INSERT OR REPLACE INTO "+this.A+"(id, value) VALUES (?, ?)";a.forEach(function(a){uf(this.ja,b,[a.id(),JSON.stringify(a.m)]);},this);return v()};tf.prototype.remove=function(a){uf(this.ja,"DELETE FROM "+this.A+" "+(0==a.length?"":"WHERE id IN ("+a.join(",")+")"),[]);return v()};function vf(a,b,c){nc.call(this,b,c);this.i=a;this.M=y();this.Nd=[];}r(vf,nc);function wf(a){return a.replace(".","__d__").replace("#","__s__")}vf.prototype.I=function(a,b){var c=this.M.get(a)||null;null===c&&(c=new tf(this,wf(a),b),this.M.set(a,c));return c};function uf(a,b,c,d){var e=w();a.Nd.push({Ng:b,Dg:c,transform:d,S:e});return e.ha}
vf.prototype.sc=function(){var a=null,b=this.S.reject.bind(this.S),c=function(a,b){this.S.reject(b);}.bind(this),d=[],e=function(b,h){if(null!==a){var f=h;null!=a.transform&&null!=h&&(f=a.transform(h));d.push(f);a.S.resolve(f);}0<this.Nd.length?(a=h=this.Nd.shift(),b.executeSql(h.Ng,h.Dg,e,c)):this.S.resolve(d);}.bind(this);0==this.yd?this.i.readTransaction(e,b):this.i.transaction(e,b);return this.S.ha};function O(a,b,c){this.i=c;this.c=a;this.Ua=b;}q("lf.backstore.WebSqlRawBackStore",O);O.prototype.cd=g("i");O.prototype.getRawDBInstance=O.prototype.cd;O.prototype.dd=function(){throw new D(356);};O.prototype.getRawTransaction=O.prototype.dd;function xf(a){return new vf(a.i,1,new ud(a.c,B()))}O.prototype.tc=function(a){var b=xf(this);uf(b,"DROP TABLE "+a,[]);return b.ka()};O.prototype.dropTable=O.prototype.tc;
O.prototype.ec=function(a){var b=xf(this);uf(b,"SELECT id, value FROM "+a,[]);return b.ka().then(function(a){for(var b=a[0].rows.length,c=Array(b),f=0;f<b;++f)c[f]={id:a[0].rows.item(f).id,value:JSON.parse(a[0].rows.item(f).value)};return v(c)})};function yf(a,b,c){var d=xf(a),e="UPDATE "+b+" SET value=? WHERE id=?";return a.ec(b).then(function(a){a.forEach(function(a){a=c(a);uf(d,e,[JSON.stringify(a.value),a.id]);});return d.ka()})}
O.prototype.qc=function(a,b,c){var d=af(c);return yf(this,a,function(a){a.value[b]=d;return a})};O.prototype.addTableColumn=O.prototype.qc;O.prototype.uc=function(a,b){return yf(this,a,function(a){delete a.value[b];return a})};O.prototype.dropTableColumn=O.prototype.uc;O.prototype.Lc=function(a,b,c){return yf(this,a,function(a){a.value[c]=a.value[b];delete a.value[b];return a})};O.prototype.renameTableColumn=O.prototype.Lc;O.prototype.xb=function(a){var b={},c;for(c in a)b[c]=af(a[c]);return kc(b)};
O.prototype.createRow=O.prototype.xb;O.prototype.Cc=g("Ua");O.prototype.getVersion=O.prototype.Cc;function zf(a){uf(a,'SELECT tbl_name FROM sqlite_master WHERE type="table"',[],function(a){for(var b=Array(a.rows.length),d=0;d<b.length;++d)b[d]=a.rows.item(d).tbl_name;return b});}
O.prototype.dump=function(){var a=w(),b=xf(this);zf(b);var c={};b.ka().then(function(b){b=b[0].filter(function(a){return "__lf_ver"!=a&&"__WebKitDatabaseInfoTable__"!=a}).map(function(a){return this.ec(a).then(function(b){c[a]=b;})},this);eb(b).then(function(){a.resolve(c);});}.bind(this));return a.ha};O.prototype.dump=O.prototype.dump;function Af(a,b,c){this.c=a;this.g=b;this.Mg=c||1;}m=Af.prototype;m.Ea=function(a){if(null==window.openDatabase)throw new D(353);var b=a||function(){return v()};return new u(function(a,d){var c=window.openDatabase(this.g.name(),"",this.g.name(),this.Mg);if(null!=c)this.i=c,Bf(this,b).then(function(){this.qe().then(a,d);}.bind(this),function(a){if(a instanceof D)throw a;throw new D(354,a.message);});else throw new D(354);},this)};
function Bf(a,b){var c=w(),d=new vf(a.i,1,new ud(a.c,B()));uf(d,"CREATE TABLE IF NOT EXISTS __lf_ver(id INTEGER PRIMARY KEY, v INTEGER)",[]);uf(d,"SELECT v FROM __lf_ver WHERE id = 0",[]);d.ka().then(function(a){var d=0;a[1].rows.length&&(d=a[1].rows.item(0).v);d<this.g.version()?this.he(b,d).then(c.resolve.bind(c)):d>this.g.version()?c.reject(new D(108)):c.resolve();}.bind(a),c.reject.bind(c));return c.ha}m.Fb=function(a,b,c){if(null!=this.i)return new vf(this.i,a,c);throw new D(2);};m.close=aa();
m.Ac=function(){throw new D(512);};m.subscribe=function(){throw new D(355);};m.Gc=function(){throw new D(355);};m.he=function(a,b){return Cf(this).then(function(){return a(new O(this.c,b,this.i))}.bind(this))};
function Cf(a){var b=a.g.oa(),c=new vf(a.i,1,new ud(a.c,B())),d=new vf(a.i,1,new ud(a.c,B()));uf(c,"INSERT OR REPLACE INTO __lf_ver VALUES (0, ?)",[a.g.version()]);zf(c);return c.ka().then(function(a){var c=a[1];c.filter(function(a){return -1!=a.indexOf("__d__")}).forEach(function(a){uf(d,"DROP TABLE "+('"'+a+'"'),[]);});var e=[],p=[];b.map(function(a){-1==c.indexOf(a.getName())&&e.push(a.getName());a.Cb&&(a.Da().forEach(function(a){a=wf(a.j());e.push(a);}),a=wf(nf(a)),e.push(a),p.push(a));});
e.forEach(function(a){uf(d,"CREATE TABLE "+('"'+a+'"')+"(id INTEGER PRIMARY KEY, value TEXT)",[]);});return d.ka()})}m.qe=function(){var a=0,b=w(),c=function(b){var c=new vf(this.i,0);uf(c,"SELECT MAX(id) FROM "+('"'+b+'"'),[]);return c.ka().then(function(b){b=b[0].rows.item(0)["MAX(id)"];a=Math.max(b,a);})}.bind(this),d=this.g.oa().map(function(a){return c(a.getName())});eb(d).then(function(){ic=Math.max(ic,a+1);b.resolve();},function(a){b.reject(a);});return b.ha};function Df(a){this.l=y();this.$b=y();a.oa().forEach(function(a){this.$b.set(a.getName(),B());},this);}m=Df.prototype;m.set=function(a,b){this.l.set(b.id(),b);this.$b.get(a).add(b.id());};m.Wb=function(a,b){var c=this.$b.get(a);b.forEach(function(a){this.l.set(a.id(),a);c.add(a.id());},this);};m.get=function(a){return this.l.get(a)||null};function Ef(a,b){return b.map(function(a){return this.get(a)},a)}
m.Va=function(a,b,c){var d=[],e=Math.min(b,c),f=Math.max(b,c);a=this.$b.get(a);if(a.size<f-e)a.forEach(function(a){a>=e&&a<=f&&(a=this.l.get(a),d.push(a));},this);else for(b=e;b<=f;++b)a.has(b)&&(c=this.l.get(b),d.push(c));return d};m.remove=function(a,b){this.l.delete(b);this.$b.get(a).delete(b);};m.zc=function(a){return null!=a?this.$b.get(a).size:this.l.size};m.clear=function(){this.l.clear();this.$b.clear();};function Ff(a,b,c){var d=0,e=a.length;for(c=c||Gf;d<e;){var f=d+e>>1;0>c(a[f],b)?d=f+1:e=f;}return d==e&&a[d]==b?d:~d}function Gf(a,b){return a-b}function Hf(a,b,c){c=Ff(a,b,c);return 0>c?(a.splice(-(c+1),0,b),!0):!1}function If(a,b,c,d){a=b?a.reverse():a;if(null==c&&null==d)return a;c=Math.min(n(c)?c:a.length,a.length);if(0==c)return [];d=Math.min(d||0,a.length);return a.slice(d,d+c)}function Jf(){this.ia=0;this.Fc=null;}Jf.prototype.add=function(a,b){this.ia+=b;this.Fc=null===this.Fc?a:a>this.Fc?a:this.Fc;};Jf.prototype.remove=function(a,b){this.ia-=b;};Jf.prototype.clear=function(){this.ia=0;};function Kf(a,b){a.clear();b.forEach(function(a){this.ia+=a.ia;},a);}function Lf(a,b,c,d){this.A=a;this.$=b;this.yf=c;this.za=new Jf;if(d){a=511;a*=a*a;if(d.length>=a)throw new D(6,a);d=Mf(this,d);this.ua=d=Nf(d);}else this.clear();}var Of=[];m=Lf.prototype;m.getName=g("A");m.toString=function(){return this.ua.toString()};m.add=function(a,b){this.ua=this.ua.Ab(a,b);};m.set=function(a,b){this.ua=this.ua.Ab(a,b,!0);};m.remove=function(a,b){this.ua=this.ua.remove(a,b);};m.get=function(a){return this.ua.get(a)};
m.Zc=function(a){if(null==a)return this.Y().ia;if(a instanceof E){if(Ad(a))return this.Y().ia;if(Ed(a))return this.get(a.from).length}return this.Va([a]).length};m.Y=g("za");m.Vd=function(a,b,c,d){c=Array(a);this.ua.fill({offset:b?this.za.ia-a-d:d,count:a,te:0},c);return b?c.reverse():c};
m.Va=function(a,b,c,d){var e=Pf(this.ua).a[0];if(!n(e)||0==c)return Of;b=b||!1;c=null!=c?Math.min(c,this.za.ia):this.za.ia;d=d||0;var f=Math.min(Math.max(this.za.ia-d,0),c);if(0==f)return Of;if(!n(a)||1==a.length&&a[0]instanceof E&&Ad(a[0]))return this.Vd(f,b,c,d);a=this.$.uf(a);var h=Array(b?this.za.ia:f),l={count:0,X:h.length,reverse:b,L:d},p=1<this.jb().Zd();a.forEach(function(a){for(var b=this.$.ud(a),b=this.$.Xd(a)?e:b[0],b=this.ua.Yf(b),c=0;null!=b&&l.count<l.X;){if(p){for(var d=b,f=a,L=l,Db=
h,Tc=d.s.jb(),oe=-1,Na=0;Na<d.a.length;++Na)if(Tc.Bb(d.a[Na],f)){oe=Na;break}if(-1!=oe)for(Na=oe;Na<d.a.length&&L.count<L.X;++Na)Tc.Bb(d.a[Na],f)&&Qf(d,L,Db,Na);}else b.Va(a,l,h);0!=l.L||b.kd(a)?c=0:c++;b=2==c?null:b.next();}},this);h.length>l.count&&h.splice(l.count,h.length-l.count);return b?If(h,b,c,d):h};m.clear=function(){this.ua=Rf(this);this.za.clear();};m.Pa=function(a){return this.ua.Pa(a)};m.min=function(){return this.Hb(this.$.min.bind(this.$))};m.max=function(){return this.Hb(this.$.max.bind(this.$))};
function Sf(a,b,c){if(!a.$.Od(b.a[c]))if(1<b.a[c].length){if(null===b.a[c][0])return null}else return null;return [b.a[c],a.yf?[b.B[c]]:b.B[c]]}m.Hb=function(a){var b;a:{b=Pf(this.ua);var c=0;do if(c>=b.a.length)b=b.ya,c=0;else {var d=Sf(this,b,c);if(null!==d){b=d;break a}c++;}while(null!==b);b=null;}a:{c=Tf(this.ua);d=c.a.length-1;do if(0>d)c=c.qb,d=0;else {var e=Sf(this,c,d);if(null!==e){c=e;break a}d--;}while(null!==c);c=null;}return null===b||null===c?null:1==a(b[0],c[0])?b:c};m.Ma=g("yf");m.jb=g("$");
m.Qa=function(a,b){return null!=a?0==this.$.compare(a,b):!1};m.Ja=function(){for(var a=[],b=Pf(this.ua);b;)a.push(new hc(b.sa,[b.a,b.B])),b=b.ya;return a};function Uf(a,b,c,d){a=new Lf(b,a,c);d=Vf(d,a);a.ua=d;return a}function Wf(a,b){this.sa=a;this.s=b;this.mb=0;this.ya=this.qb=this.D=null;this.a=[];this.B=[];this.h=[];this.Yf=1==b.jb().Zd()?this.Pe:this.Oe;}function Rf(a){return new Wf(ic++,a)}function P(a){return 0==a.mb}m=Wf.prototype;m.next=g("ya");
function Xf(a){function b(a){return null!=a?a.sa.toString():"_"}var c=a.sa+"["+a.a.join("|")+"]",d=a.h.map(function(a){return a.sa}).join("|"),e=a.B.join("/"),f=b(a.qb)+"{",f=P(a)?f+e:f+d,f=f+"}"+b(a.D);a.ya&&(a=Xf(a.ya),c=c+"  "+a[0],f=f+"  "+a[1]);return [c,f]}m.toString=function(){var a="",b=Xf(this),a=a+(b[0]+"\n"+b[1]+"\n");this.h.length&&(a+=this.h[0].toString());return a};function Pf(a){return P(a)?a:Pf(a.h[0])}function Tf(a){return P(a)?a:Tf(a.h[a.h.length-1])}
function Yf(a,b){b&&(b.qb=a);a&&(a.ya=b);}function Mf(a,b){for(var c=b.length,d=0,e=a=Rf(a);0<c;){var f=768<=c?511:257<=c&&511>=c?c:257,h=b.slice(d,d+f);a.a=h.map(function(a){return a.key});a.B=h.map(function(a){return a.value});d+=f;c-=f;0<c&&(f=Rf(a.s),Yf(a,f),a=f);}return e}function Zf(a){var b=a[0],c=Rf(b.s);c.mb=b.mb+1;c.h=a;for(b=0;b<a.length;++b)a[b].D=c,0<b&&c.a.push(a[b].a[0]);return c}
function Nf(a){var b=a,c=[];do c.push(b),b=b.ya;while(b);if(512>=c.length)b=Zf(c);else {var d=c.length,e=0,b=Rf(a.s);for(b.mb=a.mb+2;0<d;){a=768<=d?511:257<=d&&511>=d?d:257;var f=c.slice(e,e+a),h=Zf(f);h.D=b;b.h.length&&(b.a.push(f[0].a[0]),Yf(b.h[b.h.length-1],h));b.h.push(h);e+=a;d-=a;}}return b}m.get=function(a){var b=$f(this,a);if(P(this)){var c=Of;this.s.Qa(this.a[b],a)&&(c=c.concat(this.B[b]));return c}b=this.s.Qa(this.a[b],a)?b+1:b;return this.h[b].get(a)};
m.Pa=function(a){var b=$f(this,a);return this.s.Qa(this.a[b],a)?!0:P(this)?!1:this.h[b].Pa(a)};m.remove=function(a,b){ag(this,a,-1,b);return null===this.D?(a=this,1==this.h.length&&(a=this.h[0],a.D=null),a):this};function bg(a){return P(a)?a.a[0]:bg(a.h[0])}function cg(a){a.a=[];for(var b=1;b<a.h.length;++b)a.a.push(bg(a.h[b]));}
function ag(a,b,c,d){var e=$f(a,b),f=P(a);if(!f){var h=a.s.Qa(a.a[e],b)?e+1:e;if(ag(a.h[h],b,h,d))cg(a);else return !1}else if(!a.s.Qa(a.a[e],b))return !1;if(a.a.length>e&&a.s.Qa(a.a[e],b)){if(n(d)&&!a.s.Ma()&&f&&(h=a.B[e],d=Ff(h,d,void 0),0>d?d=!1:(h.splice(d,1),d=!0),d&&a.s.Y().remove(b,1),a.B[e].length))return !1;a.a.splice(e,1);f&&(f=a.s.Ma()?1:a.B[e].length,a.B.splice(e,1),a.s.Y().remove(b,f));}if(256>a.a.length&&null!==a.D){a:{if(a.ya&&256<a.ya.a.length)b=a.ya,e=d=0,f=a.a.length+1;else if(a.qb&&
256<a.qb.a.length)b=a.qb,d=a.qb.a.length-1,e=P(a)?d:d+1,f=0;else {b=!1;break a}a.a.splice(f,0,b.a[d]);b.a.splice(d,1);d=P(a)?a.B:a.h;P(a)?h=b.B:(h=b.h,h[e].D=a);d.splice(f,0,h[e]);h.splice(e,1);P(b)||(cg(b),cg(a));b=!0;}b||eg(a,c);}return !0}
function eg(a,b){var c,d,e;a.ya&&511>a.ya.a.length?(c=a.ya,e=d=0):a.qb&&(c=a.qb,d=c.a.length,e=P(c)?c.B.length:c.h.length);d=[d,0].concat(a.a);Array.prototype.splice.apply(c.a,d);d=null;P(a)?d=a.B:(d=a.h,d.forEach(function(a){a.D=c;}));d=[e,0].concat(d);Array.prototype.splice.apply(P(c)?c.B:c.h,d);Yf(a.qb,a.ya);P(c)||cg(c);-1!=b&&(a.D.a.splice(b,1),a.D.h.splice(b,1));}
m.Ab=function(a,b,c){var d=$f(this,a);if(P(this)){if(this.s.Qa(this.a[d],a)){if(c)this.s.Y().remove(a,this.s.Ma()?1:this.B[d].length),this.B[d]=this.s.Ma()?b:[b];else {if(this.s.Ma())throw new D(201,this.s.getName(),JSON.stringify(a));if(!Hf(this.B[d],b))throw new D(109);}this.s.Y().add(a,1);return this}this.a.splice(d,0,a);this.B.splice(d,0,this.s.Ma()?b:[b]);this.s.Y().add(a,1);512==this.a.length?(d=Rf(this.s),a=Rf(this.s),a.mb=1,a.a=[this.a[256]],a.h=[this,d],a.D=this.D,this.D=a,d.a=this.a.splice(256),
d.B=this.B.splice(256),d.D=a,Yf(d,this.ya),Yf(this,d),d=a):d=this;return d}d=this.s.Qa(this.a[d],a)?d+1:d;a=this.h[d].Ab(a,b,c);P(a)||1!=a.a.length||(this.a.splice(d,0,a.a[0]),a.h[1].D=this,a.h[0].D=this,this.h.splice(d,1,a.h[1]),this.h.splice(d,0,a.h[0]));return 512==this.a.length?fg(this):this};
function fg(a){var b=Rf(a.s),c=Rf(a.s);b.D=a.D;b.mb=a.mb+1;b.a=[a.a[256]];b.h=[a,c];a.a.splice(256,1);c.D=b;c.mb=a.mb;c.a=a.a.splice(256);c.h=a.h.splice(257);c.h.forEach(function(a){a.D=c;});a.D=b;Yf(c,a.ya);Yf(a,c);return b}function $f(a,b){for(var c=0,d=a.a.length,e=a.s.jb();c<d;){var f=c+d>>1;-1==e.compare(a.a[f],b)?c=f+1:d=f;}return c}m.Pe=function(a){if(!P(this)){var b=$f(this,a);this.s.Qa(this.a[b],a)&&b++;return this.h[b].Pe(a)}return this};
m.Oe=function(a){if(!P(this)){var b=$f(this,a);this.s.Qa(this.a[b],a)&&(a.some(function(a){return a==F})||b++);return this.h[b].Oe(a)}return this};
m.Va=function(a,b,c){function d(a){return a[0]?a[1]?0:1:-1}var e=this.s.jb(),f=0,h=this.a.length-1,l=this.a,p=d(e.wb(l[f],a)),L=d(e.wb(l[h],a));if(1!=p&&(-1!=p||-1!=L)){var sa=function(a,b){b=a+b>>1;return b==a?b+1:b},ca=function(b,c,f){if(b>=c)return 0==f?c:-1;var h=d(e.wb(l[b],a));if(0==h)return b;if(1==h)return -1;h=sa(b,c);if(h==c)return 0==f?c:-1;var p=d(e.wb(l[h],a));return 0==p?ca(b,h,p):-1==p?ca(h+1,c,f):ca(b+1,h,p)},Cb=function(b,c){if(b>=c)return b;var f=d(e.wb(l[c],a));if(0==f)return c;
if(-1==f)return b;f=sa(b,c);if(f==c)return b;var h=d(e.wb(l[f],a));return 0==h?Cb(f,c):1==h?Cb(b,f-1):-1};0!=p&&(f=ca(f+1,h,L));-1!=f&&(h=Cb(f,h),-1!=h&&h>=f&&gg(this,b,c,f,h+1));}};function Qf(a,b,c,d){if(a.s.Ma())!b.reverse&&b.L?b.L--:c[b.count++]=a.B[d];else for(var e=0;e<a.B[d].length&&b.count<c.length;++e)!b.reverse&&b.L?b.L--:c[b.count++]=a.B[d][e];}function gg(a,b,c,d,e){for(;d<e&&(b.reverse||!(b.count>=b.X));++d)Qf(a,b,c,d);}
m.fill=function(a,b){if(P(this))for(var c=0;c<this.B.length&&0<a.count;++c)if(0<a.offset){if(a.offset-=this.s.Ma()?1:this.B[c].length,0>a.offset)for(var d=this.B[c].length+a.offset;d<this.B[c].length&&0<a.count;++d)b[a.te++]=this.B[c][d],a.count--;}else if(this.s.Ma())b[a.te++]=this.B[c],a.count--;else for(d=0;d<this.B[c].length&&0<a.count;++d)b[a.te++]=this.B[c][d],a.count--;else for(c=0;c<this.h.length&&0<a.count;++c)this.h[c].fill(a,b);};
function Vf(a,b){var c=b.Y();a=a.map(function(a){var d=new Wf(a.id(),b);d.a=a.m[0];d.B=a.m[1];d.a.forEach(function(a,e){c.add(a,b.Ma()?1:d.B[e].length);});return d});for(var d=0;d<a.length-1;++d)Yf(a[d],a[d+1]);return 1<a.length?Nf(a[0]):a[0]}m.kd=function(a){return this.s.jb().kd(this.a[0],a)};function hg(a){this.Xc=0==a?ig:jg;this.ce=0==a?function(a){return null!=a?a.reverse():null}:function(a){return a||null};this.ie=0==a?kg:lg;}function jg(a,b){return a>b?1:a<b?-1:0}function ig(a,b){return jg(b,a)}function lg(a,b){return Fd(a,b)}function kg(a,b){return Fd(b,a)}m=hg.prototype;m.wb=function(a,b){b=this.ce(b);var c=[b.from==F,b.o==F];if(!c[0]){var d=this.Xc(a,b.from);c[0]=b.ea?1==d:-1!=d;}c[1]||(d=this.Xc(a,b.o),c[1]=b.na?-1==d:1!=d);return c};m.compare=function(a,b){return this.Xc(a,b)};
m.min=function(a,b){return a<b?1:a==b?0:-1};m.max=function(a,b){return a>b?1:a==b?0:-1};m.Bb=function(a,b){a=this.wb(a,b);return a[0]&&a[1]};m.kd=function(a,b){return this.Bb(a,b)};m.uf=function(a){return a.filter(function(a){return null!==a}).sort(function(a,c){return this.ie(a,c)}.bind(this))};m.Xd=function(a){return this.ce(a).from==F};m.ud=function(a){a=this.ce(a);return [a.from,a.o]};m.Od=function(a){return null!==a};m.Zd=k(1);
m.toString=function(){return this.compare==ig?"SimpleComparator_DESC":"SimpleComparator_ASC"};function mg(a){hg.call(this,a);this.Xc=0==a?ng:og;}r(mg,hg);function og(a,b){return null===a?null===b?0:-1:null===b?1:jg(a,b)}function ng(a,b){return og(b,a)}mg.prototype.Bb=function(a,b){return null===a?Ad(b):mg.hb.Bb.call(this,a,b)};mg.prototype.Hb=function(a,b){return null===a?null===b?0:-1:null===b?1:null};mg.prototype.min=function(a,b){var c=this.Hb(a,b);null===c&&(c=mg.hb.min.call(this,a,b));return c};
mg.prototype.max=function(a,b){var c=this.Hb(a,b);null===c&&(c=mg.hb.max.call(this,a,b));return c};function pg(a){this.pa=a.map(function(a){return new hg(a)});}function qg(a,b,c,d){for(var e=0,f=0;f<a.pa.length&&0==e;++f)e=d(a.pa[f],b[f],c[f]);return e}m=pg.prototype;m.compare=function(a,b){return qg(this,a,b,function(a,b,e){return b==F||e==F?0:a.compare(b,e)})};m.min=function(a,b){return qg(this,a,b,function(a,b,e){return a.min(b,e)})};m.max=function(a,b){return qg(this,a,b,function(a,b,e){return a.max(b,e)})};
m.wb=function(a,b){for(var c=[!0,!0],d=0;d<this.pa.length&&(c[0]||c[1]);++d){var e=this.pa[d].wb(a[d],b[d]);c[0]=c[0]&&e[0];c[1]=c[1]&&e[1];}return c};m.Bb=function(a,b){for(var c=!0,d=0;d<this.pa.length&&c;++d)c=this.pa[d].Bb(a[d],b[d]);return c};m.kd=function(a,b){return this.pa[0].Bb(a[0],b[0])};
m.uf=function(a){var b=a.filter(function(a){return a.every(ga)});a=Array(this.pa.length);for(var c=0;c<a.length;c++)a[c]=b.map(function(a){return a[c]});a.forEach(function(a,b){a.sort(function(a,c){return this.pa[b].ie(a,c)}.bind(this));},this);b=Array(b.length);for(c=0;c<b.length;c++)b[c]=a.map(function(a){return a[c]});return b.sort(function(a,b){for(var c=0,d=0;d<this.pa.length&&0==c;++d)c=this.pa[d].ie(a[d],b[d]);return c}.bind(this))};m.Xd=function(a){return this.pa[0].Xd(a[0])};
m.ud=function(a){var b=a.map(function(a,b){return this.pa[b].ud(a)[0]},this);a=a.map(function(a,b){return this.pa[b].ud(a)[1]},this);return [b,a]};m.Od=function(a){return a.every(function(a,c){return this.pa[c].Od(a)},this)};m.Zd=function(){return this.pa.length};function rg(a){pg.call(this,a);this.pa=a.map(function(a){return new mg(a)});}r(rg,pg);function sg(a){if(1==a.f.length)return new hg(a.f[0].order);var b=a.f.map(function(a){return a.order});return a.f.some(function(a){return a.ba.hc()})?new rg(b):new pg(b)}function tg(a){this.fa=a;this.ob=B();this.Oc=new Jf;this.za=new Jf;}m=tg.prototype;m.getName=function(){return this.fa.getName()};m.add=function(a,b){null===a?(this.ob.add(b),this.Oc.add(a,1)):this.fa.add(a,b);};m.set=function(a,b){null===a?(this.ob.clear(),this.Oc.clear(),this.add(a,b)):this.fa.set(a,b);};m.remove=function(a,b){null===a?b?(this.ob.delete(b),this.Oc.remove(a,1)):(this.ob.clear(),this.Oc.clear()):this.fa.remove(a,b);};m.get=function(a){return null===a?C(this.ob):this.fa.get(a)};m.Zc=function(a){return this.fa.Zc(a)};
m.Y=function(){Kf(this.za,[this.fa.Y(),this.Oc]);return this.za};m.Va=function(a,b,c,d){b=this.fa.Va(a,b,c,d);return null!=a?b:b.concat(C(this.ob))};m.clear=function(){this.ob.clear();this.fa.clear();};m.Pa=function(a){return null===a?0!=this.ob.size:this.fa.Pa(a)};m.min=function(){return this.fa.min()};m.max=function(){return this.fa.max()};m.Ja=function(){return [new hc(-2,C(this.ob))].concat(this.fa.Ja())};m.jb=function(){return this.fa.jb()};
function ug(a,b){for(var c=-1,d=0;d<b.length;++d)if(-2==b[d].id()){c=d;break}if(-1==c)throw new D(102);d=b[c].m;b=b.slice(0);b.splice(c,1);a=a(b);var e=new tg(a);d.forEach(function(a){e.ob.add(a);});return e}m.Ma=function(){return this.fa.Ma()};function vg(a){this.A=a;this.sb=B();this.$=new hg(1);}m=vg.prototype;m.getName=g("A");m.add=function(a){if("number"!=typeof a)throw new D(103);this.sb.add(a);};m.set=function(a,b){this.add(a,b);};m.remove=function(a){this.sb.delete(a);};m.get=function(a){return this.Pa(a)?[a]:[]};m.min=function(){return this.Hb(this.$.min.bind(this.$))};m.max=function(){return this.Hb(this.$.max.bind(this.$))};
m.Hb=function(a){if(0==this.sb.size)return null;var b=C(this.sb).reduce(function(b,d){return null===b||1==a(d,b)?d:b},null);return [b,[b]]};m.Zc=function(){return this.sb.size};m.Va=function(a,b,c,d){var e=a||[Dd()];a=C(this.sb).filter(function(a){return e.some(function(b){return this.$.Bb(a,b)},this)},this);return If(a,b,c,d)};m.clear=function(){this.sb.clear();};m.Pa=function(a){return this.sb.has(a)};m.Ja=function(){return [new hc(0,C(this.sb))]};m.jb=g("$");
function wg(a,b){var c=new vg(a);b[0].m.forEach(function(a){c.add(a,a);});return c}m.Ma=k(!0);m.Y=function(){var a=new Jf;a.ia=this.sb.size;return a};function xg(a){this.Oa=a.b(vc);this.C=a.b(xc);this.V=a.b(wc);}xg.prototype.Ea=function(a){var b=a.oa(),c=function(){if(0==b.length)return v();var a=b.shift();return (a.Cb()?yg(this,a):zg(this,a)).then(c)}.bind(this);return c()};function zg(a,b){var c=a.Oa.Fb(0,[b]);a=c.I(b.getName(),b.kb.bind(b),0).get([]).then(function(a){this.V.Wb(b.getName(),a);Ag(this,b,a);}.bind(a));c.ka();return a}
function Ag(a,b,c){var d=a.C.lc.get(b.getName())||[];c.forEach(function(a){d.forEach(function(b){var c=a.nb(b.getName());b.add(c,a.id());});});}function yg(a,b){var c=a.Oa.Fb(0,[b]),d=c.I(b.getName(),b.kb,0).get([]).then(function(a){this.V.Wb(b.getName(),a);}.bind(a));a=b.Da().map(function(a){return Bg(this,a,c)},a).concat(Cg(a,b,c));c.ka();return eb(a.concat(d))}
function Bg(a,b,c){c=c.I(b.j(),jc,1);var d=sg(b);return c.get([]).then(function(a){if(0<a.length){if(Dg(b)){var c=Uf.bind(void 0,d,b.j(),b.Dc);a=ug(c,a);}else a=Uf(d,b.j(),b.Dc,a);this.C.set(b.mc,a);}}.bind(a))}function Cg(a,b,c){return c.I(nf(b),jc,1).get([]).then(function(a){0<a.length&&(a=wg(nf(b),a),this.C.set(b.getName(),a));}.bind(a))}function Eg(){this.Z=y();this.lc=y();}Eg.prototype.Ea=function(a){a.oa().forEach(function(a){var b=[];this.lc.set(a.getName(),b);var d=nf(a);if(null===this.get(d)){var e=new vg(d);b.push(e);this.Z.set(d,e);}a.Da().forEach(function(a){var c;c=sg(a);c=new Lf(a.j(),c,a.Dc);c=Dg(a)&&1==a.f.length?new tg(c):c;b.push(c);this.Z.set(a.j(),c);},this);},this);return v()};Eg.prototype.get=function(a){return this.Z.get(a)||null};
Eg.prototype.set=function(a,b){var c=this.lc.get(a)||null;null===c&&(c=[],this.lc.set(a,c));a=null;for(var d=0;d<c.length;d++)if(c[d].getName()==b.getName()){a=d;break}null!==a&&0<c.length?c.splice(a,1,b):c.push(b);this.Z.set(b.getName(),b);};function Fg(a,b){var c=[],d=null,e=null;me(a,function(a){var f=b(a);null==a.getParent()?e=f:K(d,f);var l=a.getParent();null!==l&&J(l).length==J(d).length&&(l=c.indexOf(d),-1!=l&&c.splice(l,1));1<J(a).length&&c.push(f);d=null===a.h?c[c.length-1]:f;});return e}function Gg(a){return Hg(a,function(a){return null===a.h})}
function Ig(a){var b=a.getParent(),c=0;null!==b&&(c=J(b).indexOf(a),b.removeChild(a));var d=J(a).slice();d.forEach(function(d,f){a.removeChild(d);null===b||je(b,d,c+f);});return {parent:b,children:d}}function Jg(a,b){J(a).slice().forEach(function(c){a.removeChild(c);K(b,c);});K(a,b);}function Kg(a){var b=ie(a,0);Ig(a);Jg(b,a);return b}
function Lg(a,b,c){var d=ie(a,0),e=J(d).slice();if(!e.some(function(a){return b(a)}))return a;Ig(a);e.forEach(function(e,h){if(b(e)){var f=c(a);ke(d,h);K(f,e);je(d,f,h);}});return d}function Mg(a,b,c,d){var e=a.getParent();null!==e&&(a=J(e).indexOf(a),ke(e,a),je(e,c,a));J(b).slice().forEach(function(a){b.removeChild(a);K(d,a);});return c}function Hg(a,b,c){function d(a){b(a)&&e.push(a);null!=c&&c(a)||J(a).forEach(d);}var e=[];d(a);return e}
function Ng(a,b){var c=b||function(a){return a.toString()+"\n"},d="";me(a,function(a){for(var b=0;b<he(a);b++)d+="-";d+=c(a);});return d}function Og(a){ne.call(this);this.pb=a;this.Wa=!1;}r(Og,ne);m=Og.prototype;m.Nb=function(){return Fg(this,function(a){if(a instanceof Og){var b=new Og(a.pb);b.Wa=a.Wa;a=a.W();b.sa=a;return b}return a.Nb()})};m.lb=function(a){var b=a||[];me(this,function(a){a!=this&&a.lb(b);}.bind(this));a=B(b);return C(a)};m.u=function(a){var b=null!=a?a:B();me(this,function(a){a!=this&&a.u(b);}.bind(this));return b};m.vd=function(a){this.Wa!=a&&(this.Wa=a,this.pb="and"==this.pb?"or":"and",J(this).forEach(function(b){return b.vd(a)}));};
m.eval=function(a){var b=J(this).map(function(b){return b.eval(a)});return Pg(this,b)};function Pg(a,b){return "and"==a.pb?Od(b):Pd(b)}m.toString=function(){return "combined_pred_"+this.pb.toString()};m.we=function(){if("or"==this.pb){var a=new Hd;J(this).forEach(function(b){b=b.we().qa();a.add(b);});return a}return new Hd};m.ld=function(){return "or"==this.pb?Qg(this):!1};
function Qg(a){var b=null;return J(a).every(function(a){if(!(a instanceof qe&&a.ld()))return !1;null===b&&(b=a.J);return b.j()==a.J.j()})}function Rg(a,b,c){ne.call(this);this.ga=a;this.ma=b;this.F=c;this.de=null;a=ee();this.vc=fe(a,this.ga.G(),this.F);this.ng=a.Ze.get(this.ga.G())||null;}r(Rg,ne);m=Rg.prototype;m.Nb=function(){var a=new Rg(this.ga,this.ma,this.F),b=this.W();a.sa=b;return a};m.lb=function(a){return null!=a?(a.push(this.ga),a.push(this.ma),a):[this.ga,this.ma]};m.u=function(a){a=null!=a?a:B();a.add(this.ga.I());a.add(this.ma.I());return a};
m.reverse=function(){var a=this.F;switch(this.F){case "gt":a="lt";break;case "lt":a="gt";break;case "gte":a="lte";break;case "lte":a="gte";}return new Rg(this.ma,this.ga,a)};m.eval=function(a){var b=a.entries.filter(function(a){var b=H(a,this.ga);a=H(a,this.ma);return this.vc(b,a)},this);return new G(b,a.u())};m.toString=function(){return "join_pred("+this.ga.j()+" "+this.F+" "+this.ma.j()+")"};
function Sg(a,b,c){var d;-1!=b.u().indexOf(Td(a.ga.I()))?(d=b,b=c):d=c;if(d.entries.length>b.entries.length){a:{c=a.ga;a.ga=a.ma;a.ma=c;switch(a.F){case "gt":c="lt";break;case "lt":c="gt";break;case "gte":c="lte";break;case "lte":c="gte";break;default:break a}a.F=c;a.vc=fe(ee(),a.ga.G(),a.F);}return [b,d]}return [d,b]}function Tg(a){var b={};a.lb().forEach(function(a){b[a.getName()]=null;});return b}
function Ug(a,b,c){null===a.de&&(a.de=Tg(a.ma.I()));var d=new Rd(new hc(-1,a.de),!1);return Vd(b,c,d,[Td(a.ma.I())])}
function Vg(a,b,c,d){var e=[b,c];d||(e=Sg(a,b,c));b=e[0];c=e[1];var e=b,f=c,h=a.ga,l=a.ma;d&&(e=c,f=b,h=a.ma,l=a.ga);var p=new cd,L=[];e.entries.forEach(function(a){var b=String(H(a,h));p.set(b,a);});var sa=e.u(),ca=f.u();f.entries.forEach(function(a){var b=H(a,l),c=String(b);null!==b&&p.has(c)?p.get(c).forEach(function(b){b=Vd(a,ca,b,sa);L.push(b);}):d&&L.push(Ug(this,a,ca));}.bind(a));a=b.u().concat(c.u());return new G(L,a)}
function Wg(a,b,c,d,e){function f(a,b){b=new Rd(b,1<sa.length);a=Vd(a,ca,b,sa);L.push(a);}var h=d.dg.I(),l=b,p=c;-1!=b.u().indexOf(Td(h))&&(l=c,p=b);var L=[],sa=p.u(),ca=l.u();l.entries.forEach(function(a){var b=this.ng(H(a,d.wg)),b=d.index.get(b);0!=b.length&&(d.index.Ma()?f(a,e.get(b[0])):Ef(e,b).forEach(f.bind(null,a)));},a);a=l.u().concat(p.u());return new G(L,a)}function Xg(a,b,c){return null===b?new qe(a,b,c):n(b.j)?new Rg(a,b,c):new qe(a,b,c)}var Yg={};q("lf.schema.DataStoreType",Yg);Yg.INDEXED_DB=0;Yg.MEMORY=1;Yg.LOCAL_STORAGE=2;Yg.FIREBASE=3;Yg.WEB_SQL=4;Yg.OBSERVABLE_STORE=5;function Zg(a,b,c,d){this.mc=a;this.name=b;this.Dc=c;this.f=d;}Zg.prototype.j=function(){return this.mc+"."+this.name};function Dg(a){return a.f.some(function(a){return a.ba.hc()})}function Q(a,b,c,d){this.A=a;this.ta=c;this.K=b;this.rd=d;this.Ka=null;}q("lf.schema.Table",Q);Q.prototype.getName=g("A");Q.prototype.getName=Q.prototype.getName;
function Td(a){return a.Ka||a.A}Q.prototype.rc=function(a){var b=new this.constructor(this.A);b.Ka=a;b.Ig=this.Ig;return b};Q.prototype.as=Q.prototype.rc;Q.prototype.createRow=Q.prototype.xb;Q.prototype.deserializeRow=Q.prototype.kb;Q.prototype.Da=g("ta");Q.prototype.getIndices=Q.prototype.Da;Q.prototype.lb=g("K");Q.prototype.getColumns=Q.prototype.lb;Q.prototype.getConstraint=Q.prototype.Ne;Q.prototype.Cb=g("rd");Q.prototype.persistentIndex=Q.prototype.Cb;function nf(a){return a.A+".#"}function R(a,b){this.child=a;this.Lb=b;this.Ka=null;}m=R.prototype;m.getName=function(){return this.Lb+"("+this.child.getName()+")"};m.j=function(){return this.Lb+"("+this.child.j()+")"};m.I=function(){return this.child.I()};m.toString=function(){return this.j()};m.G=function(){return this.child.G()};m.Da=function(){return []};m.Ca=k(null);m.hc=k(!1);m.rc=function(a){this.Ka=a;return this};R.prototype.as=R.prototype.rc;
function $g(a){for(var b=[a];a instanceof R;)b.push(a.child),a=a.child;return b}function ah(a){this.Ka=a||null;this.U=new Q("#UnknownTable",[],[],!1);}m=ah.prototype;m.getName=k("*");m.j=function(){return this.getName()};m.toString=function(){return this.j()};m.I=g("U");m.G=k(4);m.Da=function(){return []};m.Ca=k(null);m.hc=k(!1);q("lf.fn.avg",function(a){return new R(a,"AVG")});function bh(a){return new R(a||new ah,"COUNT")}q("lf.fn.count",bh);function ch(a){return new R(a,"DISTINCT")}q("lf.fn.distinct",ch);q("lf.fn.max",function(a){return new R(a,"MAX")});q("lf.fn.min",function(a){return new R(a,"MIN")});q("lf.fn.stddev",function(a){return new R(a,"STDDEV")});q("lf.fn.sum",function(a){return new R(a,"SUM")});q("lf.fn.geomean",function(a){return new R(a,"GEOMEAN")});function S(a,b){I.call(this);this.Uf=b;}r(S,I);S.prototype.exec=function(a,b){switch(this.Uf){case 1:return dh(this,a,b);case 0:return eh(this,a,b);default:return fh(this,a,b)}};S.prototype.toString=k("dummy_node");S.prototype.Pc=function(){return this.toString()};function fh(a,b,c){return new u(function(a){a(this.ca([],b,c));}.bind(a))}function dh(a,b,c){return ie(a,0).exec(b,c).then(function(a){return this.ca(a,b,c)}.bind(a))}
function eh(a,b,c){var d=J(a).map(function(a){return a.exec(b,c)});return eb(d).then(function(a){var d=[];a.forEach(function(a){for(var b=0;b<a.length;++b)d.push(a[b]);});return this.ca(d,b,c)}.bind(a))}function gh(a){S.call(this,0,1);this.Ce=a;}r(gh,S);gh.prototype.toString=function(){return "aggregation("+this.Ce.map(function(a){return a.j()}).toString()+")"};gh.prototype.ca=function(a){a.forEach(function(a){hh(new ih(a,this.Ce));},this);return a};function ih(a,b){this.Na=a;this.K=b;}
function hh(a){a.K.forEach(function(a){a=$g(a).reverse();for(var b=1;b<a.length;b++){var d=a[b],e=$g(d).slice(-1)[0],f=d.child instanceof R?Ld(this.Na,d.child):this.Na;if(null!==f.$a&&f.$a.has(d.j()))break;f=jh(d.Lb,f,e);e=this.Na;null===e.$a&&(e.$a=y());e.$a.set(d.j(),f);}},a);}
function jh(a,b,c){var d=null;switch(a){case "MIN":d=kh(b,c,function(a,b){return b<a?b:a});break;case "MAX":d=kh(b,c,function(a,b){return b>a?b:a});break;case "DISTINCT":d=lh(b,c);break;case "COUNT":d=mh(b,c);break;case "SUM":d=nh(b,c);break;case "AVG":a=mh(b,c);0<a&&(d=nh(b,c)/a);break;case "GEOMEAN":d=oh(b,c);break;default:d=ph(b,c);}return d}function kh(a,b,c){return a.entries.reduce(function(a,e){e=H(e,b);return null===e?a:null===a?e:c(a,e)},null)}
function mh(a,b){return b instanceof ah?a.entries.length:a.entries.reduce(function(a,d){return a+(null===H(d,b)?0:1)},0)}function nh(a,b){return kh(a,b,function(a,b){return b+a})}function ph(a,b){var c=[];a.entries.forEach(function(a){a=H(a,b);null===a||c.push(a);});return 0==c.length?null:tb.apply(null,c)}function oh(a,b){var c=0;a=a.entries.reduce(function(a,e){e=H(e,b);if(0==e||null===e)return a;c++;return a+Math.log(e)},0);return 0==c?null:Math.pow(Math.E,a/c)}
function lh(a,b){var c=y();a.entries.forEach(function(a){var d=H(a,b);c.set(d,a);});return new G(z(c),a.u())}function qh(a,b){this.Ha=a;this.aa=b;}qh.prototype.bb=g("Ha");qh.prototype.da=g("aa");function rh(){I.call(this);}r(rh,I);function sh(a,b){I.call(this);this.table=a;this.values=b;}r(sh,rh);function th(a,b){sh.call(this,a,b);}r(th,sh);function uh(a){I.call(this);this.table=a;}r(uh,rh);uh.prototype.toString=function(){return "delete("+this.table.getName()+")"};function vh(a){I.call(this);this.table=a;}r(vh,rh);vh.prototype.toString=function(){return "update("+this.table.getName()+")"};
function wh(a){I.call(this);this.O=a;}r(wh,rh);wh.prototype.toString=function(){return "select("+this.O.toString()+")"};function xh(a){I.call(this);this.table=a;}r(xh,rh);xh.prototype.toString=function(){var a="table_access("+this.table.getName();null===this.table.Ka||(a+=" as "+this.table.Ka);return a+")"};function yh(){I.call(this);}r(yh,rh);yh.prototype.toString=k("cross_product");function zh(a,b){I.call(this);this.f=a;this.Pb=b;}r(zh,rh);
zh.prototype.toString=function(){var a="project("+this.f.toString();if(null!==this.Pb)var b=this.Pb.map(function(a){return a.j()}).join(", "),a=a+(", groupBy("+b+")");return a+")"};function Ah(a){I.call(this);this.N=a;}r(Ah,rh);Ah.prototype.toString=function(){return "order_by("+Ae(this.N)+")"};function Bh(a){I.call(this);this.f=a;}r(Bh,rh);Bh.prototype.toString=function(){return "aggregation("+this.f.toString()+")"};function Ch(a){I.call(this);this.f=a;}r(Ch,rh);
Ch.prototype.toString=function(){return "group_by("+this.f.toString()+")"};function Dh(a){I.call(this);this.X=a;}r(Dh,rh);Dh.prototype.toString=function(){return "limit("+this.X+")"};function Eh(a){I.call(this);this.L=a;}r(Eh,rh);Eh.prototype.toString=function(){return "skip("+this.L+")"};function Fh(a,b){I.call(this);this.O=a;this.Rb=b;}r(Fh,rh);Fh.prototype.toString=function(){return "join(type: "+(this.Rb?"outer":"inner")+", "+this.O.toString()+")"};function Gh(){}function Hh(){}r(Hh,Gh);Hh.prototype.gb=function(a){this.H=a;this.ub(this.H);return this.H};Hh.prototype.ub=function(a){if(a instanceof wh){var b=Ih(this,a.O),b=Jh(this,b);Mg(a,a,b[0],b[1]);a==this.H&&(this.H=b[0]);a=b[0];}J(a).forEach(function(a){this.ub(a);},this);};function Ih(a,b){if(0==J(b).length||"and"!=b.pb)return [b];a=J(b).slice().map(function(a){b.removeChild(a);return Ih(this,a)},a);return Ea(a)}
function Jh(a,b){var c=null,d=null;b.map(function(a,b){a=new wh(a);0==b?c=a:K(d,a);d=a;},a);return [c,d]}function Kh(){}r(Kh,Gh);Kh.prototype.gb=function(a,b){if(3>b.from.length)return a;this.H=a;this.ub(this.H);return this.H};Kh.prototype.ub=function(a){if(a instanceof yh)for(;2<J(a).length;){for(var b=new yh,c=0;2>c;c++){var d=ke(a,0);K(b,d);}je(a,b,0);}J(a).forEach(function(a){this.ub(a);},this);};function Lh(){S.call(this,0,0);}r(Lh,S);Lh.prototype.toString=k("cross_product");Lh.prototype.ca=function(a){var b=a[0],c=a[1];a=[];for(var d=b.u(),e=c.u(),f=0;f<b.entries.length;f++)for(var h=0;h<c.entries.length;h++){var l=Vd(b.entries[f],d,c.entries[h],e);a.push(l);}b=b.u().concat(c.u());return [new G(a,b)]};function Mh(a,b){De.call(this,a,b);this.Ia=a.b(zc);this.Ib=a.b(Ac);}r(Mh,De);Mh.prototype.getPriority=k(2);Mh.prototype.ge=function(a){0==this.G()?Nh(this,a):this.Mc();};function Nh(a,b){a.td.forEach(function(a,d){a instanceof ze&&Ge(this.Ib,a,b[d]);},a);}Mh.prototype.Mc=function(){var a=Ie(this.Ib,this.da());0!=a.length&&(a=new Fe(this.global,a),Je(this.Ia,a));};function Oh(a){ue.call(this,a);}r(Oh,ue);Oh.prototype.da=function(){var a=B();a.add(this.from);Ph(this,this.from.getName(),a);return a};function Ph(a,b,c){var d=Qh(a.ba.info(),b,1);Qh(a.ba.info(),b).forEach(c.add.bind(c));d.forEach(function(a){Ph(this,a.getName(),c);},a);}Oh.prototype.clone=function(){var a=new Oh(this.ba);xe(a,this);a.from=this.from;return a};Oh.prototype.bind=function(a){Oh.hb.bind.call(this,a);ye(this,a);return this};function Rh(a){ue.call(this,a);}r(Rh,ue);Rh.prototype.da=function(){var a=B();a.add(this.La);var b=this.ba.info();Sh(this.La.getName(),b.gf).forEach(a.add.bind(a));this.ac&&Qh(b,this.La.getName()).forEach(a.add.bind(a));return a};Rh.prototype.clone=function(){var a=new Rh(this.ba);xe(a,this);a.La=this.La;this.values&&(a.values=this.values instanceof Wd?this.values:this.values.slice());a.ac=this.ac;a.bc=this.bc;return a};
Rh.prototype.bind=function(a){Rh.hb.bind.call(this,a);this.bc&&(this.values=this.bc instanceof Wd?a[this.bc.Ca()]:this.bc.map(function(b){return b instanceof Wd?a[b.Ca()]:b}));return this};function Th(a){ue.call(this,a);}r(Th,ue);Th.prototype.da=function(){var a=B();a.add(this.table);var b=this.set.map(function(a){return a.J.j()}),c=this.ba.info();Uh(c,b).forEach(a.add.bind(a));Vh(c,b).forEach(a.add.bind(a));return a};Th.prototype.clone=function(){var a=new Th(this.ba);xe(a,this);a.table=this.table;a.set=this.set?Wh(this.set):this.set;return a};Th.prototype.bind=function(a){Th.hb.bind.call(this,a);this.set.forEach(function(b){-1!=b.Tc&&(b.value=a[b.Tc]);});ye(this,a);return this};
function Wh(a){return a.map(function(a){var b={},d;for(d in a)b[d]=a[d];return b})}function Xh(a,b){if(null==b)return "NULL";switch(a){case 1:return b?1:0;case 3:case 4:return b;case 0:return "'"+lc(b)+"'";default:return "'"+b.toString()+"'"}}function Yh(a,b){var c=a.ac?"INSERT OR REPLACE":"INSERT",d=a.La.lb(),c=c+(" INTO "+a.La.getName()+"("),c=c+d.map(function(a){return a.getName()}).join(", "),c=c+") VALUES (";return a.values.map(function(a){var e=d.map(function(c){var d=a.m[c.getName()];return b?null!=d?"#":"NULL":Xh(c.G(),d)});return c+e.join(", ")+");"}).join("\n")}
function Zh(a){switch(a){case "between":return "BETWEEN";case "eq":return "=";case "gte":return ">=";case "gt":return ">";case "in":return "IN";case "lte":return "<=";case "lt":return "<";case "match":return "LIKE";case "neq":return "<>";default:return "UNKNOWN"}}function $h(a,b,c,d){return a instanceof Wd?"?"+a.Ca().toString():d?null!=a?"#":"NULL":"match"==b?"'"+a.toString()+"'":"in"==b?"("+a.map(function(a){return Xh(c,a)}).join(", ")+")":"between"==b?Xh(c,a[0])+" AND "+Xh(c,a[1]):Xh(c,a).toString()}
function ai(a,b){return J(a).map(function(a){return "("+bi(a,b)+")"}).join("and"==a.pb?" AND ":" OR ")}function ci(a){return [a.ga.j(),Zh(a.F),a.ma.j()].join(" ")}function bi(a,b){if(a instanceof qe){var c=a.J.j(),d=Zh(a.F);a=$h(a.value,a.F,a.J.G(),b);return "="==d&&"NULL"==a?[c,"IS NULL"].join(" "):"<>"==d&&"NULL"==a?[c,"IS NOT NULL"].join(" "):[c,d,a].join(" ")}if(a instanceof Og)return ai(a,b);if(a instanceof Rg)return ci(a);throw new D(357,typeof a);}
function di(a,b){return (a=bi(a,b))?" WHERE "+a:""}function ei(a,b){var c="UPDATE "+a.table.getName()+" SET ",c=c+a.set.map(function(a){var b=a.J.j()+" = ";return -1!=a.Tc?b+"?"+a.Tc.toString():b+Xh(a.J.G(),a.value).toString()}).join(", ");a.w&&(c+=di(a.w,b));return c+";"}
function fi(a,b){var c="*";a.f.length&&(c=a.f.map(function(a){return a.Ka?a.j()+" AS "+a.Ka:a.j()}).join(", "));c="SELECT "+c+" FROM ";null!=a.eb&&0!=a.eb.size?c+=gi(a,b):(c+=a.from.map(hi).join(", "),a.w&&(c+=di(a.w,b)));a.N&&(b=a.N.map(function(a){return a.J.j()+(0==a.order?" DESC":" ASC")}).join(", "),c+=" ORDER BY "+b);a.ra&&(b=a.ra.map(function(a){return a.j()}).join(", "),c+=" GROUP BY "+b);a.X&&(c+=" LIMIT "+a.X.toString());a.L&&(c+=" SKIP "+a.L.toString());return c+";"}
function hi(a){return Td(a)!=a.getName()?a.getName()+" AS "+Td(a):a.getName()}function gi(a,b){for(var c=Hg(a.w,function(a){return a instanceof Rg}),d=c.map(ci),e=hi(a.from[0]),f=1;f<a.from.length;f++)var h=hi(a.from[f]),e=a.eb.has(c[d.length-f].W())?e+(" LEFT OUTER JOIN "+h):e+(" INNER JOIN "+h),e=e+(" ON ("+d[d.length-f]+")");a=a.w;a=0<J(a).length?ie(a,0):a;a instanceof Rg||(e+=" WHERE "+bi(a,b));return e}
function ii(a,b){b=b||!1;a=a.query.clone();if(a instanceof Rh)return Yh(a,b);if(a instanceof Oh){var c="DELETE FROM "+a.from.getName();a.w&&(c+=di(a.w,b));return c+";"}if(a instanceof Th)return ei(a,b);if(a instanceof ze)return fi(a,b);throw new D(358,typeof a);}function T(a,b){this.global=a;this.Hg=a.b(yc);this.Ia=a.b(zc);this.query=b;}q("lf.query.BaseBuilder",T);T.prototype.exec=function(){try{this.ab();}catch(a){return bb(a)}return new u(function(a,b){var c=new Mh(this.global,[this.Bc()]);Je(this.Ia,c).then(function(b){a(Jd(b[0]));},b);},this)};T.prototype.exec=T.prototype.exec;T.prototype.Wf=function(){var a=function(a){return a.Pc(this.query)+"\n"}.bind(this);return Ng(ji(this).bb(),a)};T.prototype.explain=T.prototype.Wf;
T.prototype.bind=function(a){this.query.bind(a);return this};T.prototype.bind=T.prototype.bind;T.prototype.Pg=function(a){return ii(this,a)};T.prototype.toSql=T.prototype.Pg;T.prototype.ab=aa();function ji(a){if(null==a.hf){var b;b=a.Hg;var c=a.query,d=b.qg.create(c);b=b.Eg.create(d,c);a.hf=b;}return a.hf}T.prototype.Bc=function(){return {context:this.query.clone(),je:ji(this)}};function ki(a){T.call(this,a,new Oh(a.b(Bc)));}r(ki,T);q("lf.query.DeleteBuilder",ki);ki.prototype.from=function(a){if(null!=this.query.from)throw new D(515);this.query.from=a;return this};ki.prototype.from=ki.prototype.from;ki.prototype.w=function(a){this.Fd();this.query.w=a;return this};ki.prototype.where=ki.prototype.w;ki.prototype.Fd=function(){if(null==this.query.from)throw new D(548);if(null!=this.query.w)throw new D(516);};
ki.prototype.ab=function(){ki.hb.ab.call(this);if(null==this.query.from)throw new D(517);};function li(a,b){T.call(this,a,new Rh(a.b(Bc)));this.query.ac=b||!1;}r(li,T);q("lf.query.InsertBuilder",li);li.prototype.ab=function(){li.hb.ab.call(this);var a=this.query;if(null==a.La||null==a.values)throw new D(518);if(a.ac&&null===a.La.Mb.sd)throw new D(519);};li.prototype.La=function(a){if(null!=this.query.La)throw new D(520);this.query.La=a;return this};li.prototype.into=li.prototype.La;
li.prototype.values=function(a){if(null!=this.query.values)throw new D(521);a instanceof Wd||a.some(function(a){return a instanceof Wd})?this.query.bc=a:this.query.values=a;return this};li.prototype.values=li.prototype.values;function mi(a){return ni("and",Array.prototype.slice.call(arguments))}q("lf.op.and",mi);q("lf.op.or",function(a){return ni("or",Array.prototype.slice.call(arguments))});function ni(a,b){var c=new Og(a);b.forEach(function(a){K(c,a);});return c}q("lf.op.not",function(a){a.vd(!0);return a});function U(a,b){T.call(this,a,new ze(a.b(Bc)));this.Me=this.Ad=!1;this.query.f=b;oi(this);pi(this);}r(U,T);q("lf.query.SelectBuilder",U);U.prototype.ab=function(){U.hb.ab.call(this);var a=this.query;if(null==a.from)throw new D(522);if(n(a.Sb)&&!n(a.X)||n(a.Zb)&&!n(a.L))throw new D(523);null!=this.query.ra?qi(this):ri(this);};function oi(a){var b=a.query.f.filter(function(a){return a instanceof R&&"DISTINCT"==a.Lb},a);if(0!=b.length&&(1!=b.length||1!=a.query.f.length))throw new D(524);}
function qi(a){if(a.query.ra.some(function(a){a=a.G();return 6==a||0==a}))throw new D(525);}function ri(a){var b=a.query.f.some(function(a){return a instanceof R},a);a=a.query.f.some(function(a){return !(a instanceof R)},a)||0==a.query.f.length;if(b&&a)throw new D(526);}function pi(a){a.query.f.forEach(function(a){if(a instanceof R&&!si(a.Lb,a.G()))throw new D(527,a.j());},a);}function ti(a,b){if(null==a.query.from)throw new D(b);}
U.prototype.from=function(a){if(this.Me)throw new D(515);this.Me=!0;null==this.query.from&&(this.query.from=[]);this.query.from.push.apply(this.query.from,Array.prototype.slice.call(arguments));return this};U.prototype.from=U.prototype.from;U.prototype.w=function(a){ti(this,548);if(this.Ad)throw new D(516);this.Ad=!0;ui(this,a);return this};U.prototype.where=U.prototype.w;function ui(a,b){null!=a.query.w&&(b=mi(b,a.query.w));a.query.w=b;}
U.prototype.hg=function(a,b){ti(this,542);if(this.Ad)throw new D(547);this.query.from.push(a);ui(this,b);return this};U.prototype.innerJoin=U.prototype.hg;U.prototype.og=function(a,b){ti(this,542);if(!(b instanceof Rg))throw new D(541);if(this.Ad)throw new D(547);this.query.from.push(a);null==this.query.eb&&(this.query.eb=B());var c=b;Td(a)!=Td(b.ma.I())&&(c=b.reverse());this.query.eb.add(c.W());ui(this,c);return this};U.prototype.leftOuterJoin=U.prototype.og;
U.prototype.X=function(a){if(null!=(this.query.X||this.query.Sb))throw new D(528);if(a instanceof Wd)this.query.Sb=a;else {if(0>a)throw new D(531);this.query.X=a;}return this};U.prototype.limit=U.prototype.X;U.prototype.L=function(a){if(null!=(this.query.L||this.query.Zb))throw new D(529);if(a instanceof Wd)this.query.Zb=a;else {if(0>a)throw new D(531);this.query.L=a;}return this};U.prototype.skip=U.prototype.L;
U.prototype.N=function(a,b){ti(this,549);null==this.query.N&&(this.query.N=[]);this.query.N.push({J:a,order:null!=b?b:1});return this};U.prototype.orderBy=U.prototype.N;U.prototype.ra=function(a){ti(this,549);if(null!=this.query.ra)throw new D(530);null==this.query.ra&&(this.query.ra=[]);this.query.ra.push.apply(this.query.ra,Array.prototype.slice.call(arguments));return this};U.prototype.groupBy=U.prototype.ra;
function si(a,b){switch(a){case "COUNT":case "DISTINCT":return !0;case "AVG":case "GEOMEAN":case "STDDEV":case "SUM":return 4==b||3==b;case "MAX":case "MIN":return 4==b||3==b||5==b||2==b}return !1}U.prototype.clone=function(){var a=new U(this.global,this.query.f);a.query=this.query.clone();a.query.Wc=null;return a};U.prototype.clone=U.prototype.clone;function vi(a,b){T.call(this,a,new Th(a.b(Bc)));this.query.table=b;}r(vi,T);q("lf.query.UpdateBuilder",vi);vi.prototype.set=function(a,b){a={Tc:b instanceof Wd?b.Ca():-1,J:a,value:b};null!=this.query.set?this.query.set.push(a):this.query.set=[a];return this};vi.prototype.set=vi.prototype.set;vi.prototype.w=function(a){this.Fd();this.query.w=a;return this};vi.prototype.where=vi.prototype.w;vi.prototype.Fd=function(){if(null!=this.query.w)throw new D(516);};
vi.prototype.ab=function(){vi.hb.ab.call(this);if(null==this.query.set)throw new D(532);if(this.query.set.some(function(a){return a.value instanceof Wd}))throw new D(501);};function wi(a){this.query=a;this.Ha=null;}wi.prototype.gc=function(){null===this.Ha&&(this.Ha=this.ad());return this.Ha};function xi(a){wi.call(this,a);}r(xi,wi);xi.prototype.ad=function(){return this.query.ac?new th(this.query.La,this.query.values):new sh(this.query.La,this.query.values)};function yi(a){wi.call(this,a);}r(yi,wi);yi.prototype.ad=function(){var a=new vh(this.query.table),b=null!=this.query.w?new wh(this.query.w.Nb()):null,c=new xh(this.query.table);null===b?K(a,c):(K(b,c),K(a,b));return a};function zi(a,b,c){this.Ha=a;this.le=b;this.Vb=c;}zi.prototype.gc=function(){this.Vb.forEach(function(a){this.Ha=a.gb(this.Ha,this.le);},this);return this.Ha};function Ai(a,b){wi.call(this,a);this.Vb=b;}r(Ai,wi);Ai.prototype.ad=function(){var a=new uh(this.query.from),b=null!=this.query.w?new wh(this.query.w.Nb()):null,c=new xh(this.query.from);null===b?K(a,c):(K(b,c),K(a,b));return (new zi(a,this.query,this.Vb)).gc()};function Bi(){}r(Bi,Gh);Bi.prototype.gb=function(a,b){if(2>b.from.length)return a;this.H=a;this.ub(this.H,b);return this.H};Bi.prototype.ub=function(a,b){if(a instanceof wh&&a.O instanceof Rg){var c=a.O.W(),d=ie(a,0);d instanceof yh&&(c=null!=b.eb&&b.eb.has(c),c=new Fh(a.O,c),Mg(a,d,c,c),a==this.H&&(this.H=c),a=c);}J(a).forEach(function(a){this.ub(a,b);},this);};function Ci(){this.Sc=B();}r(Ci,Gh);Ci.prototype.gb=function(a,b){if(!n(b.w))return a;this.Sc.clear();this.H=a;this.ub(this.H,b);this.Sc.clear();return this.H};Ci.prototype.ub=function(a,b){var c=function(a){J(a).forEach(d);}.bind(this),d=function(a){if(!this.Sc.has(a)){if(a instanceof wh){var e=a.O.u(),h=function(a){return Di(this,a,e)}.bind(this),h=Ei(this,b,a,h);this.Sc.add(a);h!=a&&(null===h.getParent()&&(this.H=h),d(h));}c(a);}}.bind(this);d(a);};
function Ei(a,b,c,d){var e=c;if(Fi(b,c))e=Kg(c),Ei(a,b,c,d);else if(Gi(c)){var f=[],e=Lg(c,d,function(a){a=new wh(a.O);f.push(a);return a});f.forEach(function(a){Ei(this,b,a,d);},a);}return e}function Di(a,b,c){var d=B();Gg(b).forEach(function(a){d.add(a.table);},a);b instanceof xh&&d.add(b.table);return Hc(d,c)}function Gi(a){a=ie(a,0);return a instanceof yh||a instanceof Fh}
function Fi(a,b){var c=ie(b,0);if(!(c instanceof wh))return !1;if(null==a.eb)return !0;b=b.O instanceof Rg;a=a.eb.has(c.O.W());return b||!a}function Hi(a,b){wi.call(this,a);this.Vb=b;this.kf=this.cf=this.tf=this.ff=this.De=this.Se=this.sf=this.Je=this.vf=null;}r(Hi,wi);
Hi.prototype.ad=function(){Ii(this);2<=this.query.from.length&&(this.Je=new yh);this.sf=null!=this.query.w?new wh(this.query.w.Nb()):null;this.query.N&&(this.ff=new Ah(this.query.N));null!=this.query.L&&0<this.query.L&&(this.tf=new Eh(this.query.L));null!=this.query.X&&(this.cf=new Dh(this.query.X));null!=this.query.ra&&(this.Se=new Ch(this.query.ra));Ji(this);this.kf=new zh(this.query.f||[],this.query.ra||null);var a=Ki(this);return (new zi(a,this.query,this.Vb)).gc()};
function Ki(a){for(var b=[a.cf,a.tf,a.kf,a.ff,a.De,a.Se,a.sf,a.Je],c=-1,d=null,e=0;e<b.length;e++){var f=b[e];null!==f&&(null===d?d=f:K(b[c],f),c=e);}a.vf.forEach(function(a){K(b[c],a);});return d}function Ii(a){a.vf=a.query.from.map(function(a){return new xh(a)},a);}function Ji(a){var b=a.query.f.filter(function(a){return a instanceof R});null!=a.query.N&&a.query.N.forEach(function(a){a.J instanceof R&&b.push(a.J);});0<b.length&&(a.De=new Bh(b));}function Li(){this.re=[new Hh,new Kh,new Ci,new Bi];this.Pd=[new Hh];}Li.prototype.create=function(a){var b;if(a instanceof Rh)b=new xi(a);else if(a instanceof Oh)b=new Ai(a,this.Pd);else if(a instanceof ze)b=new Hi(a,this.re);else if(a instanceof Th)b=new yi(a);else throw new D(513);b=b.gc();return new qh(b,a.da())};function Mi(a){S.call(this,0,1);this.U=a;}r(Mi,S);Mi.prototype.toString=function(){return "delete("+this.U.getName()+")"};Mi.prototype.ca=function(a,b){a=a[0].entries.map(function(a){return a.va});b.remove(this.U,a);return [Nd()]};function Ni(a,b){S.call(this,0,-1);this.table=b;this.C=a.b(xc);}r(Ni,S);Ni.prototype.toString=function(){return "get_row_count("+this.table.getName()+")"};Ni.prototype.ca=function(){var a=this.C.get(nf(this.table)),b=new G([],[this.table.getName()]),c=bh(),a=a.Y().ia;null===b.$a&&(b.$a=y());b.$a.set(c.j(),a);return [b]};function Oi(a,b){S.call(this,0,-1);this.V=a.b(wc);this.C=a.b(xc);this.table=b;}r(Oi,S);Oi.prototype.toString=function(){var a="table_access("+this.table.getName();null===this.table.Ka||(a+=" as "+this.table.Ka);return a+")"};Oi.prototype.ca=function(){var a=this.C.get(nf(this.table)).Va();return [Qd(Ef(this.V,a),[Td(this.table)])]};function Pi(a){this.c=a;}r(Pi,Gh);Pi.prototype.gb=function(a,b){this.H=a;if(!this.Hd(b))return a;a=Hg(a,function(a){return a instanceof Oi})[0];b=new Ni(this.c,a.table);Mg(a,a,b,b);return this.H};Pi.prototype.Hd=function(a){return 1==a.f.length&&1==a.from.length&&null==a.w&&null==a.X&&null==a.L&&null==a.ra?(a=a.f[0],a instanceof R&&"COUNT"==a.Lb&&a.child instanceof ah):!1};function Qi(a){S.call(this,0,1);this.Re=a;}r(Qi,S);Qi.prototype.toString=function(){return "groupBy("+this.Re.map(function(a){return a.j()}).toString()+")"};Qi.prototype.ca=function(a){return Ri(this,a[0])};function Ri(a,b){var c=new cd,d=function(a){return this.Re.map(function(b){return H(a,b)},this).join(",")}.bind(a);b.entries.forEach(function(a){c.set(d(a),a);},a);return c.keys().map(function(a){return new G(c.get(a),b.u())},a)}function Si(a,b,c){S.call(this,0,0);this.C=a.b(xc);this.V=a.b(wc);this.O=b;this.Rb=c;this.Dd="eq"==this.O.F?0:2;this.Ue=null;}r(Si,S);var Ti=["hash","index_nested_loop","nested_loop"];Si.prototype.toString=function(){return "join(type: "+(this.Rb?"outer":"inner")+", impl: "+Ti[this.Dd]+", "+this.O.toString()+")"};
Si.prototype.ca=function(a){switch(this.Dd){case 0:return [Vg(this.O,a[0],a[1],this.Rb)];case 1:return [Wg(this.O,a[0],a[1],this.Ue,this.V)];default:var b=this.O,c=a[0];a=a[1];var d=this.Rb,e=[c,a];d||(e=Sg(b,c,a));c=e[0];a=e[1];for(var e=[],f=c.u(),h=a.u(),l=c.entries.length,p=a.entries.length,L=p+256-1>>8,sa=0;sa<L;){for(var ca=0;ca<l;ca++){var Cb=!1,dg=H(c.entries[ca],b.ga);if(null!==dg)for(var Wi=Math.min(sa+1<<8,p),Db=sa<<8;Db<Wi;Db++)if(b.vc(dg,H(a.entries[Db],b.ma))){var Cb=!0,Tc=Vd(c.entries[ca],
f,a.entries[Db],h);e.push(Tc);}d&&!Cb&&e.push(Ug(b,c.entries[ca],f));}sa++;}b=c.u().concat(a.u());return [new G(e,b)]}};function Ui(a,b){a.Dd=1;var c=a.C.get(b.Ca().j());a.Ue={dg:b,wg:b==a.O.ga?a.O.ma:a.O.ga,index:c};}function Vi(a){S.call(this,0,-1);this.lf=a;}r(Vi,S);Vi.prototype.toString=function(){return "no_op_step("+this.lf[0].u().join(",")+")"};Vi.prototype.ca=g("lf");function Xi(){}r(Xi,Gh);Xi.prototype.gb=function(a,b){this.H=a;if(!this.Hd(b))return a;Hg(a,function(a){return a instanceof Si}).forEach(this.Gg,this);return this.H};Xi.prototype.Hd=function(a){return 1<a.from.length};
Xi.prototype.Gg=function(a){if("eq"==a.O.F&&!a.Rb){var b=function(b){if(!(b instanceof Oi))return null;b=Td(b.table)==Td(a.O.ma.I())?a.O.ma:a.O.ga;return null===b.Ca()?null:b},c=b(ie(a,0)),b=b(ie(a,1));if(null!==c||null!==b){b=null===b?c:b;Ui(a,b);var d=new G([],[Td(b.I())]);le(a,new Vi([d]),b==c?0:1);}}};function Yi(a){a=a.map(function(a){return a.qa()});a=yb.apply(null,a);var b=[];xb(a,function(a){b.push(a);});return b}function Zi(a){this.Qb=a;}Zi.prototype.bd=function(){return 1==this.Qb.f.length?[Dd()]:[this.Qb.f.map(function(){return Dd()})]};function $i(a,b){this.Qb=a;this.Ga=b;this.Ld=this.af=null;}
function aj(a,b){var c=y();a.Ga.keys().forEach(function(a){var d=this.Ga.get(a).map(function(a){return ve(b,a)},this),f=new Hd([Dd()]);d.forEach(function(a){f=Id(f,a.we());});c.set(a,f);},a);return c}$i.prototype.bd=function(a){if(this.af==a)return this.Ld;for(var b=aj(this,a),c=this.Qb.f.length-1;0<=c;c--){var d=this.Qb.f[c];if(null!==(b.get(d.ba.getName())||null))break;b.set(d.ba.getName(),new Hd([Dd()]));}this.Ld=1==this.Qb.f.length?z(b)[0].qa():Yi(bj(this,b));this.af=a;return this.Ld};
function bj(a,b){var c=y(),d=0;a.Qb.f.forEach(function(a){c.set(a.ba.getName(),d);d++;});return gc(b).sort(function(a,b){return c.get(a)-c.get(b)}).map(function(a){return b.get(a)})}function cj(a,b){this.xd=b;this.C=a.b(xc);}function dj(a){a=a.C.get(nf(a.xd));return Math.floor(.02*a.Y().ia)}function ej(a,b,c){c=c.filter(a.kg,a);if(0==c.length)return null;a=fj(a,c);if(0==a.length)return null;if(1==a.length)return a[0];var d=Number.MAX_VALUE;return a.reduce(function(a,c){var e=gj(c,b);return e<d?(d=e,c):a},null)}
function fj(a,b){return a.xd.Da().map(function(a){a=new hj(this.C,a);ij(a,b);return a},a).filter(function(a){if(null===a.Ga)a=!1;else {for(var b=!1,c=!0,f=0;f<a.cb.f.length;f++){var h=a.Ga.has(a.cb.f[f].ba.getName());if(b&&h){c=!1;break}h||(b=!0);}a=c;}return a})}cj.prototype.kg=function(a){return a instanceof qe?!a.ld()||a.J.I()!=this.xd||"in"==a.F&&a.value.length>dj(this)?!1:!0:a instanceof Og?a.ld()&&ie(a,0).J.I()==this.xd?J(a).length<=dj(this):!1:!1};
function hj(a,b){this.C=a;this.cb=b;this.eg=B(this.cb.f.map(function(a){return a.ba.getName()}));this.$d=this.Ga=null;}function jj(a){null===a.$d&&(a.$d=new $i(a.cb,a.Ga));return a.$d}function ij(a,b){b.forEach(function(a){var b=a.lb()[0].getName();this.eg.has(b)&&(null===this.Ga&&(this.Ga=new cd),this.Ga.set(b,a.W()));},a);}function gj(a,b){b=jj(a).bd(b);var c=a.C.get(a.cb.j());return b.reduce(function(a,b){return a+c.Zc(b)},0)}function kj(a,b,c,d){S.call(this,0,-1);this.C=a.b(xc);this.index=b;this.$e=c;this.pe=d;this.Rc=this.Qc=!1;}r(kj,S);kj.prototype.toString=function(){return "index_range_scan("+this.index.j()+", ?, "+(this.pe?"reverse":"natural")+(this.Qc?", limit:?":"")+(this.Rc?", skip:?":"")+")"};kj.prototype.Pc=function(a){var b=this.toString(),c=this.$e.bd(a),b=b.replace("?",c.toString());this.Qc&&(b=b.replace("?",a.X.toString()));this.Rc&&(b=b.replace("?",a.L.toString()));return b};
kj.prototype.ca=function(a,b,c){a=this.$e.bd(c);b=this.C.get(this.index.j());c=(1==a.length&&a[0]instanceof E&&Ed(a[0])?If(b.get(a[0].from),!1,this.Qc?c.X:void 0,this.Rc?c.L:void 0):b.Va(a,this.pe,this.Qc?c.X:void 0,this.Rc?c.L:void 0)).map(function(a){return new hc(a,{})},this);return [Qd(c,[this.index.mc])]};function lj(){S.call(this,0,0);}r(lj,S);lj.prototype.toString=k("multi_index_range_scan()");
lj.prototype.ca=function(a){var b=y();a.forEach(function(a){a.entries.forEach(function(a){b.set(a.va.id(),a);});});var c=z(b);return [new G(c,a[0].u())]};function mj(a){S.call(this,0,1);this.jc=a;}r(mj,S);mj.prototype.toString=k("select(?)");mj.prototype.Pc=function(a){a=ve(a,this.jc);return this.toString().replace("?",a.toString())};mj.prototype.ca=function(a,b,c){return [ve(c,this.jc).eval(a[0])]};function nj(a,b){S.call(this,0,1);this.V=a.b(wc);this.U=b;}r(nj,S);nj.prototype.toString=function(){return "table_access_by_row_id("+this.U.getName()+")"};nj.prototype.ca=function(a){return [Qd(Ef(this.V,Kd(a[0])),[Td(this.U)])]};function oj(a){this.c=a;}r(oj,Gh);oj.prototype.gb=function(a,b){this.H=a;Hg(a,function(a){return a instanceof Oi}).forEach(function(a){var c=pj(a);if(0!=c.length){var e=ej(new cj(this.c,a.table),b,c.map(function(a){return ve(b,a.jc)}));if(null!==e){var f=y();c.forEach(function(a){f.set(a.jc,a);},this);this.H=qj(this,e,f,a);}}},this);return this.H};function pj(a){var b=[];for(a=a.getParent();a;){if(a instanceof mj)b.push(a);else if(a instanceof Si)break;a=a.getParent();}return b}
function qj(a,b,c,d){(null===b.Ga?[]:b.Ga.values()).map(function(a){return c.get(a)}).forEach(Ig);b=new kj(a.c,b.cb,jj(b),!1);a=new nj(a.c,d.table);K(a,b);Mg(d,d,a,b);return b.bb()}function rj(a,b){S.call(this,0,-1);this.C=a.b(xc);this.U=b;}r(rj,S);rj.prototype.toString=function(){return "insert("+this.U.getName()+")"};rj.prototype.ca=function(a,b,c){sj(this.U,c.values,this.C);b.Ab(this.U,c.values);return [Qd(c.values,[this.U.getName()])]};function sj(a,b,c){a=a.Mb.sd;if(null===a?0:a.f[0].autoIncrement){var d=a.f[0].ba.getName();c=c.get(a.j()).Y().Fc;var e=null===c?0:c;b.forEach(function(a){if(0==a.m[d]||null==a.m[d])e++,a.m[d]=e;});}}
function tj(a,b){S.call(this,0,-1);this.C=a.b(xc);this.U=b;}r(tj,S);tj.prototype.toString=function(){return "insert_replace("+this.U.getName()+")"};tj.prototype.ca=function(a,b,c){sj(this.U,c.values,this.C);b.Wd(this.U,c.values);return [Qd(c.values,[this.U.getName()])]};function uj(){S.call(this,0,1);}r(uj,S);uj.prototype.toString=k("limit(?)");uj.prototype.Pc=function(a){return this.toString().replace("?",a.X.toString())};uj.prototype.ca=function(a,b,c){a[0].entries.splice(c.X);return a};function vj(a){S.call(this,0,1);this.N=a;}r(vj,S);m=vj.prototype;m.toString=function(){return "order_by("+Ae(this.N)+")"};m.ca=function(a){if(1==a.length){var b;b=a[0];for(var c=null,d=0;d<this.N.length;d++){var e=ch(this.N[d].J);if(null!==b.$a&&b.$a.has(e.j())){c=e;break}}b=c;(null===b?a[0]:Ld(a[0],b)).entries.sort(this.Tf.bind(this));}else a.sort(this.Jg.bind(this));return a};
m.$=function(a,b){var c,d,e,f=-1;do f++,e=this.N[f].J,c=this.N[f].order,d=a(e),e=b(e);while(d==e&&f+1<this.N.length);a=d<e?-1:d>e?1:0;return 1==c?a:-a};m.Jg=function(a,b){return this.$(function(b){return b instanceof R?Ld(a,b):H(a.entries[a.entries.length-1],b)},function(a){return a instanceof R?Ld(b,a):H(b.entries[b.entries.length-1],a)})};m.Tf=function(a,b){return this.$(function(b){return H(a,b)},function(a){return H(b,a)})};function wj(a,b){this.Na=a;this.K=b;}function xj(a){return a.K.some(function(a){return a instanceof R},a)?yj(a):zj(a)}function yj(a){if(1==a.K.length&&"DISTINCT"==a.K[0].Lb)return a=Ld(a.Na,a.K[0]).entries.map(function(a){var b=new Rd(new hc(-1,{}),1<this.Na.M.size);Ud(b,this.K[0],H(a,this.K[0].child));return b},a),new G(a,[]);var b=new Rd(new hc(-1,{}),1<a.Na.M.size);a.K.forEach(function(a){var c=a instanceof R?Ld(this.Na,a):H(this.Na.entries[0],a);Ud(b,a,c);},a);return new G([b],a.Na.u())}
function zj(a){var b=Array(a.Na.entries.length),c=1<a.Na.M.size;a.Na.entries.forEach(function(a,e){b[e]=new Rd(new hc(a.va.id(),{}),c);this.K.forEach(function(c){Ud(b[e],c,H(a,c));},this);},a);return new G(b,a.Na.u())}function Aj(a,b){var c=a.map(function(a){return xj(new wj(a,b)).entries[0]});return new G(c,a[0].u())}function Bj(a,b){S.call(this,0,1);this.f=a;this.Pb=b;}r(Bj,S);Bj.prototype.toString=function(){var a="project("+this.f.toString();if(null!==this.Pb)var b=this.Pb.map(function(a){return a.j()}).join(", "),a=a+(", groupBy("+b+")");return a+")"};Bj.prototype.ca=function(a){0==a.length?a=[Nd()]:1==a.length?(a=a[0],a=[0==this.f.length?a:xj(new wj(a,this.f))]):a=[Aj(a,this.f)];return a};function Cj(a){return a.f.some(function(a){return a instanceof R})||null!==a.Pb}function Dj(){S.call(this,0,1);}r(Dj,S);Dj.prototype.toString=k("skip(?)");Dj.prototype.Pc=function(a){return this.toString().replace("?",a.L.toString())};Dj.prototype.ca=function(a,b,c){return [new G(a[0].entries.slice(c.L),a[0].u())]};function Ej(){}r(Ej,Gh);Ej.prototype.gb=function(a,b){if(!n(b.X)&&!n(b.L))return a;var c=Fj(a);if(null===c)return a;Hg(a,function(a){return a instanceof uj||a instanceof Dj}).forEach(function(a){a instanceof uj?c.Qc=!0:c.Rc=!0;Ig(a);},this);return c.bb()};function Fj(a){a=Hg(a,function(a){return a instanceof kj},function(a){return a instanceof Bj&&Cj(a)||a instanceof vj||1!=J(a).length||a instanceof mj});return 0<a.length?a[0]:null}function Gj(a){this.c=a;}r(Gj,Gh);Gj.prototype.gb=function(a,b){this.H=a;var c=Hj(this,b);if(0==c.length)return this.H;var d,e=0;do d=c[e++],a=Ij(this,d,b);while(null===a&&e<c.length);if(null===a)return this.H;b=Jj(this,a[0].cb.mc);return null===b?this.H:this.H=Kj(this,d,b,a)};function Hj(a,b){return Hg(a.H,function(a){if(!(a instanceof mj))return !1;a=ve(b,a.jc);return a instanceof Og&&"or"==a.pb})}function Jj(a,b){return Hg(a.H,function(a){return a instanceof Oi&&a.table.getName()==b})[0]||null}
function Ij(a,b,c){b=ve(c,b.jc);var d=b.u();if(1!=d.size)return null;var d=C(d)[0],e=new cj(a.c,d),f=null;return J(b).every(function(a){a=ej(e,c,[a]);null===a||(null===f?f=[a]:f.push(a));return null!==a})?f:null}function Kj(a,b,c,d){var e=new nj(a.c,c.table),f=new lj;K(e,f);d.forEach(function(a){a=new kj(this.c,a.cb,jj(a),!1);K(f,a);},a);Ig(b);Mg(c,c,e,f);return f.bb()}function Lj(a){this.c=a;}r(Lj,Gh);Lj.prototype.gb=function(a,b){b=Mj(a,b);if(null===b)return a;a:{var c=b;a=Nj(ie(b,0));if(null!==a){var d;d=b.N;for(var e=null,f=a.table.Da(),h=0;h<f.length&&null===e;h++)e=Oj(f[h],d);d=e;if(null===d){a=c;break a}c=new kj(this.c,d.cb,new Zi(d.cb),d.Xe);d=new nj(this.c,a.table);K(d,c);Ig(b);c=Mg(a,a,d,c);}a=c;}a==b&&(a=b,c=Pj(ie(b,0)),null!==c&&(d=Oj(c.index,b.N),null!==d&&(c.pe=d.Xe,a=Ig(b).parent)));return a.bb()};
function Pj(a){a=Hg(a,function(a){return a instanceof kj},function(a){return 1!=J(a).length});return 0<a.length?a[0]:null}function Nj(a){a=Hg(a,function(a){return a instanceof Oi},function(a){return 1!=J(a).length});return 0<a.length?a[0]:null}function Mj(a,b){return n(b.N)?Hg(a,function(a){return a instanceof vj})[0]:null}function Oj(a,b){if(a.f.length!=b.length||!b.every(function(b,d){return b.J.getName()==a.f[d].ba.getName()}))return null;b=Qj(b,a);return b[0]||b[1]?{cb:a,Xe:b[1]}:null}
function Qj(a,b){var c=a.reduce(function(a,b){return a<<1|(0==b.order?0:1)},0),d=b.f.reduce(function(a,b){return a<<1|(0==b.order?0:1)},0),c=c^d;return [0==c,c==Math.pow(2,Math.max(a.length,b.f.length))-1]}function Rj(a,b,c){this.Ha=a;this.le=b;this.Vb=c;}Rj.prototype.gc=function(){this.Vb.forEach(function(a){this.Ha=a.gb(this.Ha,this.le);},this);return this.Ha};function Sj(a){S.call(this,0,1);this.U=a;}r(Sj,S);Sj.prototype.toString=function(){return "update("+this.U.getName()+")"};Sj.prototype.ca=function(a,b,c){a=a[0].entries.map(function(a){var b=this.U.kb(a.va.Ja());c.set.forEach(function(a){b.m[a.J.getName()]=a.value;},this);return b},this);b.update(this.U,a);return [Nd()]};function Tj(a){this.c=a;this.re=[new Xi,new oj(this.c),new Gj(this.c),new Lj(this.c),new Ej,new Pi(this.c)];this.Pd=[new oj(this.c)];}Tj.prototype.create=function(a,b){var c=a.bb();if(c instanceof th||c instanceof sh)return Uj(this,a,b);if(c instanceof zh||c instanceof Dh||c instanceof Eh)return Uj(this,a,b,this.re);if(c instanceof uh||c instanceof vh)return Uj(this,a,b,this.Pd);throw new D(8);};
function Uj(a,b,c,d){a=Fg(b.bb(),a.tg.bind(a));null!=d&&(a=(new Rj(a,c,d)).gc());return new Be(a,b.da())}
Tj.prototype.tg=function(a){if(a instanceof zh)return new Bj(a.f,a.Pb);if(a instanceof Ch)return new Qi(a.f);if(a instanceof Bh)return new gh(a.f);if(a instanceof Ah)return new vj(a.N);if(a instanceof Eh)return new Dj;if(a instanceof Dh)return new uj;if(a instanceof wh)return new mj(a.O.W());if(a instanceof yh)return new Lh;if(a instanceof Fh)return new Si(this.c,a.O,a.Rb);if(a instanceof xh)return new Oi(this.c,a.table);if(a instanceof uh)return new Mi(a.table);if(a instanceof vh)return new Sj(a.table);
if(a instanceof th)return new tj(this.c,a.table);if(a instanceof sh)return new rj(this.c,a.table);throw new D(514);};function Vj(a){this.qg=new Li;this.Eg=new Tj(a);}function Wj(){this.df=y();}function Xj(a,b){var c=a.df.get(b.getName())||null;null===c&&(c=new Yj,a.df.set(b.getName(),c));return c}function Zj(a,b,c,d){c.forEach(function(a){a=Xj(this,a);0==d?(a.fb=null,a.wc=b):3==d?(null===a.Yb&&(a.Yb=B()),a.Yb.add(b),null===a.Ya&&(a.Ya=B()),a.Ya.delete(b)):1==d?(null===a.Ya&&(a.Ya=B()),a.Ya.add(b)):2==d&&(a.fb=b);},a);}
function ak(a,b,c,d){var e=!0;c.forEach(function(a){if(e){a=Xj(this,a);var c=null===a.Ya||0==a.Ya.size;e=0==d?(null===a.Yb||0==a.Yb.size)&&c&&null===a.wc&&null!==a.fb&&a.fb==b:3==d?null===a.wc&&null===a.fb&&null!==a.Ya&&a.Ya.has(b):1==d?null===a.fb:c&&(null===a.fb||a.fb==b);}},a);return e}function bk(a,b,c,d){var e=ak(a,b,c,d);e&&Zj(a,b,c,d);return e}Wj.prototype.releaseLock=function(a,b){b.forEach(function(b){Xj(this,b).releaseLock(a);},this);};
function ck(a,b){b.forEach(function(a){Xj(this,a).fb=null;},a);}function Yj(){this.Yb=this.Ya=this.fb=this.wc=null;}Yj.prototype.releaseLock=function(a){this.wc==a&&(this.wc=null);this.fb==a&&(this.fb=null);null===this.Ya||this.Ya.delete(a);null===this.Yb||this.Yb.delete(a);};function dk(){this.Ub=new ek;this.Ec=new Wj;}function Je(a,b){(2>b.getPriority()||2>b.getPriority())&&ck(a.Ec,b.da());a.Ub.Ab(b);fk(a);return b.Db.ha}function fk(a){for(var b=a.Ub.qa(),c=0;c<b.length;c++){var d=b[c];if(0==d.G()?gk(a,d,1,3):gk(a,d,2,0)){a.Ub.remove(d);var e=a;d.exec().then(e.Bg.bind(e,d),e.Ag.bind(e,d));}}}function gk(a,b,c,d){var e=!1;bk(a.Ec,b.W(),b.da(),c)&&(e=bk(a.Ec,b.W(),b.da(),d));return e}dk.prototype.Bg=function(a,b){this.Ec.releaseLock(a.W(),a.da());a.Db.resolve(b);fk(this);};
dk.prototype.Ag=function(a,b){this.Ec.releaseLock(a.W(),a.da());a.Db.reject(b);fk(this);};function ek(){this.Ub=[];}ek.prototype.Ab=function(a){Hf(this.Ub,a,function(a,c){var b=a.getPriority()-c.getPriority();return 0==b?a.W()-c.W():b});};ek.prototype.qa=function(){return this.Ub.slice()};ek.prototype.remove=function(a){var b=this.Ub;a=xa(b,a);var c;(c=0<=a)&&Array.prototype.splice.call(b,a,1);return c};function hk(){this.Nc=y();}var ik;function jk(){ik||(ik=new hk);return ik}hk.prototype.clear=function(){this.Nc.clear();};hk.prototype.clear=hk.prototype.clear;hk.prototype.rb=function(a,b){this.Nc.set(a.toString(),b);return b};hk.prototype.registerService=hk.prototype.rb;hk.prototype.b=function(a){var b=this.Nc.get(a.toString())||null;if(null===b)throw new D(7,a.toString());return b};hk.prototype.getService=hk.prototype.b;hk.prototype.md=function(a){return this.Nc.has(a.toString())};
hk.prototype.isRegistered=hk.prototype.md;function kk(){var a=jk();return gc(a.Nc)}function lk(a,b,c,d){return null!=a?null!=b?mk(a,b,c,d):nk(a):ok()}function pk(a){var b="";try{b=JSON.stringify(a);}catch(c){}return b}function qk(a){var b=jk();a=new uc("ns_"+a);return b.md(a)?b.b(a):null}function ok(){var a={};kk().forEach(function(b){"ns_"==b.substring(0,3)&&(b=b.substring(3),a[b]=qk(b).b(Bc).version());});return pk(a)}function nk(a){a=qk(a);var b={};if(null!=a){var c=a.b(xc);a.b(Bc).oa().forEach(function(a){b[a.getName()]=c.get(nf(a)).Y().ia;});}return pk(b)}
function mk(a,b,c,d){var e=qk(a);a=[];if(null!=e){var f=null;try{f=e.b(Bc).table(b);}catch(h){}null!=f&&(b=e.b(xc),e=e.b(wc),c=b.get(nf(f)).Va(void 0,!1,c,d),c.length&&(a=Ef(e,c).map(function(a){return a.m})));}return pk(a)}function rk(a,b){this.Qd=ee();this.me=a;this.od=b;this.K=sk(this);}function sk(a){if(0<a.me.f.length)return a.me.f;var b=[];a.me.from.forEach(function(a){a.lb().forEach(function(a){b.push(a);});});return b}rk.prototype.$=function(a,b){return this.K.every(function(c){return 6==c.G()||0==c.G()?H(a,c)===H(b,c):fe(this.Qd,c.G(),"eq")(H(a,c),H(b,c))},this)};
function tk(a,b,c){var d=null===b?[]:b.entries,e=pb(d,c.entries,a.$.bind(a),function(a){return d[a]});b=[];for(var f=0,h=0;h<d.length;h++){var l=d[h];e[f]==l?f++:(l=a.od.splice(f,1),l=uk(h,l,0,a.od),b.push(l));}e=pb(d,c.entries,a.$.bind(a),function(a,b){return c.entries[b]});for(h=f=0;h<c.entries.length;h++)l=c.entries[h],e[f]==l?f++:(a.od.splice(h,0,l.va.m),l=uk(h,[],1,a.od),b.push(l));return b}function uk(a,b,c,d){return {addedCount:c,index:a,object:d,removed:b,type:"splice"}}function vk(){this.fc=y();}vk.prototype.Cd=function(a,b){var c=ka(a.query).toString(),d=this.fc.get(c)||null;null===d&&(d=new wk(a),this.fc.set(c,d));d.Cd(b);};vk.prototype.ne=function(a,b){a=ka(a.query).toString();var c=this.fc.get(a)||null;c.ne(b);0<c.Hc.size||this.fc.delete(a);};function Ie(a,b){var c=B();b.forEach(function(a){c.add(a.getName());});var d=[];a.fc.forEach(function(a){a=a.Bc();a.context.from.some(function(a){return c.has(a.getName())})&&d.push(a);});return d}
function Ge(a,b,c){b=ka(null!=b.Wc?b.Wc:b).toString();a=a.fc.get(b)||null;null!==a&&xk(a,c);}function wk(a){this.Hf=a;this.Hc=B();this.yg=[];this.bf=null;this.Rf=new rk(a.query,this.yg);}wk.prototype.Cd=function(a){this.Hc.has(a)||this.Hc.add(a);};wk.prototype.ne=function(a){return this.Hc.delete(a)};wk.prototype.Bc=function(){var a=this.Hf;return {context:a.query,je:ji(a)}};function xk(a,b){var c=tk(a.Rf,a.bf,b);a.bf=b;0<c.length&&a.Hc.forEach(function(a){a(c);});}function yk(a,b){var c=a.b(Bc),d=b||{};b=new Df(c);a.rb(wc,b);b=null;var e=!1;null!=d.storeType?b=d.storeType:(b=ec(),b=b.fg?0:b.Ug?4:1);switch(b){case 0:b=new hf(a,c);break;case 1:b=new qf(c);break;case 5:b=new sf(c);break;case 4:b=new Af(a,c,d.webSqlDbSize);break;case 3:b=new Ve(c,d.firebase);e=!0;break;default:throw new D(300);}a.rb(vc,b);var f=new Eg;a.rb(xc,f);return b.Ea(d.onUpgrade).then(function(){var b=new Vj(a);a.rb(yc,b);b=new dk;a.rb(zc,b);b=new vk;a.rb(Ac,b);return f.Ea(c)}).then(function(){if(e){var b=
new Ke(a);b.Oa.subscribe(b.ee.bind(b));}d.enableInspector&&(window.top["#lfInspect"]=lk);return (new xg(a)).Ea(c)})}function zk(a){this.c=a;this.g=a.b(Bc);this.aa=B(this.g.oa());this.Db=w();}function Ak(a){var b=a.c.b(xc),c=a.c.b(wc),d={};a.g.oa().forEach(function(a){var e=b.get(nf(a)).Va(),e=Ef(c,e).map(function(a){return a.m});d[a.getName()]=e;});return {name:a.g.name(),version:a.g.version(),tables:d}}m=zk.prototype;m.exec=function(){var a=Ak(this),a=new Rd(new hc(-1,a),!0);return v([new G([a],[])])};m.G=k(0);m.da=g("aa");m.W=function(){return ka(this)};m.getPriority=k(0);function Bk(a,b){this.c=a;this.g=a.b(Bc);this.aa=B(this.g.oa());this.Db=w();this.Ba=b;this.Oa=a.b(vc);this.V=a.b(wc);this.C=a.b(xc);}m=Bk.prototype;
m.exec=function(){if(!(this.Oa instanceof hf||this.Oa instanceof qf||this.Oa instanceof Af))throw new D(300);var a;a:{a=this.g.oa();for(var b=0;b<a.length;++b)if(0<this.C.get(nf(a[b])).Y().ia){a=!1;break a}a=!0;}if(!a)throw new D(110);if(this.g.name()!=this.Ba.name||this.g.version()!=this.Ba.version)throw new D(111);if(null==this.Ba.tables)throw new D(112);return Ck(this)};m.G=k(1);m.da=g("aa");m.W=function(){return ka(this)};m.getPriority=k(0);
function Ck(a){var b=new ud(a.c,a.aa),b=a.Oa.Fb(a.G(),C(a.aa),b),c;for(c in a.Ba.tables){var d=a.g.table(c),e=a.Ba.tables[c].map(function(a){return d.xb(a)}),f=b.I(c,d.kb,0);a.V.Wb(c,e);var h=a.C.lc.get(c)||[];e.forEach(function(a){h.forEach(function(b){var c=a.nb(b.getName());b.add(c,a.id());});});f.put(e);}return b.ka()}function Dk(a,b){this.c=a;this.Oa=a.b(vc);this.Ia=a.b(zc);this.Ib=a.b(Ac);this.aa=B(b);this.Ra=new ud(this.c,this.aa);this.Db=w();this.xc=w();this.ze=w();}m=Dk.prototype;m.exec=function(){this.ze.resolve();return this.xc.ha};m.G=k(1);m.da=g("aa");m.W=function(){return ka(this)};m.getPriority=k(2);function Ek(a){Je(a.Ia,a);return a.ze.ha}
function Fk(a,b){b=b.Bc();return b.je.bb().exec(a.Ra,b.context).then(function(a){return Jd(a[0])},function(a){this.Ra.Jb();var b=new jb(a.name);this.xc.reject(b);throw a;}.bind(a))}m.ka=function(){this.ja=this.Oa.Fb(this.G(),C(this.aa),this.Ra);this.ja.ka().then(function(){this.Mc();this.xc.resolve();}.bind(this),function(a){this.Ra.Jb();this.xc.reject(a);}.bind(this));return this.Db.ha};m.Jb=function(){this.Ra.Jb();this.xc.resolve();return this.Db.ha};
m.Mc=function(){var a=Ie(this.Ib,this.aa);0!=a.length&&(a=new Fe(this.c,a),Je(this.Ia,a));};m.Y=function(){var a=null;null!=this.ja&&(a=this.ja.Y());return null===a?new A(!1,0,0,0,0):a};function V(a){this.c=a;this.Ia=a.b(zc);this.Kb=null;this.Ta=0;0==Gk.size&&(Gk.set(0,B([1,4])),Gk.set(1,B([2])),Gk.set(2,B([3,5,6])),Gk.set(3,B([2,7])),Gk.set(4,B([7])),Gk.set(5,B([7])),Gk.set(6,B([7])));}q("lf.proc.Transaction",V);var Gk=y();function Hk(a,b){var c=Gk.get(a.Ta)||null;if(null===c||!c.has(b))throw new D(107,a.Ta,b);a.Ta=b;}
V.prototype.exec=function(a){Hk(this,4);var b=[];try{a.forEach(function(a){a.ab();b.push(a.Bc());},this);}catch(c){return Hk(this,7),bb(c)}this.Kb=new Mh(this.c,b);return Je(this.Ia,this.Kb).then(function(a){Hk(this,7);return a.map(function(a){return Jd(a)})}.bind(this),function(a){Hk(this,7);throw a;}.bind(this))};V.prototype.exec=V.prototype.exec;V.prototype.Ff=function(a){Hk(this,1);this.Kb=new Dk(this.c,a);return Ek(this.Kb).then(function(){Hk(this,2);}.bind(this))};V.prototype.begin=V.prototype.Ff;
V.prototype.Ef=function(a){Hk(this,3);try{a.ab();}catch(b){return Hk(this,7),bb(b)}return Fk(this.Kb,a).then(function(a){Hk(this,2);return a}.bind(this),function(a){Hk(this,7);throw a;}.bind(this))};V.prototype.attach=V.prototype.Ef;V.prototype.ka=function(){Hk(this,5);return this.Kb.ka().then(function(){Hk(this,7);}.bind(this))};V.prototype.commit=V.prototype.ka;V.prototype.Jb=function(){Hk(this,6);return this.Kb.Jb().then(function(){Hk(this,7);}.bind(this))};V.prototype.rollback=V.prototype.Jb;
V.prototype.Y=function(){if(7!=this.Ta)throw new D(105);return this.Kb.Y()};V.prototype.stats=V.prototype.Y;function W(a){this.c=a;this.g=a.b(Bc);this.hd=!1;}q("lf.proc.Database",W);W.prototype.Ea=function(a){this.c.rb(Bc,this.g);return yk(this.c,a).then(function(){this.hd=!0;this.Ia=this.c.b(zc);return this}.bind(this))};W.prototype.init=W.prototype.Ea;W.prototype.zb=g("g");W.prototype.getSchema=W.prototype.zb;function Ik(a){if(!a.hd)throw new D(2);}W.prototype.select=function(a){Ik(this);return new U(this.c,1!=arguments.length||null!=arguments[0]?Array.prototype.slice.call(arguments):[])};
W.prototype.select=W.prototype.select;W.prototype.Ab=function(){Ik(this);return new li(this.c)};W.prototype.insert=W.prototype.Ab;W.prototype.Wd=function(){Ik(this);return new li(this.c,!0)};W.prototype.insertOrReplace=W.prototype.Wd;W.prototype.update=function(a){Ik(this);return new vi(this.c,a)};W.prototype.update=W.prototype.update;W.prototype.delete=function(){Ik(this);return new ki(this.c)};W.prototype["delete"]=W.prototype.delete;
W.prototype.observe=function(a,b){Ik(this);this.c.b(Ac).Cd(a,b);};W.prototype.observe=W.prototype.observe;W.prototype.unobserve=function(a,b){Ik(this);this.c.b(Ac).ne(a,b);};W.prototype.unobserve=W.prototype.unobserve;W.prototype.Nf=function(){Ik(this);return new V(this.c)};W.prototype.createTransaction=W.prototype.Nf;W.prototype.close=function(){try{this.c.b(vc).close();}catch(a){}this.c.clear();this.hd=!1;};W.prototype.close=W.prototype.close;
W.prototype.Xf=function(){Ik(this);var a=new zk(this.c);return Je(this.Ia,a).then(function(a){return Jd(a[0])[0]})};W.prototype["export"]=W.prototype.Xf;W.prototype.import=function(a){Ik(this);a=new Bk(this.c,a);return Je(this.Ia,a).then(k(null))};W.prototype["import"]=W.prototype.import;function X(a,b,c,d,e,f){this.U=a;this.A=b;this.Ye=c;this.We=d;this.xf=e;this.Ka=f||null;}q("lf.schema.BaseColumn",X);m=X.prototype;m.getName=g("A");m.j=function(){return Td(this.U)+"."+this.A};m.toString=function(){return this.j()};m.I=g("U");m.G=g("xf");X.prototype.getType=X.prototype.G;X.prototype.Da=function(){null==this.ta&&(this.ta=[],this.I().Da().forEach(function(a){-1!=a.f.map(function(a){return a.ba.getName()}).indexOf(this.A)&&this.ta.push(a);},this));return this.ta};
X.prototype.Ca=function(){if(!n(this.fa)){var a=this.Da().filter(function(a){return 1!=a.f.length?!1:a.f[0].ba.getName()==this.getName()},this);this.fa=0<a.length?a[0]:null;}return this.fa};X.prototype.hc=g("We");X.prototype.isNullable=X.prototype.hc;X.prototype.Dc=g("Ye");X.prototype.Qa=function(a){return Xg(this,a,"eq")};X.prototype.eq=X.prototype.Qa;X.prototype.ef=function(a){return Xg(this,a,"neq")};X.prototype.neq=X.prototype.ef;X.prototype.rg=function(a){return Xg(this,a,"lt")};
X.prototype.lt=X.prototype.rg;X.prototype.sg=function(a){return Xg(this,a,"lte")};X.prototype.lte=X.prototype.sg;X.prototype.ag=function(a){return Xg(this,a,"gt")};X.prototype.gt=X.prototype.ag;X.prototype.bg=function(a){return Xg(this,a,"gte")};X.prototype.gte=X.prototype.bg;X.prototype.match=function(a){return Xg(this,a,"match")};X.prototype.match=X.prototype.match;X.prototype.Gf=function(a,b){return Xg(this,[a,b],"between")};X.prototype.between=X.prototype.Gf;
X.prototype.cg=function(a){return Xg(this,a,"in")};X.prototype["in"]=X.prototype.cg;X.prototype.mg=function(){return this.Qa(null)};X.prototype.isNull=X.prototype.mg;X.prototype.lg=function(){return this.ef(null)};X.prototype.isNotNull=X.prototype.lg;X.prototype.rc=function(a){return new X(this.U,this.A,this.Ye,this.We,this.xf,a)};X.prototype.as=X.prototype.rc;function Jk(a){this.g=a;this.Id=new cd;this.oe=new cd;this.gf=new cd;this.Ie=y();this.h=new cd;this.Ee=new cd;this.mf=new cd;this.He=new cd;Kk(this);}function Kk(a){a.g.oa().forEach(function(a){var b=a.getName();a.Mb.Ud.forEach(function(c){this.gf.set(b,this.g.table(c.Xa));this.h.set(c.Xa,a);0==c.action?(this.oe.set(c.Xa,c),this.mf.set(c.Xa,a)):(this.Id.set(c.Xa,c),this.Ee.set(c.Xa,a));this.Ie.set(a.getName()+"."+c.vb,c.Xa);this.He.set(c.Xa+"."+c.Jc,a.getName());},this);},a);}
function kd(a,b,c){if(null!=c)return 1==c?a.Id.get(b):a.oe.get(b);c=a.Id.get(b);a=a.oe.get(b);return null===c&&null===a?null:(c||[]).concat(a||[])}function Sh(a,b){a=b.get(a);return null===a?[]:a}function Uh(a,b){var c=B();b.forEach(function(a){(a=this.Ie.get(a))&&c.add(a);},a);return C(c).map(function(a){return this.g.table(a)},a)}function Qh(a,b,c){return null!=c?0==c?Sh(b,a.mf):Sh(b,a.Ee):Sh(b,a.h)}
function Vh(a,b){var c=B();b.forEach(function(a){(a=this.He.get(a))&&a.forEach(function(a){c.add(a);});},a);return C(c).map(function(a){return this.g.table(a)},a)}function Lk(a,b,c){this.sd=a;this.xg=b;this.Ud=c;}q("lf.schema.Constraint",Lk);Lk.prototype.$f=g("sd");Lk.prototype.getPrimaryKey=Lk.prototype.$f;Lk.prototype.Zf=g("Ud");Lk.prototype.getForeignKeys=Lk.prototype.Zf;function Mk(a,b,c){var d=a.ref.split(".");if(2!=d.length)throw new D(540,c);this.Ge=b;this.vb=a.local;this.Xa=d[0];this.Jc=d[1];this.name=b+"."+c;this.action=a.action;this.timing=a.timing;}function Y(a){Nk(a);this.Qd=ee();this.A=a;this.K=y();this.zd=B();this.nc=B();this.nd=B();this.Fa=null;this.ta=y();this.rd=!1;this.yb=[];}q("lf.schema.TableBuilder",Y);function Ok(a){this.name=a.name;this.order=a.order;this.autoIncrement=a.autoIncrement;}var Pk=B([0,6]);function Nk(a){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(a))throw new D(502,a);}function Qk(a,b){if(b==a.A)throw new D(546,b);if(a.K.has(b)||a.ta.has(b)||a.nc.has(b))throw new D(503,a.A+"."+b);}
function Rk(a,b){var c=!1;b.forEach(function(a){var b=this.K.get(a.name);c=c||a.autoIncrement;if(a.autoIncrement&&3!=b)throw new D(504);},a);if(c&&1<b.length)throw new D(505);}function Sk(a){if(null!==a.Fa){var b=a.ta.get(a.Fa).map(function(a){return a.name}),c=0;if(a.yb.some(function(a,e){c=e;return -1!=b.indexOf(a.vb)},a))throw new D(543,a.yb[c].name);}}
function Tk(a){if(null!==a.Fa){var b=function(a){return a.name},c=JSON.stringify(a.ta.get(a.Fa).map(b));a.ta.forEach(function(a,e){if(e!=this.Fa&&(a=a.map(b),JSON.stringify(a)==c))throw new D(544,this.A+"."+e);},a);}}function Uk(a){null===a.Fa||a.ta.get(a.Fa).forEach(function(a){if(this.nd.has(a.name))throw new D(545,this.A+"."+a.name);},a);}Y.prototype.zf=function(a,b){Nk(a);Qk(this,a);this.K.set(a,b);Pk.has(b)&&this.Be([a]);return this};Y.prototype.addColumn=Y.prototype.zf;
Y.prototype.Bf=function(a,b){var c=this.A;this.Fa="pk"+(c[0].toUpperCase()+c.substring(1));Nk(this.Fa);Qk(this,this.Fa);a=Vk(this,a,!0,void 0,b);Rk(this,a);1==a.length&&this.zd.add(a[0].name);this.nc.add(this.Fa);this.ta.set(this.Fa,a);return this};Y.prototype.addPrimaryKey=Y.prototype.Bf;
Y.prototype.Af=function(a,b){Nk(a);Qk(this,a);b=new Mk(b,this.A,a);n(b.action)||(b.action=0);n(b.timing)||(b.timing=0);if(1==b.action&&1==b.timing)throw new D(506);if(!this.K.has(b.vb))throw new D(540,a);this.yb.push(b);this.Ae(a,[b.vb],this.zd.has(b.vb));return this};Y.prototype.addForeignKey=Y.prototype.Af;Y.prototype.Cf=function(a,b){Nk(a);Qk(this,a);b=Vk(this,b,!0);1==b.length&&(this.zd.add(b[0].name),Wk(this,b[0].name));this.ta.set(a,b);this.nc.add(a);return this};Y.prototype.addUnique=Y.prototype.Cf;
function Wk(a,b){a.yb.forEach(function(a){a.vb==b&&this.nc.add(a.name.split(".")[1]);},a);}Y.prototype.Be=function(a){Vk(this,a,!1).forEach(function(a){this.nd.add(a.name);},this);return this};Y.prototype.addNullable=Y.prototype.Be;Y.prototype.Ae=function(a,b,c,d){Nk(a);Qk(this,a);b=Vk(this,b,!0,d);c&&this.nc.add(a);this.ta.set(a,b);return this};Y.prototype.addIndex=Y.prototype.Ae;Y.prototype.Cb=ba("rd");Y.prototype.persistentIndex=Y.prototype.Cb;
Y.prototype.zb=function(){Sk(this);Tk(this);Uk(this);return new (Xk(this))};Y.prototype.getSchema=Y.prototype.zb;function Vk(a,b,c,d,e){var f=b,f="string"==typeof b[0]?b.map(function(a){return new Ok({name:a,order:null!=d?d:1,autoIncrement:e||!1})}):b.map(function(a){return new Ok(a)});f.forEach(function(a){if(!this.K.has(a.name))throw new D(508,this.A,a.name);if(c){var b=this.K.get(a.name);if(0==b||6==b)throw new D(509,this.A,a.name);}},a);return f}
function Xk(a){function b(){function b(b){return a.ta.get(b).map(function(a){return {ba:this[a.name],order:a.order,autoIncrement:a.autoIncrement}},this)}var d=gc(a.K).map(function(b){this[b]=new X(this,b,a.zd.has(b),a.nd.has(b),a.K.get(b));return this[b]},this),e=gc(a.ta).map(function(c){return new Zg(a.A,c,a.nc.has(c),b.call(this,c))},this);Q.call(this,a.A,d,e,a.rd);var f=null===a.Fa?null:new Zg(a.A,a.Fa,!0,b.call(this,a.Fa)),h=d.filter(function(b){return !a.nd.has(b.getName())});this.Mb=new Lk(f,
h,a.yb);this.qf=Yk(a,d,e);}r(b,Q);b.prototype.xb=function(a){return new this.qf(ic++,a)};b.prototype.createRow=b.prototype.xb;b.prototype.kb=function(a){var b={};this.lb().forEach(function(c){var d=c.getName();c=c.G();var e=a.value[d];if(0==c)if(c=e,null!=c&&""!=c){0!=c.length%2&&(c="0"+c);for(var e=new ArrayBuffer(c.length/2),l=new Uint8Array(e),p=0,L=0;p<c.length;p+=2)l[L++]=parseInt(c.substr(p,2),16);c=e;}else c=null;else c=2==c?null!=e?new Date(e):null:e;b[d]=c;},this);return new this.qf(a.id,b)};
b.prototype.deserializeRow=b.prototype.kb;b.prototype.Ne=g("Mb");b.prototype.getConstraint=b.prototype.Ne;return b}
function Yk(a,b,c){function d(a,d){this.K=b;this.ta=c;hc.call(this,a,d);}r(d,hc);d.prototype.Ke=function(){var a={};this.K.forEach(function(b){a[b.getName()]=b.hc()?null:bd[b.G()];});return a};d.prototype.wf=function(){var a={};this.K.forEach(function(b){var c=b.getName();b=b.G();var d=this.m[c];a[c]=0==b?null!=d?lc(d):null:2==b?null!=d?d.getTime():null:6==b?null!=d?d:null:d;},this);return a};var e=function(a){var b=this.K.get(a.getName()),c=this.Qd.Ze.get(b)||null;return function(b){return c(b[a.getName()])}}.bind(a),
f=function(a){var b=a.map(function(a){return e(a.ba)});return function(a){return b.map(function(b){return b(a)})}}.bind(a),h={};c.forEach(function(a){var b=a.j();a=1==a.f.length?e(a.f[0].ba):f(a.f);h[b]=a;});d.prototype.nb=function(a){return -1!=a.indexOf("#")?this.id():h.hasOwnProperty(a)?h[a](this.m):null};return d}function Zk(a,b){this.g=new Z(a,b);this.tb=y();this.yc=!1;this.i=null;this.Yc=!1;}q("lf.schema.Builder",Zk);function $k(a,b){b.yb.forEach(function(a){var c=a.Xa;if(!this.tb.has(c))throw new D(536,a.name);var c=this.tb.get(c).zb(),e=a.Jc;if(!c.hasOwnProperty(e))throw new D(537,a.name);if(b.zb()[a.vb].G()!=c[e].G())throw new D(538,a.name);if(!c[e].Dc())throw new D(539,a.name);},a);}
Zk.prototype.Kf=function(a){a.yb.forEach(function(a){this.tb.get(a.Xa).yb.forEach(function(b){if(b.vb==a.Jc)throw new D(534,a.name);},this);},this);};function al(a){a.yc||(a.tb.forEach(function(a){$k(this,a);a=a.zb();this.g.M.set(a.getName(),a);},a),z(a.tb).forEach(a.Kf,a),bl(a),a.tb.clear(),a.yc=!0);}function cl(a,b,c){b.ye||(b.ye=!0,b.fe=!0,b.Le.forEach(function(a){a=c.get(a);if(!a.ye)cl(this,a,c);else if(a.fe&&b!=a)throw new D(533);},a));b.fe=!1;}
function bl(a){var b=y();a.g.M.forEach(function(a,d){b.set(d,new dl(d));},a);a.tb.forEach(function(a,d){a.yb.forEach(function(a){b.get(a.Xa).Le.add(d);});});z(b).forEach(function(a){cl(this,a,b);},a);}function dl(a){this.fe=this.ye=!1;this.Le=B();this.mc=a;}Zk.prototype.zb=function(){this.yc||al(this);return this.g};Zk.prototype.getSchema=Zk.prototype.zb;Zk.prototype.Qe=function(){var a=new uc("ns_"+this.g.name()),b=jk(),c;b.md(a)?c=b.b(a):(c=new hk,b.rb(a,c));return c};Zk.prototype.getGlobal=Zk.prototype.Qe;
Zk.prototype.connect=function(a){if(this.Yc||null!==this.i&&this.i.hd)throw new D(113);this.Yc=!0;if(null===this.i){var b=this.Qe();b.md(Bc)||b.rb(Bc,this.zb());this.i=new W(b);}return this.i.Ea(a).then(function(a){this.Yc=!1;return a}.bind(this),function(a){this.Yc=!1;throw a;}.bind(this))};Zk.prototype.connect=Zk.prototype.connect;Zk.prototype.Mf=function(a){if(this.tb.has(a))throw new D(503,a);if(this.yc)throw new D(535);this.tb.set(a,new Y(a));return this.tb.get(a)};Zk.prototype.createTable=Zk.prototype.Mf;
Zk.prototype.se=function(a){if(this.yc)throw new D(535);this.g.se(a);return this};Zk.prototype.setPragma=Zk.prototype.se;function Z(a,b){this.A=a;this.Ua=b;this.M=y();this.ke={Sf:!1};}q("lf.schema.DatabaseSchema",Z);Z.prototype.name=g("A");Z.prototype.name=Z.prototype.name;Z.prototype.version=g("Ua");Z.prototype.version=Z.prototype.version;Z.prototype.oa=function(){return z(this.M)};Z.prototype.tables=Z.prototype.oa;Z.prototype.table=function(a){if(!this.M.has(a))throw new D(101,a);return this.M.get(a)};
Z.prototype.table=Z.prototype.table;Z.prototype.info=function(){this.Ve||(this.Ve=new Jk(this));return this.Ve};Z.prototype.Fg=g("ke");Z.prototype.pragma=Z.prototype.Fg;Z.prototype.se=ba("ke");q("lf.schema.create",function(a,b){return new Zk(a,b)});u.prototype.catch=u.prototype.ve;u.prototype["catch"]=u.prototype.catch;
try{if(module){module.exports=lf;}}catch(e){}}.bind(window))();

}(lovefield_min));

var lf$1 = lovefield_min.exports;

// Database initialisation
var db;
const schemaBuilder = lf$1.schema.create('workpage', 1);


schemaBuilder
	.createTable('Projects')
	.addColumn('name', lf$1.Type.STRING)
	.addColumn('last_used', lf$1.Type.DATE_TIME)
	.addPrimaryKey(['name']);

schemaBuilder
	.createTable('LinkGroups')
	.addColumn('id', lf$1.Type.INTEGER)
	.addColumn('name', lf$1.Type.STRING)
	.addColumn('projectName', lf$1.Type.STRING)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_Project', {
		local: 'projectName',
		ref: 'Projects.name',
		action: lf$1.ConstraintAction.CASCADE
	});

schemaBuilder
	.createTable('Links')
	.addColumn('id', lf$1.Type.INTEGER)
	.addColumn('name', lf$1.Type.STRING)
	.addColumn('url', lf$1.Type.STRING)
	.addColumn('groupId', lf$1.Type.INTEGER)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_LinkId', {
		local: 'groupId',
		ref: 'LinkGroups.id',
		action: lf$1.ConstraintAction.CASCADE
	});

schemaBuilder
	.createTable('Tasks')
	.addColumn('id', lf$1.Type.INTEGER)
	.addColumn('title', lf$1.Type.STRING)
	.addColumn('done', lf$1.Type.BOOLEAN)
	.addColumn('due', lf$1.Type.DATE_TIME)
	.addColumn('projectName', lf$1.Type.STRING)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_Project', {
		local: 'projectName',
		ref: 'Projects.name',
		action: lf$1.ConstraintAction.CASCADE
	});

async function gen_test(db, t_projects, t_linkGroups, t_links, t_tasks) {
	db.insertOrReplace().into(t_projects).values([
		t_projects.createRow({
			'name': "Test project",
			'last_used': new Date(),
		})
	]).exec();

	db.insertOrReplace().into(t_linkGroups).values([
		t_linkGroups.createRow({
			'id': 1,
			'name': "Test group",
			'projectName': "Test project"
		}),
		t_linkGroups.createRow({
			'id': 2,
			'name': "Link group",
			'projectName': "Test project"
		}),
		t_linkGroups.createRow({
			'id': 3,
			'name': "Item list",
			'projectName': "Test project"
		})
	]).exec();

	db.insertOrReplace().into(t_links).values([
		t_links.createRow({
			'id': 1,
			'name': "Test link",
			'url': "https://www.example.com",
			'groupId': 1
		}),
		t_links.createRow({
			'id': 2,
			'name': "Second link",
			'url': "https://www.google.com",
			'groupId': 1
		}),
		t_links.createRow({
			'id': 3,
			'name': "First link",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 4,
			'name': "Another link",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 5,
			'name': "Third one",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 6,
			'name': "Soloing",
			'url': "https://www.google.com",
			'groupId': 3
		})
	]).exec();

	db.insertOrReplace().into(t_tasks).values([
		t_tasks.createRow({
			'id': 1,
			'title': "Test task",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		}),
		t_tasks.createRow({
			'id': 2,
			'title': "Another task",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		}),
		t_tasks.createRow({
			'id': 3,
			'title': "Third one for good measure",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		})
	]).exec();	
}

async function syncProject() {
	const t_linkGroups = db.getSchema().table('LinkGroups');
	const t_links = db.getSchema().table('Links');
	const t_tasks = db.getSchema().table('Tasks');
	
	links.set(await db.select().from(t_linkGroups).leftOuterJoin(t_links, t_linkGroups.id.eq(t_links.groupId)).where(t_linkGroups.projectName.eq(get_store_value(activeProject))).exec());
	tasks.set(await db.select().from(t_tasks).where(t_tasks.projectName.eq(get_store_value(activeProject))).exec());

	console.log(get_store_value(links));
}

const activeProject = writable();
activeProject.subscribe(val => {
	if (!val) return;
	localStorage.setItem("active", val);
	syncProject();
});

const projects = writable();
const links = writable([]);
const tasks = writable([]);

const loaded = async () => {
	try {
		db = await schemaBuilder.connect();
		
		const t_projects = db.getSchema().table('Projects');
		const t_linkGroups = db.getSchema().table('LinkGroups');
		const t_links = db.getSchema().table('Links');
		const t_tasks = db.getSchema().table('Tasks');

		await gen_test(db, t_projects, t_linkGroups, t_links, t_tasks);
		projects.set(await db.select().from(t_projects).exec());

		const active = localStorage.getItem("active");
		// Only set links and tasks if there is an active group
		active && activeProject.set(active);

		return true;
	} catch (error) {
		console.log(error);
		return error;
	}
};

/* src\popup\App.svelte generated by Svelte v3.42.1 */
const file = "src\\popup\\App.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	return child_ctx;
}

// (1:0) <script>    import { loaded, activeProject }
function create_catch_block(ctx) {
	const block = { c: noop, m: noop, p: noop, d: noop };

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_catch_block.name,
		type: "catch",
		source: "(1:0) <script>    import { loaded, activeProject }",
		ctx
	});

	return block;
}

// (36:0) {:then}
function create_then_block(ctx) {
	let span0;
	let t2;
	let form;
	let fieldset;
	let label0;
	let input0;
	let t3;
	let span1;
	let t5;
	let label1;
	let select;
	let option;
	let t6;
	let span2;
	let t8;
	let label2;
	let input1;
	let t9;
	let span3;
	let t11;
	let input2;
	let mounted;
	let dispose;
	let each_value = /*links*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			span0 = element("span");
			span0.textContent = `Current project: ${activeProject}`;
			t2 = space();
			form = element("form");
			fieldset = element("fieldset");
			label0 = element("label");
			input0 = element("input");
			t3 = space();
			span1 = element("span");
			span1.textContent = "Title";
			t5 = space();
			label1 = element("label");
			select = element("select");
			option = element("option");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = space();
			span2 = element("span");
			span2.textContent = "Group";
			t8 = space();
			label2 = element("label");
			input1 = element("input");
			t9 = space();
			span3 = element("span");
			span3.textContent = "Url";
			t11 = space();
			input2 = element("input");
			attr_dev(span0, "class", "project-title svelte-bc51rl");
			add_location(span0, file, 36, 2, 735);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "placeholder", "Name");
			input0.required = true;
			add_location(input0, file, 40, 8, 890);
			add_location(span1, file, 41, 8, 968);
			add_location(label0, file, 39, 6, 873);
			option.__value = "";
			option.value = option.__value;
			option.disabled = true;
			option.selected = true;
			add_location(option, file, 46, 10, 1079);
			select.required = true;
			if (/*groupId*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
			add_location(select, file, 45, 8, 1029);
			add_location(span2, file, 51, 8, 1263);
			add_location(label1, file, 44, 6, 1012);
			add_location(fieldset, file, 38, 4, 855);
			attr_dev(input1, "type", "url");
			attr_dev(input1, "placeholder", "");
			input1.required = true;
			add_location(input1, file, 56, 6, 1337);
			add_location(span3, file, 57, 6, 1406);
			add_location(label2, file, 55, 4, 1322);
			attr_dev(input2, "class", "elevation-2 svelte-bc51rl");
			attr_dev(input2, "type", "submit");
			input2.value = "Add link";
			add_location(input2, file, 60, 4, 1444);
			add_location(form, file, 37, 2, 808);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span0, anchor);
			insert_dev(target, t2, anchor);
			insert_dev(target, form, anchor);
			append_dev(form, fieldset);
			append_dev(fieldset, label0);
			append_dev(label0, input0);
			set_input_value(input0, /*title*/ ctx[1]);
			append_dev(label0, t3);
			append_dev(label0, span1);
			append_dev(fieldset, t5);
			append_dev(fieldset, label1);
			append_dev(label1, select);
			append_dev(select, option);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*groupId*/ ctx[3]);
			append_dev(label1, t6);
			append_dev(label1, span2);
			append_dev(form, t8);
			append_dev(form, label2);
			append_dev(label2, input1);
			set_input_value(input1, /*url*/ ctx[2]);
			append_dev(label2, t9);
			append_dev(label2, span3);
			append_dev(form, t11);
			append_dev(form, input2);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
					listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
					listen_dev(form, "submit", prevent_default(addLink), false, true, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*title*/ 2 && input0.value !== /*title*/ ctx[1]) {
				set_input_value(input0, /*title*/ ctx[1]);
			}

			if (dirty & /*links*/ 1) {
				each_value = /*links*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*groupId, links*/ 9) {
				select_option(select, /*groupId*/ ctx[3]);
			}

			if (dirty & /*url*/ 4) {
				set_input_value(input1, /*url*/ ctx[2]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span0);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(form);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_then_block.name,
		type: "then",
		source: "(36:0) {:then}",
		ctx
	});

	return block;
}

// (48:10) {#each links as link}
function create_each_block(ctx) {
	let option;
	let t_value = /*link*/ ctx[8].title + "";
	let t;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*link*/ ctx[8].id;
			option.value = option.__value;
			add_location(option, file, 48, 12, 1170);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*links*/ 1 && t_value !== (t_value = /*link*/ ctx[8].title + "")) set_data_dev(t, t_value);

			if (dirty & /*links*/ 1 && option_value_value !== (option_value_value = /*link*/ ctx[8].id)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(48:10) {#each links as link}",
		ctx
	});

	return block;
}

// (34:18)    Loading...  {:then}
function create_pending_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Loading...");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_pending_block.name,
		type: "pending",
		source: "(34:18)    Loading...  {:then}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let await_block_anchor;

	let info = {
		ctx,
		current: null,
		token: null,
		hasCatch: false,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block
	};

	handle_promise(loaded(), info);

	const block = {
		c: function create() {
			await_block_anchor = empty();
			info.block.c();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, await_block_anchor, anchor);
			info.block.m(target, info.anchor = anchor);
			info.mount = () => await_block_anchor.parentNode;
			info.anchor = await_block_anchor;
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;
			update_await_block_branch(info, ctx, dirty);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(await_block_anchor);
			info.block.d(detaching);
			info.token = null;
			info = null;
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

async function addLink() {
	this.reset();
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	let theme = localStorage.getItem("theme") ?? "light";
	let links;
	let title = "";
	let url = "";
	let groupId;

	onMount(async () => {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
			$$invalidate(1, title = tabs[0].title);
			$$invalidate(2, url = tabs[0].url);
		});
	});

	document.querySelector('body').classList += theme;

	activeId.subscribe(val => {
		chrome.storage.sync.get([`links-${val}`], function (result) {
			$$invalidate(0, links = result[`links-${val}`] ?? []);
			syncLinks();
		});
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	function input0_input_handler() {
		title = this.value;
		$$invalidate(1, title);
	}

	function select_change_handler() {
		groupId = select_value(this);
		$$invalidate(3, groupId);
		$$invalidate(0, links);
	}

	function input1_input_handler() {
		url = this.value;
		$$invalidate(2, url);
	}

	$$self.$capture_state = () => ({
		loaded,
		activeProject,
		onMount,
		theme,
		links,
		title,
		url,
		groupId,
		addLink
	});

	$$self.$inject_state = $$props => {
		if ('theme' in $$props) theme = $$props.theme;
		if ('links' in $$props) $$invalidate(0, links = $$props.links);
		if ('title' in $$props) $$invalidate(1, title = $$props.title);
		if ('url' in $$props) $$invalidate(2, url = $$props.url);
		if ('groupId' in $$props) $$invalidate(3, groupId = $$props.groupId);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		links,
		title,
		url,
		groupId,
		input0_input_handler,
		select_change_handler,
		input1_input_handler
	];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

const app = new App({
	target: document.body,
	props: {}
});

export { app as default };
//# sourceMappingURL=main.js.map
