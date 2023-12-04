const TEMPLATE = {
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

export var project = {};

/**
 * Initialize application
 * @param {string} active 
 */
export async function initWorkpage(active) {
  project = createDeepOnChangeProxy(await chrome.storage.sync.get(active), () => chrome.storage.sync.set(JSON.parse(JSON.stringify(project))));
  if (!project[active]) {
    project = { "General": TEMPLATE };
    chrome.storage.sync.set(project);
    localStorage.setItem("active", "General");
  }

  let projectData = await chrome.storage.sync.get();
  let projects = Object.keys(projectData).map(name => { return { name, used: projectData[name].used } });

  await customElements.whenDefined("wp-project");
  document.querySelector("wp-project").load(projects);
  await customElements.whenDefined("wp-links");
  document.querySelector("wp-links").load(project[active].linkgroups);
  await customElements.whenDefined("wp-tasks");
  document.querySelector("wp-tasks").load(project[active].todo);
}


initWorkpage(localStorage.getItem("active") ?? "General");

let proxyCache = new WeakMap();
function createDeepOnChangeProxy(target, onChange) {
  return new Proxy(target, {
    get(target, property) {
      const item = target[property];
      if (item && typeof item === 'object') {
        if (proxyCache.has(item)) return proxyCache.get(item);
        const proxy = createDeepOnChangeProxy(item, onChange);
        proxyCache.set(item, proxy);
        return proxy;
      }
      return item;
    },
    set(target, property, newValue) {
      target[property] = newValue;
      onChange();
      return true;
    },
  });
}


document.getElementById('add-project').addEventListener('submit', ev => {
  ev.stopImmediatePropagation();
  ev.preventDefault();

  /** @type {HTMLFormElement} */
  const form = ev.currentTarget;

  const fd = new FormData(form);
  const name = fd.get('name');

  if (!name) return;

  chrome.storage.sync.set({ [name]: TEMPLATE });

  form.reset();
})