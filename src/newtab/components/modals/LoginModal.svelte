<script>
  import { activeModal, activeProject, editRef, dirty } from "../../../store.js";
  import Database from "../../../database.js";
  import { onMount } from "svelte";

  let name = "";
  let password = "";

  function login() {
    
  }
</script>

<header>Login</header>
<div>
  <form on:submit|preventDefault={login}>
    <input type="text" placeholder="Username" bind:value={name} required>
    <input type="password" placeholder="Password" bind:value={password} required>
    <button type="submit">Login</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  input {
    margin-bottom: 1rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>