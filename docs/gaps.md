# 差距清单与假设

克隆站与原站的已知差异逐条记录；字体单列，按用户要求忽略、不参与判定。

## 已关闭

- Footer：原 shader 全量移植，颜色走 convertLinearToSRGB，uGridScale 220→160，指针与时间参数对齐；网格线逐像素与原站一致。
- 页脚导航 hover + 平滑回滚（2026-11-12）：根因是 .transition__container 的 pointer-events:auto 空 wrapper 覆盖 footer（z9 > footer z8）；改为 wrapper pointer-events:none、.transition__node auto。原站 SmoothLink 同页逻辑已 1:1 移植：ScrollTrigger.refresh/update，services=st.start+50、case-histories=st.end、about=st.start，Lenis duration 1.2（默认 easing）；首页 href 为 #services/#case-histories，非首页/#... 保持普通链接，contact 正常转场。实测 1440 落点 01=9950、02=12724、03=/contatti；hover 背景 .64s power4、文字 .3s power4 .2s、图标 .34s power4 .22s，触屏 @media(hover:hover) 无 hover。截图 docs/design-references/footer-nav/。字体宽度差异按用户要求忽略；hover 的箭头在 .footer__nav 元素截图外，整页帧可见。
- 页面过渡动画：整页 `.transition__container`，250ms 淡出 + 250ms 淡入。
- Loader 时间线：按源码；`dc:loader-done` 在 hide-loader+0.2。
- 菜单/导航微交互：logo hover 花瓣 scale/stagger + label 180°；菜单 bg→values→links；navbar 动态隐藏距离。
- Home/Case 时间线、案例详情：GSAP 参数按原 chunk 对齐。
- Data viz 100%：100 点算法逐行移植，终帧与原站高度一致。
- Call（第三轮）：true 50% 圆环弧线可见且一致；80% 采样 metrics ≤2px；标题/CTA 2-3px，改判一致。
- Cookie（第三轮）：3 状态 × 两端并排（first/prefs/after），vanilla-cookieconsent 3.3.0，配置/外观一致。
- 2560×1440 四页（第三轮）：home/contacts/case/legal，`scrollWidth==clientWidth`，无 overflow。
- 2560 全路由（第四轮）：17 路由 × 原/克隆各 1 张 + 17 并排（`r4/2560/`、`comparisons-r4/2560/`）；`scrollWidth==clientWidth`，全部无 overflow。
- Cookie 6 视口（第四轮）：首屏原/克隆 12 张 + 6 并排（`r4/cookie/`、`comparisons-r4/cookie/`），外观一致。
- 自定义光标：原站未观察到，不实现；不计为功能缺口。

## 剩余差距

### 1. Data viz 默认相位仍非全视口一致

- **现象**：加 `CLOCK_OFFSET_SECONDS = 4.0` 后，1440 的 50/75 与原站对齐；1920/1280 仍有上下相位差；0/100 正常。
- **原因**：同一 offset 不普适，两端动画时钟起点差随视口变化。
- **影响**：中段滚动仍有镜像，终帧不受影响。
- **能否修**：可修。找原站 clock start，或按视口调 offset。

### 2. Loader 帧同步未解，且 6 视口未补

- **现象**：第四轮没有新的 6 视口帧；第三轮 1440 对齐帧仍显示克隆 scramble 早于原站。
- **原因**：两端 loader 起跑/挂载时刻不同，非同一时间基准。
- **影响**：只能说明形态接近，不能证明逐帧一致。
- **能否修**：可修。录屏或注入统一时钟，再补 6 视口。

### 3. 过渡总时长

- **现象**：`event.loader` 改为 fetch 与 250ms 淡出并行（先 `const request=originalLoader()`，再 await fade，最后 return request）；3 次 `/`→`/contatti` 总 509/509/519ms，URL 305-317ms。
- **原因**：fetch 已与淡出重叠，剩余 +10-20ms 来自 paint/fade 采样；原站约 500ms。
- **影响**：接近原站，慢网下仍可能拉长。
- **能否修**：可继续压非 fetch 段；固定时长兜底。

### 4. 原站 hover/微交互未逐项录屏

- **现象**：克隆有 `micro-v2b` 帧；原站只核对了 CSS/状态，未逐项录屏。
- **原因**：状态多，录屏成本高。
- **影响**：细微动效可能漏检，证据不足。
- **能否修**：可修。补 hover 状态矩阵。

### 5. 字体（按用户要求忽略）

- Typekit 的 Neue Haas Grotesk 被阻断，替代字体字宽更大；按用户要求本轮不列为差距、不参与判定。
- About-50 克隆 5 行 vs 原站 4 行，属纯字体断行差，一并忽略。
- 影响仍在：断行位置、字距与真身有差；如需修，取得授权并自托管后重校准。

## VI v1.0 全站换色（品牌换色，不是原站还原偏差）

- **定位**：这是有意的品牌换色，不是克隆偏差；原站还原结论仍以换色前基线为准。
- **6 token**：asphalt `#09090B` / concrete `#121215` / stencil `#F2EFE9` / tech-grey `#78756F` / grid `rgba(242,239,233,.12)` / signal `#FF3B1D`；旧 `--color-*` 全部改为别名，不再有独立色值。
- **已换**：全站 CSS 硬编码与变量、SVG（NavLogo/LoaderLogo/AboutPattern/CallPattern）、cookie、loader、data-viz、footer canvas、页脚 hover、selection、scrollbar、focus、manifest/theme-color。
- **品牌视频**：`.main-hero__video` / `.service-card__media` 是绿色品牌动画，不是摄影，页面用 `hue-rotate(-128deg)` 映射为 signal red；照片/案例图片/视频文件本身未调色。
- **可读性调整**：未激活案例行基础 opacity 从 .3 提到 .65，保证浅底可读；hover 仍 1.0 / .3s。
- **验证数字**：17 路由 × 1440/390，`scrollWidth==clientWidth`，无横向溢出；无 JS/console error（404 路由仅浏览器记录其 HTTP 404）；`npm run build` 17 pages；旧色 `#51e076/#39FF71/#2B643B/#181914/#11120d/#0c0c0c/#a3a3a3/#f7f7f7` 在 `src` 为 0。
- **截图**：`docs/design-references/recolor-v1/`，覆盖 home/cookie/services/about/data-viz/cases-list/case-detail/contact/privacy/cookies/404/loader/footer-hover，1440/390。
- **站点图标**：站点图标已换为 signal red/asphalt；摄影/案例图片仍保持原色。
- **对比度**：骨白/沥青、沥青/骨白通过；tech-grey 只作次级；红底黑字用于页脚/案例/按钮。若后续要更严格 WCAG，再单独调 opacity/字号，不在本次换色范围。
- **口径**：明确不声称「像素级完美」。

## VI 工程鼠全站替换 + loading 组装动画（2026-11-12）

- **源**：`brand/vi/assets/rat.js` 原样复制到 `public/assets/vi/rat.js`，md5 两处均 `7459637a66629e1451c4f57513ca515e`；`brand/` 未改。
- **替换**：NavLogo、LoaderLogo、`public/assets/svg/logo-mark-*.svg`、favicon/ICO/96/apple-touch/192/512 全部改成 rat 主标/badge；旧 Cattaneo 标在 17 路由 DOM 为 0，public 图标绿色像素为 0。
- **顶栏**：实测 47.5×42.2px，宽度 <64，**静态**；不加尾巴/电钻；`menu.js` 的旧花瓣 hover timeline 在 `petals.length===0` 时直接 return，不做整标旋转。
- **Loading**：新增 `loader-rat-motion.js`，7 shards 错峰组装、帽子落下、电钻滑入、10 段 steps 抖动 + 3 条红火花；1.7s 完成，loader hide 2.0 + fade 1.5，总 ~3.5s；无整标旋转/发光/无限循环；火花仅运行时 SVG，不写 rat.js/静态 SVG。
- **VI 14.4 例外**：VI 明确「加载动画不用」；本轮鼠王明确要求 loading 动画，这是 **task-specific loading exception**，不改 VI 源；不把这条写成 VI 正式规范。
- **启动顺序**：loader 在 `initPageAnimations` + `ScrollTrigger.refresh()` 后、第二个 rAF 启动，避免首个大 GSAP tick 快进；旧 petals/rect 查找已删，无 GSAP target warning。
- **Reduced motion**：不组装/不抖/不火花，静态 rat + 0.35s 延迟/0.35s 淡出；页面隐藏 visibilitychange 暂停/恢复；只播一次。
- **验证**：`npm run build` 17 pages；首页/联系页 console error 0（仅有既有 THREE.Clock deprecation warning）；17 路由 1440/390 旧标 0、无横向溢出；favicon/rat.js/manifest/logo-mark 200；顶栏 hover 1.2s transform none。
- **截图**：`docs/design-references/logo-swap/`（nav 1440/390、favicon、loader-assembly-300、loader-drill-1000、loader-drill-1450、loader-complete-1700、loader-sparks-095、loader-reduced-static、contact light）。
- **未换**：`public/assets/og/*.png` 是 1200×630 整张成品截图，旧 Cattaneo 标已烘焙在像素里，无独立 Logo 图层，未重做；照片/案例图未调色。
- **口径**：不声称像素级完美；VI 的 loading 禁用条款保持原样。

## 防御性修复

### 桌面经典滚动条横向溢出

- **现象**：无头 Chrome 测不出；headed Chrome 157（macOS）强制经典 15px 滚动条（`::-webkit-scrollbar{width:15px}` + `html{overflow-y:scroll}`）后，17 路由 × 1280/1440/1920/2560 × cookie 显示/关闭、首页 0/3150/6075/9000/13624/16000 滚动，`scrollWidth == clientWidth`，**未复现**。
- **风险**：`100vw` 包含竖直滚动条宽度，经典滚动条下可能多出 15px 横向溢出；库规则 `#cc-main .cm--bar{width:100vw}` 与旧 `.cookie-consent{width:...100vw...}` 是候选源。
- **已做防御**（`src/styles/overrides.css`）：`html, body { overflow-x: clip; max-width: 100% }`（`overflow: clip` 不建立滚动容器，不破坏 ScrollTrigger sticky/pin；不支持时回退 `overflow-x: hidden`）；`#cc-main .cm--bar { width:100% !important; left:0; right:0 }`；`#cc-main { max-width:100vw }`；旧 `.cookie-consent` 的 `100vw` 改为 `100%`（该块当前未被使用）。
- **验证**：headed 全矩阵 200 项 checks，横向溢出 0；首页/联系页 console error 0；`npm run build` 通过（17 页）。截图见 `docs/design-references/hscroll/after-*.png`。

## 假设

- 系统 Node 22.21.1 不满足 ≥22.23.4，使用工作区 `.tools/node`。
- 根目录非空（含 RULES.md 等），`create-astro` 在空子目录生成后移入。
- Typekit、analytics.zerotredici.com、reCAPTCHA、联系表 API、CMS API 均被阻断。
- Data viz 与 Footer 为原生 Three/GLSL 逐行移植，不是原站打包代码。
- 截图 DPR 为 1；对比原站侧使用阻断 Typekit 后的 fallback 字体。
- Contact 为前端 mock，不请求外部服务；Cookies Policy 正文保留原站 Lorem ipsum。
