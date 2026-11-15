# 鼠王站文案手改目录

> 给鼠王在 VSCode 里改字用。当前站是**中文主站 + `/en` 英文副站**，共 **11 个 HTML**：10 个内容路由 + 404。  
> 本指南只说明文案在哪里、怎么改；不修改任何站点内容，也不评价视觉。

## 1. 打开、预览、保存

- 用 VSCode 打开绝对路径：`/Users/wangmingshu/Documents/ratking.me`
- 中文预览：<http://127.0.0.1:4321/>
- 英文预览：<http://127.0.0.1:4321/en/>
- 开发服已用 `./node_modules/.bin/astro dev --host 127.0.0.1 --port 4321` 启动。正常保存后 Vite HMR 自动更新；`.astro`、`.ts`、`.json`、`src/scripts/*.js` 一般不用手动刷新，若页面没变，先按一次浏览器刷新。
- `public/site.webmanifest`、favicon/OG 等静态资源属于“静态文件”，保存后刷新页面即可；`astro.config.mjs` 或 `src/layouts/BaseLayout.astro` 的结构性修改建议重启 dev。
- **不要改** `dist/`、`node_modules/`、`.tools/`、`.ratking-logs/`；不要编辑 `brand/` 或 `brand/作品素材/` 的原件。
- 只改文案时不要动路由、class、href 结构、GSAP/Three 参数、颜色 token、尺寸、条件判断。

## 2. 文案相关目录树

```text
/Users/wangmingshu/Documents/ratking.me/
├── src/
│   ├── data/
│   │   ├── site.ts          # 品牌名、导航、菜单、页脚、语言切换标签
│   │   ├── home.ts          # 首页全部中英文案
│   │   ├── cases.json       # 案例页全部中英文案（含 HTML 段落/alt）
│   │   ├── cases.ts         # 读取/类型/查找，不写正文
│   │   ├── contact.ts       # 联系页与表单全部中英文案
│   │   ├── legal.json       # 隐私/Cookie 正文
│   │   └── legal.ts         # 隐私/Cookie 标题/SEO/读取
│   ├── pages/
│   │   ├── index.astro      # 中文首页：只传 props/组装
│   │   ├── contact.astro    # 中文联系页：抓数据并传 lang
│   │   ├── privacy.astro    # 中文隐私页
│   │   ├── cookies.astro    # 中文 Cookie 页
│   │   ├── works/[slug].astro
│   │   ├── en/index.astro
│   │   ├── en/contact.astro
│   │   ├── en/privacy.astro
│   │   ├── en/cookies.astro
│   │   ├── en/works/[slug].astro
│   │   └── 404.astro         # 中文 404（标题/描述/正文硬编码）
│   ├── components/
│   │   ├── Footer.astro      # 页脚结构、空联系链接、credits
│   │   ├── Navbar.astro      # 顶栏 logo aria / 语言切换 / 菜单按钮 aria
│   │   ├── NavMenu.astro     # 菜单 aria / 联系信息
│   │   ├── NavSpy.astro      # 首页章节导航标签
│   │   ├── Loader.astro      # loader 两行硬编码标签
│   │   ├── ContactPage.astro # 联系页结构/字段/aria
│   │   ├── CasePage.astro    # 案例页结构/字段
│   │   ├── LegalPage.astro   # 法律页结构
│   │   ├── CookieConsent.astro
│   │   └── sections/         # 首页各节结构；正文多来自 home.ts
│   ├── layouts/
│   │   └── BaseLayout.astro  # SEO title/description/canonical/OG、meta
│   └── scripts/
│       ├── cookies.js        # cookie 弹窗/偏好弹窗中文文案
│       ├── loader.js         # loader 时序；可见标签在 Loader.astro
│       ├── contact.js        # 表单校验/成功逻辑（错误文案来自 contact.ts）
│       ├── menu.js           # 菜单行为；不含正文
│       ├── nav-spy.js        # 章节观察；标签来自 NavSpy.astro
│       └── home/dataviz.js   # SVG 曲线标签 LIGHTING/CONTROL/INSTALLATION/SIGNAL
└── public/
    └── site.webmanifest      # PWA name/short_name
```

## 3. 中英配对总表

| 内容 | 中文 | 英文 |
| --- | --- | --- |
| 品牌名 | `src/data/site.ts` → `site.name` | 同左（中英共用一个） |
| 顶栏/菜单导航 | `shell.zh.nav`（L33–37） | `shell.en.nav`（L58–62） |
| 菜单按钮/关闭/aria | `shell.zh.menuLabel/closeLabel/menuAria`（L30–32） | `shell.en.menuLabel/closeLabel/menuAria`（L55–57） |
| 菜单联系信息 | `shell.zh.info`（L38–41） | `shell.en.info`（L63–66） |
| 页脚标题/marquee | `shell.zh.footerLabel/footerMarquee`（L42–43） | `shell.en.footerLabel/footerMarquee`（L67–68） |
| 页脚导航 | `shell.zh.footerNav`（L44–48） | `shell.en.footerNav`（L69–73） |
| 页脚法律链接/管理/credits | `shell.zh.privacy/cookies/manage/credits`（L49–52） | `shell.en.privacy/cookies/manage/credits`（L74–77） |
| 首页全部文案 | `src/data/home.ts` 的 `zh`（L7–63） | 同文件 `en`（L67–123） |
| 案例页 | `cases.json` 中 `"lang":"zh"` 的对象 | 同文件 `"lang":"en"` 的对象 |
| 联系页/表单 | `contact.ts` 的 `zh`（L3–44） | 同文件 `en`（L46–94） |
| 隐私/Cookie | `legal.json` 的 `zh` + `legal.ts` 的 `legalPages.zh` | `legal.json` 的 `en` + `legal.ts` 的 `legalPages.en` |
| Cookie 弹窗 | `src/scripts/cookies.js` 的 `translations.zh`（L15–42） | `translations.en`（L43–71） |
| SEO title/description | 各页面 `BaseLayout` props（见第 5 节） | 各 `en/` 页面 props |
| 404 | `src/pages/404.astro`（只中文） | 无独立英文 404 |

## 4. 数据源 vs 渲染组件

- **主文案数据源**：`site.ts`、`home.ts`、`cases.json`、`contact.ts`、`legal.json`。优先改这里。
- **页面**：`src/pages/*.astro` 只选择 `zh/en`、传 `title/description/alternate`，不重复正文。改正文不要只改页面壳。
- **渲染组件**：`Footer/Navbar/NavMenu/NavSpy/Loader/ContactPage/CasePage/LegalPage/sections` 读取上述数据；组件内硬编码少量 aria/标签/结构文字，需单独处理。
- **同一字段影响多处**：`site.ts` 的 `nav`/`footerNav` 同时影响顶栏、菜单、页脚；`home.ts` 的 `caseItems` 同时影响首页案例列表；`cases.json` 同一对象同时供案例页和（经由数据）next 链接。
- **不是文案、不要当文案改**：`routes` 的路径、`href`/`hash` 结构、`class`、`data-*`、GSAP/Three 参数、颜色 token、尺寸、`lang`/`theme` 条件、`footerTheme`、`page` 类型、图片路径/文件名。需要改链接请单独确认。

## 5. 逐项清单

> 行号是本次扫描时的 `nl -ba` 参考；改完可能移动，请用「检索关键词」重新定位。

### 5.1 全局品牌 / 导航 / 菜单 / 页脚

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/data/site.ts:3-9` | `site.name`、`email`、`emailMenu`、`phone`、`phoneHref` | 品牌名；空联系方式是当前设计，不要为填空而编造 |
| `src/data/site.ts:28-53` | `shell.zh.menuLabel`、`closeLabel`、`menuAria`、`nav`、`info`、`footerLabel`、`footerMarquee`、`footerNav`、`privacy`、`cookies`、`manage`、`credits` | 中文全局；`nav` 的 `label` 是菜单/页脚共用文案 |
| `src/data/site.ts:54-79` | `shell.en.*` | 英文对应；`footerNav` 的 href 也在这里 |
| `src/components/Navbar.astro:20` | `aria-label="鼠王 Ratking — home"` | 顶栏 logo 的可访问名称（当前中英共用英文 home 字样，可按需改，不要破坏引号） |
| `src/components/Navbar.astro:25` | `aria-label="Language"` | 语言切换组 aria |
| `src/components/Navbar.astro:29` | `aria-label={copy.menuLabel}` | 菜单按钮 aria 来自 `site.ts` |
| `src/components/NavMenu.astro:14,17` | `closeLabel`、`menuAria` | 关闭按钮/菜单 nav aria |
| `src/components/NavMenu.astro:33-55` | `info.connect`、`info.phone`、email/phone | 菜单联系人；空值时显示 `—` |
| `src/components/Footer.astro:17-29` | `footerNav`、`item.label/index` | 页脚三项导航 |
| `src/components/Footer.astro:35-50` | `footerLabel`、`site.email/phone` | 有值显示 mailto/tel；空时走下一分支 |
| `src/components/Footer.astro:52-62` | `infoEmpty`? / `联系页` / `Contact page` | 当前空联系方式显示「联系页」或「Contact page」，链接到联系页；这是预期 |
| `src/components/Footer.astro:81-92` | `copy.privacy/cookies/manage/credits` | 底部法律链接、Cookie 管理、credits |
| `src/layouts/BaseLayout.astro:48-55` | `creator`、`og:site_name`、`og:*` | 品牌/SEO 共用；正文 title/description 来自页面 props |

### 5.2 首页（`home.ts`）

| 中文行 | 英文字段 | 键名/关键词 |
| --- | --- | --- |
| L7-10 | L67-70 | `meta.title` / `meta.description` |
| L14-17 | L74-77 | `heroDescription`、`heroTitle`、`scrollLabel` |
| L18-19 | L78-79 | `aboutTitle` |
| L20-25 | L80-85 | `dataVizText`、`dataVizCenterTitle`、`dataVizCenterText`、`dataVizCta` |
| L26-48 | L86-108 | `servicesTitle`、`servicesText`、`services[]`（`title/index/text/image`） |
| L49-59 | L109-119 | `casesTitle`、`casesText`、`caseItems[]`（`href/index/title/year/type`） |
| L60-63 | L120-123 | `callTitle`（含 `<span>`）、`callText`、`callCta` |

- 首页组件：`src/pages/index.astro:14-36`、`src/pages/en/index.astro` 对应；正文不要复制进组件。
- Hero/About/DataViz/Services/Cases/Call 的标签和结构在 `src/components/sections/*.astro`；大部分可见文字来自 `home.ts`。
- `heroDescription`、`callTitle` 含 HTML（`<em>`/`<span>`/`<br>`）；只改可见字，保留标签。

### 5.3 案例页

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/data/cases.json:1-126` | `slug`、`lang`、`route`、`alternate`、`h1`、`index`、`head`、`metaTitle`、`metaDescription`、`scrollLabel` | 中英各一个对象；`route/alternate` 是链接结构，不要当正文改 |
| `src/data/cases.json` 的 `infos[]` | `label`、`value` | 场地/类型/预算/周期/角色 |
| `src/data/cases.json` 的 `sections[]` | `label`、`html` | 段落、`<figure>` 图注、`img alt` 都在这个 HTML 字符串里；改可见字/alt 时保留 HTML 标签和引号 |
| `src/data/cases.json:57-61` / `119-123` | `next.href`、`next.label`、`nextTitle` | 下一篇/CTA；`href` 非文案 |
| `src/data/cases.ts:24-30` | `cases`、`getCase` | 只读取/查找，不写正文 |
| `src/pages/works/[slug].astro`、`en/works/[slug].astro` | `getStaticPaths`、`CasePage` | 路由生成；不要在里面写正文 |
| `src/components/CasePage.astro:13-65` | `study.h1/head/infos/sections/scrollLabel/next*` | 渲染；`set:html` 渲染 sections 的 HTML |

### 5.4 联系页与表单

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/data/contact.ts:4-8` | `meta.title/description` | 页面 SEO |
| `src/data/contact.ts:9-10` | `infoLabel`、`infoEmpty` | 联系方式标题/空值说明 |
| `src/data/contact.ts:11-15` | `title`、`nav`、`serviceTitle`、`services` | 标题/四步导航/服务选项 |
| `src/data/contact.ts:16-27` | `fields`、`placeholders` | 字段标签/占位符 |
| `src/data/contact.ts:28-36` | `summaryTitle`、`summary` | 确认页 |
| `src/data/contact.ts:37-44` | `hint`、`ok`、`back`、`next`、`required`、`invalidEmail`、`successTitle`、`successText`、`successAgain` | 按钮/校验/演示成功文案 |
| `src/data/contact.ts:46-94` | 英文对应 | 英文逐项同名 |
| `src/components/ContactPage.astro:37-150` | 字段结构/`data-*`/aria | 文案来自 `contact.ts`；错误/成功逻辑不在这里 |
| `src/scripts/contact.js:149-178` | `showSuccess`、`data-next`、`data-submit` | 前端 mock，不请求后端；不要加 fetch/XHR |
| `src/pages/contact.astro:8-17`、`en/contact.astro` | `title/description/alternate` | 只在页面传数据 |

### 5.5 隐私 / Cookie

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/data/legal.json:1-18` | `zh.privacy.content`、`zh.cookies.content`、`en.*` | 正文主体；内容为 HTML/字符串 |
| `src/data/legal.ts:6-35` | `legalPages.zh/en.privacy/cookies.title/metaTitle/metaDescription/content` | 标题/SEO/读取正文 |
| `src/pages/privacy.astro`、`cookies.astro`、`en/privacy.astro`、`en/cookies.astro` | `LegalPage lang kind` | 路由壳；正文在 data |
| `src/components/LegalPage.astro:13-30` | `page.title/metaTitle/metaDescription/content` | 渲染 |
| `src/scripts/cookies.js:14-42` | `translations.zh.consentModal/preferencesModal` | 弹窗标题/说明/按钮/偏好分类 |
| `src/scripts/cookies.js:43-71` | `translations.en.*` | 英文对应 |
| `src/components/CookieConsent.astro:1-12` | 容器/aria | 结构，不含正文 |
| `src/pages/*` 的 `title/description` | 页面 SEO | 见各页面 |

> Cookie 库内部默认文案在 `node_modules`，不是手改目标；站点文案以 `cookies.js` 的 translations 为准。

### 5.6 SEO / manifest / 图标

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/layouts/BaseLayout.astro:36-55` | `title`、`description`、`canonical`、`og:*`、`creator` | 页面标题/描述由 props 传入；canonical 自动由 `Astro.site` + pathname 生成 |
| 各 `src/pages/**/*.astro` | `title={...}`、`description={...}` | 首页/联系/案例/法律页面的 SEO 入口 |
| `public/site.webmanifest:2-3` | `name`、`short_name` | PWA 名称 |
| `src/layouts/BaseLayout.astro:56-70` | favicon/apple-touch/manifest 链接 | 图标路径；alt/aria 在具体组件 |
| `src/components/Navbar.astro:20` | logo `aria-label` | 顶栏 logo 可访问名称 |
| `src/components/Footer.astro:65` | footer nav `aria-label={menuAria}` | 来自 `site.ts` |
| `src/components/ContactPage.astro:39,123` | `aria-label={c.summaryTitle}`、`aria-label={c.hint}` | 来自 `contact.ts` |
| `src/components/sections/Services.astro:33` | `alt="" aria-hidden="true"` | 服务图是装饰图；如要描述图片，需同时改 alt 并确认是否保留 aria-hidden |

### 5.7 脚本内硬编码

| 位置 | 文本/关键词 | 说明 |
| --- | --- | --- |
| `src/components/Loader.astro:7-8` | `鼠王 RatKing`、`Personal Website` | loader 两行；中英共用，不是 `home.ts` |
| `src/scripts/home/dataviz.js:44-47` | `LIGHTING`、`CONTROL`、`INSTALLATION`、`SIGNAL` | 曲线标签；不是首页正文 |
| `src/scripts/home/dataviz.js:23` | `CHARACTERS` | 乱码字符集，不是文案，不要翻成中文 |
| `src/scripts/cookies.js` | `translations.*` | 弹窗文案 |
| `src/scripts/loader.js` | 无可见正文；只有时序注释 | 不要为了改字改时序 |
| `src/scripts/menu.js` / `nav-spy.js` | 行为/aria 读取；菜单标签来自 `site.ts`/`NavSpy.astro` | 不要把行为参数当文案 |

### 5.8 404

| 位置 | 字段/关键词 | 说明 |
| --- | --- | --- |
| `src/pages/404.astro:5-16` | `title="404 — 页面不存在"`、`description`、`h1`、返回链接 | 只有中文 404；没有独立英文 404 |

## 6. 改字注意

1. 先确认改的是 `zh` 还是 `en`；两边同名键要分别改，不要只改一边。
2. 不改对象/数组的逗号、引号、反引号、模板字符串 `${...}`、HTML 标签、`<br>`/`<em>`/`<span>`；`set:html` 字段里的可见字可改，标签要保留。
3. `cases.json` 的 `sections[].html` 是 HTML 字符串：改段落/图注/`alt` 时保留标签与引号；不要改 `img src` 路径。
4. `.astro` 里的 `{...}` 是表达式，不要当字面文字改；只改引号内的文案或 data 字段。
5. 空联系方式/演示表单是已知设计：不要为「通过验收」填假邮箱/电话或接后端。
6. 保存后看 4321 对应语言页面；不生效先刷新，仍不生效再重启 dev。`dist/` 是构建产物，永远不要手改。
7. 改完抽查中英两页 + 首页/案例/联系 + 404，并检查没有破坏 HTML/JSON 语法。

## 7. 一句话分工

- 改正文 → 先看 `src/data/*`。
- 改页面标题/描述 → 看对应 `src/pages/*.astro` 的 `title/description` props。
- 改导航/页脚/GLOBAL → `src/data/site.ts`。
- 改弹窗/loader/图表硬编码 → `src/scripts/cookies.js`、`src/components/Loader.astro`、`src/scripts/home/dataviz.js`。
