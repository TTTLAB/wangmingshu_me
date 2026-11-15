# ratking.me 当前站验收报告（2026-11-15）

## 1. 范围与环境

- 验收对象：**当前中文主站 + `/en` 英文副站**，不是 davidecattaneo.it 克隆验收，也不是旧 17 页口径。
- 实际构建：**11 个 HTML** = **10 个内容路由 + 404**。
- 域名配置：`https://wangmingshu.me`。
- 本地预览：`http://127.0.0.1:4321/`（绑定 `127.0.0.1`）。
- Node：`.tools/node/bin/node`，v22.23.4。
- 浏览器：本机 Chrome（Playwright 驱动，headless），1440×900 与 390×844；未覆盖 Safari/Firefox/真实屏幕阅读器。
- 已知设计：邮箱/电话为空，页脚显示「联系页 / Contact page」；联系表单为前端演示，不发送到服务器。

### 预览服务

- 命令：`./node_modules/.bin/astro dev --host 127.0.0.1 --port 4321`
- PID：`30893`
- 日志：`/Users/wangmingshu/Documents/ratking.me/.ratking-logs/dev-4321.log`
- 说明：用户指定日志目录 `/Users/wangmingshu/.ratking-logs/` 位于 DSH workspace 沙箱外，写入被拒绝（`Operation not permitted`），未申请提权；因此日志落在项目内 `.ratking-logs/`。这是**环境限制**，不是站点失败。
- HMR：页面含 `/@vite/client`；临时给 `src/styles/overrides.css` 加 `--hmr-probe:1` 后，浏览器 computed style 变为 `1`，随后已还原，无残留。正常保存一般自动更新；若数据/配置未刷新，手动刷新或重启 dev。

## 2. 构建与路由

`npm run build`：**成功，11 page(s)**。

| 路由 | 状态 |
| --- | --- |
| `/` | 200 |
| `/works/pillbox` | 200 |
| `/contact` | 200 |
| `/privacy` | 200 |
| `/cookies` | 200 |
| `/en/` | 200 |
| `/en/works/pillbox` | 200 |
| `/en/contact` | 200 |
| `/en/privacy` | 200 |
| `/en/cookies` | 200 |
| `/this-page-does-not-exist-xyz`（404） | 404（预期） |

- `curl -L --max-time 5` 最终码；无意外 301/500。
- `dist/` 实际 HTML：`index.html`、`works/pillbox/index.html`、`contact/index.html`、`privacy/index.html`、`cookies/index.html`、`en/...` 五个、`404.html`。

## 3. 逐项验收（14 项）

| # | 检查项 | 结论 | 证据/说明 |
| --- | --- | --- | --- |
| 1 | 构建成功、页面数/路径 | **通过** | 11 page(s)，路径见上；未写旧 17 页 |
| 2 | 11 HTML + 404 的 HTTP | **通过** | 10 内容页 200；404 返回 404（预期） |
| 3 | 语言切换双向 | **通过** | `/`→`/en/`→`/`；`html lang` = `zh-CN`/`en`；`link[rel=alternate]` 不存在（低优先级 SEO 建议） |
| 4 | 导航/页脚锚点 | **通过** | 首页 `#services`/`#case-histories` 目标存在，`/contact` 进联系页；内页 `/#services`/`/#case-histories`；英文对应 `/en/#...` |
| 5 | NavSpy | **通过** | 滚动到 `#about/#services/#case-histories/#contact`，分别激活正确条目，`opacity:1`；截图 `navspy-home-1440.png` |
| 6 | 390 移动端溢出 | **通过** | 22 个 1440/390 检查全部 `scrollWidth==clientWidth` |
| 7 | 菜单开关、焦点/可点区域 | **通过（有低优先级问题）** | 开：`is-menu-open`、`aria-expanded=true`、`inert` 移除、可见；Esc 关闭恢复；**焦点仍在 toggle，无 focus trap/自动移入菜单** |
| 8 | Loader 与 reduced-motion | **通过** | 普通：`window.__loaderRat` 存在、14 个 parts、动画播放；reduce：`window.__loaderRat` 不存在、静态 rat + 淡出；console error 0 |
| 9 | Logo 尺寸 | **通过** | 首页 `/`、`/en/`：**95×84.39px**；内页 `/contact`、`/en/contact`：**47.5×42.19px**；loader：196×174.22px（未随顶栏放大） |
| 10 | 媒体滤镜 | **失败** | `src/styles/overrides.css:534` 与 `:590` 仍对 hero 视频/服务图应用 `hue-rotate(-128deg)`；Pillbox 实拍出现明显偏色。见 `hero-media-filter-on/off-1440.png`、`services-media-filter-on/off-1440.png` |
| 11 | 空联系方式 | **通过** | 页脚显示「联系页」/「Contact page」并链接联系页；无空 `mailto:`/`tel:`；联系页 infoEmpty 可见 |
| 12 | 演示表单 | **通过** | 选服务→填信息→成功；成功文案「演示表单：没有发送。」；监听 POST 0，无后端请求 |
| 13 | 控制台错误 | **通过（有已知 warning）** | 内容页 console error 0；404 页仅浏览器记录其 HTTP 404；仅既有 `THREE.Clock` deprecation warning；无新 font/woff2/JS error |
| 14 | src/dist 旧业务痕迹 | **通过（低优先级注释）** | `dist` 0 命中；`src` 仅 `src/scripts/menu.js:82` 注释 "Cattaneo petals"，不影响产物 |

**汇总：通过 13；失败 1；未测 0。**  
未测仅限未覆盖的浏览器/屏幕阅读器；14 项要求均有本机 Chrome 证据。

## 4. 问题清单

### 4.1 媒体滤镜让实拍偏色（中，确认失败）

- 复现：打开首页，观察 hero Pillbox 视频和「现场落地」图片；对比临时把对应元素 `filter` 设为 `none`（仅浏览器内，不写文件）。
- 证据：`src/styles/overrides.css:534`、`:590`；截图：
  - `docs/design-references/acceptance-20261115/hero-media-filter-on-1440.png`
  - `hero-media-filter-off-1440.png`
  - `services-media-filter-on-1440.png`
  - `services-media-filter-off-1440.png`
- 说明：这是旧品牌换色滤镜残留；本轮只记，不修。

### 4.2 菜单打开后焦点未进入菜单（低）

- 复现：首页点击「菜单」；打开后 `document.activeElement` 仍是 `.js-navbar-toggle`，没有自动聚焦第一个菜单项，也没有 focus trap。
- 证据：浏览器实测；`src/scripts/menu.js` 打开逻辑未处理焦点。
- 影响：键盘用户需手动 Tab；鼠标/触屏不受影响。

### 4.3 缺少 hreflang alternate（低，SEO 建议）

- `link[rel="alternate"]` 不存在；语言切换按钮本身正常。页面已有 `alternate` prop 用于切换，但未输出 `<link rel="alternate" hreflang>`。
- 不影响当前功能，只影响搜索引擎语言对应。

### 4.4 404 canonical 指向不存在的路径（低）

- 404 页 canonical 为 `https://wangmingshu.me/this-page-does-not-exist-xyz`，不是首页/404 自身；未设 noindex。未作为失败项，因为 404 本身返回 404。

### 4.5 旧注释残留（低）

- `src/scripts/menu.js:82` 仍有 "Cattaneo petals" 注释；`dist` 无旧文案。只记，不改代码。

## 5. 截图

`docs/design-references/acceptance-20261115/`（33 张）：

- 首页/英文首页/案例/联系/隐私/Cookie：`*-1440.png`、`*-390.png`
- `cookie-first-load-1440.png`
- `footer-hover-1440.png`
- `menu-open-1440.png`
- `navspy-home-1440.png`
- `loader-normal-1440.png`、`loader-reduced-1440.png`
- `hero-media-filter-on/off-1440.png`
- `services-media-filter-on/off-1440.png`
- `contact-demo-step3-1440.png`
- 404：`404-zh-1440.png`、`404-zh-390.png`

Logo 尺寸截图在 `docs/design-references/logo-size/`（本轮未重复造）。

## 6. 最终汇报

- **三项状态**：A 预览恢复完成；B 文案指南完成；C 验收完成（1 项失败，未修）。
- **预览**：`http://127.0.0.1:4321/`，PID **30893**，日志 `项目/.ratking-logs/dev-4321.log`（指定外部路径被沙箱拒绝）；HMR 已验证；通常保存自动更新，配置/静态资源必要时刷新或重启。
- **指南**：`/Users/wangmingshu/Documents/ratking.me/docs/COPY-EDITING-GUIDE.md`
- **验收**：`/Users/wangmingshu/Documents/ratking.me/docs/acceptance-2026-11-15.md`
- **通过/失败/未测**：13 / 1 / 0。
- **高严重度**：无；中严重度 1（媒体滤镜偏色）。
- **构建**：11 pages。
