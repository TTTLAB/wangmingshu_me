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
