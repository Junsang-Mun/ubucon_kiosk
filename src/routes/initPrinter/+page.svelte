<script>
  import { onMount } from "svelte";
  import { requestUSBDevice, forgetDevice } from "$lib/USB.js";
  import { buildTestPrintTsplCmd, sendDataToPrinter } from "$lib/printer.js";

  let usbDevice;
  let forgetSupported = false;

  onMount(() => {
    if ("usb" in navigator && "forget" in USBDevice.prototype) {
      console.log("forget is supported");
      forgetSupported = true;
    }
  });

  const printTestPage = async () => {
    const data = buildTestPrintTsplCmd();
    console.log(data);
    await sendDataToPrinter(usbDevice, data);
  };

  async function removeUSBDevice() {
    const device = await requestUSBDevice();
    if (forgetSupported) {
      await forgetDevice(device);
      console.log("Device forgotten");
    } else {
      console.log("forget is not supported");
    }
  }
</script>

<div class="container pt-5">
  <h1>Init Printer</h1>
  <button
    on:click={async () => {
      usbDevice = await requestUSBDevice();
    }}>Request USB Device</button
  >

  <button
    on:click={() => {
      printTestPage();
    }}
    >Print Test Page
  </button>

  <button
    on:click={async () => {
      removeUSBDevice();
    }}
    >forgetDevice
  </button>
</div>
