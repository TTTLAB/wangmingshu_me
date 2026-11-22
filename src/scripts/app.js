import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { createLenis, destroyLenis, getLenis } from './lenis';
import { playLoaderOnce } from './loader';
import { initNavbar, cleanupNavbar, collapseNavbar } from './navbar';
import {
  initMenu,
  bindMenuTriggers,
  cleanupMenu,
  isMenuOpen,
} from './menu';
import { initPageTransitions } from './transition';
import { renderBrandLogos } from './logo';
import { initLogoTail } from './logo-tail';
import { initCookies } from './cookies';
import { initContactForm } from './contact';
import { initHeroVideo, cleanupHeroVideo } from './media';
import { initMarquee, cleanupMarquee } from './marquee';
import { initNoise } from './noise';
import { initWeChat } from './wechat';
import { initInteractiveGrids } from './home/interactive-grid';
import {
  initCaseReveal,
  initContactReveal,
  initLegalReveal,
  initBioReveal,
} from './home/case-reveal';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

// 微信内置浏览器：打 is-wechat 标记、锁 Android 字号缩放。非微信 UA 直接返回。
initWeChat();
CustomEase.create('menuEase', 'M0,0 C0.7,0.098 0.097,1 1,1');

let pageReady = false;
let pageCleanups = [];
// 每次 initPage 递增。动态 import 的回调拿它和当前值比对，避免「上一個首页的
// 模块晚到，落在新首页头上」导致 hero 被初始化两次。
let pageGeneration = 0;

/**
 * three.js / troika / postprocessing 只在对应区域接近视口时才加载，
 * 避免首页首屏为 3D 场景付出下载与解析成本。
 * 每个模块只初始化一次；动态模块的 cleanup 统一收进 pageCleanups。
 */
function initLazyCanvasModules() {
  let disposed = false;
  const teardowns = [];
  const observers = [];

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    observers.splice(0).forEach((observer) => observer.disconnect());
    teardowns.splice(0).forEach((fn) => {
      if (typeof fn === 'function') fn();
    });
  };

  const whenNear = (el, callback) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }

    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired || disposed) return;
        if (!entries.some((entry) => entry.isIntersecting)) return;
        fired = true;
        observer.disconnect();
        callback();
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    observers.push(observer);
  };

  // `.footer` is a fixed, full-viewport layer, so observing it with an
  // IntersectionObserver fires on the first frame and defeats the lazy load.
  // Trigger by scroll position instead: load once the viewport is within
  // ~1.5 screens of the document bottom (short pages qualify immediately).
  const whenNearPageEnd = (callback) => {
    let fired = false;
    const run = () => {
      if (fired || disposed) return;
      fired = true;
      window.removeEventListener('scroll', onScroll);
      callback();
    };
    const onScroll = () => {
      const doc = document.documentElement;
      // Short pages: footer already within range. Long pages: wait until the
      // viewport is within ~1.5 screens of the document bottom.
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
      if (remaining <= window.innerHeight * 1.5) run();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    teardowns.push(() => {
      window.removeEventListener('scroll', onScroll);
    });
    onScroll();
  };

  whenNearPageEnd(async () => {
    const { initFooterCanvas } = await import('./footer-canvas');
    if (disposed) return;
    teardowns.push(initFooterCanvas());
    ScrollTrigger.refresh();
  });

  const dataViz = document.querySelector('.data-viz-section');
  // Keep the pinned WebGL data-viz on phones too — the scroll effect is a
  // first-class part of the design, not a desktop extra.
  if (dataViz) {
    whenNear(dataViz, async () => {
      const { initDataViz } = await import('./home/dataviz');
      if (disposed) return;
      teardowns.push(initDataViz());
      ScrollTrigger.refresh();
    });
  }

  return cleanup;
}

/**
 * 首页专用动效按需加载：联系页 / 法务页不再为 hero、about、services、cases、
 * call、nav-spy、footer-nav 付下载和解析成本。
 * 动态 import 回来时页面可能已经换掉，所以拿到模块后必须再确认一次还停在
 * 同一个页面，否则会把上一个页面的时间线重新拉起来。
 */
function loadHomeAnimations() {
  const page = document.body.dataset.page;
  const generation = pageGeneration;
  const stillHere = () =>
    pageReady &&
    pageGeneration === generation &&
    document.body.dataset.page === page;

  Promise.allSettled([
    import('./home/hero').then((m) => (stillHere() ? m.initHero() : undefined)),
    import('./home/about').then((m) => (stillHere() ? m.initAbout() : undefined)),
    import('./home/services').then((m) => (stillHere() ? m.initServices() : undefined)),
    import('./home/cases').then((m) => (stillHere() ? m.initCases() : undefined)),
    import('./home/call').then((m) => (stillHere() ? m.initCall() : undefined)),
    import('./nav-spy').then((m) => (stillHere() ? m.initNavSpy() : undefined)),
    import('./footer-nav').then((m) => (stillHere() ? m.initFooterNav() : undefined)),
  ]).then((settled) => {
    if (!stillHere()) return;
    // 某个模块 404 时其余六个照常初始化，不搞连坐
    pageCleanups.push(
      ...settled
        .filter((s) => s.status === 'fulfilled' && s.value)
        .map((s) => s.value)
    );
    // 模块晚于首帧到达，滚动位置要重新量一遍
    ScrollTrigger.refresh();
  });
}

function initPageAnimations() {
  const page = document.body.dataset.page;

  if (page === 'home') {
    loadHomeAnimations();
  } else if (page === 'case') {
    pageCleanups.push(initCaseReveal());
  } else if (page === 'contact') {
    pageCleanups.push(initContactReveal());
  } else if (page === 'legal') {
    pageCleanups.push(initLegalReveal());
  } else if (page === 'bio') {
    pageCleanups.push(initBioReveal());
  }

  const gridCleanup = [];
  const gridStore = {
    onCleanup(fn) {
      gridCleanup.push(fn);
    },
  };

  initInteractiveGrids(gridStore);
  pageCleanups.push(initLazyCanvasModules());

  if (gridCleanup.length) {
    pageCleanups.push(() => gridCleanup.splice(0).forEach((fn) => fn()));
  }
}

/**
 * ScrollTrigger 的 start/end 是按 refresh 那一刻的布局量的，浏览器的
 * #hash 落点也是。字体替换、首屏图片和动态模块都会在入场后继续改区块
 * 高度；晚到的布局变化会让 scrub 动画停在旧进度上，锚点也可能偏——
 * 带着 #case-histories 从别的页面进来，案例区整块 opacity 0、滑动也
 * 不恢复，就是 refresh 停在了旧布局上。
 *
 * 入场后的短窗口里盯住文档高度，变化合并成一次 refresh；带 hash 时把目标
 * 顶端停到视口顶边上方 8px（越过 start:'top top' 的 once 触发线；目标自己
 * 设了 scroll-margin-top 的，按它给的留白停）。
 *
 * 对齐和 refresh 的停止条件是分开的：一有滚动意图、或位置明显离开锚点
 * 就不再对齐（不把人拽回去），但 refresh 继续，晚到的布局变化仍会被
 * 修正——在 loader 或 cookie 按钮上点一下，不该让修复失守。
 */
function settleIncomingLayout() {
  let hash = '';
  try {
    hash =
      location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : '';
  } catch {
    // Malformed escape sequence (#%) — nothing to align against.
  }
  const target = hash ? document.getElementById(hash) : null;

  let stopped = false;
  let alignCancelled = false;
  let refreshTimer = 0;
  let lastHeight = document.documentElement.scrollHeight;
  let lastScrollY = -1;
  let lastDrift = 0;
  const timers = [];

  // The settle window is idle-based rather than a fixed countdown: on a cold
  // slow load, fonts and below-fold images can land well past 12s, and the
  // original bug is precisely "layout changed after the window closed".
  let idleTimer = 0;
  let hardTimer = 0;
  let loaded = false;
  let stop = () => {};

  const bumpIdle = () => {
    // Before `load` the page is still fetching, and on a cold slow load that
    // can take far longer than the idle window; starting the countdown early
    // closes the window before the fonts and images ever arrive (the exact
    // failure being fixed here). Layout activity before load still refreshes
    // via scheduleRefresh — only the idle countdown waits.
    if (stopped || !loaded) return;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => stop(), 8000);
  };

  // Hard ceiling so a page that keeps changing layout can never hold this
  // open indefinitely. Before `load` the ceiling only re-arms (up to a wider
  // cold-load budget): a slow load can outlast 30s, and closing the window
  // before the first assets arrive is exactly the failure being fixed here.
  const preLoadCeiling = performance.now() + 120000;
  const armHard = () => {
    window.clearTimeout(hardTimer);
    hardTimer = window.setTimeout(function tick() {
      if (stopped) return;
      if (!loaded && performance.now() < preLoadCeiling) {
        hardTimer = window.setTimeout(tick, 30000);
        return;
      }
      stop();
    }, 30000);
  };

  const cancelAlign = () => {
    alignCancelled = true;
  };

  const alignAnchor = () => {
    if (stopped || alignCancelled || !target?.isConnected) return;
    // display:none / 0×0 targets also report top 0; nothing to align to.
    if (!target.getClientRects().length) return;

    const drift = Math.round(target.getBoundingClientRect().top);
    if (drift > window.innerHeight) {
      // Target still below the fold while the page is at the very top: the
      // browser has not performed its fragment scroll yet (SPA swaps reset
      // to 0 first; Safari can defer it until load). Skipping this round
      // only — cancelling here would give up before the browser ever lands.
      if (window.scrollY <= 0) return;
      // The page has scrolled away from the anchor: the user (or history /
      // find-in-page) has moved on. Only sharp jumps taken without an input
      // event land here; wheel and touch are caught below.
      cancelAlign();
      return;
    }
    if (drift < -24) {
      cancelAlign();
      return;
    }
    // Same scroll position and same target offset as after the last
    // alignment — still aligned. This also keeps pinned targets (rect.top
    // stays 0) from being nudged on every pass.
    if (
      lastScrollY >= 0 &&
      Math.abs(window.scrollY - lastScrollY) <= 2 &&
      Math.abs(drift - lastDrift) <= 12
    ) {
      return;
    }

    // Where the target's top edge should sit: honour an authored
    // scroll-margin-top (bio cards use it to clear the fixed navbar), and
    // otherwise park 8px above the viewport top — landing exactly on the
    // line leaves `once` reveals (start: 'top top') unfired, and the
    // services block would sit at opacity 0 after arriving from another
    // page.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const y =
      Math.round(window.scrollY + drift) - (margin > 0 ? margin : -8);
    // Route through Lenis when present: a running Lenis animation would
    // otherwise overwrite the native write on its next tick.
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
    lastScrollY = Math.round(window.scrollY);
    lastDrift = Math.round(target.getBoundingClientRect().top);

    // 锚点跳转是程序化滚动，导航的滚动监听读不到“下滚”手势，导航条会停在
    // 顶部压住区块标题；落位的同时直接置为收起态。自带 scroll-margin-top
    // 的目标（bio 卡片）已经给导航留了位置，保持可见。
    if (!(margin > 0)) collapseNavbar();
  };

  // One debounced refresh channel: observer, fonts and load all funnel
  // through here instead of each forcing a full ScrollTrigger recalculation.
  // The idle/hard timers bound the window, so there is no separate count cap
  // (a cold load can legitimately settle late several times).
  const scheduleRefresh = (delay) => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      if (stopped) return;
      try {
        ScrollTrigger.refresh();
      } catch {
        /* A broken trigger must not take alignment and the window with it. */
      }
      alignAnchor();
      bumpIdle();
    }, delay);
  };

  const scheduleAlign = (delays) => {
    delays.forEach((delay) => {
      timers.push(
        window.setTimeout(() => {
          if (!stopped) alignAnchor();
        }, delay)
      );
    });
  };

  const observer =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => {
          if (stopped) return;
          const height = document.documentElement.scrollHeight;
          if (height === lastHeight) return;
          lastHeight = height;
          bumpIdle();
          scheduleRefresh(180);
        })
      : null;
  observer?.observe(document.body);

  // Fonts and the full page load are the two common late-layout events;
  // cover them even when they do not change the document height. The load
  // event also carries the browser's final fragment scroll correction, so
  // the anchor gets another alignment round shortly after it.
  const onLoad = () => {
    if (stopped) return;
    loaded = true;
    // Re-arm the ceiling from load: before it, armHard() only renews the
    // pre-load budget, so the post-load window gets its own full 30s.
    armHard();
    bumpIdle();
    scheduleRefresh(0);
    if (target) scheduleAlign([150, 600, 1500, 3000]);
  };
  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => scheduleRefresh(0),
      () => scheduleRefresh(0)
    );
  }
  if (document.readyState === 'complete') {
    onLoad();
  } else {
    window.addEventListener('load', onLoad, { once: true });
  }

  // The browser's own fragment scroll can land after (and overwrite) the
  // first alignment — opening /#services cold left the section parked on its
  // reveal line with every character at opacity 0.
  if (target) scheduleAlign([0, 350, 900, 1800, 3000]);

  // Scrolling intent only. Clicks and arbitrary keys (loader, cookie
  // buttons) must not switch alignment off; jumps without any input event
  // are caught by the range check in alignAnchor().
  const scrollKeys = new Set([
    ' ',
    'PageUp',
    'PageDown',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]);
  const onKeydown = (event) => {
    if (!scrollKeys.has(event.key)) return;
    // Space on a focused control activates it (loader, cookie banner) — that
    // is not scrolling intent and must not switch alignment off.
    if (
      event.target instanceof Element &&
      event.target.closest('button, a, input, textarea, select')
    ) {
      return;
    }
    cancelAlign();
  };
  const onScrollIntent = () => cancelAlign();

  window.addEventListener('wheel', onScrollIntent, { passive: true });
  window.addEventListener('touchmove', onScrollIntent, { passive: true });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('hashchange', onScrollIntent);
  window.addEventListener('popstate', onScrollIntent);

  stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(idleTimer);
    window.clearTimeout(hardTimer);
    window.clearTimeout(refreshTimer);
    timers.forEach((id) => window.clearTimeout(id));
    observer?.disconnect();
    window.removeEventListener('load', onLoad);
    window.removeEventListener('wheel', onScrollIntent);
    window.removeEventListener('touchmove', onScrollIntent);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('hashchange', onScrollIntent);
    window.removeEventListener('popstate', onScrollIntent);
  };

  bumpIdle();
  armHard();

  return stop;
}

function initPage() {
  if (pageReady) return;
  pageReady = true;
  pageGeneration += 1;

  // Must run before initMenu() and playLoaderOnce(): the logo slots are part
  // of the navbar/loader markup and the menu reads the nav logo on init.
  renderBrandLogos();

  // VI 14.4: the tail waves on its own clock. The driver only moves marks
  // ≥64px wide and stays off under reduced motion, while hidden or printing.
  pageCleanups.push(initLogoTail());

  createLenis();

  initMenu();
  bindMenuTriggers();

  initNavbar();
  initCookies();
  initContactForm();
  initHeroVideo();
  initMarquee();
  initNoise();
  initPageAnimations();
  pageCleanups.push(settleIncomingLayout());

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    getLenis()?.resize?.();
    requestAnimationFrame(() => {
      if (!isMenuOpen()) {
        // Start after the first paint + ScrollTrigger refresh, so the loader
        // timeline is not fast-forwarded by one giant GSAP tick.
        playLoaderOnce();
      }
    });
  });
}

function cleanupPage() {
  pageCleanups.splice(0).forEach((fn) => fn());
  cleanupNavbar();
  cleanupMenu();
  cleanupHeroVideo();
  cleanupMarquee();

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('.js-marquee .marquee__wrap');

  destroyLenis();
  pageReady = false;
}

initPageTransitions();

document.addEventListener('astro:before-swap', cleanupPage);

document.addEventListener('astro:page-load', () => {
  // On the first load the DOMContentLoaded fallback may already have run.
  if (pageReady) return;
  initPage();
});

// Fallback for the very first load if the ClientRouter event already fired
// before this module was evaluated.
if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      if (!pageReady) initPage();
    },
    { once: true }
  );
} else {
  queueMicrotask(() => {
    if (!pageReady) initPage();
  });
}
