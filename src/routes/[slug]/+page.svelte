<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let slug;
  $: slug = $page.params.slug;
  let checkedIn = false;

  onMount(() => {
    console.log(slug);
    fetch(`./?key=${slug}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.checkedIn === true) {
          checkedIn = true;
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          //http://localhost:5173/print?name=문준상&org=우분투한국커뮤니티&tee=M
          window.location.href = `print/?name=${data.name}&org=${data.organization}&tee=${data.teeSize}`;
        }
      })
      .catch((e) => console.error(e));
  });
</script>

<div class="p-5">
  {#if checkedIn === false}
    <h1>잠시만 기다려 주세요...</h1>
  {:else}
    <h1>이미 체크인 완료되었습니다</h1>
    <p>관리자에게 문의해주세요.</p>
  {/if}
</div>
