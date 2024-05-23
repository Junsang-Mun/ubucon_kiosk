<script>
  import { onMount } from "svelte";
  import { createNametagImage } from "$lib/img.js";
  import { page } from "$app/stores";

  let name, org, tee;
  let nameTagImg;
  let bufferData;

  onMount(async () => {
    const url = $page.url;
    name = url.searchParams.get("name");
    org = url.searchParams.get("org");
    tee = url.searchParams.get("tee");

    nameTagImg = await createNametagImage(name, org, tee);
    console.log(nameTagImg);
    printTicket();
    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  });

  async function printTicket() {
    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: nameTagImg }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        bufferData = data.buffer; // Store buffer data in a variable
        console.log(bufferData); // Log the buffer data
      })
      .catch((error) => console.error(error)); // Handle any errors
  }
</script>

<div class="container p-5">
  <h1>입장권 출력 페이지</h1>
  <img src={nameTagImg} alt="nametag" />
</div>
