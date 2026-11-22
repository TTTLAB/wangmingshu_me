// 微信内置浏览器（iOS WKWebView / Android XWeb）专项处理。
// 只在 UA 含 MicroMessenger 时生效，其他浏览器零改动。

let cached = null;
let inited = false;

export function isWeChat() {
  if (cached === null) {
    cached =
      typeof navigator !== 'undefined' &&
      /MicroMessenger/i.test(navigator.userAgent || '');
  }
  return cached;
}

// Android 微信「设置 → 通用 → 字体大小」会通过 WebView textZoom 放大网页，
// CSS 的 text-size-adjust 拦不住，排版（大标题断行、导航、案例卡片）会被撑坏。
// 非公开桥接口 setFontSizeCallback({ fontSize: 0 })（社区通行写法，尽力而为，
// 新版 XWeb 是否仍生效需真机确认；invoke 是异步的，接口不存在时静默无效）把网页字号锁回标准；
// 用户在页内菜单改字号（menu:setfont）时再锁一次。iOS 由 CSS 的
// -webkit-text-size-adjust 处理，这里调用无副作用。
function lockFontSize() {
  const bridge = window.WeixinJSBridge;
  if (!bridge || typeof bridge.invoke !== 'function') return;
  const reset = () => {
    try {
      bridge.invoke('setFontSizeCallback', { fontSize: 0 });
    } catch (_) {
      /* 旧版本没有该接口，保持现状 */
    }
  };
  reset();
  try {
    bridge.on('menu:setfont', reset);
  } catch (_) {
    /* ignore */
  }
}

function applyRootClasses() {
  const root = document.documentElement;
  root.classList.add('is-wechat');
  if (/Android/i.test(navigator.userAgent)) root.classList.add('is-wechat-android');
}

// 模块只执行一次（Astro ClientRouter 换页不重新执行入口），这里再加一道闸，
// 保证 bridge 回调和 after-swap 监听只绑一次。
export function initWeChat() {
  if (inited || !isWeChat()) return;
  inited = true;

  // Astro ClientRouter 换页时 swapRootAttributes 会清空 <html> 全部属性再照抄
  // 新文档，class 不保留；after-swap 在新页上屏前同步触发，补回不闪。
  applyRootClasses();
  document.addEventListener('astro:after-swap', applyRootClasses);

  if (window.WeixinJSBridge) {
    lockFontSize();
  } else {
    document.addEventListener('WeixinJSBridgeReady', lockFontSize, { once: true });
  }
}
