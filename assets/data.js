/* ===================================================================
 * data.js — 唯一需要编辑的文件 / the only file you edit to add content
 *
 *
 * The whole Outline page IS the tree below. One object = one circle.
 * Append to a children array, save, reload. No layout edits.
 *
 *   {
 *     title:  "点下面的标题 / label under the dot",   // required
 *     meta:   "年份、类型等小字 / small caps line",   // optional
 *     icon:   "assets/images/icons/xxx.png",         // optional — 留空则用渐变色块
 *     text:   "点开后浮层里的正文 / overlay body",    // optional
 *     link:   "https://...",                         // optional — 浮层里的外链
 *     linkLabel: "View repository",                  // optional — 外链文字
 *     children: [ ... ]                              // optional — 有则这个点可以展开
 *   }
 *
 * 有 children 的点：点击 = 展开/收起下一层。
 * 没有 children 的点：点击 = 打开详情浮层。
 * A dot with children toggles its branch; a dot without one opens the overlay.
 *
 * 可用的图标都在 assets/images/icons/ 里，文件名就是 icon 字段的值。
 * =================================================================== */

window.portfolioData = {

  /* ---- Personal ------------------------------------- */

  personal: {
    name: "Wyllie Fang",
    short: "Wyllie",
    email: "wylliefang@gmail.com",
  },

  /* ---- 页首的自我介绍大图 / the hero image --------------------- */

  intro: {
    image: "assets/images/self-intro.png",
    alt: "Wyllie Fang — self introduction",
  },

  /* ---- 树根 / the root dot ------------------------------------- */
  /* outlined circle, label inside it; click grows the two branches. */

  root: {
    icon: "assets/images/icons/ying_yang_1.png",
  },

  /* ---- 两条主干 / the two branches ----------------------------- */
  /* 这一层就是原来 outline 页的两个大圆 / the old hub circles */

  branches: [

    {
      title: "Career",
      meta: "",
      icon: "assets/images/icons/Helvetia.png",

      children: [
        {
          title: "Project 1",
          meta: "2026 · Web",
          icon: "assets/images/icons/circle_blue_perl.png",
          text: "Short description of the project, your role, and the stack",
          link: "https://github.com/",
          linkLabel: "View repository",
        },
        {
          title: "Project 2",
          meta: "2025 · Data",
          icon: "assets/images/icons/circle_crstalball.png",
          text: "....",
        },
        {
          title: "Project 3",
          meta: "2025 · Summer",
          icon: "assets/images/icons/circle_snipe.png",
          text: "....",
        },
      ],
    },

    {
      title: "Hobby",
      meta: "",
      icon: "assets/images/icons/words_1.png",

      children: [
        {
          title: "Film Roll 001",
          meta: "Portra 400 · Hawaii · 2025",
          icon: "assets/images/icons/circle_cocktail.png",
          text: "Cut-and-paste collage, magazine scraps on kraft paper.",
        },
        {
          title: "Collage No.3",
          meta: "Paper · 2026",
          icon: "assets/images/icons/circle_flower_1.png",
          text: "....",
        },
        {
          title: "Blueberry",
          meta: "Collection",
          icon: "assets/images/icons/circle_blueberry.png",
          text: "收藏品也是一个节点。icon 留空时会自动用渐变色块占位。",
        },
      ],
    },

  ],

};
