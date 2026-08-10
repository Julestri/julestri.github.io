/* =========================================================
   Talks — single source of truth.

   Newest first. Each entry feeds three things: the circle in
   the grid, the pop-up bar shown while it is hovered, and the
   plain list used instead on narrow screens.

   Fields
     img       optional. Without one, `monogram` is shown instead
     link      optional. Without one the circle is not clickable
     upcoming  true for accepted talks not yet given; shows an
               "Upcoming" badge in the pop-up bar and in the list
   ========================================================= */

var TALKS = [
  {
    title: "AquaEpi — international conference on aquatic animal epidemiology",
    text: "Understanding marine pathogen transmission dynamics using complementary epidemiological modelling approaches",
    location: "Medellín, Colombia",
    date: "28 September 2026",
    sort: "2026-09-28",
    kind: "Oral presentation",
    img: "assets/img/AE.jpg",
    link: "https://aquaepi.org",
    upcoming: true
  },
  {
    title: "ModAH — international conference on animal health modelling",
    text: "Mitigating the impact of OsHV-1 on Pacific oyster production using a spatial compartmental modelling approach",
    location: "Nantes, France",
    date: "24 August 2026",
    sort: "2026-08-24",
    kind: "Oral presentation",
    img: "assets/img/mod.jpg",
    link: "https://www.modah-hub.com",
    upcoming: true
  },
  {
    title: "EAFP French branch meeting",
    text: "A SWEIRD model for OsHV-1 µVar transmission dynamics in Magallana gigas populations",
    location: "Ploufragan, France",
    date: "2 July 2026",
    sort: "2026-07-02",
    kind: "Oral presentation",
    img: "assets/img/EAFP.png",
    link: "https://eafp.org"
  },
  {
    title: "Second-year PhD student symposium",
    text: "Understanding the epidemiological dynamics of OsHV-1 through phylogeographic and compartmental modelling approaches",
    location: "La Rochelle, France",
    date: "8–9 June 2026",
    sort: "2026-06-08",
    kind: "Oral presentation and poster",
    img: "assets/img/PHD_Y2.png"
  },
  {
    title: "Anthropisation and Evolution workshop",
    text: "Phylogeography of OsHV-1 and environmental and anthropogenic predictors of spatial spread",
    location: "Paris, France",
    date: "9 December 2025",
    sort: "2025-12-09",
    kind: "Oral presentation",
    img: "assets/img/AE.png"
  },
  {
    title: "Société Française de Microbiologie — national congress",
    text: "A SWEIRD model for OsHV-1 µVar transmission dynamics in Magallana gigas populations",
    location: "Bordeaux, France",
    date: "24 September 2025",
    sort: "2025-09-24",
    kind: "Oral presentation",
    img: "assets/img/SFM.jpeg",
    link: "https://www.sfm-microbiologie.org"
  },
  {
    title: "Ifremer Microbiome Day",
    text: "A SWEIRD model for OsHV-1 µVar transmission dynamics in Magallana gigas populations",
    location: "Nantes, France",
    date: "25 June 2025",
    sort: "2025-06-25",
    kind: "Oral presentation",
    img: "assets/img/MBD.jpeg",
    link: "https://microbiome-nantes.sciencesconf.org"
  },
  {
    title: "My Thesis in 180 Seconds — Regional final",
    text: "Understanding the epidemiological dynamics of OsHV-1 through phylogeographic and modelling approaches",
    location: "La Rochelle, France",
    date: "10 April 2025",
    sort: "2025-04-10",
    kind: "Science communication",
    img: "assets/img/MT180.jpeg",
    link: "https://www.youtube.com/watch?v=MJsquxrnSPM"
  },
  {
    title: "My Thesis in 180 Seconds — Local final",
    text: "Understanding the epidemiological dynamics of OsHV-1 through phylogeographic and modelling approaches",
    location: "La Rochelle, France",
    date: "5 March 2025",
    sort: "2025-03-05",
    kind: "Science communication",
    img: "assets/img/MT180.jpeg",
    link: "https://www.univ-larochelle.fr/evenements/mt180-selection-locale-2025/"
  },
  {
    title: "Master's thesis defense",
    text: "Phylogeography of OsHV-1 and environmental, climatic and anthropogenic predictors of spatial spread",
    location: "Rennes, France",
    date: "11 September 2024",
    sort: "2024-09-11",
    kind: "Defense",
    img: "assets/img/ACO.jpeg",
    link: "https://dumas.ccsd.cnrs.fr/MEM-INSTITUT-AGRO-RENNES-ANGERS/dumas-04829632v1"
  },
  {
    title: "Engineering thesis defense",
    text: "Roles of Auts2a protein domains in the maternal control of behaviour, and impact of a thermal stress on the regulation of neurodevelopmental genes in medaka (Oryzias latipes)",
    location: "Rennes, France",
    date: "3 September 2023",
    sort: "2023-09-03",
    kind: "Defense",
    img: "assets/img/ACO.jpeg",
    link: "https://halieutique.institut-agro.fr/files/fichiers/memoires/222332.pdf"
  }
];

(function () {
  "use strict";

  var grid = document.getElementById("talk-grid");
  var detail = document.getElementById("talk-detail");
  var list = document.getElementById("talk-list");
  if (!grid) return;

  var sorted = TALKS.slice().sort(function (a, b) { return a.sort < b.sort ? 1 : -1; });
  var active = null;

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* --- pop-up bar at the bottom of the screen ---
     Purely informative: the title and abstract on top, then the
     date, place and kind on a single line underneath. Anything
     clickable lives on the circle itself, which shows a "+" on
     hover when a link is attached.                              */
  function hide() {
    if (detail) detail.classList.remove("is-visible");
  }

  function render(t) {
    if (!detail) return;
    detail.classList.add("is-visible");
    if (active === t) return;
    active = t;

    /* No link inside the bar: the circle itself carries the link. */
    detail.innerHTML =
      '<div class="inner">' +
      '<div class="detail-main">' +
      (t.upcoming ? '<span class="badge">Upcoming</span>' : "") +
      "<h3>" + esc(t.title) + "</h3>" +
      '<p class="abstract">' + esc(t.text) + "</p></div>" +
      '<div class="detail-meta"><ul>' +
      "<li>" + esc(t.date) + "</li>" +
      "<li>" + esc(t.location) + "</li>" +
      "<li>" + esc(t.kind) + "</li>" +
      "</ul></div>" +
      "</div>";
  }

  /* --- circles --- */
  sorted.forEach(function (t) {
    var el = document.createElement(t.link ? "a" : "div");
    el.className = "bubble reveal";

    if (t.link) {
      el.href = t.link;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.tabIndex = 0;
    }

    el.innerHTML = t.img
      ? '<img src="' + t.img + '" alt="" loading="lazy">'
      : '<span class="monogram">' + esc(t.monogram || t.title) + "</span>";

    el.setAttribute("aria-label",
      t.title + " — " + t.location + ", " + t.date + " (" + t.kind +
      (t.upcoming ? ", upcoming" : "") + ")");

    ["mouseenter", "focus"].forEach(function (ev) {
      el.addEventListener(ev, function () {
        grid.querySelectorAll(".is-active").forEach(function (n) { n.classList.remove("is-active"); });
        el.classList.add("is-active");
        render(t);
      });
    });

    ["mouseleave", "blur"].forEach(function (ev) {
      el.addEventListener(ev, function () {
        el.classList.remove("is-active");
        hide();
      });
    });

    grid.appendChild(el);
  });

  /* --- plain list, shown instead of the grid on narrow screens --- */
  if (list) {
    sorted.forEach(function (t) {
      var item = document.createElement("div");
      item.className = "timeline-entry";
      item.innerHTML =
        "<h3>" + esc(t.title) + (t.upcoming ? ' <span class="badge">Upcoming</span>' : "") + "</h3>" +
        '<div class="date">' + esc(t.date) + " · " + esc(t.location) + " · " + esc(t.kind) + "</div>" +
        "<p>" + esc(t.text) + "</p>" +
        (t.link ? '<p style="margin-top:.6rem"><a class="inline-link" href="' + t.link +
                  '" target="_blank" rel="noopener">See more</a></p>' : "");
      list.appendChild(item);
    });
  }
})();
