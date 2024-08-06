import { For, render } from 'solid-js/web';
import { bookmarks } from 'webextension-polyfill';
import { Workpage } from './Workpage';

const element = document.getElementById('app');
if (!element) {
  throw new Error('No app element found');
}

render(() => <Workpage />, element);
