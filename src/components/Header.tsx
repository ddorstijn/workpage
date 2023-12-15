import AddProjectIcon from "~icons/material-symbols/box-add-outline";
import AddLinkGroupIcon from "~icons/material-symbols/add-notes-outline-rounded";
import AddLinkIcon from "~icons/material-symbols/add-link-rounded";
import DownloadIcon from "~icons/material-symbols/download";
import UploadIcon from "~icons/material-symbols/upload";
import TranslateIcon from "~icons/material-symbols/translate-rounded";
import ThemeIcon from "~icons/material-symbols/palette-outline";

import { Component, For, JSXElement, useContext } from "solid-js";
import Dialog from "./Dialog";
import styles from "./Header.module.css";
import { ProjectContext } from "./Context";
import { storage } from "webextension-polyfill";

export default function Header() {
  let ctx = useContext(ProjectContext)!;
  
  function addProject(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget! as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get("name")! as string;

    if (form.checkValidity()) {
      console.error("Not a valid form");
      return;
    }

    let empty: Project = { used: new Date(), linkgroups: [], todo: [], done: [] };
    storage.sync.set({ [name]: empty });
    form.reset();
    form.closest('dialog')?.close();
  }
  
  function addLinkGroup(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget! as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get("name")! as string;
    const color = fd.get("color")! as string;

    if (!name || !color) return;
    
    ctx.setProject("linkgroups", [...ctx.project.linkgroups, { name, color, links: [] }]);
    
    form.reset();
    form.closest('dialog')?.close();
  }
  
  function addLink(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget! as HTMLFormElement;
    const fd = new FormData(form);
    const group = Number(fd.get("group")!);
    const name = fd.get("name")! as string;
    const url = fd.get("url")! as string;

    if (!group || !name || !url) return;

    let links = [...ctx.project.linkgroups[group].links, { name, url }];
    ctx.setProject("linkgroups", group, "links", links);

    form.reset();
    form.closest('dialog')?.close();
  }

  async function checkProject(ev: InputEvent) {
    const el = ev.currentTarget as HTMLInputElement;
    const projects = await storage.sync.get();
    const names = Array.from(Object.keys(projects));
    if (names.find(n => n == el.value)) {
      el.setCustomValidity("A project with that name already exists");
    } else {
      el.setCustomValidity("");
    }

    el.reportValidity();
  }

  async function checkLinkgroup(ev: InputEvent) {
    const el = ev.currentTarget as HTMLInputElement;
    const names = ctx.project.linkgroups.map(l => l.name);
    if (names.find(n => n == el.value)) {
      el.setCustomValidity("A link group with that name already exists");
    } else {
      el.setCustomValidity("");
    }

    el.reportValidity();
  }

  return (
    <header class={styles.header}>
      <div class={styles['header-group']}>
        <HeaderItem icon={AddProjectIcon} name="Add Project">
          <form onSubmit={addProject}>
            <label>
              Project name
              <input onInput={checkProject} name="name" type="text" required />
            </label>
            <button type="submit">Add</button>
          </form>
        </HeaderItem>

        <HeaderItem icon={AddLinkGroupIcon} name="Add link group">
          <form onSubmit={addLinkGroup}>
            <input onInput={checkLinkgroup} name="name" type="text" required />
            <select name="color" required>
              <option value="gray">Gray</option>
              <option value="stone">Stone</option>
              <option value="red">Red</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="violet">Violet</option>
              <option value="indigo">Indigo</option>
              <option value="blue">Blue</option>
              <option value="cyan">Cyan</option>
              <option value="teal">Teal</option>
              <option value="green">Green</option>
              <option value="lime">Lime</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="choco">Choco</option>
              <option value="brown">Brown</option>
              <option value="sand">Sand</option>
              <option value="camo">Camo</option>
              <option value="jungle">Jungle</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </HeaderItem>

        <HeaderItem icon={AddLinkIcon} name="Add link">
          <form onSubmit={addLink}>
            <select name="group">
              <For each={ctx.project.linkgroups}>
                {(group, idx) => <option value={idx()}>{group.name}</option>}
              </For>
            </select>
            <input name="name" type="text" required />
            <input name="url" type="url" required />
            <button type="submit">Add</button>
          </form>
        </HeaderItem>
      </div>
      <div class={styles["header-group"]}>
        <HeaderItem icon={DownloadIcon} name="Download project">
        
        </HeaderItem>
        
        <HeaderItem icon={UploadIcon} name="Upload project">
        
        </HeaderItem>
      </div>
      <div class={styles["header-group"]}>
        <HeaderItem icon={TranslateIcon} name="Translate">
        
        </HeaderItem>
        
        <HeaderItem icon={ThemeIcon} name="Change theme">
        
        </HeaderItem>
      </div>
    </header>
  );
}

const HeaderItem: Component<{
  icon: any;
  name: string;
  children?: JSXElement;
}> = (props) => {
  let dialog: HTMLDialogElement | undefined;

  const open = () => {
    dialog?.showModal();
  };

  return (
    <>
      <button class={styles["header-item"]} onClick={open}>
        <props.icon width={24} height={24} />
        <span>{props.name}</span>
      </button>
      <Dialog name={props.name} ref={dialog}>
        {props.children}
      </Dialog>
    </>
  );
};
