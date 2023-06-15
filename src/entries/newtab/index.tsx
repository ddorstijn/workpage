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

storage.sync.onChanged.addListener((x) => console.log(x))

render(() => <App />, root!);
