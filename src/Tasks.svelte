<script>
  import { createPopperActions } from 'svelte-popperjs';
	import {clickOutside} from './click_outside.js';
	import Sortable from "sortablejs";
	import { onMount } from "svelte";

	import Task from "./Task.svelte";

	let viewDone = false;
	let dragging = false;
	let creating = false;
	let currentID = 0;
	let tasks = [];
	let doing = [];
	let done = [];

	let tasksEl, doingEl, doneEl;

	onMount(async function() {
		Sortable.create(tasksEl, {
			group: 'tasks',
			animation: 100
		});

		Sortable.create(doingEl, {
			group: 'tasks',
			animation: 100
		});

		Sortable.create(doneEl, {
			group: 'tasks',
			animation: 100
		});
	});

	function addTask(evt) {
		const formData = new FormData(evt.target);

		const description = formData.get('description');
		const due = formData.get('due');
		const goalHours = formData.get('goal-hours');
		const goalMinutes = formData.get('goal-minutes');

		let task = {
			id: currentID++,
			description: description,
			created: new Date(),
			due: due,
			spent: '0h 0m',
			estimate: `${goalHours}h ${goalMinutes}m`,
		};

		tasks = [...tasks, task];
		creating = false;
	};

	function removeTask(item) {
		let index = tasks.indexOf(item)
		if (index > -1) {
			tasks.splice(index, 1)
			tasks = tasks;
		}
	};

	function resize(evt) {
		evt.target.style.height = 'auto';
		evt.target.style.height = `${evt.target.scrollHeight}px`
	};

	function handleInput(evt) {
		if (evt.key === 'Enter') {
			evt.preventDefault();
			evt.target.blur();
		}
	}

  const [ popperRef, popperContent ] = createPopperActions();
  const popperOptions = {
		placement: "top",
  };
</script>

<style>
header {
	font-size: var(--size-3xl);
	margin-bottom: var(--space-6);
}

button {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
}

header svg { 
	height: var(--size-5xl);
}

svg {
	height: 1em;
}

textarea {
	resize: none;
}

.tooltip {
	background: var(--tone-200);
	color: var(--tone-800);
	padding: var(--space-2);
	border-radius: var(--rounded);
	box-shadow: var(--shadow-lg);
}

[data-popper-arrow]::before {
	background-color: var(--tone-200);
}
</style>

<article>
	<header>
		{#if viewDone}
		<button title="View todo's" on:click="{() => viewDone = false}">
			<h2>Done</h2>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
				<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
			</svg>
		</button>
		{:else}
		<button title="View completed tasks" on:click="{() => viewDone = true}">
			<h2>Todo</h2>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
				<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
			</svg>
		</button>
		{/if}
	</header>
	<section>
		<h2>Current task:</h2>
		<div>
			{#if !doing.length}
			<p>
				You currently do not have a task you are working on. Drag an item here
				to start working on it.
			</p>
			{/if}
			<ul bind:this="{doingEl}" hidden="{doingEl}">
				{#each doing as task}
				<Task
					description="{task.description}"
					created="{task.created}"
					due="{task.due}"
					spent="{task.spent}"
					estimate="{task.estimate}"
					on:remove="{() => removeTask(task)}"
				/>
				{/each}
			</ul>
		</div>
	</section>
	<ul bind:this="{doneEl}" hidden="{!viewDone}">
		{#if !done.length}
		<p>You currently don't have any tasks marked as done.</p>
		{/if}
		{#each done as task}
		<Task
			description="{task.description}"
			created="{task.created}"
			due="{task.due}"
			spent="{task.spent}"
			estimate="{task.estimate}"
			on:remove="{() => removeTask(task)}"
		/>
		{/each}
	</ul>
	<ul bind:this="{tasksEl}" hidden="{viewDone}">
		{#each tasks as task}
		<Task
			description="{task.description}"
			created="{task.created}"
			due="{task.due}"
			spent="{task.spent}"
			estimate="{task.estimate}"
			on:remove="{() => removeTask(task)}"
		/>
		{/each}
	</ul>
	<section>
		{#if dragging}
		<ul bind:this="{doneEl}">
			Mark as completed!
		</ul>
		{:else if !viewDone}
		<button id="reference" use:popperRef on:click="{() => creating = !creating}">
			Add a new task
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
			</svg>
		</button>
		{#if creating}
		<div class="tooltip" use:popperContent={popperOptions} use:clickOutside on:click_outside="{() => creating = false}">
			<form on:submit|preventDefault="{addTask}">
				<header>Add new task</header>
				<label>
					Task name:
					<textarea 
						name="description" 
						rows="1" 
						required
						on:keydown="{handleInput}"
						on:input="{resize}"
					></textarea>
				</label>
				<div>
					Time estimate:
					<div>
						<label>
							Hours: 
							<input type="number" name="goal-hours" size="2">
						</label>
						<label>
							Minutes: 
							<input type="number" name="goal-minutes" size="2">
						</label>
					</div>
				</div>
				<label>
					Due date:
					<input name="due" type="date">
				</label>
				<input type="submit" value="Add task">
			</form>
			<div data-popper-arrow />
		</div>
		{/if}
		{/if}
	</section>
</article>
