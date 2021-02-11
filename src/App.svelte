<script>
  import Clock from './Clock.svelte';
  import Projects from './Projects.svelte';
  import Links from './Links.svelte';
  import Tasks from './Tasks.svelte';
  import Timer from './Timer.svelte';
</script>

<main class="w-2/3 my-auto">
  <Clock />
  <Projects />
  <Links />
</main>
<aside class="flex flex-col justify-between gap-12">
  <Tasks />
  <Timer />
</aside>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    @apply w-screen h-screen overflow-hidden p-16 flex gap-16 text-gray-900;
    background: radial-gradient(#3c3836 0%, #282828 70%);
  }

  aside {
    @apply w-1/3 pl-16 border-l border-gray-300;
  }

  button {
    @apply flex items-center justify-center gap-1 rounded;
  }

  button > svg {
    @apply h-8;
  }

  input {
    @apply block py-1 px-2 bg-gray-200 border border-gray-400 rounded text-base;
  }

  input:focus {
    @apply border-gray-600;
    outline: none;
  }

  textarea {
    resize: none;
    scrollbar-width: none;
    border-radius: 3px;
    padding: 5px;
    @apply bg-gray-200 border border-gray-400;
  }

  [data-popper-placement^='top'] > [data-popper-arrow] {
    bottom:-4px;
  }

  [data-popper-placement^='right'] > [data-popper-arrow] {
    left:-4px;
  }

  [data-popper-placement^='bottom'] > [data-popper-arrow] {
    top:-4px;
  }

  [data-popper-placement^='left'] > [data-popper-arrow] {
    right:-4px;
  }

  [data-popper-arrow],
  [data-popper-arrow]::before {
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  [data-popper-arrow]::before {
    content: '';
    transform: rotate(45deg);
  }
</style>

