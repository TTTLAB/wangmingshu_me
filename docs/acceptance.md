# 验收报告

验收日期：2026-11-11（第四轮）
项目路径：`/Users/wangmingshu/Documents/ratking.me`
最终检查：`evidence/final-check-r2.json`；补充证据：`docs/design-references/r3/`、`comparisons-r3/`、`docs/design-references/r4/`、`comparisons-r4/`

## 环境与命令

| 项目 | 值 |
| --- | --- |
| 框架 | Astro 7.4.10 |
| Node | 22.23.4（工作区 `.tools/node`） |
| 动效库 | GSAP 3.13.0、Lenis 1.3.17、Three 0.187.0、troika-three-text、meshline |
| 开发服务器 | `export PATH="$PWD/.tools/node/bin:$PATH" && npm run dev` → http://localhost:4321 |
| 构建 / 预览 | `npm run build`；`npm run preview -- --port 4321` |
| 测试视口 | 375×812、430×932、768×1024、1280×800、1440×900、1920×1080，DPR1 |

## 路由（16 + 404）

| IT | EN |
| --- | --- |
| `/` | `/en` |
| `/contatti` | `/en/contacts` |
| `/politica-privacy` | `/en/privacy-policy` |
| `/politica-cookies` | `/en/cookies-policy` |

4 个 case（两语同 slug）：`migrazione-dati` / `data-migration`、`integrazione-dati-dashboard` / `data-integration-dashboard`、`formazione-power-bi` / `power-bi-training`、`dashboard-ux-design`。

构建结果：17 个 HTML；16 路由 200，任意未知路径 404。

## 验收表

结果只取三值：一致 / 有差距 / 未实现。

| 动效 | 结果 | 说明/证据 |
| --- | --- | --- |
| Loader（四角绿点、花瓣、双行文案、scramble、退出） | 有差距 | 代码时间线按源码；本轮无新 6 视口帧；第三轮 1440 对齐帧仍显示克隆 scramble 早于原站，两端起跑/挂载时刻不同，不能证明逐帧一致。 |
| Hero SplitText + 桌面/移动视频 + pin | 一致 | 视频、SplitText、pin 按原 chunk 参数对齐（字体按用户要求忽略）。 |
| Lenis 手感 | 一致 | `{autoRaf:false,syncTouch:true}` + `gsap.ticker` + `lagSmoothing(0)`。 |
| Navbar 下滚隐藏/上滚显示 | 一致 | 动态隐藏距离 `-(offsetHeight+rect.top+8)`。 |
| Menu 开合与遮罩/Esc | 一致 | 顺序 bg→values→links；面板、锁滚动、Esc 均按原 chunk 对齐。 |
| navbar--dark | 一致 | About/Cases 进入时切换，data-viz/services/footer 不切换。 |
| 250ms 页面过渡（out-in） | 有差距 | prefetch 已开，fetch 与 250ms 淡出并行；3 次 `/`→`/contatti` 总 509/509/519ms，URL 305-317ms；原站约 500ms，剩 +10-20ms。 |
| About 揭示 + 像素网格 + pin | 一致 | SplitText/网格/pin 的 start/end/scrub 按原 chunk 对齐。 |
| Data viz（pin/scrub/Three/veil/反向） | 有差距 | 重抓克隆 6 视口 × 0/25/50/75/100 共 30 帧、30 并排；默认 `CLOCK_OFFSET_SECONDS = 4.0` 后 1440 的 50/75 与原站对齐，1920/1280 仍有上下相位差（同一 offset 不普适）；0/100 正常，算法/几何正确。 |
| Services 视频 + 卡片 + hover | 一致 | 3 卡、3 视频、pin、绿色 conic 边框；GSAP 参数按原 chunk 对齐。 |
| Case list pin + hover pattern | 一致 | 4 行、pattern scaleX 0↔1.05、stagger .01 按原 chunk 对齐。 |
| Case detail 8 路由 + 标题/段落 | 一致 | 标题/段落 SplitText 与 reveal 参数按原 chunk 对齐。 |
| Call pin + 圆点 + 标题 | 一致 | 1440 true 50%（#contact top+750）两端圆环弧线可见且一致；`r3-states.json` 的 80%（top+1200）采样三个 circle 的 scale/opacity/rect 差 ≤2px；标题 80 chars 全可见；CTA rect 差 2-3px。 |
| Footer WebGL + marquee | 一致 | 原 shader 全量；网格线位置逐像素一致（PIL 采样 y=350/450/550）；marquee 约 95px/s。 |
| Contact 多步 mock | 一致 | 3 步/4 导航项、校验、摘要、成功态；按任务要求不请求外部服务，无 POST/fetch/XHR。 |
| Cookie 弹层 | 一致 | 6 视口首屏原/克隆 12 张 + 6 并排，外观一致；3 状态 × 两端并排（first/prefs/after）；vanilla-cookieconsent 3.3.0，categories necessary/analytics/profiling，`consent__cookie`；接受后隐藏、刷新不弹。 |
| Hover 微交互（Logo 等） | 有差距（证据不足） | 克隆有 `micro-v2b` 帧；原站未逐项录屏，无法逐项对照。 |
| Mobile | 一致 | 6 视口无横向溢出；字体按用户要求本轮忽略。 |
| prefers-reduced-motion | 一致 | 最终检查通过：loader 隐藏、内容可见、平滑关闭、过渡即时。 |

## 检查结果

- `evidence/final-check-r2.json`：102 路由截图、102 并排；26 状态帧、18 状态并排；failures 0。
- 第三轮产物：`docs/design-references/r3/` 122 文件；`comparisons-r3/` 58 张（dataviz 30、states 12、loader 6、cookie 3、2560 4、dataviz-aligned 3）。
- 第四轮产物：`docs/design-references/r4/` 76 文件；`comparisons-r4/` 53 张（dataviz 30、2560 17、cookie 6）。
- Data viz（第四轮）：重抓克隆 6 视口 × 0/25/50/75/100 = 30 帧、30 并排；默认 +4s offset 在 1440 的 50/75 与原站对齐，1920/1280 仍有上下相位差；0/100 正常。
- 过渡（第四轮）：3 次 `/`→`/contatti`，总 509/509/519ms，URL 305-317ms；fetch 与 250ms 淡出并行，另加 prefetch。
- 2560（第四轮）：17 路由 × 原/克隆各 1 张 + 17 并排；`scrollWidth==clientWidth`，全部无 overflow。
- Cookie（第四轮）：6 视口首屏原/克隆 12 张 + 6 并排，外观一致。
- 两端 dataviz 都在 `__dvMount + T`、`preserveDrawingBuffer`、停止 rAF 后抓帧。
- Call：true 50% 两端圆环弧线一致；80% 采样 metrics 差 ≤2px；标题/CTA 差 2-3px。
- About-50：原站 1440 已补 `r3/original/about-50.png`；克隆 5 行 vs 原 4 行，纯字体差，按用户要求忽略。
- 6 视口 `scrollWidth==clientWidth`，无横向溢出。
- console 仅 6 条有意 404；pageErrors 0。
- 未发现被禁用的外部请求（Typekit/analytics/reCAPTCHA/CMS/表单 API）；reduced-motion 通过。
- Loader 本轮无新 6 视口帧；第三轮 1440 对齐帧仍显示克隆 scramble 早于原站。
- `npm run build`：17 pages 通过。

## 结论

- 第四轮关闭 2560 全路由（17）与 Cookie 6 视口；Data viz 加 4s offset 后 1440 的 50/75 对齐，1280/1920 仍有相位差。
- 剩余非字体差距：Data viz 1280/1920 时钟相位、Loader 帧同步且 6 视口未补、过渡 509-519ms（+10-20ms）、hover 证据不足；字体忽略；详见 `docs/gaps.md`。
- 不声称像素级完美。
