/// <reference path="typedefs.js" />

/** @type {Project} */
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

/** @type {Project} */
export var project = {};

/**
 * Initialize application
 * @param {string} active 
 */
export async function initWorkpage(active) {
  const record = await chrome.storage.sync.get(active);
  if (!record[active]) {
    record[active] = TEMPLATE;
    chrome.storage.sync.set({ "General": record });
    localStorage.setItem("active", "General");
  }
  
  project = createDeepOnChangeProxy(record[active], () => {
    chrome.storage.sync.set({ [active]: JSON.parse(JSON.stringify(record[active])) })
  });

  await customElements.whenDefined("wp-project");
  document.querySelector("wp-project").load();
  await customElements.whenDefined("wp-links");
  document.querySelector("wp-links").load(project.linkgroups);
  await customElements.whenDefined("wp-tasks");
  document.querySelector("wp-tasks").load(project.todo);
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
});

document.getElementById('add-linkgroup').addEventListener('submit', ev => {
  ev.stopImmediatePropagation();
  ev.preventDefault();

  /** @type {HTMLFormElement} */
  const form = ev.currentTarget;

  const fd = new FormData(form);
  const name = fd.get('name');
  const color = fd.get('color');

  if (!name || project.linkgroups.find(l => l.name == name)) return;

  project.linkgroups.push({ name, color, links: [] });

  form.reset();
});

const addLink = document.getElementById('add-link');
addLink.querySelector('input[list="dl-linkgroups"]').addEventListener("focus", _ => {
  const options = project.linkgroups.map(group => {
    let el = document.createElement('option');
    el.textContent = group.name;

    return el;
  });
  
  addLink.querySelector('datalist').replaceChildren(...options);
})

addLink.addEventListener('submit', ev => {
  ev.stopImmediatePropagation();
  ev.preventDefault();
  
  /** @type {HTMLFormElement} */
  const form = ev.currentTarget;

  const fd = new FormData(form);
  const group = fd.get('group');
  const name = fd.get('name');
  const url = fd.get('url');

  if (!group || !name) return;

  project.linkgroups.find(l => l.name == group).links.push({ name, url })

  form.reset();
});