class Project {
  #name = "";
  #used = new Date();
  #todo = [];
  #done = [];
  #linkgroups = [];

  get name() { return this.#name; }
  set name(val) { this.#name = val; this.save(); }

  get used() { return this.#used; }
  set used(val) { this.#used = val; this.save(); }

  get todo() { return this.#todo; }
  set todo(val) { this.#todo = val; this.save(); }

  get done() { return this.#done; }
  set done(val) { this.#done = val; this.save(); }

  get linkgroups() { return this.#linkgroups; }
  set linkgroups(val) { this.#linkgroups = val; this.save(); }
  
  constructor(name) {
    browser.storage.sync.get(name).then((record) => {
      if (!record.hasOwnProperty(name)) {
        this.default();
        return;
      }

      let p = record[name];
      this.#name = name;
      this.#used = p.used;
      this.#todo = p.todo;
      this.#done = p.done;
      this.#linkgroups = p.linkgroups;
    });
  }

  async default() {
    this.#name = "General";
    this.#linkgroups = [
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
    ];

    await this.save();
  }

  async save() {
    let project = { [this.#name]: {
        used: this.#used,
        todo: this.#todo,
        done: this.#done,
        linkgroups: this.#linkgroups
    }};

    await browser.storage.sync.set(project);
  }
}

window.project = new Project(localStorage.getItem("active") ?? "General");

