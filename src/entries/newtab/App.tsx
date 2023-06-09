import { Accessor, Component, For, Signal, createEffect, createResource, createSignal } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import { storage } from 'webextension-polyfill';
import LinkGroup from './components/LinkGroup';
import Clock from './components/Clock';
import Project from './components/Project';

import logo from '~/assets/logo.svg';
import { createDeepSignal } from '~/store';


type Project = {
      last_used: Date,
      todo: Array<{ title: string, due: Date | undefined }>,
      done: Array<{ title: string, done: Date }>,
      linksgroups: Array<{ title: string, color: string, links: Array<{ alias: string, url: URL }> }>,
}

const getProject = async (active: Accessor<string | null>) => {
  const project: Record<string, Project> = await storage.sync.get(active);
  return project[active.toString()];
}

const App: Component = () => {
  let [active, _] = createSignal(localStorage.getItem('active'));
  const [project] = createResource(active, getProject, { storage: createDeepSignal });

  return (
    <div class='flex bg-orange-50'>
      <header class='absolute text-2xl p-2'>
        <img class='mb-4 mt-2' src={logo} />
        <ul class='mt-2'>
          <li><span class='i-mdi:file-document-plus-outline'></span></li>
          <li><span class='i-ic:baseline-upload'></span></li>
          <li><span class='i-ic:baseline-download'></span></li>
        </ul>

        <ul class='mt-2'>
          <li><span class='i-ic:outline-post-add'></span></li>
          <li><span class='i-ic:outline-bookmark-add'></span></li>
        </ul>

        <ul class='mt-2'>
          <li><span class='i-ic:outline-translate'></span></li>
          <li><span class='i-ic:outline-dark-mode'></span></li>
        </ul>
      </header>
      <p>{JSON.stringify(project.length)}</p>
      <main class='flex-1 grid content-center place-items-center w-full min-h-screen gap-6'>
        <Clock />
        <Project />

        <ul class='grid grid-flow-col auto-cols-fr gap-16 mt-4'>
          <For each={project()?.linksgroups}>
            {(item, _) => (
              <LinkGroup title={item.title} color={item.color} links={item.links} />
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
