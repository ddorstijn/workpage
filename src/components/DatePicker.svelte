<script lang="ts">
  export let placeholder: string;
  export let date: Date;

  function updateDate() {
    if (!this.value) {
      date = null;
      return;
    }

    date = new Date(this.value);
  }

  $: dateStr = date?.toLocaleDateString("en-CA") ?? "";
</script>


<div class="wrapper">
  <input type="text" {placeholder} value={dateStr} />
  {#if !dateStr}
    <i class="material-icons">calendar_today</i>
    <input type="date" on:change={updateDate} />
  {:else}
    <button type="reset" class="clear-input material-icons" on:click={() => date = null}>clear</button>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
  }

  input[type="date"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  /* make the native arrow invisible and stretch it over the whole field so you can click anywhere in the input field to trigger the native datepicker*/
  input[type="date"]::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    color: transparent;
    background: transparent;
    cursor: pointer;
    z-index: 2;
  }

  i, .clear-input {
    transform: translateY(-50%);
    pointer-events: none;
    position: absolute;
    z-index: 3;
    top: 50%;
    right: .7rem;
  }

  .clear-input {
    padding: 0;
    background-color: transparent;
    pointer-events: all;
    cursor: pointer;
  }
</style>
