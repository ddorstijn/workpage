import { Manifest } from 'webextension-polyfill';
import { name, version, description } from '../package.json';

export function getManifest(): Manifest.WebExtensionManifest {
  return {
    manifest_version: 3,
    name: name,
    version: version,
    description: description,
    browser_specific_settings: {
      gecko: {
        id: "dannydorstijn1997@gmail.com"
      }
    },
    chrome_url_overrides: {
      newtab: "src/newtab/index.html"
    },
    action: {
      default_popup: 'src/popup/index.html',
      default_icon: 'icons/64.png',
    },
    icons: {
      32: 'icons/32.png',
      48: 'icons/48.png',
      64: 'icons/64.png',
    },
    permissions: ['tabs', 'storage', 'bookmarks'],
  };
}
