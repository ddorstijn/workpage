/* @refresh reload */
import { render } from 'solid-js/web';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import App from './App';
import { storage } from 'webextension-polyfill';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  );
}

  console.log("Creating new project");
  storage.sync.set({
    'General': {
      last_used: new Date(),
      todo: [],
      done: [],
      linksgroups: [
        {
          title: 'Google',
          color: '#DE5B5B',
          links: [
            {
              alias: 'Maps',
              url: 'https://maps.google.com'
            },
            {
              alias: 'Youtube',
              url: 'https://youtube.google.com'
            },
            {
              alias: 'Gmail',
              url: 'https://mail.google.com'
            },
            {
              alias: 'Drive',
              url: 'https://drive.google.com'
            },
            {
              alias: 'Search',
              url: 'https://search.google.com'
            }
          ]
        },
        {
          title: 'Entertainment',
          color: '#708ACD',
          links: [
            {
              alias: 'Netflix',
              url: 'https://netflix.com'
            },
            {
              alias: 'Reddit',
              url: 'https://reddit.com'
            },
            {
              alias: 'HBO',
              url: 'https://hbo.com'
            },
            {
              alias: 'HackerNews',
              url: 'https://ycombinator.com'
            }
          ]
        },
        {
          title: 'Development',
          color: '#DEAA5B',
          links: [
            {
              alias: 'Stack Overflow',
              url: 'https://stackoverflow.com'
            },
            {
              alias: 'Stack Exchange',
              url: 'https://stackexhange.com'
            },
            {
              alias: 'ChatGPT',
              url: 'https://chat.openai.com'
            },
          ]
        },
        {
          title: 'Communication',
          color: '#71B061',
          links: [
            {
              alias: 'WhatsApp',
              url: 'https://web.whatsapp.com'
            },
            {
              alias: 'Discord',
              url: 'https://discord.gg'
            },
            {
              alias: 'Signal',
              url: 'https://signal.com'
            }
          ]
        }]
    }
  });

if (!localStorage.getItem('active')) {
  localStorage.setItem('active', 'General' );
}

render(() => <App />, root!);
