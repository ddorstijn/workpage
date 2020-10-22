<template>
  <article class="absolute w-full flex flex-col items-center">
    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-3xl">
        <span class="material-icons">layers</span>
        Projects
      </h2>
      <!-- <button class="material-icons ml-auto text-2xl text-light-darkest">
        expand_more
      </button> -->
    </header>
  </article>
</template>

<style lang="postcss" scoped>
.collapsible-header {
  @apply flex justify-center items-center px-4 py-2 mt-2;
  @apply cursor-pointer select-none bg-dark shadow-xl;
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header > h2 {
  @apply transition-all duration-500 ease-in-out;
}
</style>
