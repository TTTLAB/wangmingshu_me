#!/usr/bin/env node
/**
 * 静态链接检查：扫描 dist/ 下的 HTML，提取本地 a[href]、img[src]、
 * script[src] 与 link[rel=stylesheet|icon|preload|manifest|apple-touch-icon]
 * 的引用，按静态站点的路径映射校验目标文件是否存在。
 *
 * 用法：node scripts/check-links.mjs
 * 退出码：0 = 全部存在；1 = 有缺失或 dist/ 不存在。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const LINK_RELS = new Set(['stylesheet', 'icon', 'preload', 'manifest', 'apple-touch-icon']);
// 404 页的 canonical 指向 /404/ 属于已知假阳性；alternate 指向 /bio.md 等原始文件。
const SKIP_RELS = new Set(['canonical', 'alternate']);

const dirCache = new Map();

function listDir(dir) {
  if (!dirCache.has(dir)) {
    try {
      dirCache.set(dir, new Set(fs.readdirSync(dir)));
    } catch {
      dirCache.set(dir, null);
    }
  }
  return dirCache.get(dir);
}

// 逐段大小写精确地判断文件存在（macOS 默认不区分大小写，部署环境区分），
// 同时拒绝符号链接，避免 dist 内的链接把检查带出目录。
function fileExistsExact(file) {
  const rel = path.relative(DIST, file);
  if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) {
    return false;
  }
  const parts = rel.split(path.sep);
  let current = DIST;
  for (let i = 0; i < parts.length; i++) {
    const names = listDir(current);
    if (!names || !names.has(parts[i])) return false;
    const next = path.join(current, parts[i]);
    let stat;
    try {
      stat = fs.lstatSync(next);
    } catch {
      return false;
    }
    if (stat.isSymbolicLink()) return false;
    const last = i === parts.length - 1;
    if (last ? !stat.isFile() : !stat.isDirectory()) return false;
    current = next;
  }
  return true;
}

function walkHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function parseAttrs(raw) {
  const attrs = {};
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

function shouldSkip(ref) {
  const v = ref.trim();
  if (!v) return true;
  if (v.startsWith('#')) return true;
  if (v.startsWith('//')) return true; // protocol-relative
  if (v.includes('{{')) return true; // 构建期占位符
  // http(s)、mailto、tel、data、javascript 等带 scheme 的一律不看
  return /^[a-z][a-z0-9+.-]*:/i.test(v);
}

// urlPath 已去掉 #hash 与 ?query。
function resolves(sourceFile, urlPath) {
  let p = urlPath;
  try {
    p = decodeURIComponent(p);
  } catch {
    // 保留原样
  }
  // 去掉末尾斜杠（/ 本身保留），后面按同一套映射处理。
  if (p.length > 1) p = p.replace(/\/+$/, '');

  const rooted = p.startsWith('/');
  const target = rooted
    ? path.join(DIST, p)
    : path.resolve(path.dirname(sourceFile), p);

  // 越出 dist 的引用不属于本站，跳过。
  if (target !== DIST && !target.startsWith(DIST + path.sep)) return true;

  if (p === '/' || target === DIST) return fileExistsExact(path.join(DIST, 'index.html'));

  // /foo → dist/foo、dist/foo.html、dist/foo/index.html；
  // /404/ 归一化后同样命中 dist/404.html（Astro 的 404 约定）。
  return (
    fileExistsExact(target) ||
    fileExistsExact(target + '.html') ||
    fileExistsExact(path.join(target, 'index.html'))
  );
}

function collectRefs(html) {
  const refs = [];

  // 先摘出 <script> 开标签，再整段移除脚本/样式/注释，避免内联代码里的
  // HTML 字符串被误当成真实标签。
  const withoutScripts = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (_, attrs) => {
    const src = parseAttrs(attrs).src;
    if (src !== undefined) refs.push(src);
    return '';
  });

  const scan = withoutScripts
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  for (const m of scan.matchAll(/<a\b([^>]*)>/gi)) {
    const href = parseAttrs(m[1]).href;
    if (href !== undefined) refs.push(href);
  }
  for (const m of scan.matchAll(/<img\b([^>]*)>/gi)) {
    const src = parseAttrs(m[1]).src;
    if (src !== undefined) refs.push(src);
  }
  for (const m of scan.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = parseAttrs(m[1]);
    const rels = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rels.some((rel) => SKIP_RELS.has(rel))) continue;
    if (!rels.some((rel) => LINK_RELS.has(rel))) continue;
    if (attrs.href !== undefined) refs.push(attrs.href);
  }

  return refs;
}

let distStat;
try {
  distStat = fs.statSync(DIST);
} catch {
  // 落到下面的统一报错
}
if (!distStat || !distStat.isDirectory()) {
  console.error('错误：找不到 dist/ 目录。请先运行 `npm run build` 生成站点，再运行本脚本。');
  process.exit(1);
}

const htmlFiles = walkHtml(DIST);
if (htmlFiles.length === 0) {
  console.error('错误：dist/ 下没有任何 HTML 文件，构建可能不完整。请先重新运行 `npm run build`。');
  process.exit(1);
}
const missing = new Map();
let checkedRefs = 0;

for (const file of htmlFiles) {
  const source = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');

  for (const ref of collectRefs(html)) {
    if (shouldSkip(ref)) continue;
    const urlPath = ref.trim().split('#')[0].split('?')[0];
    if (!urlPath) continue;
    checkedRefs++;
    if (resolves(file, urlPath)) continue;
    const key = `${source}\0${urlPath}`;
    if (!missing.has(key)) missing.set(key, { source, target: urlPath });
  }
}

const printable = (s) => s.replace(/[\u0000-\u001f\u007f]/g, '');

if (missing.size > 0) {
  console.error(
    `链接检查失败：${htmlFiles.length} 个 HTML，${checkedRefs} 个本地引用，发现 ${missing.size} 处缺失：`
  );
  for (const { source, target } of [...missing.values()].sort(
    (a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target)
  )) {
    console.error(`  ${printable(source)} -> ${printable(target)}`);
  }
  process.exit(1);
}

console.log(
  `链接检查通过：${htmlFiles.length} 个 HTML，${checkedRefs} 个本地引用，未发现缺失。`
);
