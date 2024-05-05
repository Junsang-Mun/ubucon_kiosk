<script>
  import { onMount } from "svelte";
  import { createNametagImage } from "$lib/img.js";
  import { buildBitmapPrintTsplCmd, sendDataToPrinter } from "$lib/printer.js";
  import { page } from "$app/stores";

  let name, org, tee;
  let nameTagImg;
  let cmd, tsplBitmap;

  onMount(async () => {
    const url = $page.url;
    name = url.searchParams.get("name");
    org = url.searchParams.get("org");
    tee = url.searchParams.get("tee");

    nameTagImg = await createNametagImage(name, org, tee);
    console.log(nameTagImg);
    //(x, y, imgWidthPx, imgHeightPx, canvasWidthMm, canvasHeightMm, imageBitmap)//
    // cmd = buildBitmapPrintTsplCmd(testImg);
    // console.log(cmd);
  });

  //   async function printTicket() {
  //     const filters = [{ vendorId: 0x1fc9, productId: 0x2016 }];
  //     try {
  //       let device = await navigator.usb.requestDevice({ filters: filters });
  //       if (device === null) {
  //         console.log("Device not found");
  //         return;
  //       }
  //       sendDataToPrinter(device, cmd);
  //     } catch (error) {
  //       console.error("Error while getting USB device:", error);
  //     }
  //   }

  async function printTicket() {
    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: nameTagImg }),
    });
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
