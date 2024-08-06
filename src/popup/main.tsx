import { render } from 'solid-js/web';
import { AddLinkModal } from './AddLinkModal';

const element = document.getElementById('app');
if (!element) {
  throw new Error('No app element found');
}

render(() => <AddLinkModal />, element);
