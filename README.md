# Wyllie's Portfolio

A modern, minimal portfolio website built with Next.js 15, featuring Shopify Winter '26 inspired design aesthetics.

## 🎯 Features

- **3 Core Pages**: About, Projects, Media
- **Dynamic Navigation**: Center-to-corner animated navigation with scroll effects
- **Mouse Parallax**: Smooth background that follows cursor movement
- **GSAP Animations**: Scroll-triggered reveal effects
- **Lenis Smooth Scroll**: Buttery smooth scrolling experience
- **Shopify-Inspired Design**: Large typography, minimal colors, mix-blend-mode effects

## 📁 Project Structure

```
app/
├── page.tsx              → / (About)
├── projects/
│   └── page.tsx          → /projects
└── media/
    └── page.tsx          → /media

components/
├── CenterNavigation.tsx  → Animated navigation
├── ParallaxBackground.tsx → Mouse-driven background
└── sections/
    ├── AboutSection.tsx
    ├── ProjectsSection.tsx
    └── MediaSection.tsx

lib/
└── config.ts             → Content configuration (edit this!)
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## ✏️ Customization

### 1. Update Content

Edit `lib/config.ts` to modify all content:

```typescript
export const portfolioConfig = {
  personal: {
    name: "Your Name",
    email: "your@email.com",
  },

  navigation: [
    { id: "about", label: "About", roman: "I", href: "/" },
    { id: "projects", label: "Projects", roman: "II", href: "/projects" },
    { id: "media", label: "Media", roman: "III", href: "/media" },
  ],

  // Add your projects
  projects: [...],

  // Add media items
  media: {
    items: [...],
  },
};
```

### 2. Add Images

Place images in `public/assets/images/`:
- `my-avatar.png` - Your profile photo
- `project-X.jpg` - Project screenshots

### 3. Customize Colors

Edit `app/globals.css`:

```css
:root {
  --color-bg: #050505;
  --color-accent: #4FB3E8;
}
```

## 🎨 Design System

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Hero Size**: `clamp(4rem, 15vw, 18rem)`
- **Letter Spacing**: `0.3em` for uppercase text

### Colors
- **Background**: `#050505` (Pure black)
- **Text**: `#FAFAFA` (High contrast white)
- **Accent**: `#4FB3E8` (Sky blue)

### Effects
- **Mix Blend Mode**: Text adapts to background
- **Parallax**: Strength `0.03`, Smoothness `1.2`
- **Scroll Animations**: GSAP ScrollTrigger with `scrub: 1`

## 📱 Responsive Design

- **Desktop**: Full experience with all animations
- **Tablet**: Adjusted layout, preserved animations
- **Mobile**: Simplified stack layout

## 🧩 Adding New Pages

### 1. Create Page Directory
```bash
mkdir app/newpage
```

### 2. Create Page Component
```tsx
// app/newpage/page.tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import ParallaxBackground from "@/components/ParallaxBackground";
import CenterNavigation from "@/components/CenterNavigation";
import YourSection from "@/components/sections/YourSection";

export default function NewPage() {
  useSmoothScroll();

  return (
    <main className="relative">
      <ParallaxBackground />
      <CenterNavigation items={portfolioConfig.navigation} />
      <YourSection />
    </main>
  );
}
```

### 3. Update Navigation
```typescript
// lib/config.ts
navigation: [
  // ...existing items
  { id: "newpage", label: "New Page", roman: "IV", href: "/newpage" },
]
```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Fonts**: Google Fonts (Inter, Playfair Display)

## 📦 Key Dependencies

```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "gsap": "^3.12.5",
  "lenis": "^1.1.13",
  "tailwindcss": "^3.4.17"
}
```

## 🎯 Performance

- **Code Splitting**: Automatic per-page
- **Image Optimization**: Next.js Image component
- **Font Loading**: Optimized with `next/font`
- **Bundle Size**: ~400KB initial load

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Other Platforms
```bash
npm run build
# Deploy the .next folder
```

## 📄 License

MIT License - Feel free to use this template!

## 🙏 Credits

- Design Inspiration: Shopify Winter '26 Editions
- Built by: Wenxue (Wyllie) Fang
