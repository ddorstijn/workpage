<script>
  export let checked;
</script>

<label class:check={checked}>
  <input class="is-hidden" type="checkbox" bind:checked />
</label>

<style>
  label {
    position: relative;
    background-color: transparent;
    border: 2px solid var(--color-lightGrey);
    border-radius: 50%;
    cursor: pointer;
    height: 24px;
    width: 24px;
  }

  label:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 25%;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0;

    border: 2px solid white;
    border-top: none;
    border-right: none;
  }

  label.check {
    background-color: #66bb6a;
    border-color: #66bb6a;
  }

  label.check:after {
    opacity: 1;
  }
</style>
