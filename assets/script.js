/* ===================================================================
 * script.js — rendering logic
 *
 * Reads the tree out of window.portfolioData and builds it as nested
 * <ul>/<li> elements. The connector lines between dots are drawn
 * entirely in CSS (the ::before / ::after rules on .tree-item in
 * style.css), so there are no coordinates computed here and nothing
 * to recalculate on resize — the wires can never drift out of place.
 * =================================================================== */

(function () {
  "use strict";

  var data = window.portfolioData || {};

  /* ---- helpers ------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  /* Fall back to a gradient disc when the image is missing. */
  function paintDisc(disc, src, seed) {
    disc.style.setProperty("--seed", seed * 47 + "deg");

    if (!src) {
      disc.classList.add("is-empty");
      return;
    }

    var probe = new Image();
    probe.onload = function () {
      disc.style.backgroundImage = 'url("' + src + '")';
    };
    probe.onerror = function () {
      disc.classList.add("is-empty");
    };
    probe.src = src;
  }

  /* ---- One dot ------------------------------------------------- */

  function makeDot(item, variant, seed) {
    var dot = el("button", "dot " + variant);
    dot.type = "button";

    var disc = el("span", "dot-disc");
    paintDisc(disc, item.icon, seed);
    dot.appendChild(disc);

    var text = el("span", "dot-text");
    text.appendChild(el("span", "dot-label", item.title || ""));
    if (item.meta) text.appendChild(el("span", "dot-meta", item.meta));
    dot.appendChild(text);

    return dot;
  }

  /* ---- Wire a dot to the level hanging below it ---------------- */

  function wire(dot, list) {
    dot.classList.add("has-kids");
    dot.setAttribute("aria-expanded", "false");

    dot.addEventListener("click", function () {
      var wasOpen = dot.getAttribute("aria-expanded") === "true";

      dot.setAttribute("aria-expanded", wasOpen ? "false" : "true");
      dot.classList.toggle("is-open", !wasOpen);
      list.hidden = wasOpen;

      /* Scroll the newly grown level into view. */
      if (!wasOpen) {
        requestAnimationFrame(function () {
          list.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    });
  }

  /* ---- One level of the tree ----------------------------------- */
  /* depth 1 is the branch row (Career / Hobby); anything deeper is
     treated as a leaf. */

  function makeLevel(items, depth) {
    var list = el("ul", "tree-level");
    list.hidden = true;

    items.forEach(function (item, i) {
      var cell = el("li", "tree-item");
      cell.style.setProperty("--i", i);

      var dot = makeDot(item, depth === 1 ? "is-branch" : "is-leaf", i + 1);
      cell.appendChild(dot);

      if (item.children && item.children.length) {
        var sub = makeLevel(item.children, depth + 1);
        wire(dot, sub);
        cell.appendChild(sub);
      } else {
        /* A leaf has nothing to expand, so it opens the overlay. */
        dot.addEventListener("click", function () {
          openDetail(item);
        });
      }

      list.appendChild(cell);
    });

    return list;
  }

  function renderTree(mount) {
    var branches = data.branches || [];

    var root = el("ul", "tree-level tree-root");
    var cell = el("li", "tree-item");
    cell.style.setProperty("--i", 0);

    var dot = makeDot(data.root || { title: "Start" }, "is-root", 0);
    cell.appendChild(dot);

    if (branches.length) {
      var level = makeLevel(branches, 1);
      wire(dot, level);
      cell.appendChild(level);
    }

    root.appendChild(cell);
    mount.appendChild(root);
  }

  /* ---- Hold the start dot back until the tree scrolls into view - */

  function armReveal(stage) {
    if (!stage || !("IntersectionObserver" in window)) return;

    /* This class is added by JS only, which is deliberate: with JS
       off the dot has no hiding rule applied and stays visible. */
    document.body.classList.add("tree-armed");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          document.body.classList.add("tree-revealed");
          io.disconnect();
        });
      },
      { threshold: 0.3 }
    );

    io.observe(stage);
  }

  /* ---- The detail overlay -------------------------------------- */

  var overlay = null;
  var lastFocus = null;

  function buildOverlay() {
    overlay = el("div", "overlay");
    overlay.setAttribute("aria-hidden", "true");

    var panel = el("div", "overlay-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    var close = el("button", "overlay-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", closeDetail);

    panel.appendChild(close);
    panel.appendChild(el("div", "overlay-disc"));
    panel.appendChild(el("h2", "overlay-title"));
    panel.appendChild(el("p", "overlay-meta"));
    panel.appendChild(el("p", "overlay-text"));
    panel.appendChild(el("a", "overlay-link"));

    overlay.appendChild(panel);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeDetail();
    });

    document.body.appendChild(overlay);
  }

  function openDetail(item) {
    if (!overlay) buildOverlay();
    lastFocus = document.activeElement;

    var disc = overlay.querySelector(".overlay-disc");
    disc.className = "overlay-disc";
    disc.style.backgroundImage = "";
    paintDisc(disc, item.icon, 3);

    overlay.querySelector(".overlay-title").textContent = item.title || "";

    var meta = overlay.querySelector(".overlay-meta");
    meta.textContent = item.meta || "";
    meta.hidden = !item.meta;

    var text = overlay.querySelector(".overlay-text");
    text.textContent = item.text || "";
    text.hidden = !item.text;

    var link = overlay.querySelector(".overlay-link");
    if (item.link) {
      link.href = item.link;
      link.textContent = item.linkLabel || "Open link";
      link.target = "_blank";
      link.rel = "noopener";
      link.hidden = false;
    } else {
      link.hidden = true;
    }

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    overlay.querySelector(".overlay-close").focus();
  }

  function closeDetail() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");

    /* Hand focus back to the dot that opened this. */
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDetail();
  });

  /* ---- Boot ---------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    var tree = document.querySelector("[data-tree]");
    if (tree) renderTree(tree);

    armReveal(document.querySelector("[data-reveal]"));

    document.querySelectorAll("[data-intro-img]").forEach(function (node) {
      var intro = data.intro || {};
      if (intro.image) node.src = intro.image;
      node.alt = intro.alt || "";
    });

    document.querySelectorAll("[data-name]").forEach(function (node) {
      node.textContent = (data.personal && data.personal.name) || "";
    });

    document.querySelectorAll("[data-name-short]").forEach(function (node) {
      var personal = data.personal || {};
      node.textContent = personal.short || personal.name || "";
    });

    document.querySelectorAll("[data-email]").forEach(function (node) {
      var mail = (data.personal && data.personal.email) || "";
      node.textContent = mail;
      node.href = "mailto:" + mail;
    });
  });

})();
