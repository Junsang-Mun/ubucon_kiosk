<script>
  export let data;
  import { postDataToDatabase } from "$lib/index.js";
  import { onMount } from "svelte";

  const delay = 3000;
  let currentUrl;

  onMount(() => {
    if (data.name === undefined || data.org === undefined) {
      window.location.href = "localhost:5173";
    }
    postDataToDatabase(data.key);
    currentUrl = window.location.href;
  });
  const sendPrintData = () => {
    const dataToSend = {
      name: data.name,
      org: data.org,
    };
    const queryParams = new URLSearchParams(dataToSend).toString();
    window.location.href = `${currentUrl}/print?${queryParams}`;
  };
</script>

<div class="container p-5 m-5">
  <h1>안녕하세요 {data.org}의 {data.name}님!</h1>
  {#if data.checkedIn === true}
    <h1>이미 체크인 되셨습니다.</h1>
  {:else if data.checkedIn === false}
    <h1>체크인 되셨습니다.</h1>
    <button
      on:click={() => {
        sendPrintData();
      }}>인쇄하기</button
    >
  {:else}
    <h1>체크인 상태를 확인할 수 없습니다.</h1>
  {/if}
  <p>{data.key}</p>
</div>

<style>
  @page {
    size: A6;
    margin: 2cm;
  }
</style>
