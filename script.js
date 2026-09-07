(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var themeIcon = themeToggle.querySelector("i");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeIcon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem("portfolio-theme");
  } catch (e) {}

  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(storedTheme || (prefersLight ? "light" : "dark"));

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch (e) {}
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 20);
    toggleBackToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scrollspy ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (section) {
    spyObserver.observe(section);
  });

  /* ---------- Reveal on scroll ---------- */
  /* Content is visible by default (see .reveal in CSS) so a JS failure
     never hides it. Here we opt elements into a hide-then-reveal effect,
     with a hard timeout as a safety net in case the observer never fires. */
  try {
    var revealEls = document.querySelectorAll(".reveal");

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pre-reveal");
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 6, 5) * 60 + "ms";
      el.classList.add("pre-reveal");
      revealObserver.observe(el);
    });

    setTimeout(function () {
      revealEls.forEach(function (el) {
        el.classList.remove("pre-reveal");
      });
    }, 3000);
  } catch (e) {
    /* IntersectionObserver unsupported or failed — content stays visible by default */
  }

  /* ---------- Rotating hero role text ---------- */
  var roles = [
    "Backend Engineer",
    "Full-Stack Developer",
    "GenAI Engineer",
    "Automation Builder"
  ];
  var roleEl = document.getElementById("roleText");
  var roleIndex = 0;
  var charIndex = roles[0].length;
  var deleting = false;

  function tickRole() {
    var current = roles[roleIndex];
    var delay = deleting ? 40 : 80;

    if (!deleting && charIndex === current.length) {
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    } else {
      charIndex += deleting ? -1 : 1;
    }

    roleEl.textContent = current.slice(0, charIndex);
    setTimeout(tickRole, delay);
  }
  setTimeout(tickRole, 1600);

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  function toggleBackToTop() {
    backToTop.style.opacity = window.scrollY > 400 ? "1" : "0";
    backToTop.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
  }
  backToTop.style.transition = "opacity 0.3s ease";
  toggleBackToTop();
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
