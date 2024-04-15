<script>
  export let data;
  import { postDataToDatabase } from "$lib/index.js";
  import { onMount } from "svelte";

  onMount(() => {
    postDataToDatabase(data.key);
  });
</script>

<div class="container p-5 m-5">
  <h1>안녕하세요 {data.org}의 {data.name}님!</h1>
  {#if data.checkedIn === true}
    <h1>이미 체크인 되셨습니다.</h1>
  {:else if data.checkedIn === false}
    <h1>체크인 되셨습니다.</h1>
  {:else}
    <h1>체크인 상태를 확인할 수 없습니다.</h1>
  {/if}
  <p>{data.key}</p>
</div>
