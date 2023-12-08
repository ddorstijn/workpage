import { initWorkpage } from "../workpage.js";

customElements.define(
  "wp-project",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    /**
     *
     * @param {{ name: string, used: Date }[]} projects
     */
    load() {
      chrome.storage.sync.get().then(data => {
        let projects = Object.keys(data).map(name => { return { name, used: data[name].used } });
  
        let button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', () => this.shadowRoot.querySelector('wp-dialog').showModal());
        button.querySelector("span").textContent = localStorage.getItem('active') ?? 'General';
  
        let list = this.shadowRoot.querySelector("ol");
        list.replaceChildren();
        projects.forEach((p) => {
          list.appendChild(document.createElement("wp-project-item")).load(p);
        });
      });
    }
  }
);

customElements.define(
  "wp-project-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    /**
     *
     * @param {{ name: string, used: string }} project
     */
    load(project) {
      this.data = project;

      this.shadowRoot.querySelector('li').addEventListener('click', () => {
        localStorage.setItem('active', project.name);
        initWorkpage(project.name)

        this.closest('wp-dialog').close();
      }); 

      this.shadowRoot.querySelector('.project-title').textContent = project.name;
      this.shadowRoot.querySelector('.project-subtitle').textContent = new Date(project.used).toLocaleDateString();
    }
  }
);
