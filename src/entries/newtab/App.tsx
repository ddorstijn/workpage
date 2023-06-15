import { Component, For, Show, createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { storage } from 'webextension-polyfill';
import { dndzone as dndzoneDirective } from "solid-dnd-directive";

import LinkGroup from './components/LinkGroup';
import Clock from './components/Clock';
import ProjectDrawer from './components/ProjectDrawer';
import SideMenu from './components/SideMenu';
import { DndEvent, Project } from '~/project';

const App: Component = () => {
  let [active, setActive] = createSignal(localStorage.getItem('active'));
  if (!active()) {
    setActive('General');
  }

  // @ts-ignore
  let [project, setProject] = createStore<Project>();
  
  createEffect(async () => {
    let activeProject = active()!.toString();
    let proj: Project = (await storage.sync.get(activeProject))[activeProject];
    if (!proj) {
      proj = {
        last_used: new Date(),
        todo: [],
        done: [],
        linkgroups: [
          {
            id: 1,
            name: 'Google',
            color: '#DE5B5B',
            links: [
              {
                id: 10,
                name: 'Maps',
                url: 'https://maps.google.com'
              },
              {
                id: 11,
                name: 'Youtube',
                url: 'https://youtube.google.com'
              },
              {
                id: 12,
                name: 'Gmail',
                url: 'https://mail.google.com'
              },
              {
                id: 13,
                name: 'Drive',
                url: 'https://drive.google.com'
              },
              {
                id: 14,
                name: 'Search',
                url: 'https://search.google.com'
              }
            ]
          },
          {
            id: 2,
            name: 'Entertainment',
            color: '#708ACD',
            links: [
              {
                id: 15,
                name: 'Netflix',
                url: 'https://netflix.com'
              },
              {
                id: 16,
                name: 'Reddit',
                url: 'https://reddit.com'
              },
              {
                id: 17,
                name: 'HBO',
                url: 'https://hbo.com'
              },
              {
                id: 18,
                name: 'HackerNews',
                url: 'https://ycombinator.com'
              }
            ]
          },
          {
            id: 3,
            name: 'Development',
            color: '#DEAA5B',
            links: [
              {
                id: 19,
                name: 'Stack Overflow',
                url: 'https://stackoverflow.com'
              },
              {
                id: 20,
                name: 'Stack Exchange',
                url: 'https://stackexhange.com'
              },
              {
                id: 21,
                name: 'ChatGPT',
                url: 'https://chat.openai.com'
              },
            ]
          },
          {
            id: 4,
            name: 'Communication',
            color: '#71B061',
            links: [
              {
                id: 22,
                name: 'WhatsApp',
                url: 'https://web.whatsapp.com'
              },
              {
                id: 23,
                name: 'Discord',
                url: 'https://discord.gg'
              },
              {
                id: 24,
                name: 'Signal',
                url: 'https://signal.com'
              }
            ]
          }]
      }
    }
    setProject(proj);
  });

  createEffect(async () => {
    let activeProject = active()!.toString();
    await storage.sync.set({[activeProject]: project});
  });

  // @ts-ignore
  const dndzone = dndzoneDirective;

  function handleDndColumnsSorted(e: any) {
    setProject("linkgroups", e.detail.items);
  }
  
  function handleDndCardsSorted(cid: number, e: DndEvent) {
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

        <Show when={project?.linkgroups}>
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
        </Show>
      </main>
      
      <aside>

      </aside>
    </div>
  )
};

export default App;
