document.addEventListener("DOMContentLoaded", () => {

  // ── 1. Custom Cursor with Magnetic Effect ──
  const cursor = document.querySelector(".cursor");
  const cf = document.querySelector(".cursor-follower");

  if (cursor && cf && window.innerWidth > 768) {
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

    // Magnetic effect on CTA buttons and toggles
    document.querySelectorAll(".cta-btn, .cta-btn-filled, .service-panel-toggle, .footer-scroll-top").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = "translate(" + (x * 0.2) + "px, " + (y * 0.2) + "px)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ── 2. Scroll Reveal (IntersectionObserver) ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
    revealObserver.observe(el);
  });

  // Timeline dot reveal
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        dotObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".timeline-dot").forEach((dot) => {
    dotObserver.observe(dot);
  });

  // ── 3. Nav Scroll State ──
  const nav = document.querySelector(".nav");

  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 100);
    }, { passive: true });
  }

  // ── 4. Menu Overlay Toggle ──
  const nt = document.getElementById("navToggle");
  const menuOverlay = document.getElementById("menuOverlay");

  if (nt && menuOverlay) {
    nt.addEventListener("click", () => {
      nt.classList.toggle("active");
      menuOverlay.classList.toggle("active");
      document.body.style.overflow = menuOverlay.classList.contains("active") ? "hidden" : "";
    });

    // Close on menu link click
    menuOverlay.querySelectorAll(".menu-link").forEach((l) => {
      l.addEventListener("click", () => {
        nt.classList.remove("active");
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // ── 5. Language Toggle (EN/TR) ──
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

  // ── 6. Services Accordion ──
  document.querySelectorAll(".service-panel").forEach((panel) => {
    const header = panel.querySelector(".service-panel-header");
    if (header) {
      header.addEventListener("click", () => {
        const isActive = panel.classList.contains("active");
        // Close all panels
        document.querySelectorAll(".service-panel.active").forEach((p) => p.classList.remove("active"));
        // Toggle clicked
        if (!isActive) panel.classList.add("active");
      });
    }
  });

  // ── 7. Horizontal Scroll Drag (Work Showcase) ──
  const hScroll = document.querySelector(".work-horizontal");

  if (hScroll) {
    let isDown = false, startX, scrollLeft;

    hScroll.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - hScroll.offsetLeft;
      scrollLeft = hScroll.scrollLeft;
      hScroll.style.scrollBehavior = "auto";
    });

    hScroll.addEventListener("mouseleave", () => { isDown = false; });
    hScroll.addEventListener("mouseup", () => {
      isDown = false;
      hScroll.style.scrollBehavior = "smooth";
    });

    hScroll.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - hScroll.offsetLeft;
      const walk = (x - startX) * 1.5;
      hScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // ── 8. Stat Counter Animation ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".stat-number[data-count]").forEach((el) => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.textContent.replace(/[0-9]/g, "");
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + suffix;
    }, 16);
  }

  // ── 9. Page Transitions ──
  const pageTransition = document.querySelector(".page-transition");

  if (pageTransition) {
    // Exit transition on page load
    if (pageTransition.classList.contains("active")) {
      requestAnimationFrame(() => {
        pageTransition.classList.add("exit");
        setTimeout(() => {
          pageTransition.classList.remove("active", "exit");
        }, 600);
      });
    }

    // Enter transition on link click
    document.querySelectorAll("a[href]").forEach((link) => {
      if (link.hostname === location.hostname && !link.hash && link.href !== location.href + "#") {
        link.addEventListener("click", (e) => {
          // Don't intercept menu links that also close menu, or links with target
          if (link.target === "_blank") return;
          e.preventDefault();
          const target = link.href;
          pageTransition.classList.add("active");
          setTimeout(() => {
            window.location = target;
          }, 550);
        });
      }
    });
  }

  // ── 10. Video Modal ──
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

    function closeModal() {
      vm.classList.remove("active");
      mv.pause();
      mv.src = "";
    }

    if (cb) cb.addEventListener("click", closeModal);

    vm.addEventListener("click", (e) => {
      if (e.target === vm) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ── 11. Video Hover-to-Play ──
  document.querySelectorAll(".work-card video, .work-item video").forEach((v) => {
    const p = v.closest(".work-card") || v.closest(".work-item");
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

  // ── 12. Work Page Filter ──
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

  // ── 13. Contact Form (Formspree) ──
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

  // ── 14. Scroll to Top ──
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

});
