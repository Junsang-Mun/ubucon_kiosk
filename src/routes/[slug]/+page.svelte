<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let slug;
  $: slug = $page.params.slug;

  onMount(() => {
    console.log(slug);
    fetch(`./?key=${slug}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //http://localhost:5173/print?name=문준상&org=우분투한국커뮤니티&tee=M
        window.location.href = `print/?name=${data.name}&org=${data.organization}&tee=${data.teeSize}`;
      })
      .catch((e) => console.error(e));
  });
</script>

<div class="p-5">
  <h1>잠시만 기다려 주세요...</h1>
</div>
