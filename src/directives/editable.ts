declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      editable: typeof editable;
    }
  }
}


export function editable(el: HTMLElement, accessor: Function) {  
  el.addEventListener("dblclick", () => {
    el.contentEditable = "true";
    el.focus();
  });
  
  el.addEventListener("blur", () => {    
    if (!el.textContent?.trim()) {
      return;
    }
    
    el.contentEditable = "false";
    accessor()?.(el.textContent!);
  });

  el.addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
      ev.preventDefault();

      if (el.textContent?.trim()) {
        el.blur();
      }
    }
  });
}