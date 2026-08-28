/* ===================================================================
 * script.js — 渲染逻辑，通常不需要修改 / rendering logic
 *
 * 从 window.portfolioData 读取数组，自动生成圆形节点。
 * Reads the arrays in data.js and builds one circle node per item.
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

  /* ---- Outline 页的两个大圆 / hub circles ---------------------- */

  function renderHubs(mount, items) {
    items.forEach(function (item, i) {
      var link = el("a", "hub");
      link.href = item.href;
      link.style.setProperty("--i", i);

      var disc = el("span", "hub-disc");
      paintDisc(disc, item.image, i + 1);

      link.appendChild(disc);
      link.appendChild(el("span", "hub-title", item.title));
      if (item.meta) link.appendChild(el("span", "hub-meta", item.meta));

      mount.appendChild(link);
    });
  }

  /* ---- 展厅节点 / gallery nodes -------------------------------- */

  function renderNodes(mount, items) {
    if (!items.length) {
      mount.appendChild(el("p", "empty", "还没有内容 · Nothing here yet."));
      return;
    }

    items.forEach(function (item, i) {
      var node = el("button", "node");
      node.type = "button";
      node.style.setProperty("--i", i);

      var disc = el("span", "node-disc");
      paintDisc(disc, item.image, i + 1);

      node.appendChild(disc);
      node.appendChild(el("span", "node-title", item.title));
      if (item.meta) node.appendChild(el("span", "node-meta", item.meta));

      node.addEventListener("click", function () {
        openDetail(item);
      });

      mount.appendChild(node);
    });
  }

  /* ---- 详情浮层 / detail overlay ------------------------------- */

  var overlay = null;

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

    var disc = overlay.querySelector(".overlay-disc");
    disc.className = "overlay-disc";
    disc.style.backgroundImage = "";
    paintDisc(disc, item.image, 3);

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
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDetail();
  });

  /* ---- 启动 / boot --------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    var hubs = document.querySelector("[data-hubs]");
    if (hubs) renderHubs(hubs, data.outline || []);

    var gallery = document.querySelector("[data-gallery]");
    if (gallery) renderNodes(gallery, data[gallery.dataset.gallery] || []);

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
