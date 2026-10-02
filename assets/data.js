/* ===================================================================
 * data.js — 唯一需要编辑的文件 / the only file you edit to add content
 *
 * 整个 Outline 页就是下面这棵树。每一个对象 = 页面上一个圆点。
 * 往 children 里追加一个对象，树上就多长一个点，布局不用改。
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

  /* ---- 个人信息 / personal ------------------------------------- */

  personal: {
    name: "Wenxue (Wyllie) Fang",
    short: "Wyllie Fang",
    email: "wylliefang@gmail.com",
  },

  /* ---- 页首的自我介绍大图 / the hero image --------------------- */

  intro: {
    image: "assets/images/self-intro.png",
    alt: "Wenxue (Wyllie) Fang — self introduction",
  },

  /* ---- 树根 / the root dot ------------------------------------- */
  /* 空心圆，文字写在圆圈里面。点一下长出下面两条主干。
     outlined circle, label inside it; click grows the two branches. */

  root: {
    title: "Start",
  },

  /* ---- 两条主干 / the two branches ----------------------------- */
  /* 这一层就是原来 outline 页的两个大圆 / the old hub circles */

  branches: [

    {
      title: "Career",
      meta: "Software · Work",
      icon: "assets/images/icons/circle_clock.png",

      children: [
        {
          title: "Project One",
          meta: "2026 · Web",
          icon: "assets/images/icons/circle_blue_perl.png",
          text: "一句话说明这个项目做了什么、你负责哪部分、用了什么技术栈。",
          link: "https://github.com/",
          linkLabel: "View repository",
        },
        {
          title: "Project Two",
          meta: "2025 · Data",
          icon: "assets/images/icons/circle_crstalball.png",
          text: "Short description of the project, your role, and the stack.",
        },
        {
          title: "Internship",
          meta: "2025 · Summer",
          icon: "assets/images/icons/circle_snipe.png",
          text: "工作履历也可以作为一个节点放在这里。",
        },
      ],
    },

    {
      title: "Hobby",
      meta: "Film · Collage · Collection",
      icon: "assets/images/icons/circle_cocktail.png",

      children: [
        {
          title: "Film Roll 001",
          meta: "Portra 400 · Tokyo",
          icon: "assets/images/icons/circle_watermelon.png",
          text: "拍摄地点、机身、胶卷、当时的心情。",
        },
        {
          title: "Collage No.3",
          meta: "Paper · 2026",
          icon: "assets/images/icons/circle_flower_1.png",
          text: "Cut-and-paste collage, magazine scraps on kraft paper.",
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
