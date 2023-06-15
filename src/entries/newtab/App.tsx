import { Component, For, createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { storage } from 'webextension-polyfill';
import { dndzone as dndzoneH } from "solid-dnd-directive";

import LinkGroup from './components/LinkGroup';
import Clock from './components/Clock';
import ProjectDrawer from './components/ProjectDrawer';
import SideMenu from './components/SideMenu';
import { Project } from '~/project';

const App: Component = () => {
  // let [active] = createSignal(localStorage.getItem('active'));
  // let [project, setProject] = createStore<Project>({last_used: new Date(), todo: [], done: [], linkgroups: []});

  // createEffect(async () => {
  //   let activeProject = active()!.toString();
  //   let proj = (await storage.sync.get(activeProject))[activeProject];
  //   setProject(proj);
  // });

  // createEffect(async () => {
  //   let activeProject = active()!.toString();
  //   await storage.sync.set({[activeProject]: project});
  // });

  const dndzone = dndzoneH;

  const [project, setProject] = createStore<Project>({
    last_used: new Date(),
    todo: [],
    done: [],
    linkgroups: [
      {
        id: 1,
        name: "TODO",
        color: "black",
        links: [
          { id: 41, name: "item41", url: "" },
          { id: 42, name: "item42", url: "" },
          { id: 43, name: "item43", url: "" },
          { id: 44, name: "item44", url: "" },
          { id: 45, name: "item45", url: "" },
          { id: 46, name: "item46", url: "" },
          { id: 47, name: "item47", url: "" },
          { id: 48, name: "item48", url: "" },
          { id: 49, name: "item49", url: "" },
          { id: 50, name: "item50", url: "" },
          { id: 51, name: "item51", url: "" }
        ]
      },
      {
        id: 2,
        name: "DOING",
        color: "black",
        links: []
      },
      {
        id: 3,
        name: "DONE",
        color: "black",
        links: []
      }
    ]
  });

  function handleDndColumnsSorted(e: any) {
    setProject("linkgroups", e.detail.items);
  }
  
  function handleDndCardsSorted(cid: any, e: any) {
   setProject(
      "linkgroups",
      (column) => column.id === cid,
      "links",
      e.detail.items
    );
  }

  return (
    <div class='flex bg-orange-50'>
      <SideMenu />
      
      <main class='flex-1 grid content-center place-items-center w-full min-h-screen gap-6'>
        <Clock />
        <ProjectDrawer />

        <ul 
          use:dndzone={{
            items: () => project.linkgroups,
            type: "column",
            flipDurationMs: 250
          }} 
          on:consider={handleDndColumnsSorted}
          on:finalize={handleDndColumnsSorted}
          class='grid grid-flow-col auto-cols-fr gap-16 mt-4'
        >
          <For each={project!.linkgroups}>
            {(group) => (
              <LinkGroup
                name={group.name}
                links={group.links}
                color={group.color}
                onItemsChange={(e: any) => handleDndCardsSorted(group.id, e)}
              />
            )}
          </For>
        </ul>
      </main>
      
      <aside>

      </aside>
    </div>
  )
};

export default App;
