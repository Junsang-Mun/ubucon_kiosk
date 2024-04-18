<script>
  import { onMount } from "svelte";
  import { requestUSBDevice, getDevices } from "$lib/index.js";

  let urlParams;
  let name;
  let org;
  const delay = 500;

  onMount(() => {
    // setTimeout(() => {
    //   window.print();
    //   window.location.href = "/";
    // }, delay);
    // requestUSBDevice();
    // getDevices();
    urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get("name");
    org = urlParams.get("org");
  });
</script>

<h1>{name}</h1>
<h1>{org}</h1>

<button
  on:click={() => {
    requestUSBDevice();
  }}>Request USB Device</button
>
