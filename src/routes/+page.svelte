<script>
  import jsQR from "jsqr";

  let video;
  let canvas;
  let ctx;
  let isScanning = false;

  function startScanning() {
    isScanning = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        video.addEventListener("canplay", scanFrame); // Call scanFrame() when video is ready
      });
  }

  function stopScanning() {
    isScanning = false;
    video.pause();
    video.srcObject.getTracks().forEach((track) => track.stop());
  }

  function scanFrame() {
    if (!isScanning) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      stopScanning();
      alert(`QR Code detected: ${code.data}`);
    } else {
      requestAnimationFrame(scanFrame);
    }
  }
</script>

<main>
  <video bind:this={video} width="320" height="240" autoplay></video>
  <canvas bind:this={canvas} width="320" height="240"></canvas>

  {#if !isScanning}
    <button on:click={startScanning}>Start Scanning</button>
  {:else}
    <button on:click={stopScanning}>Stop Scanning</button>
  {/if}
</main>

<style>
  video,
  canvas {
    width: 100%;
    max-width: 320px;
    height: auto;
  }
</style>
