<!-- BARCODE TYPE CODE128 NEEDED, OTHERS WILL NOT ACCEPTED -->

<script>
  import { writable } from "svelte/store";
  import Quagga from "quagga";
  import { onMount, onDestroy } from "svelte";

  let videoElement;
  let videoWidth = 640;
  let videoHeight = 480;
  let intervalId;
  let showModal = false;

  const barcodeValue = writable("No Data Found");

  onMount(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
      })
      .catch(function (err) {
        console.error("Error accessing webcam:", err);
        toggleModal();
      });
    intervalId = setInterval(captureAndDetectQRCode, 200);
  });

  onDestroy(() => {
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
          readers: ["code_128_reader"],
        },
        locate: true,
        src: imageData,
      },
      function (result) {
        if (result && result.codeResult) {
          barcodeValue.set(result.codeResult.code);
          window.location.href = `/${result.codeResult.code}`;
          // getUserData(result.codeResult.code);
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
        src="https://raw.githubusercontent.com/ubuntu-kr/2024.ubuntu-kr.org/main/src/assets/logo.svg"
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
      <h2>Scanned Value: {$barcodeValue}</h2>
    </div>
  </div>
{/if}
