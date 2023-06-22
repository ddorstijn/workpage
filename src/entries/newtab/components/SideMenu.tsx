import { Component, Setter, createSignal } from "solid-js";

import logo from "~/assets/logo.svg";
import SideMenuItem from "./SideMenuItem";
import Input from "./form/Input";
import Modal from "./Modal";
import ComboBox from "./form/ComboBox";
import { LinkGroup } from "~/project";

interface Props {
  linkgroups: LinkGroup[],
  addProject(e: SubmitEvent, setError: Setter<string>): Promise<void>,
  addLinkGroup(e: SubmitEvent, setError: Setter<string>): Promise<void>,
  addLink(e: SubmitEvent, setError: Setter<string>): Promise<void>,
  toggleDarkMode(): void,
}

const SideMenu: Component<Props> = (props) => {
  const [error, setError] = createSignal('');
  const [lgError, setLgError] = createSignal('');
  const [lError, setLError] = createSignal('');

  return (
    <header class="absolute text-2xl p-2 text-gray-6">
      <img class="mb-4 mt-2" src={logo} />
      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new project">
            <Modal icon="i-ic:outline-library-add" title="New project">
              <form onSubmit={(e: SubmitEvent) => props.addProject(e, setError)}>
                <Input name="propject" label="Name" placeholder="New project" error={error} autofocus={true} />
                <button type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                  Add project
                </button>
              </form>
            </Modal>

          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Import project">
            <button onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:baseline-upload"></span>
            </button>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Export project">
            <button onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:baseline-download"></span>
            </button>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new link group">
            <Modal icon="i-ic:outline-post-add" title="Add new link group">
              <form onSubmit={(e: SubmitEvent) => props.addLinkGroup(e, setLgError)}>
                <Input name="name" label="Name" placeholder="New group" error={lgError} autofocus={true} />
                <Input name="color" label="Color" placeholder="#FFAABB" error={lgError} autofocus={false} />
                <button type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                  Add group
                </button>
              </form>
            </Modal>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Add new link">
            <Modal icon="i-ic:outline-bookmark-add" title="Add new link group">
              <form onSubmit={(e: SubmitEvent) => props.addLink(e, setLError)}>
                <Input name="name" label="Name" placeholder="New group" error={lgError} autofocus={true} />
                <Input name="url" label="URL" placeholder="https://google.com" error={lgError} autofocus={false} />
                <ComboBox options={props.linkgroups.map(l => { return { value: l.id, label: l.name } })} name="group" placeholder="Link group" required={true}  />
                <button type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                  Add link
                </button>
              </form>
            </Modal>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Change language">
            <button onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:outline-translate"></span>
            </button>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Switch theme">
            <button onClick={props.toggleDarkMode}>
              <span class="hover:text-gray-900 i-ic:outline-dark-mode"></span>
            </button>
          </SideMenuItem>
        </li>
      </ul>
    </header>
  );
};

export default SideMenu;
