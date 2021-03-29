# Workpage

Creative workspace based new tab page.

## Features
Create new workspaces for specific projects. This gives you a blank canvas to add links and tasks to.

## Installation
```bash
npm run build
```
for deployment

```bash
npm run dev
```
This creates a development environment. Because WebExtension specific function are used (like storage) load the extension as follows:
* Firefox: Go to addons -> Debug addons -> Add temporary addon and select the public folder
* Chrome: Go to extensions -> Enable Developer Mode -> Load unpacked and select the public folder

Versions used for building:
* Node: v12.10.2
* Npm: 6.14.8 