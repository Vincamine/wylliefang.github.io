/* ===================================================================
 * data.js — the only file you edit to add content
 *
 * The whole Outline page IS the tree below. One object = one circle
 * on the page. Append an object to a children array, save, reload —
 * a new dot grows and the layout never needs touching.
 *
 *   {
 *     title:  "label under the dot",        // required
 *     meta:   "small caps line: year, type" // optional
 *     icon:   "assets/images/icons/x.png",  // optional — empty = gradient disc
 *     text:   "body copy in the overlay",   // optional
 *     link:   "https://...",                // optional — outbound link in the overlay
 *     linkLabel: "View repository",         // optional — that link's text
 *     children: [ ... ]                     // optional — if present, the dot expands
 *   }
 *
 * A dot WITH children toggles its branch open and closed.
 * A dot WITHOUT children opens the detail overlay.
 *
 * The available icons all live in assets/images/icons/ — the filename
 * is exactly what the icon field takes.
 * =================================================================== */

window.portfolioData = {

  /* ---- Personal ------------------------------------- */

  personal: {
    name: "Wyllie Fang",
    short: "Wyllie",
    email: "wylliefang@gmail.com",
  },

  /* ---- The self-introduction image at the top of the page ------ */

  intro: {
    image: "assets/images/self-intro.png",
    alt: "Wyllie Fang — self introduction",
  },

  /* ---- The root dot -------------------------------------------- */
  /* outlined circle, label inside it; click grows the two branches. */

  root: {
    icon: "assets/images/icons/ying_yang_1.png",
  },

  /* ---- The two branches ---------------------------------------- */
  /* This level is what used to be the two hub circles on the old
     outline page. */

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
          text: "A collected object is a node too. Leave icon empty and\n            a gradient disc stands in for the image.",
        },
      ],
    },

  ],

};
