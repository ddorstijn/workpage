<script>
  import Menu from "../menu/Menu.svelte";

  export let item;
  let hovering = false;
</script>

<li
  class="item"
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => (hovering = false)}
>
  <a href={item.url}>{item.name}</a>
  <Menu {hovering} />
</li>

<style>
  .item {
    position: relative;
    margin-bottom: 0.25rem;

    display: flex;
  }

  .item > a {
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.2em;

    color: var(--color-grey);
  }
</style>
