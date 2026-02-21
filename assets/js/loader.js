/* WM Logomark SVG Stroke Draw Loader */
function initLoader() {
  var loader = document.getElementById("loader");
  if (!loader) return;

  var wmW = loader.querySelector(".wm-w");
  var wmM = loader.querySelector(".wm-m");
  var counter = loader.querySelector(".loader-counter");
  var progressBar = loader.querySelector(".loader-progress-bar");

  if (!wmW || !wmM) return;

  // Calculate path lengths
  var wLen = wmW.getTotalLength();
  var mLen = wmM.getTotalLength();

  // Set initial stroke-dash (fully hidden)
  wmW.style.strokeDasharray = wLen;
  wmW.style.strokeDashoffset = wLen;
  wmM.style.strokeDasharray = mLen;
  wmM.style.strokeDashoffset = mLen;

  var progress = 0;
  var interval = setInterval(function () {
    progress += Math.random() * 10 + 2;
    if (progress > 100) progress = 100;

    // Animate stroke reveal based on progress
    wmW.style.strokeDashoffset = wLen * (1 - progress / 100);
    wmM.style.strokeDashoffset = mLen * (1 - progress / 100);

    if (progressBar) progressBar.style.width = progress + "%";
    if (counter) counter.textContent = Math.round(progress) + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(function () {
        loader.classList.add("loader-done");
        setTimeout(function () {
          loader.style.display = "none";
        }, 800);
      }, 300);
    }
  }, 45);
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoader);
} else {
  initLoader();
}
