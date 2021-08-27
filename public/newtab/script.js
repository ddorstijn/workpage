// Remove as soon as PopperJS error is resolved
var process = {env: {}};

import('./build/main.js');

window.onload = function() {
  if (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
  }
}