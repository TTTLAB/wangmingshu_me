# ratking.me 品牌视觉规范（VI）v1.0

> 本文件是 `brand/vi/index.html`（586 行，2026-11-12 核对）的中文转写，供 agent 读取与执行。
> **视觉唯一源是 `brand/vi/index.html`**；本文件是转写与工程约定。两者冲突时，以 `index.html` 为准。
> v1.0 定稿（2026-11-12）：颜色 6 token、字体 Chivo Mono 700、Logo 动效 rat-motion.js、正式授权条款。全文均为正式规范。

## 0. 给 agent 的速览

**硬规则**

1. 做任何品牌视觉、配色、logo、作品案例的工作前，先读本文件，再读 `brand/vi/index.html`。
2. 颜色只用第 2 节的 6 个 token，不新增。默认主题锁定 `STENCIL_SIGNAL`（沥青黑 × 骨白 × 信号朱红）。
3. Logo 主体走 `currentColor`；瞳孔与闪电固定 `#FF3B1D`，任何背景、任何尺寸都不改。
4. 字体只用 `Chivo Mono 700`（SIL OFL 1.1），不引入第二字体；woff2 子集与 OFL 文本放在 `brand/vi/assets/`。
5. 作品素材只从 `brand/作品素材/` 取；原件 `/Users/wangmingshu/Documents/wangmingshu_me/` 绝对不动。
6. 改 VI 必须同改 `brand/vi/index.html` 与本文件；只改目录、命名、署名规则时，只改本文件。
7. Logo 动效只由 `brand/vi/assets/rat-motion.js` 驱动；不改 `rat.js`，静态 SVG 下载保持静态。
8. 授权按第 18 节正式版执行；该条款是品牌使用规范，不是法律意见。

**禁止**

- 不把预设 A（薄荷青 `#AAF0CE`）或 C（激光绿 `#CCFF00`）当默认主题，它们只是可切换预设。
- 不改 `brand/vi/assets/rat.js`；静态 `stencil-rat-*.svg` 只能由 rat.js 生成，不得手画、描摹或伪造。
- 不新增第 7 个颜色 token；不把 CMYK / Pantone 参考值写成已确认色或指定色。
- 不把旧字体重新写回规范或页面；旧字体只允许出现在第 12 节变更记录。
- 不在 22px 顶栏、favicon、印刷稿、静态 SVG 下载里加 Logo 动效；不忽略 `prefers-reduced-motion`。
- 不把原图、未压缩大图放进 `网站用/`；不改 `brand/vi/` 与 `brand/作品素材/` 里的现有文件来「顺手统一」。

**改 VI 时同步改哪里**

| 改动类型 | 要改 |
| --- | --- |
| 颜色、字体、尺寸、组件、logo 构造 | `brand/vi/index.html` + 本文件 |
| 06–11 规范 / Logo 动效 / 授权 | `brand/vi/index.html` + 本文件第 13–19 节同步 |
| 作品目录约定、文件命名、摄影署名 | 只改本文件 |
| 站点实现里复制过的 token/尺寸 | 以 index 为准，另行 grep 排查同步（本文件不维护代码位置清单） |

## 1. 品牌定位与关键词

- 名称：`STENCIL_SIGNAL`；中文：`鼠王`；组合写法：`STENCIL_SIGNAL · 鼠王`。
- 一句话定位：`STENCIL_SIGNAL —— 地下信号鼠。Banksy 模板鼠 × ratking.studio 工业网格。`
- 视觉公式：`Banksy Stencil Rat × 瑞士工业网格`。
- 关键词：街头涂鸦张力、单色骨白剪影、镂空断桥、信号朱红点睛、原生 SVG Path、GSAP / WAAPI 微动效、全站 1px 裸露网格。

## 2. 颜色 token

`brand/vi/index.html:11` 的 `:root` 是唯一色值定义；色卡数据与之一致。**严格按下列 6 个 token，不新增。**

| 变量 | HEX | RGB | 用途 / 来源 |
| --- | --- | --- | --- |
| `--vi-bg-asphalt` | `#09090B` | 9, 9, 11 | 地下沥青黑：页面底色、浅色组合文字色 |
| `--vi-bg-concrete` | `#121215` | 18, 18, 21 | 暗部混凝土：构造框、卡片、代码块底色 |
| `--vi-stencil-white` | `#F2EFE9` | 242, 239, 233 | 喷漆骨白：主文字、剪影、浅色组合背景 |
| `--vi-tech-grey` | `#78756F` | 120, 117, 111 | 工程铅灰：次级文字、说明文字 |
| `--vi-grid-line` | `rgba(242,239,233,0.12)` | 242, 239, 233 / 12% | 裸露网格线：1px 网格与边框 |
| `--vi-accent-signal` | `#FF3B1D` | 255, 59, 29 | 信号朱红：kicker、强调、hover、瞳孔 / 闪电固定色 |

```css
:root{--vi-bg-asphalt:#09090B;--vi-bg-concrete:#121215;--vi-stencil-white:#F2EFE9;--vi-tech-grey:#78756F;--vi-grid-line:rgba(242,239,233,0.12);--vi-accent-signal:#FF3B1D}
```

**保留预设（仅可切换，不可作默认）**

| 预设 | 色值 | RGB | 状态 |
| --- | --- | --- | --- |
| A 薄荷青 | `#AAF0CE` | 170, 240, 206 | 可切换预设 |
| C 激光绿 | `#CCFF00` | 204, 255, 0 | 可切换预设 |

默认主题 `STENCIL_SIGNAL` 锁定为「沥青 × 骨白 × 信号朱红」。色卡点击复制 HEX；这是页面交互，不是新规范。

**CMYK / Pantone**：只作为换算参考列在第 17 节，不是颜色 token，不是指定色，也不进 `:root`。

## 3. 字体与字阶

### 3.1 采用字体

- 字体族：`'Chivo Mono', ui-monospace, SFMono-Regular, Menlo, monospace`。
- 字重 / 样式：`700` / `normal`；`@font-face` 使用 `font-display:swap`，格式 `woff2`。
- 本地文件：`brand/vi/assets/ChivoMono_Bold.woff2`，**10,756 bytes**，md5 `3f2e83f654dae75e0ff589004ba8d007`。
- 许可：**SIL Open Font License 1.1**；OFL 全文在 `brand/vi/assets/OFL-ChivoMono.txt`（4,385 bytes）。
- 上游与官方来源：
  - 源码仓库：https://github.com/Omnibus-Type/Chivo
  - Google Fonts：https://fonts.google.com/specimen/Chivo+Mono
  - OFL 原文：https://github.com/Omnibus-Type/Chivo/blob/master/OFL.txt
- 字体重命名与再分发遵循 OFL：保留版权与许可文本；不单独售卖字体；修改版不占用原作者名义。字体许可独立于品牌授权（第 18 节）。
- 字体二进制（v1.008）内版权行为 2018 The Chivo Project Authors；随附 OFL 文本取自上游仓库当前版本（2019），两者同为 SIL OFL 1.1、条款一致。正式法务审查时以二进制版权行与上游 OFL 原文一并核对。
- 子集范围：Basic Latin `U+0020–007E`、Latin-1 `U+00A0–00FF`、General Punctuation `U+2000–206F`，并含 `≤ ≥ ≠ ×`。箭头 `← ↑ → ↓` 不在 Chivo Mono 字符集内，按系统等宽回退；不为此另引第二款字体。
- 子集由 Google Fonts CSS `text=` 接口按上述字符集生成，只保留所需字形；文件落到本地后不再依赖 Google Fonts。
- 站点接入：目标路径 `/fonts/ChivoMono_Bold.woff2`。当前 `src/styles/site.css`、`src/scripts/home/dataviz.js` 仍引用旧字体；迁移由网站会话按本节执行。本会话不改 `src/`，因此迁移完成前站点与 VI 页会存在字体差异。

```css
@font-face{font-family:'Chivo Mono';src:url('./assets/ChivoMono_Bold.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
html,body{font-family:'Chivo Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
```

### 3.2 选型过程（3 个候选）

| 候选 | 风格判断 | 授权 / 官方来源 | 结论 |
| --- | --- | --- | --- |
| **Chivo Mono 700** | 字宽、字重与灰度最接近上一版字体；grotesque 骨架、方切终端，工业但不花。 | SIL OFL 1.1；https://github.com/Omnibus-Type/Chivo；https://fonts.google.com/specimen/Chivo+Mono | **采用** |
| Martian Mono 700 | 工业信号最强，但字面更宽、更圆，密集表格里占位明显。 | SIL OFL 1.1；https://github.com/evilmartians/mono | 备选 |
| Azeret Mono 700 | 窄、干净、技术感；性格最弱，更像通用 coding mono。 | SIL OFL 1.1；https://github.com/displaay/azeret | 备选 |

选择理由：VI 的主体是大量 10–13px 的表格与说明文字，等宽字体首先要在小字号下稳住灰度；Chivo Mono 700 在相近字宽下保留了工业 grotesque 的方切感，又不像 Martian Mono 那样把表格撑宽。三款均为 SIL OFL 1.1，可商用、可嵌入、可再分发；最终只交付 Chivo Mono 的一个 700 字重、一个 woff2 子集，保持轻量。

### 3.3 字阶

- HTML 根字号 16px（CSS 未显式声明，取浏览器默认）。
- 正文 13px / 行高 1.8；标题行高 0.92–1.0；全大写字距 0.18–0.30em。
- 等宽无衬线；页面所有文字共用同一字体族，不引入第二字体。

| 角色 | 字号 / 行高 / 字距 | 来源 |
| --- | --- | --- |
| h1 | `clamp(34px,6vw,74px)` / .98 / -.01em | `.wrap h1` |
| 巨型字样（Aa Bb 0123） | `clamp(40px,8vw,120px)` / .9 / -.02em | `.type-spec .big` |
| lede 导语 | 13px / 1.8 / 默认；max-width 640px；margin-bottom 60px | `.lede` |
| section 标题 h2 | 12px / 默认 / .26em | `.section h2` |
| kicker | 11px / 默认 / .3em | `.kicker` |
| meta 说明 | 11px / 2 / 默认 | `.meta` |
| 顶栏品牌 | 11px / 默认 / .24em | `.vi-top .brand` |
| 返回链接 | 11px / 默认 / .16em | `.vi-top a.back` |
| 按钮 | 700 10px / 1 / .16em | `.btn` |
| 锁定组合文字 | 12px / 1.4 / .24em | `.lock .word` |
| 色卡信息 | 10px / 1.7 / .12em；名称 11px / .18em | `.sw .info` |
| 代码块 | 10px / 1.7 / 默认 | `pre` |
| 页脚 note | 10px / 1.9 / 默认 | `.note` |
| toast | 700 11px / 1 / .14em | `.toast` |

## 4. Logo 构造与用法

**构造（index 第 01 节）**

- 图形：7 组剪影碎片（`body` / `head` / `ear` / `arm` / `hindfoot` / `frontleg` / `frontfoot`）+ `hat`、`drill`、`bolt`、`tail`、`whiskers`、`eye`。
- 视口：**270 × 240**；badge 版独立视口 120 × 120。
- 单色 `currentColor` 剪影；**瞳孔（`eye`）与闪电（`bolt`）固定信号朱红 `#FF3B1D`**。
- 全部图形为原生 SVG Path。
- 构造图框：16:9、40px 内网格、图形宽 66%、参考线水平 50% / 垂直 38%、参考线信号朱红 55% 不透明度。

| 用法 | 尺寸 / 规则 | 来源 |
| --- | --- | --- |
| 顶栏 ratbox | 40 × 22，骨白 | `.vi-top .brand .ratbox` |
| 锁定组合（深色） | rat 120px + 文字 12px/.24em/1.4，混凝土底 | `.lock.dark` |
| 锁定组合（浅色） | rat 120px + 同文字；背景 `#F2EFE9`，图形/文字 `#09090B` | `.lock.light` |
| badge | 110px 宽 | `.badge-lock .badge` |
| 小号 rat | 70px 宽 | 第 04 节第 4 个 lock 内联样式 |
| 构造图 | 图形宽 66%，16:9 框，40px 内网格 | `.construct` |

**动效钩子**

- 瞳孔随光标移动。
- 耳朵随机抽动。
- 尾尖随滚动速度摆动（Lenis / scroll velocity）。
- 悬停碎片错位抖动：`.28s steps(2) infinite`，位移序列 `(0,0) → (-2px,1px) → (2px,-1px) → (-1px,-1px) → (0,0)`。
- Logo 尾巴 / 电钻动效：由 `rat-motion.js` 驱动，见第 14.4 节；不改 `rat.js`。

```js
// GSAP hooks（站点主叙事）
// eye-tracking: mousemove -> gsap.to([data-part=eye],{x,y});
// tail wave: scroll velocity -> gsap.to([data-part=tail],{rotation:v*14,transformOrigin:"100% 100%"});
// ear twitch: random interval -> gsap.fromTo([data-part=ear],{rotation:0},{rotation:-14,yoyo:true,repeat:1});
// hover glitch: mouseenter -> shards x/y jitter (repeat:2, yoyo)
```

说明：尾根 pivot 为 `100% 100%`（当前 path 的尾根在 bbox 右下角）；旧文案的 `10% 80%` 已修正。

**最小尺寸 / 安全区 / 禁用清单**：见第 13 节。index 第 06 节给出数字、安全区、禁用清单与正误示例。

## 5. 版式与间距

| 项目 | 规则 | 来源 |
| --- | --- | --- |
| 内容容器 `.wrap` | `max-width:1180px`，居中，`padding:64px 22px 120px` | `.wrap` |
| 顶栏 `.vi-top` | sticky，`padding:14px 22px`，背景 `rgba(9,9,11,.86)`，下边框 1px 网格线，`backdrop-filter:blur(6px)` | `.vi-top` |
| 构造框 | 16:9，40px 内网格，参考线 1px 信号朱红 55% | `.construct` |
| 区块 `.section` | 上边框 1px 网格线，`padding:44px 0` | `.section` |
| 两栏 `.two` | `1.1fr .9fr`，gap 34px，`min-width:0` | `.two` |
| 同屏最大宽度 | 1180px + 左右 22px | `.wrap` |

**2px 中缝实现**：`h1 .cut` 用 `mask-image` 在垂直 50% 处挖掉 2px（上下各 1px），标题被切成上下两半。

**响应式断点（本页全部）**

- `≤860px`：`.two` 从两栏变一栏。
- `≤700px`：`.lockups` 从 2 列变 1 列；`.swatches` 从 3 列变 2 列；`.motion-demo` 从两栏变一栏；`.font-table` 从表格变堆叠卡片；`.spec-table--flow` 取消 560px 最小宽度。
- `≤560px`：`.use-grid` 从 2 列变 1 列。
- `≤520px`：顶栏隐藏 `STENCIL_SIGNAL · ` 前缀，只留 `VI.SPEC`，避免与返回链接相撞。

## 6. 组件

- **按钮 `.btn`**：透明底、1px 网格边框、骨白字；700 10px/1、字距 .16em、`padding:10px 14px`；hover 边框与文字变信号朱红。
- **锁定组合 `.lock`**：1px 边框、`padding:26px`、`min-height:150px`、flex 居中、gap 16px；深色底 `#121215`，浅色底 `#F2EFE9`。
- **badge**：110px 宽；说明写「RAT BADGE / 社交头像 / Favicon 变体」。
- **toast**：固定底部 26px、水平居中；信号朱红底、`#09090B` 字（字面量，非变量）；700 11px/1、.14em、`padding:10px 16px`；淡入 0.25s、1.2s 后消失。
- **swatches**：3 列、gap 14px；`≤700px` 2 列；卡片混凝土底、1px 边框，色块高 96px，信息区 `padding:10px 12px`；hover 边框变信号朱红。
- **lockups**：2 列、gap 18px；`≤700px` 1 列。
- **代码块 `pre`**：混凝土底、1px 边框、`padding:16px`、最大高 260px、10px/1.7。
- **Logo 动效演示 `.motion-demo`**：两栏，左舞台右控制；`≤700px` 单栏；舞台 300px 高（手机 250px），Logo 190px（手机 160px）；控制按钮复用 `.btn`；状态行 `aria-live="polite"`。
- **页脚 note**：10px、铅灰、上边框 1px、`padding-top:18px`、`margin-top:30px`。

## 7. 图形语言与动效

- 母题：Banksy 模板鼠 × 瑞士工业网格；单色骨白剪影 + 镂空断桥 + 信号朱红点睛。
- 全站 1px 裸露网格；标题中缝 2px 镂空。
- 全部图形为原生 SVG Path；站点主叙事由 GSAP 驱动；Logo 动效由 `rat-motion.js` 用 Web Animations API 驱动，无第三方依赖。
- 交互钩子：瞳孔跟随、耳朵抽动、尾尖随滚动速度摆动、悬停碎片错位；具体参数见第 4 节代码块。
- 动效时长与缓动：见第 14 节；Logo 动效的完整规范见第 14.4 节。唯一既有的 VI 值是悬停碎片错位 `.28s steps(2)`，已收为 `--dur-vi-glitch` / `--ease-steps`，保留不改；`prefers-reduced-motion` 下该 hover 动画关闭。

## 8. 文案与语气

index 已有的固定文案：

| 场景 | 文案 |
| --- | --- |
| 页面标题 | `VI.SPEC — STENCIL_SIGNAL · 鼠王` |
| 顶栏 | `STENCIL_SIGNAL · VI.SPEC`（≤520px 只显示 `VI.SPEC`） |
| kicker | `VISUAL IDENTITY / 2026` |
| 主标题 | `Stencil Rat` / `× 工业网格` |
| lede | `Banksy 模板鼠的街头涂鸦张力，装配瑞士工业网格。单色骨白剪影、镂空断桥、信号朱红点睛；全部图形为原生 SVG Path，配合 GSAP 微动效与全站 1px 裸露网格。` |
| 定位语 | `STENCIL_SIGNAL —— 地下信号鼠。Banksy 模板鼠 × ratking.studio 工业网格。` |
| 锁定组合 | `鼠王` / `RAT KING` |
| badge 说明 | `RAT BADGE` / `社交头像 / Favicon 变体` |
| 下载区说明 | `全部为矢量 SVG，可直接用于导航、社媒、印刷。交付资产统一命名 stencil-rat-*；vi-* 只用于本页内部 CSS / JS，不再用于新资产。` |

**完整语气规范**：见第 15 节。上表固定文案不变；语气规范只约束新写的文案，不改旧文案。

## 9. 资产与命名

index 规定的下载资产：

| 按钮文案 | 实际下载文件名 | 说明 |
| --- | --- | --- |
| `STENCIL-RAT-BONE.SVG` | `stencil-rat-bone.svg` | 骨白版，`currentColor` 替换为 `#F2EFE9` |
| `STENCIL-RAT-ASPHALT.SVG` | `stencil-rat-asphalt.svg` | 沥青版，替换为 `#09090B` |
| `STENCIL-RAT-BADGE.SVG` | `stencil-rat-badge.svg` | badge 版 |

- 命名规范：交付资产统一 `stencil-rat-*`；`vi-*` 只保留 VI 页内部 CSS / JS / 旧文案，不再用于新资产（详见第 19 节）。
- 目录：本仓库落地位置为 `brand/vi/assets/`。
- **本地资产（`brand/vi/assets/`）**：
  - `rat.js`（3,771 bytes，md5 `7459637a66629e1451c4f57513ca515e`）：唯一 logo 源，来自原件 `_custom/vi/rat.js`，逐字节一致；提供 `window.__VI_RAT__()`（270 × 240）与 `window.__VI_RAT_BADGE__()`（120 × 120）。
  - `rat-motion.js`（15,537 bytes）：Logo 动效驱动，只操作实时 DOM，不生成 logo、不改静态 SVG、不依赖 GSAP。
  - `ChivoMono_Bold.woff2`（10,756 bytes，md5 `3f2e83f654dae75e0ff589004ba8d007`）：Chivo Mono 700 woff2 子集。
  - `OFL-ChivoMono.txt`（4,385 bytes）：SIL OFL 1.1 全文。
  - `favicon.svg`（10,745 bytes）：自 `public/favicon.svg` 复制，512 × 512，内嵌位图；站点根 `/favicon.svg`。
  - `stencil-rat-bone.svg`（1,711 bytes）、`stencil-rat-asphalt.svg`（1,711 bytes）、`stencil-rat-badge.svg`（1,409 bytes）：由 `rat.js` 经 Node `vm` 生成；前两者分别把 `currentColor` 替换为 `#F2EFE9` / `#09090B`，badge 原样输出。
- index 以 `./assets/rat.js` 与 `./assets/rat-motion.js` 加载；页面 logo、badge 仍由脚本运行时注入。05 节三个下载按钮为静态 `<a href="./assets/stencil-rat-*.svg" download>`，不再使用 `.vi-download` / Blob。
- `rat.js` 仍是唯一 logo 源；不得另画 / 描摹「官方 logo」。静态文件只能由 rat.js 重新生成，md5 与内容校验见第 19 节。
- 旧字体 woff2 已从 `brand/vi/assets/` 移除，只在 `.backups/` 留档；不得再被页面或规范引用。

## 10. 作品素材目录约定

`brand/作品素材/` 当前结构：

```text
brand/作品素材/
├── 01-Pillbox舞池主视觉-新媒体装置/
│   ├── 案例.md
│   ├── 文案/流水账原文.md
│   ├── 网站用/
│   │   ├── pillbox-01.jpg ~ pillbox-04.jpg
│   │   ├── pillbox-lineart.jpg
│   │   ├── pillbox-signal-flow.png / .svg
│   │   ├── pillbox-led.mp4
│   │   └── mat-*.jpg（8 个材料图，1024×1024）
│   └── 草图/草图-原稿.jpg、草图-抽象线稿.jpg
├── 02-Lust成都北京/ · 03-音乐节-阿那亚游山Wigwam/ · 04-上海Reactor/
└── 05-深圳OIL/ · 06-台州神仙居-互动装置/ · 99-其他/   （以上均为空占位）
```

当前只有 01 有内容；02–06 是占位目录，不要为了「填满」造内容。

**命名规则**

- 案例目录：`NN-名称/`，两位数字 + 中文短名，例如 `01-Pillbox舞池主视觉-新媒体装置`。
- 网页图：`项目slug-01.jpg`、`项目slug-02.jpg`……序号两位。
- 材料图：`mat-<英文材料名>.jpg`，例如 `mat-led-strip.jpg`。
- `网站用/` 里的文件名全部小写 ASCII、用短横线、无空格、无中文；`草图/` 可保留中文名（如现有 `草图-原稿.jpg`）。
- `网站用/` 只放网页压缩版，不放原图。
- `案例.md` 用相对路径 `./网站用/...` 引用图片，不写绝对路径。

**`案例.md` 约定**

frontmatter 字段：`title`、`subtitle`、`client`、`date`、`cover`、`tags`、`credit`、`creditUrl`。

正文结构：H1 → 粗体副题 → 引用摘要 → 项目概览表 → 设计思路 → 系统构成 → 主要材料 → 现场 → 结果与运营 → 更多现场。

**摄影署名（硬规则）**

- Pillbox 现场照片 `pillbox-01` ~ `pillbox-04` 必须署名：**Akilou Photo（小红书 @AkilouPhoto）**。
- 链接：`https://www.xiaohongshu.com/user/profile/627202190000000021029e2c`。
- `案例.md` 已统一为 `@AkilouPhoto`（frontmatter `credit`、文末链接、更多现场三处一致）。两者不要混用。
- 本次只同步 `案例.md` 署名，不动素材图片。

**新增案例步骤**

1. 建目录 `brand/作品素材/NN-中文短名/`；编号取 01–06 中现有最大序号 +1（当前下一个是 07），`99-其他/` 固定给杂项，不参与递增。
2. 建 `网站用/`、`文案/`、`草图/`；没有草图也保留空目录。原图留在原件目录，不复制进来。
3. 图片压成网页版，按 `项目slug-01.jpg`、`mat-<材料>.jpg` 命名，全小写 ASCII。
4. 写 `案例.md`：frontmatter 八个字段齐全，正文按上述结构；图片一律 `./网站用/...`。
5. 有摄影署名就写 `credit` + `creditUrl`；Pillbox 用 `@AkilouPhoto`。
6. 检查：`网站用/` 文件名无中文/空格、序号两位、`网站用/` 无原图、`案例.md` 相对路径可解析。

## 11. 如何修改 VI

1. **改视觉规范**：先改 `brand/vi/index.html`（视觉唯一源），再同步本文件对应章节。
2. **只改目录/命名/署名**：只改本文件第 9–10 节，不动 index。
3. **冲突处理**：index 与本文件不一致时，以 index 为准；先修本文件，必要时再修 index 并说明原因。
4. **站点实现**：若 `src/` 中已复制 token 或尺寸，按 index 的新值同步；不要反向用站点代码覆盖 index。字体迁移见第 3.1 节，不在本会话范围内。
5. **不得顺手改**：`rat.js`、favicon、字体源文件不改；`stencil-rat-*` 只允许由 rat.js 生成后写入；`rat-motion.js` 只按第 14.4 节改。`brand/作品素材/` 现有文件不要为了「统一」而重命名或改写。
6. **改完检查**：
   - 颜色严格 6 个 token，HEX/RGB 与 `:root` 一致；没有新增第 7 个颜色变量；
   - 字体族为 `Chivo Mono`、字重 700、fallback 正确；woff2 为 10,756 bytes、md5 为 `3f2e83f654dae75e0ff589004ba8d007`；OFL 文本存在；
   - logo 构造（270×240、7 碎片 + 安全帽 / 电钻、瞳孔与闪电红、currentColor）未变；
   - 断点为 860 / 700 / 560 / 520；桌面 1440 与手机 390 页面无横向溢出；
   - index 第 06–11 节与本文第 13–19 节一致；全文无旧提案标记与旧确认字样残留；页面无 `.proposal`；
   - 三个静态 `stencil-rat-*.svg` 存在，且能用 `rat.js` 重算到逐字节一致；`rat.js` md5 仍为 `7459637a66629e1451c4f57513ca515e`；
   - `rat-motion.js` 语法通过；尾巴 / 电钻可触发；暂停、页面隐藏、打印、`prefers-reduced-motion` 均能停；
   - 05 节下载为静态 `<a download>`，无 `.vi-download`；页面仍有 rat.js 动态 logo；静态 SVG 不含 spark 或动画；
   - 印刷 CMYK / Pantone 只作换算参考，未写成指定色 / 已确认色；
   - 没有改 `brand/vi/index.html` 以外的 VI 资产（除非本次任务就是改它）。

## 12. 变更记录（v1.0 定稿，2026-11-12）

### 12.1 v1.0 · 2026-11-12

**A. 字体定稿**

- 从 3 个免费可商用候选（Chivo Mono 700 / Martian Mono 700 / Azeret Mono 700）中选定 **Chivo Mono 700**（SIL OFL 1.1，Omnibus-Type）。
- 交付 `brand/vi/assets/ChivoMono_Bold.woff2`：10,756 bytes，Basic Latin / Latin-1 / General Punctuation 子集，含 `≤ ≥ ≠ ×`；箭头按系统等宽回退。
- OFL 全文落在 `brand/vi/assets/OFL-ChivoMono.txt`。
- **Basically A Mono 从规范与页面移除**；旧 woff2 只留在 `.backups/vi-20261112-041827/`，不再引用。此句是全文唯一保留旧字体名的地方。

**B. 颜色定稿**

- 严格保留现有 6 个 token，不新增。
- CMYK / Pantone 降为「换算参考」，只列在第 17 节，并注明未打样、不是指定色。

**C. 授权条款定稿**

- 第 18 节写定正式版本：Logo / VI 资产 / 字体 / 摄影的范围、允许、禁止、署名、联系方式（ratking.me）、终止与英文摘要。
- 末尾固定写「本条款为品牌使用规范，非法律意见」。

**D. 提案转正**

- 原提案标记已全部转为正式规范；index 删除 `.proposal` 标记与样式。
- 第 13–19 节全部为正式条款，不再保留提案状态。

**E. Logo 动效新增**

- 新增 `brand/vi/assets/rat-motion.js`：尾巴每 4–9s 轻甩（480ms），电钻每 6–12s 间歇工作（520ms，高频抖动 + 火花）。
- 支持 `prefers-reduced-motion` 默认关闭、手动开关、暂停 / 继续、页面不可见停止、打印停止；同一时刻只做一组动作。
- 只初始化显式传入的 Logo（VI 页演示），顶栏 / 锁定组合 / 下载 SVG 保持静态。

**F. 页面修订**

- VI 页字体、字体选型表、Logo 动效演示与开关、授权正式版全部更新。
- 手机顶栏在 ≤520px 隐藏 `STENCIL_SIGNAL · ` 前缀，消除与返回链接的重叠。
- 字体候选表在 ≤700px 改为堆叠卡片；动效规范表取消 560px 最小宽度，手机可读。

**G. 未改**

- `rat.js` 未改，md5 仍为 `7459637a66629e1451c4f57513ca515e`。
- 三个静态 `stencil-rat-*.svg` 未改，md5 与第 19 节一致。
- 颜色 token、logo 构造、断点 860 / 700 的基础布局未改。

**H. 执行备注（不是未决项）**

- 站点字体迁移：`src/styles/site.css`、`src/scripts/home/dataviz.js` 仍引用旧字体；由网站会话按第 3.1 节替换为 `/fonts/ChivoMono_Bold.woff2`。本会话未改 `src/`。
- 印刷打样：CMYK / Pantone 尚未打样；实际印刷前按第 17.2 节打样确认。

## 13. Logo 最小尺寸、安全区与禁用

对应 index 第 06 节。以下为正式规范。

### 13.1 最小尺寸

| 场景 | 下限 | 依据 |
| --- | --- | --- |
| 数字 | 图形高度 ≥ **22px**；宽度按 270:240 等比约 **24.75px** | 顶栏 40×22 已实测 |
| 印刷 | 图形高度 ≥ **12mm** | 工艺下限 |
| 锁定组合 | 整体宽度 ≥ **96px** | 可读性下限 |

- 小于数字下限时，改用 badge 或纯文字，不硬缩主 logo。
- badge 独立视口 120×120，可作头像 / favicon / 小尺寸替代；不得把 badge 当主 logo 拉伸。
- 22px 是下限，不是常用尺寸；顶栏继续用 40×22。

### 13.2 安全区

- 四周至少留 **0.5 × 图形高度**；22px 高时即四周 ≥ 11px。
- 安全区内不放文字、边框、其他图形或裁切边。
- 锁定组合按整体外框高度计算安全区。
- 安全区是空白，不是加边框或底板的理由。

### 13.3 禁用清单

1. 拉伸、压扁或任何非等比缩放。
2. 旋转、倾斜。
3. 改主体色；主体只允许 `currentColor` 单色。
4. 改瞳孔 / 闪电的红（固定 `#FF3B1D`）。
5. 加描边、阴影、渐变、发光。
6. 拆碎片单独使用；7 组剪影碎片必须整体出现。
7. 裁切图形或切入安全区。
8. 低对比背景上直接使用。
9. 在繁忙照片 / 视频上无遮罩直接放。
10. 把 badge 当主 logo 拉伸使用。

### 13.4 正误示例

index 第 06 节用 rat.js 实时渲染 9 个示例瓦片：

- 正确 4 个：深底 bone、浅底 asphalt、22px 最小高度、badge 小尺寸替代。
- 错误 5 个：横向拉伸、整体改红、加描边 / 阴影 / 发光、低对比、拆碎片单用。
- 每个瓦片带 `正确` / `错误` 标签；错误项只作反例，不得进生产。

## 14. 动效 token 与 Logo 动效

### 14.1 时长

通用 token 取自 `src/scripts/` 的 GSAP 调用；Logo token 取自 `rat-motion.js`。

| Token | 值 | 用途 | 来源 |
| --- | --- | --- | --- |
| `--dur-instant` | 50ms | .02–.05 闪烁 / 指针 | `loader.js`、`menu.js` |
| `--dur-fast` | 200ms | .2 快速反馈 | `home/dataviz.js`、`home/call.js` |
| `--dur-base` | 300ms | .3 基础过渡 | `home/services.js`、`home/case-reveal.js` |
| `--dur-medium` | 400ms | .4 常规位移 | `navbar.js`、`menu.js`、`home/interactive-grid.js` |
| `--dur-slow` | 600ms | .6 场景切换 | `home/services.js`、`loader.js`、`noise.js` |
| `--dur-slower` | 800ms | .8 强调出场 | `menu.js`、`loader.js`、`home/call.js` |
| `--dur-long` | 1250ms | 1.25 长揭示 | `home/hero.js`、`home/case-reveal.js` |
| `--dur-cinematic` | 1500ms | 1.5 电影感段落 | `loader.js` |
| `--dur-hero` | 1750ms | 1.75 首屏主叙事 | `home/hero.js`、`home/case-reveal.js` |
| `--dur-epic` | 3200ms | 3.2 氛围长镜头 | `home/call.js` |
| `--dur-transition` | 250ms | 页面转场 | `transition.js`（`DURATION = 0.25`） |
| `--dur-vi-glitch` | 280ms | VI 页 04 节 hover glitch | `brand/vi/index.html`（`.28s steps(2)`） |
| `--dur-logo-tail` | 480ms | Logo 尾巴轻甩 | `rat-motion.js` |
| `--dur-logo-drill` | 520ms | Logo 电钻工作 + 火花 | `rat-motion.js` |

### 14.2 缓动

| Token | 值 | 用途 | 来源 |
| --- | --- | --- | --- |
| `--ease-out` | `power2` | 通用出场 | 全站最常见（18 处） |
| `--ease-in-out` | `power1.inOut` | 对称过渡 | 多处 |
| `--ease-strong` | `power4.inOut` | 强对比转场 | 多处（17 处） |
| `--ease-enter` | `power4` | 入场 | 多处 |
| `--ease-exit` | `power4.in` | 退场 | 多处 |
| `--ease-ui` | `power3.out` | UI 反馈 | 菜单 / 导航 |
| `--ease-linear` | `none` | 匀速 / 循环 | 多处（11 处） |
| `--ease-scramble` | `sine.in` | 文本扰动 | 菜单 / 乱码效果 |
| `--ease-bounce` | `bounce.inOut` | 弹跳强调 | 多处（7 处） |
| `--ease-steps` | `steps(2)` | VI 页 glitch 步进 | `brand/vi/index.html` |
| `--ease-logo-tail` | `cubic-bezier(.22,1,.36,1)` | Logo 尾巴起手 | `rat-motion.js` |
| `--ease-logo-drill` | `steps(1,end)` | Logo 电钻高频抖动 | `rat-motion.js` |

### 14.3 使用说明

- 通用 `--ease-*` 存的是 GSAP 缓动名，不是 CSS 关键字；直接写进 CSS 前需换等价 `cubic-bezier`。
- `--ease-logo-tail` / `--ease-logo-drill` 是 CSS 值，可直接用于 Web Animations API。
- 代码另有 0.01 / 0.08 / 0.7 / 0.9 秒等零散值，不单列 token，按最近档取用。
- `.28s steps(2)` 是 VI 页 04 节 hover glitch 的现有值，保留不改；`prefers-reduced-motion` 下该 hover 动画关闭。
- token 用于交接与讨论，不得据此批量改写 `src/` 既有动效。

### 14.4 Logo 动效（尾巴 / 电钻）

**何时用**

- VI / 品牌演示页。
- 官网导航、页脚的动态 Logo（尺寸 ≥ 64px 宽时）。
- 社交头像动图（可选，导出 GIF / MP4 时按同一节奏）。
- 只在品牌自有触点使用；客户物料需书面许可。

**何时不用 / 禁用**

- 22px 顶栏、favicon、印刷稿、静态 SVG 下载、邮件签名。
- 加载动画、警示、按钮反馈或任何功能状态提示。
- 繁忙照片 / 视频上无遮罩的 Logo。
- `prefers-reduced-motion: reduce` 下自动播放；用户未手动开启时不得运行。
- 持续循环、呼吸、漂浮、无限旋转；同一时刻不得尾巴和电钻同时动。

**尾巴**

| 项目 | 值 |
| --- | --- |
| 间隔 | 随机 4,000–9,000ms；首次演示预热 1,600–2,800ms（仅 VI 页 `warmup:true`） |
| 单次时长 | 480ms |
| 关键帧 | 0° → +9°（23%）→ -3.5°（58%）→ +1.2°（84%）→ 0° |
| 旋转中心 | 尾根 `transform-origin:100% 100%`（`transform-box:fill-box`） |
| 缓动 | 起手 `cubic-bezier(.22,1,.36,1)`；回位 `cubic-bezier(.37,0,.63,1)` |

**电钻**

| 项目 | 值 |
| --- | --- |
| 间隔 | 随机 6,000–12,000ms；首次演示预热 3,000–4,400ms（仅 VI 页 `warmup:true`） |
| 单次时长 | 520ms；身体 recoil 300ms；火花 520ms |
| 抖动 | 10 帧、每 52ms 一段，位移 ±1.7px、旋转 ±1.3°，`steps(1,end)` |
| 火花 | 钻头端点 `(249,126)` 起 3 条信号朱红短线；闪 2 次，最大 scale 1.4 |
| 旋转中心 | 电钻手柄 `transform-origin:28% 72%`；身体 `50% 50%` |
| 颜色 | 火花只用 `#FF3B1D`；不新增颜色 |

**生命周期**

- `prefers-reduced-motion: reduce`：默认关闭；用户可手动开启，系统偏好切换为 reduce 时再次关闭。
- 暂停：`pause()` 立即取消当前动画与定时器；`resume()` 重新排程。
- 页面不可见：`visibilitychange` 停止定时器与动画；恢复可见后按常规间隔重排。
- 打印：`beforeprint` 停止；`afterprint` 恢复。
- 静态 SVG 下载：不含 spark、不含 CSS / JS 动画；`rat.js` 源码不出现 spark。

**实现**

- 文件：`brand/vi/assets/rat-motion.js`（15,537 bytes）。
- 技术：Web Animations API + `setTimeout`；无 GSAP、无第三方依赖。
- 只初始化显式传入的根元素：`RatMotion.init(root, options)`；加载脚本本身不会动任何 logo。
- API：`start()` / `stop()` / `pause()` / `resume()` / `triggerTail()` / `triggerDrill()` / `getState()` / `subscribe(fn)` / `destroy()`。
- 选项：`tailMin`、`tailMax`、`drillMin`、`drillMax`、`tailDuration`、`drillDuration`、`sparkDuration`、`warmup`、`onState`。
- 根元素写 `data-motion="on|off"`，供 CSS / 调试读取。
- 若浏览器不支持 `Element.animate`，保持静态 logo，不抛错。

## 15. 语气

语气基于：地下电子音乐俱乐部灯光系统设计与施工；Banksy 式涂鸦鼠；自嘲的「下水道鼠王」；红猪式骑士精神（对客户有礼、对工艺认真）。

### 15.1 原则

- 先讲现场、系统、限制、预算，再讲效果。
- 短句、具体、克制；能用数字就不用形容词。
- 可以自黑，不贬低客户 / 同行。
- 不装艺术豪门；不吹「顶级 / 唯一 / 100%」。
- 不卖萌，不堆表情包；玩笑只冲事，不冲人。
- 承诺要能落地；做不到就说做不到，并给替代方案。

### 15.2 可 / 不可

| 可 | 不可 |
| --- | --- |
| 「这套系统跟 DJ 台走，不跑预设。」 | 「顶级沉浸式光影艺术盛宴。」 |
| 「两周落地，不影响营业。」 | 「行业首创，完美还原。」 |
| 「预算 7 万，能做；要更多得加钱或砍项。」 | 「预算不是问题，效果拉满。」 |
| 「我是下水道鼠王，活儿得干细。」 | 「鼠鼠我呀，今天也要努力呢。」 |

## 16. 背景使用规则

### 16.1 深色 / 浅色

- 深色 `#09090B` / `#121215`：用 bone `#F2EFE9` 的 logo 与文字；红只做小面积强调。
- 浅色 `#F2EFE9`：用 asphalt `#09090B` 的 logo 与文字；红可做强调。
- 红色不做大面积底色；朱红是信号，不是墙漆。

### 16.2 照片 / 视频

- 只把 logo / 文字放在相对平静的区域。
- 先加 **40–60% 同色遮罩**：深底用 asphalt，浅底用 bone；再放 logo / 文字。
- 不得直接压在繁忙高光、频闪或高对比纹理上。
- 对比度至少按正文 **4.5:1**、大 logo **3:1** 检查。
- 遮罩属于背景层，不是 logo 效果；不用阴影 / 渐变 / 发光给 logo 补对比。

### 16.3 预设色

- 预设 A 薄荷青 `#AAF0CE`：用 asphalt 图形 / 文字，红只做小面积。
- 预设 C 激光绿 `#CCFF00`：用 asphalt，避免红绿相邻的高饱和冲突。
- 两个预设仍只是可切换项，不得当默认主题。

### 16.4 index 示例

index 第 09 节用 4 个 CSS 瓦片示意：深色、浅色、照片渐变 + 55% asphalt 遮罩、预设 A。示例不含真实照片；实际遮罩在 40–60% 内按对比度实测调整。

## 17. 印刷（换算参考，未打样）

### 17.1 色值

| Token | HEX | RGB | CMYK 换算参考 | Pantone 参考（未打样） |
| --- | --- | --- | --- | --- |
| `--vi-bg-asphalt` | `#09090B` | 9, 9, 11 | C18 M18 Y0 K96 | Black 6 C |
| `--vi-bg-concrete` | `#121215` | 18, 18, 21 | C14 M14 Y0 K92 | Black 3 C |
| `--vi-stencil-white` | `#F2EFE9` | 242, 239, 233 | C0 M1 Y4 K5 | Warm Gray 1 C |
| `--vi-tech-grey` | `#78756F` | 120, 117, 111 | C0 M3 Y7 K53 | 404 C |
| `--vi-grid-line` | `rgba(242,239,233,.12)`；合成约 `#252526` | 242, 239, 233 / 12% | 骨白 12% 网点；合成约 C3 M3 Y0 K85 | Warm Gray 1 C 12% |
| `--vi-accent-signal` | `#FF3B1D` | 255, 59, 29 | C0 M77 Y89 K0 | 172 C |

- CMYK 为 naive sRGB→CMYK 换算，**不是 ICC 分色**；Pantone 只是参考，不是已确认色。
- 上表只作沟通 / 换算参考，不构成印刷指定色；实际以打样为准。
- 深色需 GCR / 总墨量控制；大面积黑先打样，别直接上量产。
- 网格线按骨白 12% 网点处理，叠在沥青上合成约 `#252526`。

### 17.2 文件与工艺

- 矢量 SVG / PDF/X-4；全部转 CMYK。
- 位图 ≥ 300dpi；字体转曲。
- 出血 3mm；安全边 5mm。
- 深底印刷需白墨或专色；1px 网格线按最小可印线宽放大。
- 先数码打样或上机打样，确认黑位、专色与网点后再批量。
- CMS（色彩管理）按打样结果校正；未打样前所有 CMYK / Pantone 只作沟通值。

## 18. 授权（正式版 v1.0）

### 18.1 适用范围

本条款适用于鼠王 / ratking.me 的品牌标识（以下简称“Logo”，含 `rat.js` 生成的工程鼠主标、badge、静态 SVG）、VI 规范与规范资产（网格、锁定组合、字体排印系统、色彩 token、Logo 动效脚本与参数、本页与 VI.md 文档）。摄影作品、第三方字体、站点源代码不在此列：摄影按各案例署名，字体按 SIL OFL 1.1，代码按仓库许可。

### 18.2 Logo 与 VI 资产

- 鼠王本人及 ratking.me 自有项目可无限使用；不转让、不转授权、不售卖 Logo 本身。
- 合作方须取得书面许可，写明项目、渠道、期限、尺寸与署名；许可不得转授第三方。
- 为报道 / 评论 ratking.me 可展示 Logo，须注明 `ratking.me` 并链接；不得暗示背书。
- 编辑引用不代表许可合作；超出评论范围的商用需另行书面许可。

### 18.3 允许

- 在品牌自有网站、作品集、提案、报价、合同、社媒头像与现场物料中使用 Logo 与 VI 资产。
- 按 VI 第 06 / 13 节的尺寸、安全区、配色与构造规则做等比缩放与单色切换。
- 在经书面许可的客户案例中展示；摄影与出镜另按案例 credit 署名。
- 在技术文档、设计评审与教学中引用本页链接，并保留出处。

### 18.4 禁止

- 拉伸、压扁、旋转、倾斜、改主体色、改瞳孔 / 闪电红、加描边 / 阴影 / 渐变 / 发光。
- 拆碎片另组标识，或把 badge 当主 Logo 拉伸；不得手画、描摹、伪造“官方 Logo”。
- 把 Logo 或 VI 资产注册为商标、外观设计、域名、账号名，或申请为他人所有。
- 未经许可暗示与鼠王 / ratking.me 的合作、赞助、认证或背书。
- 单独售卖、再许可、打包为模板 / 素材库，或移除版权与许可标识。
- 用于违法、欺诈、侵权、仇恨、色情、赌博等损害品牌声誉的场景。

### 18.5 字体

- `Chivo Mono 700` 由 Omnibus-Type 以 **SIL OFL 1.1** 发布，允许商用、嵌入、修改与再分发；再分发须保留版权与许可文本，不得单独售卖字体。
- 字体许可独立于本品牌条款；字体不因收录进 VI 而变成鼠王专属资产。
- OFL 全文：`brand/vi/assets/OFL-ChivoMono.txt`；官方来源：https://github.com/Omnibus-Type/Chivo 。
- 网页交付使用 woff2 子集（10,756 bytes）；不得把字体文件当作 Logo 或商标的一部分注册。

### 18.6 摄影

- 按各案例 `credit` 署名；Pillbox 现场摄影 **@AkilouPhoto**（Akilou Photo）。
- 不裁水印，不二次分发原图；商业使用另取授权。

### 18.7 署名与联系

- 必署：`STENCIL_SIGNAL · 鼠王` / `ratking.me`；可链接 https://ratking.me 。
- 摄影：按案例 frontmatter 的 `credit` 署名；Pillbox 现场摄影 `@AkilouPhoto`。
- 许可、商用、合作与侵权联系：**ratking.me**（站内联系入口）。本规范不提供私人邮箱。
- 许可被撤销或发现违约时，应立即停止使用并删除相关物料；已产生的第三方权利不因此自动转移。

### 18.8 English summary

The STENCIL_SIGNAL / 鼠王 logo, VI system and its assets are brand property of ratking.me. They may be used by the owner without restriction, by partners only under written permission, and by editors for commentary with clear credit and a link to ratking.me. Do not alter, stretch, recolor, split, register, sublicense or sell the marks, or imply endorsement. Chivo Mono is licensed separately under SIL OFL 1.1. Photography credits follow each case. Contact: ratking.me. This is a brand usage policy, not legal advice.

### 18.9 声明

**本条款为品牌使用规范，非法律意见。** 具体许可范围以双方书面协议为准。v1.0 定稿 · 2026-11-12。

## 19. 静态资产与交付

### 19.1 文件

| 文件 | 大小 | md5 | viewBox | 内容 |
| --- | --- | --- | --- | --- |
| `stencil-rat-bone.svg` | 1,711 bytes | `1c6c3fdc407684870c7f819ad1fcd49c` | 270 × 240 | `__VI_RAT__()`，`currentColor` → `#F2EFE9` |
| `stencil-rat-asphalt.svg` | 1,711 bytes | `2cd5deff16e7464db7bf2b6f7244497e` | 270 × 240 | `__VI_RAT__()`，`currentColor` → `#09090B` |
| `stencil-rat-badge.svg` | 1,409 bytes | `06853f20667f35a5536dbac049791c96` | 120 × 120 | `__VI_RAT_BADGE__()` 原样 |
| `ChivoMono_Bold.woff2` | 10,756 bytes | `3f2e83f654dae75e0ff589004ba8d007` | — | Chivo Mono 700 woff2 子集 |
| `OFL-ChivoMono.txt` | 4,385 bytes | — | — | SIL OFL 1.1 全文 |
| `rat-motion.js` | 15,537 bytes | — | — | Logo 尾巴 / 电钻动效驱动 |

### 19.2 生成与校验

- 静态 SVG 生成：Node `vm` 加载 `brand/vi/assets/rat.js`，调用 `window.__VI_RAT__()` / `window.__VI_RAT_BADGE__()`；bone / asphalt 用字符串替换 `currentColor`。
- 不添加 XML 声明，不添加末尾换行；与页面旧 Blob 下载内容逐字节一致。
- 校验：重算三个字符串并与文件内容比较，必须完全一致；`rat.js` md5 必须仍为 `7459637a66629e1451c4f57513ca515e`。
- 动效校验：`rat-motion.js` 只操作 `[data-part]` 元素；不写入静态文件；页面加载后检查 spark 只存在于实时 SVG，下载的 SVG 不含 spark。
- 字体校验：woff2 大小 10,756 bytes、md5 `3f2e83f654dae75e0ff589004ba8d007`；OFL 文本存在且含 “SIL Open Font License, Version 1.1”。
- 任何不一致先查 `rat.js`、字体子集或生成方式，不得手改 SVG 对齐。

### 19.3 命名与引用

- 交付资产统一 `stencil-rat-*`；`vi-*` 只保留 VI 页内部 CSS / JS / 旧文案，不再用于新资产。SVG 内部仍带 rat.js 原有的 `vi-rat` / `vi-rat-badge` class，这是源字符串的一部分，不改；命名规范只约束交付文件名。
- index 05 节使用静态链接：`<a class="btn" href="./assets/stencil-rat-bone.svg" download>` 等；页面 logo 仍由 rat.js 动态渲染。
- 不再使用 `.vi-download` 类；旧 Blob 下载 JS 已移除，避免拦截静态链接。
- 新增资产必须先定名、再由 rat.js 生成、再登记大小与 md5，最后接入页面。
- Logo 动效只引用 `rat-motion.js`，不把动画写进 `rat.js` 或静态 SVG；新增动效参数先改第 14.4 节，再改脚本。

---

维护：鼠王。v1.0 定稿：2026-11-12。视觉以 `brand/vi/index.html` 为准。
