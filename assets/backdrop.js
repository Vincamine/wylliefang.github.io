/* ===================================================================
 * backdrop.js — Cargo「Backdrop: Parallax」的本地还原
 *
 * 1. 空间与景深：7 层同一张图，平面被 rotate(50°) skew(-50°) 切成
 *    斜向的画布；层与层之间有静态错位 (Spread)，做出厚度。
 * 2. 几何遮罩：整块背景透过一个 171°、85% 大小、0% 羽化的三角形
 *    Knockout Mask 显示，边缘锐利。
 * 3. 动态视差：鼠标移动时 7 层沿 285° 方向平滑位移，越靠前的层
 *    位移越大 —— 这就是「透过视窗看三维空间」的错觉。
 *
 * rotate/skew 作用在「图层这块平面」上，平面内部的照片反向变形
 * 抵消回正 —— 所以看到的是一叠倾斜的色块，而不是被剪切到认不出
 * 来的照片。
 *
 * The rotate/skew shapes the LAYER PLANE; the photo inside is
 * counter-transformed so the bitmap itself stays undistorted.
 * =================================================================== */

/* ---- 1. 配置参数（对应 Cargo 面板数值）------------------------- */

const CONFIG = {
  layersCount: 7,
  speed: 0.20,       // 20%
  depth: 0.30,       // 30%
  sensitivity: 0.68, // 68%
  directionDeg: 285, // 285°
  baseRotation: 50,  // 50°
  skew: -50,         // -50°

  /* false = 照片保持不变形，倾斜只体现在图层边缘（推荐）
     true  = 照片本身跟着 rotate/skew 一起被剪切（Cargo 的原始行为，
             在 50° / -50° 这种数值下照片会糊到认不出）
     false keeps the photo upright; true shears the bitmap too */
  distortImage: false,

  // 标定基准 (可根据实际视觉效果微调)
  reach: 260,
  spread: 150,

  /* 图层平面相对「刚好盖住蒙版」的比例 —— 决定倾斜到底看不看得见。
     1.0 = 平面大到边缘永远在画外，只剩一张正的照片，rotate/skew 白做了
     0.x = 平面收小，7 条倾斜的边切进画面，这才是「多层倾斜网格」
     how far the tilted layer edges cut into frame; 1 hides them entirely */
  planeFit: 0.68,

  /* 位移的平滑系数：每帧向目标靠拢的比例。
     越小越「黏」，越大越跟手。0 = 不平滑，直接吸附鼠标。
     easing factor per frame — this is what makes the motion smooth */
  ease: 0.085,

  // 图片与 Knockout Mask
  image: "assets/images/intro.png",
  knockout: {
    shape: "triangle", // triangle | square | circle
    size: 85,          // Knockout Size     (%)
    rotation: 171,     // Knockout Rotation (deg)
    blur: 0,           // Knockout Blur     (%)
    invert: false,     // true = 挖掉形状，其余可见
  },

  /* 最后层 → 最前层的不透明度。
     最前层不能是 1：7 张同样大小的图叠在一起，
     只要最前面那张不透明，后面 6 层就永远看不见。
     the front layer must stay < 1, or it hides the six behind it */
  opacityRange: [0.18, 0.62],

  overlayColor: null, // 例 "rgba(28,26,23,.2)"
};

/* ---- 2. 角度转弧度计算向量方向 -------------------------------- */

const rad = (CONFIG.directionDeg * Math.PI) / 180;
const dirX = Math.cos(rad);
const dirY = Math.sin(rad);

const totalLayers = CONFIG.layersCount;

/* 层级归一化 0（最后层）→ 1（最前层）/ back to front, 0…1 */
function layerT(index) {
  return totalLayers === 1 ? 1 : index / (totalLayers - 1);
}

/* M = R(θ)·SkewX(φ)，图层平面的变形矩阵 / the layer-plane matrix */
function planeMatrix() {
  const c = Math.cos((CONFIG.baseRotation * Math.PI) / 180);
  const s = Math.sin((CONFIG.baseRotation * Math.PI) / 180);
  const k = Math.tan((CONFIG.skew * Math.PI) / 180);
  return { a: c, b: c * k - s, d: s, e: s * k + c };
}

/* ---- 建立图层 / build the layers ------------------------------ */

/* 结构 / structure:
     .parallax-layer  ← 平面：translate + rotate + skew，overflow hidden
       .parallax-tile ← 照片：skew⁻¹ + rotate⁻¹，把变形抵消掉        */

const host = document.querySelector("[data-backdrop]");
const layers = [];
const tiles = [];

if (host) {
  for (let i = 0; i < totalLayers; i++) {
    const layer = document.createElement("div");
    layer.className = "parallax-layer";

    const [lo, hi] = CONFIG.opacityRange;
    layer.style.opacity = (lo + (hi - lo) * layerT(i)).toFixed(3);

    const tile = document.createElement("div");
    tile.className = "parallax-tile";
    tile.style.backgroundImage = `url("${CONFIG.image}")`;

    layer.appendChild(tile);
    host.appendChild(layer);

    layers.push(layer);
    tiles.push(tile);
  }

  if (CONFIG.overlayColor) {
    const wash = document.createElement("div");
    wash.className = "backdrop-overlay";
    wash.style.background = CONFIG.overlayColor;
    host.appendChild(wash);
  }
}

/* ---- Knockout 蒙版 / knockout mask ---------------------------- */

/* 按容器实际像素生成 SVG，三角形在任何宽高比下都不会被拉变形 */
function maskUrl(w, h, k) {
  const cx = w / 2;
  const cy = h / 2;
  const r = (Math.min(w, h) * (k.size / 100)) / 2;
  let body;

  if (k.shape === "circle") {
    body = `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}"`;
  } else {
    const sides = k.shape === "square" ? 4 : 3;
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = ((-90 + k.rotation + (i * 360) / sides) * Math.PI) / 180;
      pts.push(
        `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
      );
    }
    body = `<polygon points="${pts.join(" ")}"`;
  }

  /* blur 以短边百分比换算成 stdDeviation；0% 时不加 filter，
     保留锐利的几何切割线 / blur 0 keeps the cut hard-edged */
  const blur = (k.blur / 100) * Math.min(w, h) * 0.25;
  let defs = "";
  if (blur > 0) {
    defs =
      `<filter id="b" x="-50%" y="-50%" width="200%" height="200%">` +
      `<feGaussianBlur stdDeviation="${blur.toFixed(1)}"/></filter>`;
    body += ` filter="url(#b)"`;
  }

  const ground = k.invert ? `<rect width="${w}" height="${h}" fill="#fff"/>` : "";
  body += ` fill="${k.invert ? "#000" : "#fff"}"/>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    defs + ground + body + `</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* ---- 位移量 / how far a layer can travel ---------------------- */

/* 鼠标推到最边上时的位移 + 层间静态错位，单位 px（屏幕坐标） */
const amplitude = CONFIG.reach * CONFIG.speed * CONFIG.sensitivity;

const maxTravel =
  (Math.abs(dirX) + Math.abs(dirY)) * amplitude +
  0.5 * CONFIG.spread * CONFIG.depth;

/* ---- 图层平面要多大 / how big the layer plane must be ---------- */

/* 平面被 rotate + skew 之后会转出画面，得先做大一点才盖得住蒙版。
   把「蒙版外接圆 + 最大位移」用 M⁻¹ 映射回平面自身坐标系取包围盒。
   注意是放大元素尺寸，不是 scale() —— scale 会把里面的照片也放大。 */
function planeSize(w, h) {
  const { a, b, d, e } = planeMatrix();
  const det = a * e - b * d;
  if (!det) return { pw: w, ph: h };

  const ia = e / det, ib = -b / det;   // M⁻¹
  const ic = -d / det, id = a / det;

  const radius = CONFIG.knockout.invert
    ? Math.hypot(w, h) / 2
    : (Math.min(w, h) * (CONFIG.knockout.size / 100)) / 2;

  /* 图层中心最远会离开容器中心 maxTravel，
     所以相对图层自己要盖住半径 radius + maxTravel 的圆。
     planeFit < 1 时故意收小，让倾斜的平面边缘露进画面。 */
  const reachOut = (radius + maxTravel) * CONFIG.planeFit;

  const pw = 2 * reachOut * Math.hypot(ia, ib);
  const ph = 2 * reachOut * Math.hypot(ic, id);

  /* planeFit = 1 时再兜一层底，保证任何宽高比下都不漏边
     only pad up to the container when we mean to cover completely */
  return CONFIG.planeFit >= 1
    ? { pw: Math.max(w, pw), ph: Math.max(h, ph) }
    : { pw, ph };
}

/* ---- 照片反变形后要多大 / counter-transformed tile scale ------- */

/* 照片被 M⁻¹ 转回正之后，还要填满平面这块 pw×ph 的矩形，
   所以按 M 映射平面四角取包围盒。 */
function tileScale(pw, ph) {
  if (CONFIG.distortImage) return 1;
  const { a, b, d, e } = planeMatrix();
  const halfW = (Math.abs(a) * pw + Math.abs(b) * ph) / 2;
  const halfH = (Math.abs(d) * pw + Math.abs(e) * ph) / 2;
  return Math.max(1, (2 * halfW) / pw, (2 * halfH) / ph);
}

let plane = { pw: 0, ph: 0 };

function measure() {
  if (!host) return;
  const w = host.offsetWidth;
  const h = host.offsetHeight;
  if (!w || !h) return;

  const mask = maskUrl(w, h, CONFIG.knockout);
  host.style.webkitMaskImage = mask;
  host.style.maskImage = mask;

  plane = planeSize(w, h);
  const s = tileScale(plane.pw, plane.ph);

  layers.forEach((layer) => {
    layer.style.width = plane.pw.toFixed(1) + "px";
    layer.style.height = plane.ph.toFixed(1) + "px";
  });

  /* 照片反向变形，把平面的 rotate/skew 抵消掉
     (R·S)⁻¹ = S⁻¹·R⁻¹ → 先 skew(-φ) 再 rotate(-θ) */
  tiles.forEach((tile) => {
    tile.style.transform = CONFIG.distortImage
      ? "none"
      : `skew(${-CONFIG.skew}deg) rotate(${-CONFIG.baseRotation}deg) scale(${s.toFixed(4)})`;
  });

  render(current);
}

/* ---- 3. 遍历 7 个图层，分层施加 CSS Transform 变形 ------------- */

/* baseOffset ∈ [-√2, √2]：鼠标位置在 285° 方向上的投影 */
function render(baseOffset) {
  layers.forEach((layer, index) => {
    const t = layerT(index);

    /* 每层速度不同才叫视差：最后层慢 (1-depth)，最前层满速
       different speed per layer — this is what makes it parallax */
    const shift = baseOffset * amplitude * (1 - CONFIG.depth * (1 - t));

    /* 层间静态错位，让 7 层不是完全重合的一张图 */
    const stagger = (t - 0.5) * CONFIG.spread * CONFIG.depth;

    const d = shift + stagger;

    /* translate 必须写在 rotate / skew 前面：
       CSS transform 是从右往左作用的，写在后面的话位移会被
       rotate·skew 矩阵再乘一次，方向和幅度全都跑偏。
       translate goes FIRST, or the matrix rewrites the direction */
    layer.style.transform =
      `translate(-50%, -50%) ` +
      `translate(${(d * dirX).toFixed(2)}px, ${(d * dirY).toFixed(2)}px) ` +
      `rotate(${CONFIG.baseRotation}deg) ` +
      `skew(${CONFIG.skew}deg)`;
  });
}

/* ---- 4. 监听鼠标移动，实时计算偏移 ---------------------------- */

/* current 每帧向 target 靠拢，位移是「平滑的响应」而不是硬吸附。
   current eases toward target — the motion reads as smooth, not snappy */
let current = 0;
let target = 0;
let running = false;

function tick() {
  const diff = target - current;

  /* 足够接近就停下，别让 rAF 一直空转 / park the loop when settled */
  if (Math.abs(diff) < 0.0005) {
    current = target;
    render(current);
    running = false;
    return;
  }

  current += diff * CONFIG.ease;
  render(current);
  requestAnimationFrame(tick);
}

function start() {
  if (running) return;
  running = true;
  requestAnimationFrame(tick);
}

const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (host && !still) {
  window.addEventListener(
    "pointermove",
    (e) => {
      // 鼠标在窗口中的归一化坐标 (-1 → 1)
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // 投影到 285° 方向上，只留一个标量 / project onto the 285° axis
      target = mouseX * dirX + mouseY * dirY;
      start();
    },
    { passive: true }
  );

  /* 鼠标离开窗口就慢慢回到中位 / drift back to centre on leave */
  document.addEventListener("pointerleave", () => {
    target = 0;
    start();
  });
}

/* resize 也压到一帧一次 / one measure per frame on resize */
let resizeQueued = false;

window.addEventListener(
  "resize",
  () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      measure();
    });
  },
  { passive: true }
);

measure();
