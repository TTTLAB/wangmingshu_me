import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { createLenis, destroyLenis, getLenis } from './lenis';
import { playLoaderOnce } from './loader';
import { initNavbar, cleanupNavbar } from './navbar';
import {
  initMenu,
  bindMenuTriggers,
  cleanupMenu,
  isMenuOpen,
} from './menu';
import { initPageTransitions } from './transition';
import { renderBrandLogos } from './logo';
import { initCookies } from './cookies';
import { initContactForm } from './contact';
import { initHeroVideo, cleanupHeroVideo } from './media';
import { initMarquee, cleanupMarquee } from './marquee';
import { initNoise } from './noise';
import { initInteractiveGrids } from './home/interactive-grid';
import {
  initCaseReveal,
  initContactReveal,
  initLegalReveal,
  initBioReveal,
} from './home/case-reveal';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
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

function initPage() {
  if (pageReady) return;
  pageReady = true;
  pageGeneration += 1;

  // Must run before initMenu() and playLoaderOnce(): the logo slots are part
  // of the navbar/loader markup and the menu reads the nav logo on init.
  renderBrandLogos();

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
