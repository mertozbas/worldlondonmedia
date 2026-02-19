document.addEventListener("DOMContentLoaded", () => {

  // ── Custom Cursor ──
  const cursor = document.querySelector(".cursor");
  const cf = document.querySelector(".cursor-follower");

  if (cursor && cf) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function ac() {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
      cf.style.left = cx + "px";
      cf.style.top = cy + "px";
      requestAnimationFrame(ac);
    })();

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }

  // ── Nav Scroll ──
  const nav = document.querySelector(".nav");

  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 80);
    });
  }

  // ── Mobile Nav Toggle ──
  const nt = document.getElementById("navToggle");
  const nl = document.getElementById("navLinks");

  if (nt && nl) {
    nt.addEventListener("click", () => {
      nt.classList.toggle("active");
      nl.classList.toggle("active");
    });

    nl.querySelectorAll(".nav-link").forEach((l) =>
      l.addEventListener("click", () => {
        nt.classList.remove("active");
        nl.classList.remove("active");
      })
    );
  }

  // ── Language Toggle (EN/TR) ──
  const lt = document.getElementById("langToggle");

  if (lt) {
    let lang = localStorage.getItem("preferredLang") || "en";

    if (lang !== "en") applyLang(lang);

    lt.addEventListener("click", () => {
      lang = lang === "en" ? "tr" : "en";
      applyLang(lang);
      localStorage.setItem("preferredLang", lang);
    });

    function applyLang(l) {
      lt.querySelector(".lang-current").textContent = l.toUpperCase();
      lt.querySelector(".lang-other").textContent = l === "en" ? "TR" : "EN";

      document.querySelectorAll("[data-en][data-tr]").forEach((el) => {
        const t = el.getAttribute("data-" + l);
        if (t) el.innerHTML = t;
      });

      document.documentElement.lang = l;
    }
  }

  // ── Video Modal ──
  const vm = document.getElementById("videoModal");
  const mv = document.getElementById("modalVideo");

  if (vm && mv) {
    const cb = vm.querySelector(".video-modal-close");

    document.querySelectorAll("[data-video]").forEach((i) => {
      i.addEventListener("click", () => {
        const s = i.dataset.video;
        if (s) {
          mv.src = s;
          vm.classList.add("active");
          mv.play().catch(() => {});
        }
      });
    });

    function cl() {
      vm.classList.remove("active");
      mv.pause();
      mv.src = "";
    }

    if (cb) cb.addEventListener("click", cl);

    vm.addEventListener("click", (e) => {
      if (e.target === vm) cl();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cl();
    });
  }

  // ── Video Hover-to-Play ──
  document.querySelectorAll(".video-item video, .work-item video").forEach((v) => {
    const p = v.closest(".video-item") || v.closest(".work-item");

    if (p) {
      p.addEventListener("mouseenter", () => {
        if (v.readyState >= 2) v.play().catch(() => {});
      });

      p.addEventListener("mouseleave", () => {
        v.pause();
        v.currentTime = 0;
      });
    }
  });

  // ── Work Page Filter ──
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workItems = document.querySelectorAll(".work-item");

  if (filterBtns.length && workItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const cat = btn.dataset.category || "all";

        workItems.forEach((item) => {
          if (cat === "all") {
            item.style.display = "";
          } else {
            const cats = (item.dataset.categories || "").split(",");
            item.style.display = cats.includes(cat) ? "" : "none";
          }
        });
      });
    });
  }

  // ── Contact Form (Formspree) ──
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector(".submit-btn span");
      const origText = btn.textContent;
      btn.textContent = "Sending...";

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            btn.textContent = "Message Sent!";
            contactForm.reset();
            setTimeout(() => { btn.textContent = origText; }, 3000);
          } else {
            btn.textContent = "Error. Try Again.";
            setTimeout(() => { btn.textContent = origText; }, 3000);
          }
        })
        .catch(() => {
          btn.textContent = "Error. Try Again.";
          setTimeout(() => { btn.textContent = origText; }, 3000);
        });
    });
  }

});
