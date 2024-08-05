import { editable } from "./utils/editable.js";
import { sortable } from "./utils/sortable.js";

/** @type {HTMLOListElement} */
const taskList = () => document.querySelector('.tasks > ol');

function createTask(todo) {
    /** @type {HTMLLIElement} */
    let todoEl = taskList().appendChild(document.createElement('li'));
    todoEl.classList.add('task-list_item');
    todoEl.innerHTML = `<div class="handle"></div><span>${todo.name}</span>`;

    return todoEl;
}

/**
 * 
 * @param {Project} project 
 */
export function initTasks(project) {
    /** @type {HTMLDetailsElement} */
    const drawer = document.querySelector('.task-drawer');
    drawer.open = localStorage.getItem('tasks-open') == "true";
    drawer.querySelector('summary').addEventListener('click', _ => setTimeout(() => localStorage.setItem('tasks-open', drawer.open)));

    /**
     * Map task to HTMLElement
     * @param {Task} todo 
     * @returns Created element
     */
    const createTodo = (todo) => {
        const todoEl = createTask(todo);

        const handle = todoEl.querySelector('.handle');
        handle.addEventListener('click', () => {
            project.todo.splice(project.todo.indexOf(todo), 1);
            project.done.unshift(todo);
            todoEl.remove();
        });
        
        const nameEl = todoEl.querySelector('span');
        editable(nameEl);
        nameEl.addEventListener("edit", () => (todoEl.draggable = false));
        nameEl.addEventListener("save", () => {
            todoEl.draggable = true;
            todo.name = nameEl.innerText; 
        });
        
        return todoEl;
    }

    /**
     * Map task to HTMLElement
     * @param {Task} done 
     * @returns Created element
     */
    const createDone = (done) => {
        const todoEl = createTask(done);

        const handle = todoEl.querySelector('.handle');
        handle.addEventListener('click', () => {
            project.done.splice(project.todo.indexOf(done), 1);
            project.todo.unshift(done);
            todoEl.remove();
        });
        
        return todoEl;
    }
    
    sortable(taskList(), {
        items: project.todo,
        template: createTodo,
        group: 'tasks',
        mode: "vertical",
    });

    document.querySelector('.add-task').addEventListener('click', () => {
        let newTask = { name: '' };
        project.todo.push(newTask);
        let taskEl = createTodo(project.todo[project.todo.length - 1]);
        taskEl.querySelector('span').edit();
    });

    /** @type {HTMLButtonElement} */
    const todoBtn = document.querySelector('.tasks > header > .tasks_todo');

    /** @type {HTMLButtonElement} */
    const doneBtn = document.querySelector('.tasks > header > .tasks_done');

    todoBtn.addEventListener('click', () => {
        sortable(taskList(), {
            items: project.todo,
            template: createTodo,
            group: 'tasks',
            mode: "vertical",
        });

        todoBtn.querySelector('h3').className = 'active';
        doneBtn.querySelector('h3').className = '';
    })

    doneBtn.addEventListener('click', () => {
        const listEl = taskList();
        const newNode = listEl.cloneNode(false);
        listEl.replaceWith(newNode);

        for (const item of project.done) {
            newNode.append(createDone(item));
        }

        todoBtn.querySelector('h3').className = '';
        doneBtn.querySelector('h3').className = 'active';
    });
}