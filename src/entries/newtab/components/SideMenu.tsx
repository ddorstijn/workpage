import { Component } from "solid-js";

import logo from "~/assets/logo.svg";
import SideMenuItem from "./SideMenuItem";

const SideMenu: Component = () => {
  return (
    <header class="absolute text-2xl p-2">
      <img class="mb-4 mt-2" src={logo} />
      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new project">
            <span class="i-ic:outline-library-add"></span>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Import project">
            <span class="i-ic:baseline-upload"></span>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Export project">
            <span class="i-ic:baseline-download"></span>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Add new link group">
            <span class="i-ic:outline-post-add"></span>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Add new link">
            <span class="i-ic:outline-bookmark-add"></span>
          </SideMenuItem>
        </li>
      </ul>

      <ul class="mt-2">
        <li>
          <SideMenuItem tooltip="Change language">
            <span class="i-ic:outline-translate"></span>
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem tooltip="Switch theme">
            <span class="i-ic:outline-dark-mode"></span>
          </SideMenuItem>
        </li>
      </ul>
    </header>
  );
};

export default SideMenu;
