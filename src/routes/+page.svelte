<script>
  import { writable } from "svelte/store";
  import Quagga from "quagga";
  import { onMount, onDestroy } from "svelte";

  let videoElement;
  let videoWidth = 640;
  let videoHeight = 480;
  let intervalId;
  let showModal = false;

  // Create a writable store for barcodeValue
  const barcodeValue = writable("No Data Found");

  onMount(() => {
    // Get access to the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
      })
      .catch(function (err) {
        console.error("Error accessing webcam:", err);
        toggleModal();
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
          barcodeValue.set(result.codeResult.code);
          window.location.href = `http://localhost:5173/${result.codeResult.code}`;
        } else {
          barcodeValue.set("No Data Found");
        }
      }
    );
  }

  function toggleModal() {
    showModal = !showModal;
  }
</script>

<!-- Modal -->
{#if showModal}
  <div class="modal-backdrop show" />
  <div class="modal" tabindex="-1" role="dialog" style="display:block;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <strong>
            Don't have access to camera or no camera found. Check the camera
            again.
          </strong>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" on:click={toggleModal}
            >Ignore</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Main content -->
{#if !showModal}
  <div class="container p-5">
    <div class="navbar navbar-expand-lg mb-5">
      <img
        src="https://2024.ubuntu-kr.org/_astro/logo.B4ivTObo.svg"
        alt="UbuCon Korea 2024 Logo"
        style="height:100%; width:100px; object-fit:contain;"
      />
      <h1>UbuCon Korea 2024 Check-in Kiosk</h1>
    </div>
    <div class="card p-3">
      <video
        id="preview"
        bind:this={videoElement}
        autoplay
        style="height: 30em;"
      ></video>
    </div>
    <div class="card p-3 m-5">
      <h2>Barcode Value: {$barcodeValue}</h2>
    </div>
  </div>
{/if}

<style>
  /* #preview {
    width: 640px;
    height: 360px;
  } */
</style>
