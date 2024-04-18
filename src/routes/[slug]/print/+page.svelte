<script>
  import { onMount } from "svelte";
  import { createNametagImagePng, pngToUint8 } from "$lib/img.js";
  import { buildBitmapPrintTsplCmd } from "$lib/printer.js";

  let urlParams;
  let name;
  let org;
  let teeShirtSize;
  let nameTagPng;

  onMount(() => {
    urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get("name");
    org = urlParams.get("org");
    teeShirtSize = urlParams.get("tsize");

    nameTagPng = printNametag();
    const printUint8Data = pngToUint8(nameTagPng);
    console.log(nameTagPng);
  });

  function doNothing() {
    console.log("I do nothing");
  }

  function printNametag() {
    const nametagImage = createNametagImagePng(name, org);
    return nametagImage;
  }
</script>

<div class="container pt-5">
  <h1>입장권 출력 중...</h1>
  <h2>Printing Tickets...</h2>

  <img src={nameTagPng} alt="Nametag" />
</div>
