import { author, name, displayName, description, version } from '../package.json';

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: author,
    description: description,
    name: displayName ?? name,
    version: version,
    manifest_version: 3,

    browser_specific_settings: {
      gecko: {
        id: author,
      }
    },
    chrome_url_overrides: {
      newtab: "src/entries/newtab/index.html"
    },
    options_ui: {
      page: 'src/entries/options/index.html',
      open_in_tab: true
    },
    action: {
      default_popup: 'src/entries/popup/index.html',
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
