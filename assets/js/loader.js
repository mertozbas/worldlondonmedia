const loader = document.getElementById("loader");

if (loader) {
  const pb = loader.querySelector(".loader-progress-bar");
  const ct = loader.querySelector(".loader-counter");
  const chars = loader.querySelectorAll(".loader-logo span");

  chars.forEach((c, i) => {
    setTimeout(() => {
      c.style.transform = "translateY(0)";
      c.style.opacity = "1";
      c.style.transition = "transform .6s cubic-bezier(.16,1,.3,1), opacity .6s ease";
    }, i * 50);
  });

  let p = 0;

  const iv = setInterval(() => {
    p += Math.random() * 15;
    if (p > 100) p = 100;

    if (pb) pb.style.width = p + "%";
    if (ct) ct.textContent = Math.round(p) + "%";

    if (p === 100) {
      clearInterval(iv);
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => (loader.style.display = "none"), 800);
      }, 300);
    }
  }, 50);
}
