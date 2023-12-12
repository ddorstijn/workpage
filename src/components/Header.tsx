import AddProjectIcon from "~icons/material-symbols/box-add-outline";
import AddLinkGroupIcon from "~icons/material-symbols/add-notes-outline-rounded";
import AddLinkIcon from "~icons/material-symbols/add-link-rounded";
import DownloadIcon from "~icons/material-symbols/download";
import UploadIcon from "~icons/material-symbols/upload";
import TranslateIcon from "~icons/material-symbols/translate-rounded";
import ThemeIcon from "~icons/material-symbols/palette-outline";

import { Component, JSXElement } from "solid-js";
import Dialog from "./Dialog";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header class={styles.header}>
      <div class={styles['header-group']}>
        <HeaderItem icon={AddProjectIcon} name="Add Project">
          <form
            slot="modal"
            id="add-project"
            onSubmit={(event) => event.preventDefault()}
          >
            <input name="name" type="text" />
            <button type="submit">Add</button>
          </form>
        </HeaderItem>

        <HeaderItem icon={AddLinkGroupIcon} name="Add link group">
          <form id="add-linkgroup">
            <input name="name" type="text" />
            <select name="color">
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
          <form id="add-link">
            <input name="group" list="dl-linkgroups"></input>
            <datalist id="dl-linkgroups">
              <option></option>
            </datalist>
            <input name="name" type="text" />
            <input name="url" type="url" />
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
