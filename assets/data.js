/* ===================================================================
 * data.js — 唯一需要编辑的文件 / the only file you edit to add content
 *
 * 有了新作品或照片，只要往下面对应的数组里追加一个对象，
 * 页面就会自动生成一个新的圆形节点，无需改动布局。
 *
 * Every object below becomes one circle node. Append, save, reload.
 *
 *   {
 *     title:  "节点标题 / node label",        // required
 *     meta:   "年份、类型等副标题 / subtitle", // optional
 *     image:  "assets/images/xxx.jpg",        // optional — 留空则用渐变色块
 *     text:   "点开后展示的正文 / detail body",// optional
 *     link:   "https://...",                  // optional — 详情页里的外链
 *     linkLabel: "View repository",           // optional — 外链文字
 *   }
 * =================================================================== */

window.portfolioData = {

  /* ---- 个人信息 / personal ------------------------------------- */

  personal: {
    name: "Wenxue (Wyllie) Fang",
    short: "Wyllie Fang",          // 第一页胶囊按钮里的名字 / cover capsule
    email: "zhengpri@gmail.com",
  },

  /* ---- Outline 页的两个大圆 / the two hub circles --------------- */

  outline: [
    {
      title: "Career",
      meta: "Software · Work",
      image: "assets/images/circle-career.jpg",
      href: "career.html",
    },
    {
      title: "Hobby",
      meta: "Film · Collage · Collection",
      image: "assets/images/circle-hobby.jpg",
      href: "hobby.html",
    },
  ],

  /* ---- Career 展厅：软件项目、代码作品、工作履历 ---------------- */

  career: [
    {
      title: "Project One",
      meta: "2026 · Web",
      image: "assets/images/project-1.jpg",
      text: "一句话说明这个项目做了什么、你负责哪部分、用了什么技术栈。",
      link: "https://github.com/",
      linkLabel: "View repository",
    },
    {
      title: "Project Two",
      meta: "2025 · Data",
      image: "assets/images/project-2.png",
      text: "Short description of the project, your role, and the stack.",
    },
    {
      title: "Internship",
      meta: "2025 · Summer",
      image: "",
      text: "工作履历也可以作为一个节点放在这里。",
    },
  ],

  /* ---- Hobby 展厅：胶片摄影、拼贴画、收藏品 -------------------- */

  hobby: [
    {
      title: "Film Roll 001",
      meta: "Portra 400 · Tokyo",
      image: "assets/images/film-1.jpg",
      text: "拍摄地点、机身、胶卷、当时的心情。",
    },
    {
      title: "Collage No.3",
      meta: "Paper · 2026",
      image: "assets/images/collage-3.jpg",
      text: "Cut-and-paste collage, magazine scraps on kraft paper.",
    },
    {
      title: "Blueberry",
      meta: "Collection",
      image: "",
      text: "收藏品也是一个节点。图片留空时会自动用渐变色块占位。",
    },
  ],

};
