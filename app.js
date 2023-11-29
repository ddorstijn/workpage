const BASE_PROJECT = {
    used: new Date(),
    todo: [],
    done: [],
    linkgroups: [
        {
            id: '0ecaad00-7fce-4b24-a5ca-d346b635ba4c',
            name: 'Google',
            color: '#DE5B5B',
            links: [
                {
                    id: 'bd5a4cad-e24b-447c-bed0-6389ae508623',
                    name: 'Maps',
                    url: 'https://maps.google.com'
                },
                {
                    id: 'a6e6c3ad-2727-4f3d-92b8-975c9ecae438',
                    name: 'Youtube',
                    url: 'https://youtube.google.com'
                },
                {
                    id: '1688451f-cb8d-4ffa-a816-5207a5d034c9',
                    name: 'Gmail',
                    url: 'https://mail.google.com'
                },
                {
                    id: '5d68b580-9a42-48bb-bb2e-78729a28b8f3',
                    name: 'Drive',
                    url: 'https://drive.google.com'
                },
                {
                    id: 'a3e20c32-85e1-4a5b-b6d2-3e438c25de57',
                    name: 'Search',
                    url: 'https://search.google.com'
                }
            ]
        },
        {
            id: '8ff7688a-8552-4c01-97fe-4f28b7263ee7',
            name: 'Entertainment',
            color: '#708ACD',
            links: [
                {
                    id: 'e014cc88-9aa7-47e2-9ffb-35373beca98e',
                    name: 'Netflix',
                    url: 'https://netflix.com'
                },
                {
                    id: '4c060e88-aab3-4bce-b741-6188fab3e19e',
                    name: 'Reddit',
                    url: 'https://reddit.com'
                },
                {
                    id: '5356da79-f163-4a75-a3fb-1f5cacee2a39',
                    name: 'HBO',
                    url: 'https://hbo.com'
                },
                {
                    id: 'dcb04550-0835-4158-b564-1c8db96e4515',
                    name: 'HackerNews',
                    url: 'https://ycombinator.com'
                }
            ]
        },
        {
            id: '271e6e69-4407-450b-8122-d7ea21f6bdf2',
            name: 'Development',
            color: '#DEAA5B',
            links: [
                {
                    id: 'c3b75b48-6ce7-495f-9c15-b464700e7147',
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com'
                },
                {
                    id: '90c5617a-883b-4a55-84c6-9e3ede75e1d5',
                    name: 'Stack Exchange',
                    url: 'https://stackexhange.com'
                },
                {
                    id: '26162184-50e5-42a0-bfd1-e1ad89209e5a',
                    name: 'ChatGPT',
                    url: 'https://chat.openai.com'
                },
            ]
        },
        {
            id: 'f1ffb6f5-2548-42a5-925e-b84f10199255',
            name: 'Communication',
            color: '#71B061',
            links: [
                {
                    id: 'dd01c0e7-c1f9-4df0-a303-3068e76462b9',
                    name: 'WhatsApp',
                    url: 'https://web.whatsapp.com'
                },
                {
                    id: 'd5190c9b-ada7-4a04-ab9c-299ed7db6ec1',
                    name: 'Discord',
                    url: 'https://discord.gg'
                },
                {
                    id: '1266cad9-d0c9-41c4-a947-f62c0e6c7ad5',
                    name: 'Signal',
                    url: 'https://signal.com'
                }
            ]
        }
    ]
}

class Project {
    name = "";
    used = new Date();
    todo = [];
    done = [];
    linkgroups = [];

    constructor(name) {
        browser.storage.sync.get(name).then(record => {
            if (!record.hasOwnProperty(name)) {
                this.default();
                return;
            }

            let p = record[name];
            this.name = name;
            this.used = p.used;
            this.todo = p.todo;
            this.done = p.done;
            this.linkgroups = p.linkgroups;
        })
    }

    async default() {
        console.log('default');
    }
}

async function init() {
    let activeProject = localStorage.getItem('active') ?? 'General';
    let project = new Project(activeProject);
}

init();