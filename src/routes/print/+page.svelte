<script>
  import { onMount } from "svelte";
  import { createNametagImage } from "$lib/img.js";
  import { buildBitmapPrintTsplCmd, sendDataToPrinter } from "$lib/printer.js";
  import { page } from "$app/stores";

  let name, org, tee;
  let nameTagImg;
  let cmd, tsplBitmap;
  let bufferData; // Variable to store buffer data

  onMount(async () => {
    const url = $page.url;
    name = url.searchParams.get("name");
    org = url.searchParams.get("org");
    tee = url.searchParams.get("tee");

    nameTagImg = await createNametagImage(name, org, tee);
    console.log(nameTagImg);
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
        // Use the buffer data as needed
      })
      .catch((error) => console.error(error)); // Handle any errors
  }
</script>

<div class="container p-5">
  <h1>입장권 출력 페이지</h1>
  <div class="container p-5">
    <p>{name}</p>
    <p>{org}</p>
    <p>{tee}</p>
  </div>
  <div class="flex justify-center">
    <button class="btn btn-primary" on:click={printTicket}>프린터로 출력</button
    >
  </div>
</div>
