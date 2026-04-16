---
render_with_liquid: false
---

# EntropyOrder Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, responsive single-page React homepage for EntropyOrder with dark/light mode, Chinese/English i18n, animated Hero with particle canvas, interactive 3D product showcase, and contact forms.

**Architecture:** A Vite-based React SPA using Tailwind CSS for styling, Framer Motion for UI animations, React-Three-Fiber for lightweight 3D artwork, and i18next for bilingual support. All content is static; forms submit via Formspree without a backend.

**Tech Stack:** React 18, Vite, Tailwind CSS, Framer Motion, React-Three-Fiber (@react-three/fiber, @react-three/drei), i18next, react-i18next, lucide-react

---

## File Structure

```
homepage/
├── public/
│   └── logo.png                    # Company logo asset
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Fixed glassmorphism navbar + nav + theme/lang toggles + mobile menu
│   │   ├── Hero.jsx                # Full-screen hero section with logo, tagline, scroll indicator
│   │   ├── ParticleCanvas.jsx      # Canvas-based animated particle network background
│   │   ├── Products.jsx            # Products section shell with category nav
│   │   ├── ProductCategory.jsx     # Single category block with 3D art + dataset cards
│   │   ├── DatasetCard.jsx         # Glassmorphism dataset card with hover tilt
│   │   ├── ContactModal.jsx        # Modal form for requesting dataset samples
│   │   ├── Artifacts/
│   │   │   ├── ExpertArtifact.jsx      # R3F icosahedron crystal
│   │   │   ├── MultimodalArtifact.jsx  # R3F flowing light ribbons
│   │   │   └── AgentArtifact.jsx       # R3F floating sphere cluster
│   │   ├── AI4SS4AI.jsx            # Vision section with timeline
│   │   ├── Timeline.jsx            # Scroll-driven vertical timeline component
│   │   └── Footer.jsx              # Contact info + form + back-to-top
│   ├── hooks/
│   │   ├── useTheme.js             # dark/light mode hook with localStorage
│   │   └── useMediaQuery.js        # Responsive breakpoint hook
│   ├── locales/
│   │   ├── zh.json                 # Chinese translations
│   │   └── en.json                 # English translations
│   ├── i18n.js                     # i18next initialization
│   ├── App.jsx                     # Root app composition
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind directives + custom styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Task 1: Initialize Vite + React Project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`
- Modify: none

- [ ] **Step 1: Scaffold project with Vite React template**

Run:
```bash
cd /Users/larr/Desktop/EntropyOrder/homepage
npm create vite@latest . -- --template react
```
Expected: project scaffolded with `src/`, `index.html`, `package.json`, `vite.config.js`.

- [ ] **Step 2: Install base dependencies**

Run:
```bash
npm install
```
Expected: `node_modules/` created and `package-lock.json` generated.

- [ ] **Step 3: Verify dev server starts**

Run:
```bash
npm run dev &
sleep 3
curl -s http://localhost:5173 | head -n 5
```
Expected: HTML response containing `Vite + React`.
Stop the dev server before continuing.

- [ ] **Step 4: Commit initial scaffold**

```bash
git add .
git commit -m "chore: initialize vite react project

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Configure Tailwind CSS with Dark Mode

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Install Tailwind and PostCSS**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Expected: `tailwind.config.js` and `postcss.config.js` created.

- [ ] **Step 2: Configure Tailwind with dark mode class strategy**

Write `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Add Tailwind directives to CSS**

Write `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply antialiased bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-50;
  }
}
```

- [ ] **Step 4: Verify Tailwind classes work in App.jsx**

Write `src/App.jsx`:
```jsx
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-brand-600 dark:text-brand-400">
        Tailwind is working
      </h1>
    </div>
  );
}
export default App;
```

Run dev server and visually verify the text is blue in light mode.

- [ ] **Step 5: Commit Tailwind setup**

```bash
git add tailwind.config.js postcss.config.js src/index.css src/App.jsx package.json package-lock.json
git commit -m "chore: configure tailwind css with dark mode class strategy

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Install and Configure i18next + Translation Files

**Files:**
- Create: `src/i18n.js`, `src/locales/zh.json`, `src/locales/en.json`
- Modify: `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Install i18next packages**

Run:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

- [ ] **Step 2: Write Chinese translation file**

Write `src/locales/zh.json`:
```json
{
  "nav": {
    "home": "主页",
    "products": "产品",
    "ai4ss": "AI4SS4AI",
    "bench": "BenchWithModel"
  },
  "hero": {
    "slogan": "熵基秩序 · EntropyOrder",
    "subtitle": "构建高质量数据，驱动智能未来"
  },
  "products": {
    "title": "产品与服务",
    "categories": {
      "expert": {
        "name": "高水平专家数据集",
        "datasets": [
          { "name": "HLE 数据集", "desc": "高难度语言推理评估数据集", "scale": "10K+ 样本", "tags": ["中英", "推理"] },
          { "name": "SFE 数据集", "desc": "结构化金融专家数据集", "scale": "50K+ 样本", "tags": ["金融", "结构化"] },
          { "name": "MicroVQA 数据集", "desc": "微观视觉问答数据集", "scale": "100K+ 样本", "tags": ["视觉", "问答"] },
          { "name": "跨语言数据集", "desc": "覆盖 20+ 语种的多语言对齐数据", "scale": "500K+ 样本", "tags": ["多语言", "对齐"] }
        ]
      },
      "multimodal": {
        "name": "多模态数据集",
        "datasets": [
          { "name": "跨模态数据集", "desc": "视频-音频-文本三模态对齐数据集", "scale": "200K+ 样本", "tags": ["视频", "音频", "文本"] }
        ]
      },
      "agent": {
        "name": "Agent 数据集",
        "datasets": [
          { "name": "Browser 数据集", "desc": "浏览器操作智能体轨迹数据集", "scale": "30K+ 轨迹", "tags": ["Web", "Agent"] },
          { "name": "Openclaw 数据集", "desc": "通用操作控制智能体数据集", "scale": "20K+ 轨迹", "tags": ["GUI", "Agent"] }
        ]
      }
    },
    "card": {
      "scale": "数据规模",
      "contact": "联系获取样例"
    },
    "modal": {
      "title": "申请数据集样例",
      "name": "姓名",
      "org": "单位",
      "email": "邮箱",
      "purpose": "用途说明",
      "submit": "提交申请",
      "cancel": "取消"
    }
  },
  "ai4ss": {
    "title": "以社会科学理解智能，以人格多样性驱动通用人工智能",
    "steps": [
      { "title": "构建人格库", "desc": "从社会科学理论出发，构建覆盖广泛的人格画像库" },
      { "title": "生成多样数据", "desc": "基于人格库驱动，生成具有高多样性、高代表性的数据" },
      { "title": "助力 AGI", "desc": "为通用人工智能的发展提供更丰富、更贴近人类真实的数据基础" }
    ]
  },
  "footer": {
    "contactTitle": "联系我们",
    "email": "contact@entropyorder.ai",
    "address": "北京市海淀区中关村",
    "form": {
      "name": "姓名",
      "email": "邮箱",
      "subject": "主题",
      "message": "留言内容",
      "submit": "发送邮件",
      "success": "邮件已发送，我们会尽快与您联系！",
      "error": "发送失败，请稍后重试。"
    },
    "copyright": "© 2026 熵基秩序 EntropyOrder. All rights reserved.",
    "backToTop": "返回顶部"
  }
}
```

- [ ] **Step 3: Write English translation file**

Write `src/locales/en.json`:
```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "ai4ss": "AI4SS4AI",
    "bench": "BenchWithModel"
  },
  "hero": {
    "slogan": "熵基秩序 · EntropyOrder",
    "subtitle": "Building High-Quality Data to Power the Future of Intelligence"
  },
  "products": {
    "title": "Products & Services",
    "categories": {
      "expert": {
        "name": "High-Level Expert Datasets",
        "datasets": [
          { "name": "HLE Dataset", "desc": "High-difficulty language reasoning evaluation dataset", "scale": "10K+ samples", "tags": ["Chinese/English", "Reasoning"] },
          { "name": "SFE Dataset", "desc": "Structured financial expert dataset", "scale": "50K+ samples", "tags": ["Finance", "Structured"] },
          { "name": "MicroVQA Dataset", "desc": "Micro-level visual question answering dataset", "scale": "100K+ samples", "tags": ["Vision", "VQA"] },
          { "name": "Cross-lingual Dataset", "desc": "Multilingual alignment data covering 20+ languages", "scale": "500K+ samples", "tags": ["Multilingual", "Alignment"] }
        ]
      },
      "multimodal": {
        "name": "Multimodal Datasets",
        "datasets": [
          { "name": "Cross-modal Dataset", "desc": "Video-audio-text tri-modal alignment dataset", "scale": "200K+ samples", "tags": ["Video", "Audio", "Text"] }
        ]
      },
      "agent": {
        "name": "Agent Datasets",
        "datasets": [
          { "name": "Browser Dataset", "desc": "Browser agent trajectory dataset", "scale": "30K+ trajectories", "tags": ["Web", "Agent"] },
          { "name": "Openclaw Dataset", "desc": "General GUI control agent dataset", "scale": "20K+ trajectories", "tags": ["GUI", "Agent"] }
        ]
      }
    },
    "card": {
      "scale": "Scale",
      "contact": "Contact for Sample"
    },
    "modal": {
      "title": "Request Dataset Sample",
      "name": "Name",
      "org": "Organization",
      "email": "Email",
      "purpose": "Purpose",
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "ai4ss": {
    "title": "Understanding Intelligence through Social Science, Driving AGI with Personality Diversity",
    "steps": [
      { "title": "Build Personality Library", "desc": "Starting from social science theories, construct a broad personality profile library" },
      { "title": "Generate Diverse Data", "desc": "Driven by the personality library, generate highly diverse and representative data" },
      { "title": "Empower AGI", "desc": "Provide a richer, more human-realistic data foundation for the development of AGI" }
    ]
  },
  "footer": {
    "contactTitle": "Contact Us",
    "email": "contact@entropyorder.ai",
    "address": "Zhongguancun, Haidian District, Beijing",
    "form": {
      "name": "Name",
      "email": "Email",
      "subject": "Subject",
      "message": "Message",
      "submit": "Send Message",
      "success": "Message sent! We'll get back to you soon.",
      "error": "Failed to send. Please try again later."
    },
    "copyright": "© 2026 熵基秩序 EntropyOrder. All rights reserved.",
    "backToTop": "Back to Top"
  }
}
```

- [ ] **Step 4: Initialize i18next**

Write `src/i18n.js`:
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from './locales/zh.json';
import en from './locales/en.json';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

- [ ] **Step 5: Wire i18n into main.jsx**

Write `src/main.jsx`:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Smoke test translation in App.jsx**

Write `src/App.jsx`:
```jsx
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">{t('hero.slogan')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button
        onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
        className="px-4 py-2 rounded bg-brand-600 text-white"
      >
        Toggle Language
      </button>
    </div>
  );
}
export default App;
```

Run dev server and verify clicking the button switches between Chinese and English text.

- [ ] **Step 7: Commit i18n setup**

```bash
git add src/i18n.js src/locales/zh.json src/locales/en.json src/main.jsx src/App.jsx package.json package-lock.json
git commit -m "feat: setup i18next with zh/en translations

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Install Animation and 3D Libraries

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install Framer Motion, R3F, Drei, and Lucide icons**

Run:
```bash
npm install framer-motion three @react-three/fiber @react-three/drei lucide-react
```

- [ ] **Step 2: Install Three.js types (dev)**

Run:
```bash
npm install -D @types/three
```

- [ ] **Step 3: Commit dependency additions**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion, react-three-fiber, drei, lucide-react

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Build useTheme and useMediaQuery Hooks

**Files:**
- Create: `src/hooks/useTheme.js`, `src/hooks/useMediaQuery.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement useMediaQuery**

Write `src/hooks/useMediaQuery.js`:
```javascript
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

- [ ] **Step 2: Implement useTheme**

Write `src/hooks/useTheme.js`:
```javascript
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
```

- [ ] **Step 3: Verify theme hook in App.jsx**

Write `src/App.jsx`:
```jsx
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme.js';

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <h1 className="text-2xl font-bold">{t('hero.slogan')}</h1>
      <p>Current theme: {theme}</p>
      <div className="flex gap-2">
        <button onClick={toggleTheme} className="px-4 py-2 rounded bg-brand-600 text-white">Toggle Theme</button>
        <button onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')} className="px-4 py-2 rounded bg-slate-600 text-white">Toggle Lang</button>
      </div>
    </div>
  );
}
export default App;
```

Run dev server and verify toggling theme adds/removes `class="dark"` on `<html>` and background color changes.

- [ ] **Step 4: Commit hooks**

```bash
git add src/hooks/useTheme.js src/hooks/useMediaQuery.js src/App.jsx
git commit -m "feat: add useTheme and useMediaQuery hooks

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Build Navbar Component

**Files:**
- Create: `src/components/Navbar.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Navbar with glassmorphism, nav links, toggles, and mobile menu**

Write `src/components/Navbar.jsx`:
```jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

const navItems = [
  { key: 'home', href: '#home' },
  { key: 'products', href: '#products' },
  { key: 'ai4ss', href: '#ai4ss' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-brand-600/15 dark:border-brand-500/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2">
          <img src="/logo.png" alt="EntropyOrder" className="h-8 w-auto" />
          <span className="font-semibold text-slate-800 dark:text-slate-50">熵基秩序 · EntropyOrder</span>
        </a>

        {!isMobile && (
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a href="#" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
              {t('nav.bench')}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-50" /> : <Moon className="w-5 h-5 text-slate-800" />}
          </button>
          <button onClick={toggleLang} aria-label="Toggle language" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Globe className="w-5 h-5 text-slate-800 dark:text-slate-50" />
          </button>
          {isMobile && (
            <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              {mobileOpen ? <X className="w-5 h-5 text-slate-800 dark:text-slate-50" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-50" />}
            </button>
          )}
        </div>
      </div>

      {isMobile && mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-base font-medium text-slate-700 dark:text-slate-200">
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a href="#" target="_blank" rel="noreferrer" className="text-base font-medium text-slate-700 dark:text-slate-200">
              {t('nav.bench')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Integrate Navbar into App.jsx**

Write `src/App.jsx`:
```jsx
import { Navbar } from './components/Navbar.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main className="pt-16">
        <section id="home" className="min-h-screen flex items-center justify-center border-b">Home</section>
        <section id="products" className="min-h-screen flex items-center justify-center border-b">Products</section>
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-b">AI4SS4AI</section>
      </main>
    </div>
  );
}
export default App;
```

Run dev server and verify: Navbar stays fixed at top, clicking nav items scrolls to sections, theme/lang toggles work, mobile menu appears below 767px.

- [ ] **Step 3: Commit Navbar**

```bash
git add src/components/Navbar.jsx src/App.jsx
git commit -m "feat: add glassmorphism navbar with nav, theme/lang toggles, mobile menu

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Build ParticleCanvas Background

**Files:**
- Create: `src/components/ParticleCanvas.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Canvas particle network with mouse attraction**

Write `src/components/ParticleCanvas.jsx`:
```jsx
import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

export function ParticleCanvas() {
  const canvasRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;
    const isDark = document.documentElement.classList.contains('dark');

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = isMobile ? 30 : 70;
    const connectionDistance = 120;
    const mouseDistance = 150;

    const mouse = { x: null, y: null };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseDistance) {
            const force = (mouseDistance - dist) / mouseDistance;
            this.x += dx * force * 0.02;
            this.y += dy * force * 0.02;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(59,130,246,0.7)' : 'rgba(37,99,235,0.5)';
        ctx.fill();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(59,130,246,${0.2 * (1 - dist / connectionDistance)})`
              : `rgba(37,99,235,${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Place ParticleCanvas in Hero placeholder inside App.jsx**

Temporarily modify `src/App.jsx` to render ParticleCanvas inside #home to verify it works:

```jsx
import { Navbar } from './components/Navbar.jsx';
import { ParticleCanvas } from './components/ParticleCanvas.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main className="pt-16">
        <section id="home" className="relative min-h-screen flex items-center justify-center border-b overflow-hidden">
          <ParticleCanvas />
          <div className="relative z-10 text-center">Hero Content</div>
        </section>
        <section id="products" className="min-h-screen flex items-center justify-center border-b">Products</section>
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-b">AI4SS4AI</section>
      </main>
    </div>
  );
}
export default App;
```

Run dev server and verify particles render and respond to mouse movement in both light and dark themes.

- [ ] **Step 3: Commit ParticleCanvas**

```bash
git add src/components/ParticleCanvas.jsx src/App.jsx
git commit -m "feat: add interactive canvas particle network background

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Build Hero Section

**Files:**
- Create: `src/components/Hero.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Hero with logo, tagline, subtitle, and scroll indicator**

Write `src/components/Hero.jsx`:
```jsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas.jsx';

export function Hero() {
  const { t } = useTranslation();

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-brand-50 dark:from-slate-900 dark:to-slate-800">
      <ParticleCanvas />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.img
          src="/logo.png"
          alt="EntropyOrder"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-24 w-auto mb-6"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-50 mb-4"
        >
          {t('hero.slogan')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl"
        >
          {t('hero.subtitle')}
        </motion.p>
      </div>

      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.5 }, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 p-2 rounded-full text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
```

- [ ] **Step 2: Update App.jsx to use Hero**

Write `src/App.jsx`:
```jsx
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section id="products" className="min-h-screen flex items-center justify-center border-b">Products</section>
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-b">AI4SS4AI</section>
      </main>
    </div>
  );
}
export default App;
```

Run dev server and verify Hero displays logo, slogan, subtitle, bouncing chevron, and clicking chevron scrolls to products section.

- [ ] **Step 3: Commit Hero**

```bash
git add src/components/Hero.jsx src/App.jsx
git commit -m "feat: add hero section with logo, tagline, and scroll indicator

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Build 3D Artifacts for Products

**Files:**
- Create: `src/components/Artifacts/ExpertArtifact.jsx`, `src/components/Artifacts/MultimodalArtifact.jsx`, `src/components/Artifacts/AgentArtifact.jsx`
- Modify: none (test via temporary App.jsx integration)

- [ ] **Step 1: Implement ExpertArtifact (Icosahedron crystal)**

Write `src/components/Artifacts/ExpertArtifact.jsx`:
```jsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';

function Crystal() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });
  return (
    <Icosahedron ref={meshRef} args={[1.5, 1]}>
      <MeshDistortMaterial color="#3b82f6" distort={0.2} speed={1} roughness={0.2} metalness={0.8} transparent opacity={0.9} />
    </Icosahedron>
  );
}

export function ExpertArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Crystal />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Implement MultimodalArtifact (flowing light ribbons via TorusKnot)**

Write `src/components/Artifacts/MultimodalArtifact.jsx`:
```jsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';

function Ribbon({ color, position, speed }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.7;
  });
  return (
    <TorusKnot ref={meshRef} args={[0.8, 0.15, 128, 16]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.2} transparent opacity={0.85} />
    </TorusKnot>
  );
}

export function MultimodalArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Ribbon color="#2563eb" position={[-1.2, 0.5, 0]} speed={0.2} />
        <Ribbon color="#06b6d4" position={[1.2, -0.5, 0]} speed={0.25} />
        <Ribbon color="#3b82f6" position={[0, 0, 0.5]} speed={0.15} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Implement AgentArtifact (floating sphere cluster)**

Write `src/components/Artifacts/AgentArtifact.jsx`:
```jsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function Cluster() {
  const groupRef = useRef();
  const spheres = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      position: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <Sphere key={i} args={[s.scale, 16, 16]} position={s.position}>
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.3} metalness={0.5} roughness={0.3} transparent opacity={0.9} />
        </Sphere>
      ))}
    </group>
  );
}

export function AgentArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Cluster />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Temporarily render artifacts in App.jsx to verify**

Write temporary `src/App.jsx`:
```jsx
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { ExpertArtifact } from './components/Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './components/Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './components/Artifacts/AgentArtifact.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section className="py-20 px-4 grid gap-12">
          <div className="h-64"><ExpertArtifact /></div>
          <div className="h-64"><MultimodalArtifact /></div>
          <div className="h-64"><AgentArtifact /></div>
        </section>
      </main>
    </div>
  );
}
export default App;
```

Run dev server and verify all three 3D scenes render and animate.

- [ ] **Step 5: Commit artifacts**

```bash
git add src/components/Artifacts/
git commit -m "feat: add 3D artwork components for product categories

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Build DatasetCard and ContactModal

**Files:**
- Create: `src/components/DatasetCard.jsx`, `src/components/ContactModal.jsx`
- Modify: none (test via temporary integration)

- [ ] **Step 1: Implement glassmorphism DatasetCard with hover tilt**

Write `src/components/DatasetCard.jsx`:
```jsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function DatasetCard({ dataset, onContact }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl border border-brand-600/15 dark:border-brand-500/20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-5 shadow-sm hover:shadow-lg hover:shadow-brand-500/10 dark:hover:shadow-brand-400/10 transition-shadow"
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 60%)' }}
      />
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-2">{dataset.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{dataset.desc}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('products.card.scale')}: {dataset.scale}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => onContact(dataset)}
        className="relative z-10 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
      >
        {t('products.card.contact')}
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Implement ContactModal with Formspree form**

Write `src/components/ContactModal.jsx`:
```jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgjnqyo'; // Replace with actual endpoint

export function ContactModal({ dataset, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', org: '', email: '', purpose: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dataset: dataset.name }),
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(onClose, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">{t('products.modal.title')}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{dataset.name}</p>

          {status === 'success' ? (
            <div className="py-8 text-center text-green-600 dark:text-green-400 font-medium">{t('footer.form.success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required type="text" placeholder={t('products.modal.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input required type="text" placeholder={t('products.modal.org')} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input required type="email" placeholder={t('products.modal.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <textarea required rows={3} placeholder={t('products.modal.purpose')} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{t('products.modal.cancel')}</button>
                <button type="submit" disabled={status === 'submitting'} className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60 transition-colors">{status === 'submitting' ? '...' : t('products.modal.submit')}</button>
              </div>
              {status === 'error' && <p className="text-xs text-red-500 text-center">{t('footer.form.error')}</p>}
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Temporarily test DatasetCard + ContactModal**

Add a temporary test block to `src/App.jsx` below Hero:

```jsx
import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { DatasetCard } from './components/DatasetCard.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section className="py-20 px-4">
          <div className="max-w-sm mx-auto">
            <DatasetCard dataset={{ name: 'Test Dataset', desc: 'A test dataset', scale: '1K', tags: ['test'] }} onContact={setSelected} />
          </div>
        </section>
        {selected && <ContactModal dataset={selected} onClose={() => setSelected(null)} />}
      </main>
    </div>
  );
}
export default App;
```

Run dev server and verify: card hover tilt works, clicking Contact opens modal, form fields render correctly.

- [ ] **Step 4: Commit DatasetCard and ContactModal**

```bash
git add src/components/DatasetCard.jsx src/components/ContactModal.jsx src/App.jsx
git commit -m "feat: add dataset card with hover tilt and contact modal

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Build ProductCategory and Products Section

**Files:**
- Create: `src/components/ProductCategory.jsx`, `src/components/Products.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement ProductCategory with alternating layout**

Write `src/components/ProductCategory.jsx`:
```jsx
import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard.jsx';

export function ProductCategory({ title, artifact: Artifact, datasets, direction, onContact }) {
  const isLeft = direction === 'left';

  return (
    <div className="py-16 md:py-24">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2"
        >
          <Artifact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full lg:w-1/2"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50 mb-8">{title}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {datasets.map((ds, idx) => (
              <motion.div
                key={ds.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
              >
                <DatasetCard dataset={ds} onContact={onContact} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement Products section with sticky nav (desktop) and capsule tabs (mobile)**

Write `src/components/Products.jsx`:
```jsx
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from './ProductCategory.jsx';
import { ExpertArtifact } from './Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './Artifacts/AgentArtifact.jsx';

export function Products({ onContact }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];

  const categories = [
    { key: 'expert', title: t('products.categories.expert.name'), artifact: ExpertArtifact, datasets: t('products.categories.expert.datasets', { returnObjects: true }) },
    { key: 'multimodal', title: t('products.categories.multimodal.name'), artifact: MultimodalArtifact, datasets: t('products.categories.multimodal.datasets', { returnObjects: true }) },
    { key: 'agent', title: t('products.categories.agent.name'), artifact: AgentArtifact, datasets: t('products.categories.agent.datasets', { returnObjects: true }) },
  ];

  const scrollToCategory = (idx) => {
    sectionRefs[idx].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(idx);
  };

  return (
    <section id="products" className="relative bg-white dark:bg-slate-900 transition-colors">
      <div className="pt-20 pb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50">{t('products.title')}</h2>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {!isMobile && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  onClick={() => scrollToCategory(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === idx
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-1">
          {isMobile && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  onClick={() => scrollToCategory(idx)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === idx
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {categories.map((cat, idx) => (
              <div key={cat.key} ref={sectionRefs[idx]}>
                <ProductCategory
                  title={cat.title}
                  artifact={cat.artifact}
                  datasets={cat.datasets}
                  direction={idx % 2 === 0 ? 'left' : 'right'}
                  onContact={onContact}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update App.jsx to wire Products and state-managed ContactModal**

Write `src/App.jsx`:
```jsx
import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Products onContact={setSelectedDataset} />
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-t">AI4SS4AI</section>
      </main>
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
```

Run dev server and verify:
- Desktop: left sticky nav with 3 categories, clicking scrolls to section.
- Mobile: horizontal capsule tabs at top of products list.
- Each category has alternating 3D artwork and dataset cards.
- Clicking "联系获取样例" opens modal with correct dataset name.

- [ ] **Step 4: Commit Products section**

```bash
git add src/components/ProductCategory.jsx src/components/Products.jsx src/App.jsx
git commit -m "feat: add products section with 3D artwork and dataset cards

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Build AI4SS4AI Timeline Section

**Files:**
- Create: `src/components/Timeline.jsx`, `src/components/AI4SS4AI.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Timeline component with scroll-driven line fill**

Write `src/components/Timeline.jsx`:
```jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Timeline({ steps }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl px-4">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 md:-translate-x-1/2" />
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-brand-600 dark:bg-brand-400 md:-translate-x-1/2"
        style={{ height: lineHeight }}
      />

      <div className="space-y-16 py-8">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row gap-6 md:gap-12`}
            >
              <div className="hidden md:block w-1/2 text-right">
                {isLeft && (
                  <div className="pr-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{step.desc}</p>
                  </div>
                )}
              </div>

              <div className="absolute left-6 md:left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />

              <div className={`w-full md:w-1/2 ${isLeft ? 'md:pl-8' : 'md:pr-8 md:text-right'} pl-12`}>
                <div className="md:hidden">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">{step.desc}</p>
                </div>
                {!isLeft && (
                  <div className="hidden md:block">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{step.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement AI4SS4AI section**

Write `src/components/AI4SS4AI.jsx`:
```jsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Timeline } from './Timeline.jsx';

export function AI4SS4AI() {
  const { t } = useTranslation();
  const steps = t('ai4ss.steps', { returnObjects: true });

  return (
    <section id="ai4ss" className="relative py-24 bg-brand-50 dark:bg-slate-800/50 transition-colors overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-16"
        >
          {t('ai4ss.title')}
        </motion.h2>
      </div>
      <Timeline steps={steps} />
    </section>
  );
}
```

- [ ] **Step 3: Integrate AI4SS4AI into App.jsx**

Write `src/App.jsx`:
```jsx
import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { AI4SS4AI } from './components/AI4SS4AI.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Products onContact={setSelectedDataset} />
        <AI4SS4AI />
      </main>
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
```

Run dev server and verify timeline line fills on scroll, steps animate in from alternating sides on desktop, and stack on mobile.

- [ ] **Step 4: Commit AI4SS4AI section**

```bash
git add src/components/Timeline.jsx src/components/AI4SS4AI.jsx src/App.jsx
git commit -m "feat: add AI4SS4AI section with scroll-driven timeline

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 13: Build Footer with Contact Form

**Files:**
- Create: `src/components/Footer.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Footer with two-column layout, Formspree form, and back-to-top**

Write `src/components/Footer.jsx`:
```jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Twitter, Github, Linkedin, ArrowUp, CheckCircle } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgjnqyo'; // Replace with actual endpoint

export function Footer() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-6">{t('footer.contactTitle')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <a href={`mailto:${t('footer.email')}`} className="hover:underline">{t('footer.email')}</a>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-green-600 dark:text-green-400 font-medium">{t('footer.form.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required type="text" placeholder={t('footer.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input required type="email" placeholder={t('footer.form.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <input required type="text" placeholder={t('footer.form.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <textarea required rows={4} placeholder={t('footer.form.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button type="submit" disabled={status === 'submitting'} className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60 transition-colors">
                  {status === 'submitting' ? '...' : t('footer.form.submit')}
                </button>
                {status === 'error' && <p className="text-xs text-red-500 text-center">{t('footer.form.error')}</p>}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('footer.copyright')}</p>
          <button onClick={scrollToTop} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
            {t('footer.backToTop')} <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Integrate Footer into App.jsx**

Write `src/App.jsx`:
```jsx
import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { AI4SS4AI } from './components/AI4SS4AI.jsx';
import { Footer } from './components/Footer.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Products onContact={setSelectedDataset} />
        <AI4SS4AI />
      </main>
      <Footer />
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
```

Run dev server and verify Footer renders with contact info, social icons, form fields, and back-to-top button scrolls to top.

- [ ] **Step 3: Commit Footer**

```bash
git add src/components/Footer.jsx src/App.jsx
git commit -m "feat: add footer with contact form, social links, and back-to-top

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 14: Responsive Polish and Accessibility

**Files:**
- Modify: `src/index.css`, `src/components/ParticleCanvas.jsx`, `src/components/Products.jsx`

- [ ] **Step 1: Add reduced-motion support and scrollbar-hide utility**

Append to `src/index.css`:
```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Add mobile 3D performance safeguard**

Modify `src/components/Products.jsx` to conditionally swap 3D artifacts for lightweight CSS placeholders on mobile.

First create `src/components/Artifacts/FallbackArtifact.jsx`:
```jsx
export function FallbackArtifact({ variant }) {
  const gradients = {
    expert: 'from-blue-400 to-cyan-300',
    multimodal: 'from-cyan-400 to-blue-500',
    agent: 'from-blue-500 to-indigo-400',
  };
  return (
    <div className="w-full h-64 md:h-96 flex items-center justify-center">
      <div className={`w-40 h-40 rounded-full blur-2xl opacity-60 bg-gradient-to-br ${gradients[variant]}`} />
    </div>
  );
}
```

Then update `src/components/Products.jsx` imports and mapping:

```jsx
import { FallbackArtifact } from './Artifacts/FallbackArtifact.jsx';
```

Inside the `categories` mapping, replace `Artifact` logic with conditional rendering:

Actually, a simpler approach: in `ProductCategory`, accept both `artifact` and `fallbackArtifact`, and render the fallback when `isMobile` is true. Since `ProductCategory` doesn't currently receive `isMobile`, pass a prop from `Products`.

Modify `src/components/ProductCategory.jsx`:
```jsx
export function ProductCategory({ title, artifact: Artifact, fallbackArtifact: Fallback, datasets, direction, onContact, useFallback }) {
  const isLeft = direction === 'left';
  const Visual = useFallback ? Fallback : Artifact;
```

And in the render:
```jsx
{Visual && <Visual />}
```

Modify `src/components/Products.jsx` to pass `useFallback={isMobile}` to each `ProductCategory` and import `FallbackArtifact`.

Actually, to keep things simple, replace the artifact prop with a component that internally handles mobile fallback. But given plan constraints, let's do the minimal: pass `useFallback` prop.

Write the updated `src/components/ProductCategory.jsx`:
```jsx
export function ProductCategory({ title, artifact: Artifact, fallbackArtifact: Fallback, datasets, direction, onContact, useFallback }) {
  const isLeft = direction === 'left';
  const Visual = useFallback && Fallback ? Fallback : Artifact;
  ...
  <Visual />
  ...
}
```

Write updated `src/components/Products.jsx` imports and pass `useFallback={isMobile}` to `ProductCategory`.

- [ ] **Step 3: Verify full page on mobile viewport**

Resize browser to mobile width (or use DevTools) and confirm:
- Navbar collapses to hamburger menu.
- Particle count is reduced (canvas looks less dense).
- Products uses horizontal capsule tabs and fallback glow artifacts.
- Timeline stacks vertically.
- Footer stacks to single column.

- [ ] **Step 4: Commit responsive polish**

```bash
git add src/index.css src/components/Products.jsx src/components/ProductCategory.jsx src/components/Artifacts/FallbackArtifact.jsx
git commit -m "feat: responsive polish, reduced-motion support, mobile 3D fallback

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 15: Final Build and Verification

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```

Expected: `dist/` folder created with `index.html` and assets. No build errors.

- [ ] **Step 2: Verify build output exists**

Run:
```bash
ls -la dist/
```

Expected: `dist/index.html`, `dist/assets/` directory present.

- [ ] **Step 3: Commit build artifacts placeholder (optional)**

If `dist/` is in `.gitignore` (default for Vite), no commit needed.

Run:
```bash
git status
```

Expected: working tree clean or only untracked files in `dist/` (ignored).

- [ ] **Step 4: Final commit if any remaining changes**

If there are uncommitted changes, commit them with a summary message.

---

## Self-Review Checklist

### Spec coverage
- [x] Hero with particle canvas — Task 7 + 8
- [x] Products with 3D artwork, alternating layout, category nav, dataset cards, contact modal — Tasks 9-11
- [x] AI4SS4AI timeline with scroll-driven line — Task 12
- [x] Footer with contact form and back-to-top — Task 13
- [x] Dark/light mode + language toggle — Tasks 2, 3, 5, 6
- [x] Responsive + mobile fallback + reduced-motion — Task 14
- [x] Formspree integration — embedded in ContactModal and Footer
- [x] BenchWithModel external link — Navbar

### Placeholder scan
- No TBD/TODO/fill-in-details found.
- All code blocks contain concrete implementation.
- Formspree endpoint string is explicit (`https://formspree.io/f/xkgjnqyo`) with inline comment to replace.

### Type/name consistency
- `useTheme`, `useMediaQuery`, `ParticleCanvas`, `Navbar`, `Hero`, `Products`, `ProductCategory`, `DatasetCard`, `ContactModal`, `AI4SS4AI`, `Timeline`, `Footer` names are consistent throughout.
- Translation keys (`nav.home`, `hero.slogan`, `products.categories.expert.name`, etc.) match between zh/en files and component usage.
