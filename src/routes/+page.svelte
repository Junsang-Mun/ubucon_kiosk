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
          readers: ["code_39_reader"],
        },
        locate: true,
        src: imageData,
      },
      function (result) {
        if (result && result.codeResult) {
          qrCodeValue.set(result.codeResult.code);
          window.location.href = `http://localhost:5173/${result.codeResult.code}`;
        } else {
          qrCodeValue.set("No Data Found");
        }
      }
    );
  }
</script>

<h1>UbuCon Korea 2024</h1>
<p>{$qrCodeValue}</p>

<div class="card" style="width: 18rem;">
  <video id="preview" bind:this={videoElement} autoplay></video>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<style>
  /* #preview {
    width: 640px;
    height: 360px;
  } */
</style>
