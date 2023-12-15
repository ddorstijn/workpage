import { Accessor, Component, Context, ParentProps, Setter, createContext, createEffect, createSignal } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { storage } from "webextension-polyfill";


const TEMPLATE: Project = {
  used: new Date(),
  todo: [],
  done: [],
  linkgroups: [
    {
      name: "Google",
      color: "red",
      links: [
        {
          name: "Maps",
          url: "https://maps.google.com",
        },
        {
          name: "Youtube",
          url: "https://youtube.google.com",
        },
        {
          name: "Gmail",
          url: "https://mail.google.com",
        },
        {
          name: "Drive",
          url: "https://drive.google.com",
        },
        {
          name: "Search",
          url: "https://search.google.com",
        },
      ],
    },
    {
      name: "Entertainment",
      color: "orange",
      links: [
        {
          name: "Netflix",
          url: "https://netflix.com",
        },
        {
          name: "Reddit",
          url: "https://reddit.com",
        },
        {
          name: "HBO",
          url: "https://hbo.com",
        },
        {
          name: "HackerNews",
          url: "https://ycombinator.com",
        },
      ],
    },
    {
      name: "Development",
      color: "yellow",
      links: [
        {
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
        },
        {
          name: "Stack Exchange",
          url: "https://stackexhange.com",
        },
        {
          name: "ChatGPT",
          url: "https://chat.openai.com",
        },
      ],
    },
    {
      name: "Communication",
      color: "green",
      links: [
        {
          name: "WhatsApp",
          url: "https://web.whatsapp.com",
        },
        {
          name: "Discord",
          url: "https://discord.gg",
        },
        {
          name: "Signal",
          url: "https://signal.com",
        },
      ],
    },
  ],
};

type Ctx = {
  project: Project,
  setProject: SetStoreFunction<Project>,
  active: Accessor<string>,
  setActive: Setter<string>
  theme: Accessor<string>,
  setTheme: Setter<string>
}

export const ProjectContext = createContext<Ctx>();

export const ProjectContextProvider: Component<ParentProps> = (props) => {
  const [active, setActive] = createSignal(localStorage.getItem('active') ?? 'General');
  const [project, setProject] = createStore<Project>(TEMPLATE);
  const [theme, setTheme] = createSignal(localStorage.getItem("theme") ?? window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light' ?? "light");

  createEffect(() => localStorage.setItem('active', active()));
  createEffect(() => {
    localStorage.setItem("theme", theme());
    document.querySelector('body')!.classList.value = theme();
  });

  createEffect(async () => {
    let proj: Project | undefined = (await storage.sync.get(active()))[active()];
    if (!proj && active() == "General") {
      localStorage.setItem("active", active());
      storage.sync.set({ [active()]: JSON.parse(JSON.stringify(project)) });
    } else {
      setProject(proj!);
    }
  })

  createEffect(() => storage.sync.set({ [active()]: JSON.parse(JSON.stringify(project)) }));

  return (
    <ProjectContext.Provider value={{ project, setProject, active, setActive, theme, setTheme }}>
      {props.children}
    </ProjectContext.Provider>
  )
}