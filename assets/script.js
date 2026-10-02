/* ===================================================================
 * script.js — 渲染逻辑，通常不需要修改 / rendering logic
 *
 * 从 window.portfolioData 读出那棵树，生成嵌套的 <ul>/<li>。
 * 连线是纯 CSS 画的（style.css 里 .tree-item 的 ::before / ::after），
 * 所以这里完全不用算坐标 —— 窗口怎么缩放都不会错位。
 *
 * Builds nested <ul>/<li> from the tree in data.js. The connector
 * lines are pure CSS pseudo-elements, so there is no position math
 * here and nothing to recalculate on resize.
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

  /* 图片缺失时退回渐变色块 / fall back to a gradient disc */
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

  /* ---- 一个圆点 / one dot -------------------------------------- */

  function makeDot(item, variant, seed) {
    var dot = el("button", "dot " + variant);
    dot.type = "button";

    var disc = el("span", "dot-disc");
    /* 根节点是空心圆，不需要底图 / the root is an outline, no image */
    if (variant !== "is-root") paintDisc(disc, item.icon, seed);
    dot.appendChild(disc);

    var text = el("span", "dot-text");
    text.appendChild(el("span", "dot-label", item.title || ""));
    if (item.meta) text.appendChild(el("span", "dot-meta", item.meta));
    dot.appendChild(text);

    return dot;
  }

  /* ---- 把一个点和它下面那层接起来 / wire a dot to its branch ---- */

  function wire(dot, list) {
    dot.classList.add("has-kids");
    dot.setAttribute("aria-expanded", "false");

    /* 加 / − 角标，告诉人这个点可以展开 / the +/− affordance */
    var cue = el("span", "dot-cue");
    cue.setAttribute("aria-hidden", "true");
    dot.appendChild(cue);

    dot.addEventListener("click", function () {
      var wasOpen = dot.getAttribute("aria-expanded") === "true";

      dot.setAttribute("aria-expanded", wasOpen ? "false" : "true");
      dot.classList.toggle("is-open", !wasOpen);
      list.hidden = wasOpen;

      /* 展开后把新长出来的一层滚进视野 / scroll the new level into view */
      if (!wasOpen) {
        requestAnimationFrame(function () {
          list.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    });
  }

  /* ---- 一层节点 / one level of the tree ------------------------ */
  /* depth 1 = Career / Hobby 那层，再往下都是叶子
     depth 1 is the branch row; anything deeper is a leaf */

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
        /* 叶子节点 = 打开详情浮层 / a leaf opens the overlay */
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

  /* ---- 滚到树那一屏时再让 start 圆浮出来 / reveal on scroll ----- */

  function armReveal(stage) {
    if (!stage || !("IntersectionObserver" in window)) return;

    /* 先加 armed 再隐藏：没有 JS 的时候圆点是默认可见的
       class added by JS only, so the dot stays visible without JS */
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

  /* ---- 详情浮层 / detail overlay ------------------------------- */

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

    /* 焦点还回刚才点的那个圆 / hand focus back to the dot */
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDetail();
  });

  /* ---- 启动 / boot --------------------------------------------- */

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
