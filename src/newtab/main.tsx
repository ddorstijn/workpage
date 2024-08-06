import { render } from 'solid-js/web';
import { Workpage } from './Workpage';

const element = document.getElementById('app');
if (!element) {
  throw new Error('No app element found');
}

render(() => <Workpage />, element);
