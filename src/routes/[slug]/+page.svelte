<script>
  export let data;
  import { onMount } from "svelte";

  let currentUrl;
  let dbQueryData = {};

  let org;
  let name;
  let checkedIn;
  const timeOut = 2000;

  const getUser = () => {
    const url = `${window.location.href}`;
    const queryData = {
      userKey: data.slug,
    };
    return fetch(`${url}/?${new URLSearchParams(queryData).toString()}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        return {};
      });
  };

  const checkInUser = () => {
    const url = `${window.location.href}`;
    const queryData = {
      userKey: data.slug,
    };
    fetch(`${url}/?${new URLSearchParams(queryData).toString()}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  const sendPrintData = () => {
    const dataToSend = {
      name: name,
      org: org,
    };
    const queryParams = new URLSearchParams(dataToSend).toString();
    window.location.href = `${currentUrl}/print?${queryParams}`;
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  onMount(async () => {
    currentUrl = window.location.href;
    dbQueryData = await getUser();
    console.log(dbQueryData);
    name = dbQueryData.name;
    org = dbQueryData.organization;
    checkedIn = dbQueryData.checkedIn;
    checkInUser();
  });
</script>

<div class="container p-5 m-5">
  {#if org !== undefined || name !== undefined}
    <h1>안녕하세요 {org}의 {name}님!</h1>
  {/if}
  {#if checkedIn === true}
    <h1>이미 체크인 되셨습니다.</h1>
  {:else if checkedIn === false}
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
