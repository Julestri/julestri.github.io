/* =========================================================
   Shared behaviour for every page.
   1. Dropdown menu
   2. Mark the current page in the nav
   3. Reveal-on-scroll
   4. Expandable project panels (Projects page)
   5. Repository detail bar (Projects page)
   6. Hero transmission network (Home page only)

   Every block below leaves quietly if its markup is absent, so
   the same file can be loaded on all pages.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Dropdown menu ---------- */
  function setupMenu() {
    var menu = document.getElementById("menu");
    var button = document.getElementById("menu-button");
    if (!menu || !button) return;

    function close() {
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll(".menu-list a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); button.focus(); }
    });
  }

  /* ---------- 2. Which page am I on ----------
     The menu button doubles as a position indicator: its label is the
     current page. The server-rendered aria-current is authoritative;
     this only re-syncs it when the file is opened under another name
     (a bare directory URL, index.htm, a local preview...).          */
  function setupCurrentPage() {
    var links = document.querySelectorAll(".menu-list a");
    var label = document.getElementById("menu-label");
    if (!links.length) return;

    var here = location.pathname.split("/").pop().toLowerCase();
    if (!here) here = "index.html";

    links.forEach(function (a) {
      var target = (a.getAttribute("href") || "").toLowerCase();
      if (target === here) {
        a.setAttribute("aria-current", "page");
        if (label) label.textContent = a.textContent;
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add("is-in"); }, i * 70);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Expandable project panels ---------- */
  function setupProjects() {
    document.querySelectorAll(".project-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = btn.closest(".project");
        var open = panel.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---------- 5. Repository detail bar ----------
     Same behaviour as the talks grid: hovering a circle pops the
     bar up at the bottom of the screen. Data travels on the anchor's
     dataset so the markup stays the single source of truth.

     The bar only describes: the link is on the circle, which shows
     a "+" on hover. Optional data-lang and data-updated attributes
     are added to the meta line when present.                       */
  function setupRepoDetail() {
    var bar = document.getElementById("repo-detail");
    var repos = document.querySelectorAll(".repo");
    if (!bar || !repos.length) return;

    function fill(el) {
      var meta = [el.dataset.host, el.dataset.lang, el.dataset.updated]
        .filter(Boolean)
        .map(function (v) { return "<li>" + v + "</li>"; })
        .join("");

      bar.innerHTML =
        '<div class="inner">' +
        '<div class="detail-main"><h3>' + el.dataset.title + "</h3>" +
        '<p class="abstract">' + el.dataset.text + "</p></div>" +
        (meta ? '<div class="detail-meta"><ul>' + meta + "</ul></div>" : "") +
        "</div>";
      bar.classList.add("is-visible");
    }

    repos.forEach(function (el) {
      ["mouseenter", "focus"].forEach(function (ev) {
        el.addEventListener(ev, function () { fill(el); });
      });
      ["mouseleave", "blur"].forEach(function (ev) {
        el.addEventListener(ev, function () { bar.classList.remove("is-visible"); });
      });
    });
  }

  /* ---------- 6. Hero network ----------
     Nodes drifting and linking: a nod to the transmission and
     phylogenetic networks at the centre of the research.        */
  function setupNetwork() {
    var canvas = document.getElementById("bg-network");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, nodes = [];
    var mouse = { x: null, y: null };
    var LINK = 130, PULL = 150;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      var count = Math.round(Math.min(70, Math.max(26, (w * h) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() < 0.14 ? 3 : 1.8
        });
      }
    }

    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0 }).observe(canvas);
    }

    function frame() {
      if (!visible) { requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (var j = i + 1; j < nodes.length; j++) {
          var q = nodes[j];
          var d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(100,134,163," + (1 - d / LINK) * 0.32 + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          var dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < PULL) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = "rgba(217,164,65," + (1 - dm / PULL) * 0.45 + ")";
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.r > 2 ? "rgba(217,164,65,.75)" : "rgba(47,80,104,.42)";
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(47,80,104,.35)";
        ctx.fill();
      });
    }

    resize();
    seed();

    window.addEventListener("resize", function () {
      resize();
      seed();
      if (reduceMotion) staticFrame();
    });

    if (reduceMotion) {
      staticFrame();
      return;
    }

    window.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        mouse.x = mouse.y = null;
        return;
      }
      mouse.x = x;
      mouse.y = y;
    });
    window.addEventListener("mouseout", function () {
      mouse.x = mouse.y = null;
    });

    frame();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupCurrentPage();
    setupReveal();
    setupProjects();
    setupRepoDetail();
    setupNetwork();
  });
})();
