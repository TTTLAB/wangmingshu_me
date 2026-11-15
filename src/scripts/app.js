import 'lenis/dist/lenis.css';
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
import { initNavSpy } from './nav-spy';
import { initHeroVideo, cleanupHeroVideo } from './media';
import { initMarquee, cleanupMarquee } from './marquee';
import { initNoise } from './noise';
import { initHero } from './home/hero';
import { initAbout } from './home/about';
import { initServices } from './home/services';
import { initCases } from './home/cases';
import { initCall } from './home/call';
import { initInteractiveGrids } from './home/interactive-grid';
import { initDataViz } from './home/dataviz';
import { initFooterCanvas } from './footer-canvas';
import { initFooterNav } from './footer-nav';
import {
  initCaseReveal,
  initContactReveal,
  initLegalReveal,
} from './home/case-reveal';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
CustomEase.create('menuEase', 'M0,0 C0.7,0.098 0.097,1 1,1');

let pageReady = false;
let pageCleanups = [];

function initPageAnimations() {
  const page = document.body.dataset.page;

  if (page === 'home') {
    pageCleanups = [
      initHero(),
      initAbout(),
      initServices(),
      initCases(),
      initCall(),
      initDataViz(),
      initNavSpy(),
      initFooterNav(),
    ];
  } else if (page === 'case') {
    pageCleanups = [initCaseReveal()];
  } else if (page === 'contact') {
    pageCleanups = [initContactReveal()];
  } else if (page === 'legal') {
    pageCleanups = [initLegalReveal()];
  }

  const gridCleanup = [];
  const gridStore = {
    onCleanup(fn) {
      gridCleanup.push(fn);
    },
  };

  initInteractiveGrids(gridStore);
  pageCleanups.push(initFooterCanvas());

  if (gridCleanup.length) {
    pageCleanups.push(() => gridCleanup.splice(0).forEach((fn) => fn()));
  }
}

function initPage() {
  if (pageReady) return;
  pageReady = true;

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
