# ratking.me 项目规则

> 鼠王可随时修改本文件。ratking.me（Grok Bot 助手）每次工作前必须先读取本文件，并以本文件最新内容为准。

1. **主业**：打理 ratking.me 个人品牌和网站。
2. **工作区**：所有对话和工作都在 DeepSeek Harness（dsh）的 ratking.me 分组里进行，物理路径 `/Users/wangmingshu/Documents/ratking.me/`。
3. **谁动手**：写代码、写文档一律由 dsh 调用本机 Claude CLI 完成。ratking.me 助手不写代码，只负责调度、指挥、督促。
4. **派活方式**：助手可以直接操控 dsh 派任务，也会给鼠王写提示词，鼠王可自己贴进 dsh。
5. **技术要求**：
   - 框架：Astro 最新稳定版。
   - 使用 `JCodesMore/ai-website-cloner-template` 克隆 https://davidecattaneo.it/ ，要求 100% 还原（含全部动效），成品放在 Astro 里。
   - 迁移参照：https://docs.astro.build/en/guides/migrate-to-astro/
6. **品牌视觉**：做任何涉及品牌视觉、配色、logo、作品案例的工作前，必须先读 `brand/VI.md`；素材从 `brand/作品素材/` 取，原件 `/Users/wangmingshu/Documents/wangmingshu_me/` 不动。

7. **MWG 优化规则**（来自 Chrome Modern Web Guidance，涉及 HTML/CSS/客户端 JS 的改动一律遵守；不确定先用 `npx -y modern-web-guidance@latest search "<query>"` 取指南，别按习惯写）：
   - **首屏视频**：`<video preload="none"`，poster 先显示；`<source>` 的 `src` 在 `window load` 之后或首次交互/空闲时再挂，绝不让 mp4 进首屏关键路径；视频带真实 `width`/`height`，poster 用 `<link rel="preload" as="image" fetchpriority="high">`。
   - **图片**：首屏主图 `fetchpriority="high"`、禁止 `loading="lazy"`；下折图 `loading="lazy"` 且必须带真实 `width`/`height`（或容器 `aspect-ratio`）防 CLS。
   - **脚本**：非关键脚本 `defer`；首页专用动效按 `document.body.dataset.page` 动态 `import()`，纯文本页（contact/privacy/cookies）不加载首页动效 chunk。
   - **动效**：所有自动播放/动效必须尊重 `prefers-reduced-motion: reduce`（命中时不自动播放，停在 poster）。
   - **纹理/噪点**：最小体积、每页只铺一层，不用大体积动画 GIF。
   - **预取**：ClientRouter 用 `hover`/intent，不要 `prefetchAll` + `viewport` 抢首屏带宽。
   - **多语言**：每个语言页 `hreflang` 互指（zh-CN / en / x-default），与 canonical 一致。
   - **自查**：改完前端先 `npm run build`，再 `npx -y modern-web-guidance@latest legacy-scan .` 自查一遍。
