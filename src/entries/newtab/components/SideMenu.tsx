import { Component, Setter, createSignal } from "solid-js";

import logo from "~/assets/logo.svg";
import SideMenuItem from "./SideMenuItem";
import { Button } from "@kobalte/core";
import Input from "./form/Input";
import Modal from "./Modal";

interface Props {
  addProject(e: SubmitEvent, setError: Setter<string>): Promise<void>
  toggleDarkMode(): void
}

const SideMenu: Component<Props> = (props) => {
  const [error, setError] = createSignal('');

  return (
    <header class="absolute text-2xl p-2 text-gray-6">
      <img class="mb-4 mt-2" src={logo} />
      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new project">
            <Modal icon="i-ic:outline-library-add" title="New project">
              <form onSubmit={(e: SubmitEvent) => props.addProject(e, setError)}>
                <Input label="Name" placeholder="New project" error={error} />
                <Button.Root type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                  Add project
                </Button.Root>
              </form>
            </Modal>

          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Import project">
            <Button.Root onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:baseline-upload"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Export project">
            <Button.Root onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:baseline-download"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new link group">
            <Modal icon="i-ic:outline-post-add" title="Add new link group">
              <form onSubmit={(e: SubmitEvent) => props.addProject(e, setError)}>
                <Input label="Name" placeholder="New group" error={error} />
                <Input label="Color" placeholder="#FFAABB" />
                <Button.Root type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                  Add project
                </Button.Root>
              </form>
            </Modal>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Add new link">
            <Button.Root onClick={() => { }}>
              <span class="hover:text-gray-900 i-ic:outline-bookmark-add"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Change language">
            <Button.Root onClick={(e) => { }}>
              <span class="hover:text-gray-900 i-ic:outline-translate"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Switch theme">
            <Button.Root onClick={props.toggleDarkMode}>
              <span class="hover:text-gray-900 i-ic:outline-dark-mode"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
      </ul>
    </header>
  );
};

export default SideMenu;
