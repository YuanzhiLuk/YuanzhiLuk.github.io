/* ==========================================================================
   Yuanzhi Lu — Personal Homepage
   Scroll-spy navigation, smooth jumps, progress bar, reveal-on-scroll.
   Plain JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  var progressBar = document.getElementById("progressBar");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var backToTop = document.getElementById("backToTop");

  var links = Array.prototype.slice.call(navLinks.querySelectorAll(".nav-link"));
  var sections = links
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  /* ---------- Scroll-spy: highlight the section in view ---------- */
  var currentActive = null;

  function setActive(link) {
    if (currentActive === link) return;
    if (currentActive) currentActive.classList.remove("active");
    link.classList.add("active");
    currentActive = link;
  }

  function spy() {
    var pos = window.scrollY + 140; /* nav height + breathing room */
    var found = links[0];

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) found = links[i];
    }

    /* Footer edge case: keep the last section highlighted at page bottom */
    var bottomReached =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
    if (bottomReached) found = links[links.length - 1];

    setActive(found);
  }

  /* ---------- Progress bar, nav shadow, back-to-top ---------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      nav.classList.toggle("scrolled", y > 8);
      backToTop.classList.toggle("visible", y > 600);
      if (max > 0) {
        progressBar.style.width = ((y / max) * 100).toFixed(2) + "%";
      }
      spy();
      ticking = false;
    });
  }

  window.addEventListener(
    "scroll",
    onScroll,
    { passive: true }
  );
  window.addEventListener("resize", onScroll);

  /* ---------- Back to top ---------- */
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Initial paint */
  onScroll();
})();
