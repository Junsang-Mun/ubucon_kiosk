<script>
  import { onMount } from "svelte";
  let urlParams;
  let name;
  let org;
  const delay = 500;

  onMount(() => {
    setTimeout(() => {
      window.print();
      window.location.href = "/";
    }, delay);
    urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get("name");
    org = urlParams.get("org");
  });
</script>

<h1>{name}</h1>
<h1>{org}</h1>
