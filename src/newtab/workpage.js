import './components/util/ut-dialog.js';
import './components/wp/wp-clock.js';
import './components/wp/header/wp-header-list.js';
import './components/wp/header/wp-header-item.js';
import './components/wp/links/wp-group-list.js';
import './components/wp/links/wp-group-item.js';
import './components/wp/links/wp-link-item.js';
import './components/wp/project/wp-project-drawer.js';
import './components/wp/project/wp-project-item.js';
import './components/wp/tasks/wp-task-list.js';
import './components/wp/tasks/wp-task-item.js';

import { createDefaultProject, getRoot } from '../../utils/bookmark.js';

async function init() {
    const root = await getRoot();
    const projects = await chrome.bookmarks.getChildren(root.id);
    if (projects.length === 0) {
        createDefaultProject(root.id);
    }
}

init();