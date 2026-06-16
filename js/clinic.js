(function () {
  "use strict";

  /* Navbar collapse (Bootstrap JS fallback) */
  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function (toggler) {
    toggler.addEventListener("click", function () {
      var target = document.querySelector(toggler.getAttribute("data-bs-target"));
      if (!target) return;
      var isOpen = target.classList.toggle("show");
      toggler.setAttribute("aria-expanded", isOpen);
      var nav = toggler.closest("nav");
      if (nav) nav.classList.toggle("opened", isOpen);
    });
  });

  /* Close mobile nav on link click */
  document.querySelectorAll(".navbar-nav .nav-link, .navbar-buttons .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      var collapse = document.getElementById("navbarSupportedContent");
      var toggler = document.querySelector('[data-bs-target="#navbarSupportedContent"]');
      if (collapse && collapse.classList.contains("show")) {
        collapse.classList.remove("show");
        if (toggler) toggler.setAttribute("aria-expanded", "false");
        var nav = toggler && toggler.closest("nav");
        if (nav) nav.classList.remove("opened");
      }
    });
  });

  /* Responsive horizontal carousel */
  function initCarousel(containerId, prevId, nextId, options) {
    var container = document.getElementById(containerId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    if (!container || !prevBtn || !nextBtn) return;

    var translateX = options.startOffset || 0;
    var gap = options.gap || 16;

    function getStep() {
      var firstItem = container.children[0];
      if (!firstItem) return 300;
      return firstItem.getBoundingClientRect().width + gap;
    }

    function getMaxScroll() {
      var wrapper = container.parentElement;
      if (!wrapper) return 0;
      return Math.max(0, container.scrollWidth - wrapper.clientWidth);
    }

    function update() {
      var max = getMaxScroll();
      translateX = Math.min(0, Math.max(-max, translateX));
      container.style.transform = "translateX(" + translateX + "px)";
      prevBtn.disabled = translateX >= 0;
      nextBtn.disabled = translateX <= -max;
      prevBtn.style.opacity = translateX >= 0 ? "0.4" : "1";
      nextBtn.style.opacity = translateX <= -max ? "0.4" : "1";
    }

    prevBtn.addEventListener("click", function () {
      translateX += getStep();
      update();
    });

    nextBtn.addEventListener("click", function () {
      translateX -= getStep();
      update();
    });

    /* Touch swipe */
    var startX = 0;
    var isDragging = false;

    container.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    container.addEventListener("touchmove", function (e) {
      if (!isDragging) return;
      var diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 40) {
        translateX += diff > 0 ? getStep() : -getStep();
        update();
        isDragging = false;
      }
    }, { passive: true });

    container.addEventListener("touchend", function () {
      isDragging = false;
    });

    window.addEventListener("resize", update);
    update();
  }

  initCarousel("newsScroll", "newsPrev", "newsNext", { gap: 16 });
  initCarousel("galleryScroll", "galleryPrev", "galleryNext", { startOffset: 0, gap: 8 });

  /* Fade-in on scroll */
  var faders = document.querySelectorAll(".fade-in-section");
  if (faders.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    faders.forEach(function (el) { observer.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Loop hero video */
  document.querySelectorAll("video").forEach(function (video) {
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
  });

  /* Team page member buttons — use CSS class instead of inline styles */
  document.querySelectorAll(".member-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".member-button").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
    });
  });

  /* Set initial active member button */
  var firstMember = document.querySelector(".member-button");
  if (firstMember && !document.querySelector(".member-button.active")) {
    firstMember.classList.add("active");
  }
})();
