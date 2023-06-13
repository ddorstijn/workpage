import { Component, For, createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { storage } from 'webextension-polyfill';

import LinkGroup from './components/LinkGroup';
import Clock from './components/Clock';
import ProjectDrawer from './components/ProjectDrawer';
import SideMenu from './components/SideMenu';
import { Project } from '~/project';

const App: Component = () => {
  let [active] = createSignal(localStorage.getItem('active'));
  let [project, setProject] = createStore<Project>({last_used: new Date(), todo: [], done: [], linksgroups: []});

  createEffect(async () => {
    let activeProject = active()!.toString();
    let proj = (await storage.sync.get(activeProject))[activeProject];
    setProject(proj);
  });

  createEffect(async () => {
    let activeProject = active()!.toString();
    await storage.sync.set({[activeProject]: project});
  });

  return (
    <div class='flex bg-orange-50'>
      <SideMenu />
      
      <main class='flex-1 grid content-center place-items-center w-full min-h-screen gap-6'>
        <Clock />
        <ProjectDrawer />

        <ul class='grid grid-flow-col auto-cols-fr gap-16 mt-4'>
          <For each={project!.linksgroups}>
            {(item, index) => (
              <LinkGroup title={item.title} color={item.color} links={item.links} index={index} setLinks={setProject} />
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
