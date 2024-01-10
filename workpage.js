import { initClock } from "./clock.js";
import { initHeader } from "./header.js";
import { initLinks } from "./links.js";

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
  const record = (await chrome.storage.sync.get(active));
  if (!record[active]) {
    record[active] = TEMPLATE;
    chrome.storage.sync.set({ "General": record[active] });
    localStorage.setItem("active", "General");
  }
  
  project = createDeepOnChangeProxy(record[active], () => {
    chrome.storage.sync.set({ [active]: JSON.parse(JSON.stringify(project)) })
  });

  initClock();
  initLinks(project);
  initHeader(project);
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