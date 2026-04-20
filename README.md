# Entropyorder Homepage

公司官网前端项目。单页应用，部署到 GitHub Pages。

## 技术栈

- **框架**：React 18 + Vite 6
- **样式**：Tailwind CSS 3（深浅主题，见 `tailwind.config.js`）
- **动画**：framer-motion（tokens 在 `src/animations/tokens.js`）
- **3D / 粒子**：three.js + @react-three/fiber / drei
- **国际化**：i18next + react-i18next（中英文，`src/locales/`）
- **Markdown**：react-markdown（用于 Blog）
- **图标**：lucide-react

## 环境要求

- Node.js **20+**（CI 使用 Node 20）
- npm

## 快速开始

```bash
npm install
npm run dev         # 本地开发，http://localhost:5173
npm run build       # 生产构建，输出 dist/
npm run preview     # 预览构建产物
npm run lint        # ESLint 检查（--max-warnings 0）
```

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）自动构建并发布到 GitHub Pages。

构建时 `base` 被设为 `/Entropyorder/`（见 `vite.config.js`），本地开发使用 `/`。如要换仓库名需同步修改。

## 目录结构

```
src/
├── App.jsx                 # 顶层路由（tab 切换：home / blog / ai4ss）
├── main.jsx                # 入口，挂载 <App/> + 加载 i18n
├── i18n.js                 # i18next 初始化
├── index.css / App.css     # 全局样式
├── animations/             # framer-motion 预设、动画 tokens、滚动触发 hook
├── components/             # 业务组件
│   ├── Navbar / Hero / Footer
│   ├── Products / ProductCategory / DatasetCard / DatasetDetailModal
│   ├── ExpertDataValue / AI4SS4AI / Blog / Timeline
│   ├── ContactModal        # 样本申请弹窗
│   ├── ParticleCanvas.jsx  # three.js 粒子背景
│   └── Artifacts/          # 首页三张特色卡片（Agent/Expert/Multimodal）
├── data/datasets.js        # 数据集中央注册表（Products / Modal 共用）
├── hooks/                  # useTheme, useMediaQuery
└── locales/                # zh.json / en.json
public/
├── logo.png
└── papers/                 # 论文图表 PNG
```

## 关键约定

- **路由**：不使用 react-router，`App.jsx` 内通过 `activeTab` state 切换页面，Navbar 触发 `handleTabChange`。新增页面时在 `TAB_ORDER` 注册。
- **数据集**：所有数据集定义集中在 `src/data/datasets.js`，`Products`、`DatasetDetailModal`、`ContactModal` 均从该注册表读取。新增数据集只改这一处。
- **i18n**：文案统一放 `src/locales/{zh,en}.json`，组件中使用 `useTranslation()` 的 `t()`，不要硬编码中英文。
- **动画**：时长和缓动统一从 `animations/tokens.js` 读取；尊重 `prefers-reduced-motion`（`App.jsx` 已用 `useReducedMotion` + `MotionConfig`）。
- **主题**：通过 `useTheme` hook + Tailwind `dark:` 前缀，颜色 token 是 `page-bg` / `page-bg-dark` 等（`tailwind.config.js`）。
- **ESLint**：`--max-warnings 0`，提交前跑 `npm run lint`。

## 常见开发任务

| 任务 | 改什么 |
| --- | --- |
| 新增数据集 | `src/data/datasets.js` |
| 新增/修改文案 | `src/locales/zh.json` + `en.json` |
| 新增顶部 Tab 页面 | `App.jsx` 的 `TAB_ORDER` + 对应组件；`Navbar` 按钮 |
| 调整全局动画节奏 | `src/animations/tokens.js` |
| 换主色/背景色 | `tailwind.config.js` 的 theme.extend.colors |
| 替换 Hero 3D 背景 | `src/components/ParticleCanvas.jsx` / `Hero.jsx` |
