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
              url: new URL('https://maps.google.com')
            },
            {
              alias: 'Youtube',
              url: new URL('https://youtube.google.com')
            },
            {
              alias: 'Gmail',
              url: new URL('https://mail.google.com')
            },
            {
              alias: 'Drive',
              url: new URL('https://drive.google.com')
            },
            {
              alias: 'Search',
              url: new URL('https://search.google.com')
            }
          ]
        },
        {
          title: 'Entertainment',
          color: '#708ACD',
          links: [
            {
              alias: 'Netflix',
              url: new URL('https://netflix.com')
            },
            {
              alias: 'Reddit',
              url: new URL('https://reddit.com')
            },
            {
              alias: 'HBO',
              url: new URL('https://hbo.com')
            },
            {
              alias: 'HackerNews',
              url: new URL('https://ycombinator.com')
            }
          ]
        },
        {
          title: 'Development',
          color: '#DEAA5B',
          links: [
            {
              alias: 'Stack Overflow',
              url: new URL('https://stackoverflow.com')
            },
            {
              alias: 'Stack Exchange',
              url: new URL('https://stackexhange.com')
            },
            {
              alias: 'ChatGPT',
              url: new URL('https://chat.openai.com')
            },
          ]
        },
        {
          title: 'Communication',
          color: '#71B061',
          links: [
            {
              alias: 'WhatsApp',
              url: new URL('https://web.whatsapp.com')
            },
            {
              alias: 'Discord',
              url: new URL('https://discord.gg')
            },
            {
              alias: 'Signal',
              url: new URL('https://signal.com')
            }
          ]
        }]
    }
  });

if (!localStorage.getItem('active')) {
  localStorage.setItem('active', 'General' );
}

render(() => <App />, root!);
