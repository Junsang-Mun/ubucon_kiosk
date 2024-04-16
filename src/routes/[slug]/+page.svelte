<script>
  export let data;
  import { postDataToDatabase } from "$lib/index.js";
  import { onMount } from "svelte";

  let currentUrl;
  const timeOut = 2000;

  onMount(() => {
    if (!data.name) setTimeout(goToHome, timeOut);
    postDataToDatabase(data.key);
    currentUrl = window.location.href;
    if (data.checkedIn === false) setTimeout(sendPrintData, timeOut);
    else if (data.checkedIn === true) setTimeout(goToHome, timeOut);
  });

  const sendPrintData = () => {
    const dataToSend = {
      name: data.name,
      org: data.org,
    };
    const queryParams = new URLSearchParams(dataToSend).toString();
    window.location.href = `${currentUrl}/print?${queryParams}`;
  };

  const goToHome = () => {
    window.location.href = "http://localhost:5173";
  };
</script>

<div class="container p-5 m-5">
  {#if data.org !== undefined || data.name !== undefined}
    <h1>안녕하세요 {data.org}의 {data.name}님!</h1>
  {/if}
  {#if data.checkedIn === true}
    <h1>이미 체크인 되셨습니다.</h1>
  {:else if data.checkedIn === false}
    <h1>체크인 되셨습니다.</h1>
  {:else}
    <div class="modal-backdrop show" />
    <div class="modal" tabindex="-1" role="dialog" style="display:block;">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <p>
              No such key <strong>{data.key}</strong> found in the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <p>{data.key}</p>
</div>

<style>
  @page {
    size: A6;
    margin: 2cm;
  }
</style>
