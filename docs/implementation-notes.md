# Implementation notes

## 2026-11-11 — Data viz (Three.js) + Footer WebGL

### 本轮完成

- 新增 `src/scripts/home/dataviz.js`：Home data-viz 的 Three.js 场景、滚动驱动、DOM 可见性切换、清理。
- 新增 `src/scripts/footer-canvas.js`：从 `.scratch/34zl8se8l5ddc.js` 移植的 footer 透视网格 shader（`uGridScale` / `uPointer` / `uTime` 等 uniform 原样保留）。
- 修改 `src/components/sections/DataViz.astro`：在 container 内加一层 `.data-viz-section__sticky`，把 canvas、bottom 文案、center CTA 放进同一个 100svh 舞台。
- 修改 `src/styles/overrides.css`：舞台尺寸、canvas 绝对定位、center 初始 `opacity:0;visibility:hidden`。
- 修改 `src/scripts/app.js`：home 分支 `initDataViz()`；所有页面 `initFooterCanvas()`。

### Data viz 实现要点

- `WebGLRenderer({ alpha:true, antialias:true, preserveDrawingBuffer:true })`，pixelRatio `min(dpr,2)`；`ResizeObserver` 跟随 `[data-dataviz-canvas]`。
- `OrthographicCamera(-w/2, w/2, h/2, -h/2)`，世界单位 = CSS 像素。
- 4 条 `CatmullRomCurve3`，每条采样 100 点；每条曲线有 expanded / converged 两组控制点，滚动时逐点插值。
- 曲线用 `Line + LineBasicMaterial`（#51e076，透明）；标签用 `troika-three-text` 的 `Text`，字体 `/fonts/BasicallyAMono_Bold.woff`，字号约 13px（375 下约 10.7px），白色、居中锚点。
- 右中发光点 = additive Sprite 光晕 + 绿色圆 + 白色内核；50% 时在 CONSULTING 末端，100% 时随曲线汇聚到画面中心。
- 滚动：`ScrollTrigger.create({ trigger:'.data-viz-section', start:'top top', end:'bottom bottom', pin: stage, pinSpacing:false, scrub:1 })`，反向天然可逆。
- 为什么不用 `position:sticky`：`.page__content` 是 `overflow:hidden`，会成为 sticky 的滚动容器，sticky 实际不生效；因此改为 GSAP pin 整个舞台（任务允许「pin container」）。
- DOM 状态：progress 0 时 center 隐藏、bottom 也隐藏（对齐原站 0% 截图）；0.06→0.18 bottom 淡入；0.76→0.88 bottom 淡出；0.85→0.96 center 淡入。CTA 标题最后一个词由 JS 包一层 `.word`，沿用现有 CSS 变绿。
- 只在 section 附近渲染；`visibilitychange` 隐藏时暂停；`astro:before-swap` 清理 rAF、ResizeObserver、ScrollTrigger、几何体/材质/贴图/text、renderer。
- reduced-motion：不 scrub，静态 50% 帧，但仍 pin 住舞台，避免 750svh 空滚动。

### Footer WebGL 实现要点

- 全屏 `PlaneGeometry(2,2)` + `OrthographicCamera(-1,1,1,-1,0,1)`，fragment shader 从参考 bundle 原样移植。
- uniform 颜色按原站逻辑写原始 sRGB 分量（自定义 ShaderMaterial 不会自动做 linear→sRGB 输出转换），深色 `#181914/#2B643B`，`.footer--light` 下 `#f7f7f7/#39FF71`。
- `uGridScale` 220→160 由 `ScrollTrigger` 跟随整页滚动进度；`uTime += 0.1*dt`；指针位置 lerp 0.05，停止移动 50ms 后 strength 衰减。
- resize/DPR 更新；reduced-motion 不跑动画循环，但在 footer 进入视口时渲染静态帧（scroll/resize 触发）。
- 清理监听、ScrollTrigger、geometry/material/renderer（`astro:before-swap`）。

### 验证

- `npm run build` 通过（17 页）。
- `npm run preview -- --port 4321` + Playwright（系统 Chrome，`playwright-core`，locale it-IT，localStorage cookie 已接受）。
- 截图（`docs/design-references/astro/three/`）：
  - `dataviz-000.png` / `dataviz-050.png` / `dataviz-100.png`（1440×900）
  - `dataviz-050-375.png`（375×812）
  - `footer-1440-dark.png`、`footer-legal-1440-light.png`
  - 另附 `dataviz-050-reverse.png`、`dataviz-050-after-nav.png`、`dataviz-reduced-motion.png`
- canvas `toDataURL()` 像素统计（2px 采样，alpha>0 且 max(r,g,b)>30）：
  - 000：0.00%（空白，符合预期）
  - 050：0.72%
  - 100：1.02%
  - 正向 50 与反向 100→50 的 canvas 截图逐像素完全一致（ImageChops bbox = None，mean = 0）。
- 50 与 100 的整屏差异：RGB 平均差 7.17 / 7.98 / 7.48，RMS 26.9 / 29.1 / 27.8，明显不同。
- console error = 0（含 ClientRouter 去 `/contatti` 再返回、reduced-motion 场景）。
- 1440 / 375 `scrollWidth === innerWidth`，无横向溢出。
- 状态检查：50% 时 center hidden / bottom visible；100% 时 center visible / bottom hidden；pin 舞台 top=0，section 高度 6750px（900×750svh）。

### 未完成 / 限制

- 不是逐像素复刻：曲线控制点按 1440x900 原站截图目测拟合，形态接近但不同；未复刻原 shader 的逐行效果。
- 375 下四条曲线与标签会更拥挤（按任务允许的「移动端可简化」处理），未做单独的移动端控制点布局。
- footer 指针光效代码已按原 bundle 移植，但其视觉增量叠加在持续滚动的网格上，截图对比无法单独隔离；未做数值级 uniform 断言。
- `preserveDrawingBuffer: true` 是为了满足 canvas `toDataURL()` 验收，带来少量显存/性能代价。
- 未在真实触屏设备上验证，375 仅为 Playwright viewport。
- 100% 截图取在 section 末端前 3px；GSAP pin 在精确 end 点会释放，属正常行为。

### 假设

- troika-three-text 自带解析器不支持 woff2（控制台会报 `woff2 fonts not supported`），因此使用同目录的 `.woff`，仍为本地字体。
- reduced-motion 只呈现静态 50% 帧，不显示 center CTA（按任务「静态 50% 帧」执行）。

## 2026-11-12 — 桌面经典滚动条横向溢出（防御性修复）

### 根因候选

- `100vw` 按定义包含竖直滚动条；macOS 默认 overlay 滚动条宽 0，但用户启用「始终显示滚动条」或 Windows/经典滚动条时占 15px。若元素按 `100vw` 定宽，就会出现 15px 横向溢出。
- 高风险规则：vanilla-cookieconsent 库内 `#cc-main .cm--bar{width:100vw}`；`src/styles/overrides.css` 旧 `.cookie-consent{width:min(864px, calc(100vw - 2*var(--padding)))}`（当前组件已改用 `#cc-main`，该块大概率未使用）。
- Chrome 157 headed（强制 15px 经典滚动条）下未复现，故按风险做防御性修复，不改动效/字体/sticky/Lenis。

### 修改

- `src/styles/overrides.css` 末尾新增：`html, body { overflow-x: clip; max-width: 100% }`，`@supports not (overflow: clip)` 回退 `overflow-x: hidden`；`#cc-main .cm--bar { width:100% !important; left:0; right:0 }`；`#cc-main { max-width:100vw }`。用 `clip` 而非 `hidden`，避免创建滚动容器破坏 ScrollTrigger 的 sticky/pin。
- 旧 `.cookie-consent` 宽度 `calc(100vw - 2*var(--padding))` → `calc(100% - 2*var(--padding))`。

### 验证

- headed Chrome 157（playwright-core，`headless:false`，注入 15px 经典滚动条 CSS）：17 路由 × 4 视口 × cookie 显示/关闭 + 首页滚动扫描，共 200 项 checks，`documentElement.scrollWidth === clientWidth` 全部成立，横向溢出 0。
- 首页/联系页 console error = 0；cookie 弹窗可显示、点击接受后正常隐藏，两种状态均无溢出。
- `npm run build` 通过（17 页）。
- 截图：`docs/design-references/hscroll/after-home-{1280,1440,1920,2560}.png`、`after-contact-1440.png`、`after-cookie-{shown,dismissed}-1440.png`、`after-home-dataviz-1440.png`、`after-home-dataviz-mid-1440.png`、`after-home-footer-1440.png`，共 10 张。
- 结论：Chrome 157 headed 未复现；本修复为 100vw/经典滚动条风险的防御性加固，未观察到副作用。
