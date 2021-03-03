<script>
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from './click_outside.js';
	import { currentID, activeId } from './store.js';

	import List from './List.svelte';
	import CurrentActive from "./CurrentActive.svelte"; 
	import Dropzone from './Dropzone.svelte';
	import TaskItem from './TaskItem.svelte';

	let viewDone = false;
	let creating = false;

	let todo = [];
	let doing = [];
	let done = [];
	$: localStorage.setItem(`todo${$activeId}`, JSON.stringify(todo));
	$: localStorage.setItem(`done${$activeId}`, JSON.stringify(done));
	$: localStorage.setItem(`doing${$activeId}`, JSON.stringify(doing));
	activeId.subscribe(val => {
		todo = JSON.parse(localStorage.getItem(`todo${val}`)) || [];
		doing = JSON.parse(localStorage.getItem(`doing${val}`)) || [];
		done = JSON.parse(localStorage.getItem(`done${val}`)) || [];
	});

	let swap = null;

	function onDropTodo(items, info) {
		todo = items;

		if (info.trigger === "droppedIntoAnother" && swap) {
			todo = [swap, ...todo];
			swap = null;
		}
	};

	function onRemoveTodo(item) {
		todo.splice(todo.indexOf(item), 1);
		todo = todo;
	};

	function onDropDoing(newItems, info) {
		if (info.trigger === "droppedIntoZone") {
			let dropped = newItems.find(x => x.id === info.id);
			swap = doing[0] || null;
			dropped.doing = true;
			if (swap) swap.doing = false;
			doing = [dropped];
		} else {
			doing = newItems;
		}
	};

	function onDropCompleted(items, info) {
		if (info.trigger === "droppedIntoZone") {
			done = [...items, ...done];
		}
	};

	function addTask(evt) {
		creating = false;

		const fd = new FormData(evt.target);
		const description = fd.get('description');
		const due = fd.get('due');
		const goalHours = fd.get('goal-hours');
		const goalMinutes = fd.get('goal-minutes');

		const goalTime = goalHours * 360000 + goalMinutes * 60000;

		todo = [...todo, {
			id: $currentID++,
			created: new Date(),
			description,
			due,
			spent: 0,
			estimate: goalTime,
			doing: false,
		}];
	};

	function resize(evt) {
		evt.target.style.height = 'auto';
		evt.target.style.height = `${evt.target.scrollHeight}px`
	};

	function handleInput(evt) {
		if (evt.key === 'Enter') {
			evt.preventDefault();
			// Make textarea behave the same as a normal input
			evt.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
		}
	}

	const [ popperRef, popperContent ] = createPopperActions();
	const popperOptions = {
		placement: "top",
	};
</script>

<article class="tasks">
	<header class="text-3xl mb-6">
		{#if viewDone}
			<button class="w-full gap-2" title="View todo's" on:click="{() => viewDone = false}">
				<h2>Done</h2>
				<svg class="h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
					<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
			</button>
		{:else}
			<button class="w-full gap-2" title="View completed tasks" on:click="{() => viewDone = true}">
				<h2>Todo</h2>
				<svg class="h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
					<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
				</svg>
			</button>
		{/if}
	</header>

	<CurrentActive name="task" items={doing} component={TaskItem} type="tasks" onDrop={onDropDoing} /> 

	<div class="px-4 py-2">
		{#if viewDone}
			<List items={done} itemComponent={TaskItem} type="tasks" disable>
				<p class="mt-4 text-sm text-gray-700 text-center">You currently don't have any tasks marked as done.</p>
			</List>
		{:else}
			<List items={todo} itemComponent={TaskItem} type="tasks" onDrop={onDropTodo} onRemove={onRemoveTodo} />
		{/if}
	</div>

	<section class="mt-4">
		<Dropzone onDrop={onDropCompleted} itemComponent={TaskItem} type="tasks">
			Mark as completed!
		</Dropzone>

		{#if !viewDone}
		<button id="reference" class="w-full" use:popperRef on:click="{() => creating = !creating}">
			Add a new task
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
			</svg>
		</button>
		{#if creating}
			<div class="tooltip" use:popperContent={popperOptions} use:clickOutside on:click_outside="{() => creating = false}">
				<header class="text-center text-xl font-bold mb-4">Add new task</header>
				<form class="p-2" on:submit|preventDefault="{addTask}">
					<label for="description">Task description</label>
					<textarea id="description" name="description" rows="1" placeholder="Task description" on:keydown="{handleInput}" on:input="{resize}" />

					<label for="estimate">Estimated time</label>
					<fieldset id="estimate" class="flex gap-4">
						<input class="w-1/2" type="number" placeholder="Hours" name="goal-hours" size="2">
						<input class="w-1/2" type="number" placeholder="Minutes" name="goal-minutes" size="2">
					</fieldset>

					<label for="due">Due date:</label>
					<input id="due" name="due" type="date">

					<div class="mt-4 flex justify-around col-span-2">
						<button class="px-12 py-2 rounded bg-green text-gray-950" type="submit">Add task</button>
					</div>
				</form>
				<div data-popper-arrow />
			</div>
		{/if}
		{/if}
	</section>
</article>

<style lang="postcss">
	.tooltip {
		@apply bg-gray-200 text-gray-800 p-4 rounded shadow-lg;
	}

	[data-popper-arrow]::before {
		@apply bg-gray-200;
	}

	.tooltip > form {
		@apply grid gap-2 items-center;
		grid-template-columns: 2fr 3fr;
	}
</style>
