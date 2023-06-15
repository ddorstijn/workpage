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

declare module "solid-js" {
  namespace JSX {
    interface CustomEvents {
      consider: (items: any[], info: any) => any;
      finalize: (items: any[], info: any) => any;
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
