<script>
  export let data;
  import { postDataToDatabase } from "$lib/index.js";
</script>

<div class="container p-5 m-5">
  <h1>안녕하세요 {data.org}의 {data.name}님!</h1>
  {#if data.checkedIn}
    <h1>이미 체크인 되셨습니다.</h1>
  {:else}
    <button on:click={() => postDataToDatabase(data.key)}>체크인</button>
    <h1>체크인 되셨습니다.</h1>
  {/if}
  <p>{data.key}</p>
</div>
