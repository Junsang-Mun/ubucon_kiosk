<script>
  import { onMount } from "svelte";

  let urlParams;
  let name;
  let org;
  const delay = 500;

  onMount(() => {
    urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get("name");
    org = urlParams.get("org");
  });

  function doNothing() {
    console.log("I do nothing");
  }
</script>

<h1>{name}</h1>
<h1>{org}</h1>

<button
  on:click={() => {
    doNothing();
  }}>Request USB Device</button
>
