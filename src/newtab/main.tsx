import { render } from 'solid-js/web';
import { App } from './App';

const element = document.getElementById('app');
if (!element) {
  throw new Error('No app element found');
}

render(() => <App />, element);
