declare type SolidOptions = {
    /**a getter the list of items (SIGNAL or a getter to STORE value) that was used to generate the children of the given node (the list used in the `<For>` block*/
    items: () => Array<Record<string, any>>; 
    /**the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type*/
    type?: string | (() => string); 
    /**the duration of the flip animation. zero means no animation*/
    flipDurationMs?: number | (() => number); 
    dragDisabled?: boolean | (() => boolean);
    /**whether dragged element should morph to zone dimensions*/
    morphDisabled?: boolean | (() => boolean); 
    dropFromOthersDisabled?: boolean | (() => boolean);
    /**set the tabindex of the list container when not dragging*/
    zoneTabIndex?: number | (() => number); 
    dropTargetStyle?: Record<string, string> | (() => Record<string, string>);
    dropTargetClasses?: string[] | (() => string[]);
};

declare enum TRIGGERS {
  DRAG_STARTED = "dragStarted",
  DRAGGED_ENTERED = "draggedEntered", //only relevant for pointer interactions
  DRAGGED_ENTERED_ANOTHER = "dragEnteredAnother", //only relevant for pointer interactions
  DRAGGED_OVER_INDEX = "draggedOverIndex", //only relevant for pointer interactions
  DRAGGED_LEFT = "draggedLeft", //only relevant for pointer interactions
  DRAGGED_LEFT_ALL = "draggedLeftAll", //only relevant for pointer interactions
  DROPPED_INTO_ZONE = "droppedIntoZone",
  DROPPED_INTO_ANOTHER = "droppedIntoAnother",
  DROPPED_OUTSIDE_OF_ANY = "droppedOutsideOfAny",
  DRAG_STOPPED = "dragStopped" //only relevant for keyboard interactions - when the use exists dragging mode
}

declare enum SOURCES {
  POINTER = "pointer", // mouse or touch
  KEYBOARD = "keyboard"
}

export interface DndEventInfo {
  trigger: TRIGGERS; // the type of dnd event that took place
  id: string;
  source: SOURCES; // the type of interaction that the user used to perform the dnd operation
}
export type DndEventDetails<T = Item> = {
  items: T[];
  info: DndEventInfo;
};

export type DndEvent = Event & { detail: DndEventDetails};

declare type Item = any;

declare module "solid-js" {
  namespace JSX {
    interface CustomEvents {
      consider: (e: DndEvent) => void;
      finalize: (e: DndEvent) => void;
    }

    interface Directives {
      dndzone: SolidOptions;
    }
  }
}

export type Project = {
  last_used: Date;
  todo: Todo[];
  done: Done[];
  linkgroups: LinkGroup[];
};

export type LinkGroup = {
  id: number;
  name: string;
  color: string;
  links: Link[];
};

export type Link = {
  id: number;
  name: string;
  url: string;
};

export type Todo = {
  title: string;
  due?: Date;
};

export type Done = {
  title: string;
  done: Date;
};
