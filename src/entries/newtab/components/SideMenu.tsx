import { Component, Setter, Show, createSignal } from "solid-js";

import logo from "~/assets/logo.svg";
import SideMenuItem from "./SideMenuItem";
import { Button, Dialog, TextField } from "@kobalte/core";

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
            <Dialog.Root modal={true}>
              <Dialog.Trigger>
                <span class="hover:text-gray-900 i-ic:outline-library-add"></span>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay class="fixed inset-0 z-10 bg-dark opacity-20" />
                <div class="z-20 fixed inset-0 grid place-items-center">
                  <Dialog.Content class="p-4 rounded-lg bg-orange-50 border-solid border-1 border-amber-100 .dark:bg-dark-7">
                    <div class="flex items-center mb-2">
                      <Dialog.Title class="font-bold text-lg">Create project</Dialog.Title>
                      <Dialog.CloseButton class="ml-auto">
                        <span class="i-ic:baseline-close"></span>
                      </Dialog.CloseButton>
                    </div>
                    <Dialog.Description>
                      <form onSubmit={(e: SubmitEvent) => props.addProject(e, setError)}>
                        <TextField.Root name="project" validationState={error() != '' ? 'invalid' : 'valid'}>
                          <TextField.Label class="block py-1">Name - {error()}</TextField.Label>
                          <TextField.Input class="py-1 px-2 rounded bg-orange-1" placeholder="New project" />
                          <TextField.ErrorMessage>{error()}</TextField.ErrorMessage>
                        </TextField.Root>
                        <Button.Root type="submit" class="w-full bg-rose-6 text-light-1 font-bold p-2 rounded-lg mt-2">
                          Add project
                        </Button.Root>
                      </form>
                    </Dialog.Description>
                  </Dialog.Content>
                </div>
              </Dialog.Portal>
            </Dialog.Root>

          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Import project">
            <Button.Root onClick={(e) => {}}>
              <span class="hover:text-gray-900 i-ic:baseline-upload"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Export project">
            <Button.Root onClick={(e) => {}}>
              <span class="hover:text-gray-900 i-ic:baseline-download"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new link group">
            <Button.Root onClick={(e) => {}}>
              <span class="hover:text-gray-900 i-ic:outline-post-add"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Add new link">
            <Button.Root onClick={() => {}}>
              <span class="hover:text-gray-900 i-ic:outline-bookmark-add"></span>
            </Button.Root>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Change language">
            <Button.Root onClick={(e) => {}}>
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
