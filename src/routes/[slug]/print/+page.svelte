<script>
  import { onMount } from "svelte";
  import { createNametagImagePng, pngToUint8 } from "$lib/img.js";
  import { sendDataToPrinter } from "$lib/printer.js";
  import { Buffer } from "buffer";

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
    nameTagPng = createNametagImagePng(name, org, teeShirtSize);
    console.log(nameTagPng);
  });

  async function convertImageDataToTSPL(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    // Convert RGBA pixel data to binary bitmap
    const bitmapData = [];
    for (let i = 0; i < data.length; i += 4) {
      const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
      bitmapData.push(grayscale < 128 ? 0 : 1);
    }

    // Generate TSPL command
    const commands = [];
    commands.push(`BITMAP ${width},${height},${Math.ceil(width / 8)},`);
    for (let i = 0; i < bitmapData.length; i += 8) {
      const byte = bitmapData
        .slice(i, i + 8)
        .reverse()
        .join("");
      commands.push(parseInt(byte, 2).toString(16).toUpperCase());
    }

    return commands.join(", ");
  }

  function tsplBuffer(uint8Array) {
    const widthInBytes = Math.ceil(uint8Array.length / uint8Array.byteLength);
    const heightInDots = uint8Array.byteLength;
    const buffer = Buffer.concat([
      Buffer.from("SIZE 70 mm, 70 mm\r\n"),
      Buffer.from("CLS\r\n"),
      Buffer.from(`BITMAP 0,0,${widthInBytes},${heightInDots},0,`),
      Buffer.from(
        uint8ArrayToTSPLBitmap(uint8Array, widthInBytes, heightInDots)
      ),
      Buffer.from("PRINT 1\r\n"),
      Buffer.from("END\r\n"),
    ]);
    return buffer;
  }

  const getUSBDevice = async () => {
    const filters = [{ vendorId: 0x1fc9, productId: 0x2016 }];

    try {
      let device = await navigator.usb.requestDevice({ filters: filters });

      if (device === null) {
        console.log("Device not found");
        return;
      }

      pngToUint8(nameTagPng).then(async (uint8Data) => {
        const printTsplCmd = tsplBuffer(uint8Data);
        console.log(printTsplCmd.buffer);
        await sendDataToPrinter(device, printTsplCmd.buffer);
      });
      // const printTsplCmd = tsplBuffer(uint8Data);
      // await sendDataToPrinter(device, printTsplCmd);
    } catch (error) {
      console.error("Error while getting USB device:", error);
    }
  };
</script>

<div class="container pt-5">
  <button on:click={getUSBDevice}>Request USB Device</button>
  <h1>입장권 출력 중...</h1>
  <h2>Printing Tickets...</h2>

  <img src={nameTagPng} alt="Nametag" />
</div>
