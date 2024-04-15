<script>
  import { writable } from "svelte/store";
  import Quagga from "quagga";
  import { onMount, onDestroy } from "svelte";

  let videoElement;
  let videoWidth = 640;
  let videoHeight = 480;
  let intervalId;

  // Create a writable store for qrCodeValue
  const qrCodeValue = writable("No Data Found");

  onMount(() => {
    // Get access to the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
      })
      .catch(function (err) {
        console.error("Error accessing webcam:", err);
      });

    // Start continuous QR code detection
    intervalId = setInterval(captureAndDetectQRCode, 100); // Adjust the interval as needed
  });

  onDestroy(() => {
    // Stop continuous detection when component is destroyed
    clearInterval(intervalId);
  });

  function captureAndDetectQRCode() {
    let video = document.getElementById("preview");
    let canvas = document.createElement("canvas");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageData = canvas.toDataURL("image/png");
    detectQRCode(imageData);
  }

  function detectQRCode(imageData) {
    Quagga.decodeSingle(
      {
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
          ],
        },
        locate: true,
        src: imageData,
      },
      function (result) {
        if (result && result.codeResult) {
          console.log("QR Code detected: ", result.codeResult.code);
          qrCodeValue.set(result.codeResult.code);
          // Do something with the detected QR code, like emitting an event
        } else {
          console.log("No QR Code detected.");
          qrCodeValue.set("No Data Found");
        }
      }
    );
  }
</script>

<h1>UbuCon Korea 2024</h1>
<video id="preview" bind:this={videoElement} autoplay></video>
<p>{$qrCodeValue}</p>

<style>
  #preview {
    width: 640px;
    height: 360px;
  }
</style>
