# 鼠王 Ratking

鼠王 Ratking 的个人网站，基于 Astro 7 构建，部署域名为 <https://wangmingshu.me>。

站点以中文为主站，`/en` 为英文副站；视觉使用 VI v1.0 的工程鼠主标与 Chivo Mono 字体。

## 本地开发

项目自带 Node，无需使用系统 Node。先把它加入 `PATH`：

```sh
export PATH="$PWD/.tools/node/bin:$PATH"
```

常用命令：

```sh
npm run dev      # 启动开发服务器
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 内容结构

- `/` — 首页
- `/works/pillbox` — 作品案例页
- `/contact` — 联系页
- `/privacy` — 隐私政策
- `/cookies` — Cookie 说明
- `/en`、`/en/works/pillbox`、`/en/contact`、`/en/privacy`、`/en/cookies` — 英文副站

页面源码位于 `src/pages/`，布局在 `src/layouts/`，首页各区块在 `src/sections/`，样式在 `src/styles/`，静态资源在 `public/`。

## 资源

- 字体：`public/fonts/` 下的 Chivo Mono Bold（VI v1.0）
- 品牌素材：`brand/vi/`
- OG 图：`public/assets/og/ratking-og.png`
