const DEFAULT = {
  General: {
    used: "2023-11-29T11:16:08.139Z",
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
  },
};

async function init() {
  let active = localStorage.getItem("active") ?? "General";
  let project;

  const handler = {
    get(target, key) {
      if (key == 'isProxy') return true;
  
      const prop = target[key];
      if (typeof prop == 'undefined') return;
  
      // set value as proxy if object
      if (!prop.isProxy && typeof prop === 'object')
        target[key] = new Proxy(prop, handler);
  
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
  
      chrome.storage.sync.set(Object.assign({}, project));
      return true;
    }
  };
  
  project = new Proxy(await chrome.storage.sync.get(localStorage.getItem("active")), handler);

  if (!project[active]) {
    project = DEFAULT;
    chrome.storage.sync.set(project);
  }

  await customElements.whenDefined("wp-links");
  await customElements.whenDefined("wp-tasks");
  document.querySelector("wp-links").load(project[active].linkgroups);
  document.querySelector("wp-tasks").load(project[active].todo);
}

init();
