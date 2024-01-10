import { editable } from "./utils/editable.js";
import { sortable, sortableItem } from "./utils/sortable.js";

/** @type {HTMLOListElement} */
const taskList = document.querySelector('.tasks > ol');

/**
 * Map task to HTMLElement
 * @param {Task} todo 
 * @returns Created element
 */
function createTask(todo) {
    let todoEl = taskList.appendChild(document.createElement('li'));
    todoEl.classList.add('task-list_item');
    todoEl.innerHTML = `<div class="handle"></div><span>${todo.name}</span>`;
    
    const nameEl = todoEl.querySelector('span');
    editable(nameEl);
    nameEl.addEventListener("edit", () => (nameEl.draggable = false));
    nameEl.addEventListener("save", () => {
        nameEl.draggable = true;
        todo.name = nameEl.innerText;
        
    });
    
    return todoEl;
}

/**
 * 
 * @param {Project} project 
 */
export function initTasks(project) {
    sortable(taskList, {
        items: project.todo,
        template: createTask,
        group: 'tasks',
        mode: "vertical",
    });
    
    document.querySelector('.add-task').addEventListener('click', () => {
        let newTask = { name: '' };
        project.todo.push(newTask);
        let taskEl = createTask(project.todo[project.todo.length - 1]);
        sortableItem(taskList, taskEl);
        taskEl.querySelector('span').edit();
    });
}