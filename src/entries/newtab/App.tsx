import { Component, For, Setter, Show, createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { storage } from 'webextension-polyfill';
import { dndzone as dndzoneDirective } from "solid-dnd-directive";

import LinkGroup from './components/LinkGroup';
import Clock from './components/Clock';
import ProjectDrawer from './components/ProjectDrawer';
import SideMenu from './components/SideMenu';
import { DndEvent, Project } from '~/project';

const App: Component = () => {
  let [theme, setTheme] = createSignal(localStorage.getItem('theme') || 'light');
  let [active, setActive] = createSignal(localStorage.getItem('active') || 'General');
  let [project, setProject] = createStore<Project>({ last_used: new Date(), todo: [], done: [], linkgroups: [] });

  createEffect(() => {
    localStorage.setItem('theme', theme())

    if (theme() == 'dark') {
      document.querySelector('body')?.classList.add('dark');
    } else {
      document.querySelector('body')?.classList.remove('dark');
    }
  })
  
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

  // @ts-ignore
  const dndzone = dndzoneDirective;

  async function onLinkGroupSort(e: any, finalize = false) {
    setProject("linkgroups", e.detail.items);

    if (finalize) {
      await storage.sync.set({[active()!]: project});
    }
  }
  
  async function onLinkSort(e: DndEvent, cid: number, finalize = false) {
   setProject(
      "linkgroups",
      (column) => column.id === cid,
      "links",
      e.detail.items
    );

    if (finalize) {
      await storage.sync.set({[active()!]: project});
    }
  }

  async function onProjectChange() {

  }

  async function onActiveProjectChange() {

  }

  async function addProject(e: SubmitEvent, setError: Setter<string>): Promise<void> {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const name = new FormData(form).get('name') as string;
    if (await storage.sync.get(name)) {
      setError('A project with that name already exists');
      return;
    }
    
    const project: Record<string, Project> = {
      [name]: { 
        last_used: new Date(),
        todo: [],
        done: [],
        linkgroups: []
      }
    };

    // await storage.sync.set(project);
    form.reset();
  }

  function toggleDarkMode() {
    if (theme() == 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  return (
    <div class='flex bg-orange-50 .dark:bg-dark-3'>
      <SideMenu toggleDarkMode={toggleDarkMode} addProject={addProject} />
      
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
            on:consider={(e: any) => onLinkGroupSort(e)}
            on:finalize={(e: any) => onLinkGroupSort(e, true)}
            class='grid grid-flow-col auto-cols-fr gap-16 mt-4'
          >
            <For each={project!.linkgroups}>
              {(group) => (
                <LinkGroup
                  name={group.name}
                  links={group.links}
                  color={group.color}
                  onHandleSort={(e: any, finalize = false) => onLinkSort(e, group.id, finalize)}
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
