import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis';

let cleanups = [];
// Set by the live initNavbar(); lets other modules park the bar without
// reaching into its closure.
let collapseHandler = null;

function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}

/**
 * Put the navbar in its hidden state at once (no slide), using the same
 * resting offset as the scroll-down hide. Anchor landings call this: a hash
 * jump from another page is a programmatic scroll, so the scroll handler
 * never reads it as a downward gesture and the bar would otherwise sit on
 * top of the target's title.
 */
export function collapseNavbar() {
  collapseHandler?.();
}

export function initNavbar() {
  cleanup();

  const nav = document.querySelector('[data-navbar]');
  if (!nav) return;

  const baseDark = nav.classList.contains('navbar--dark');
  const activeSections = new Set();
  const applyTheme = () => {
    nav.classList.toggle('navbar--dark', baseDark || activeSections.size > 0);
  };

  // Hide on scroll down, reveal on scroll up (threshold 80, like the source).
  const HIDE_AT = 80;
  let hidden = false;
  let lastY = window.scrollY;

  const showNav = () => {
    hidden = false;
    gsap.to(nav, { y: 0, duration: 0.4, ease: 'power3.out', overwrite: true });
  };

  // Same offset as the scroll-down hide, but placed in a single tick. The
  // base top is measured from the untransformed position so a mid-flight
  // reveal cannot shorten the distance.
  const hideNow = () => {
    // The menu owns the bar's transform while it is open (menu.js tweens it
    // back to 0); collapsing underneath it would fight that tween.
    if (document.body.classList.contains('is-menu-open')) return;
    // The scroll handler keeps the bar visible above HIDE_AT; a shallow
    // landing must follow the same rule or `hidden` would disagree with it.
    if (window.scrollY < HIDE_AT) return;
    hidden = true;
    lastY = window.scrollY;
    const y = Number(gsap.getProperty(nav, 'y')) || 0;
    const baseTop = nav.getBoundingClientRect().top - y;
    const distance = -(nav.offsetHeight + baseTop + 8);
    gsap.to(nav, {
      y: distance,
      duration: 0,
      ease: 'none',
      overwrite: true,
    });
  };
  collapseHandler = hideNow;
  cleanups.push(() => {
    if (collapseHandler === hideNow) collapseHandler = null;
  });

  const onScroll = (event) => {
    if (document.body.classList.contains('is-menu-open')) return;
    const y = typeof event?.scroll === 'number' ? event.scroll : window.scrollY;
    const direction =
      typeof event?.direction === 'number'
        ? event.direction
        : y > lastY
          ? 1
          : y < lastY
            ? -1
            : 0;
    // Immediate Lenis jumps (anchor landings, resize) report the direction
    // of the last real scroll; never let a stale one re-open the bar.
    const isProgrammaticJump = event?.isScrolling === false;

    if (y < HIDE_AT) {
      if (hidden) showNav();
    } else if (direction === 1 && !hidden) {
      hidden = true;
      const distance = -(
        nav.offsetHeight +
        nav.getBoundingClientRect().top +
        8
      );
      gsap.to(nav, {
        y: distance,
        duration: 0.4,
        ease: 'power3.in',
        overwrite: true,
      });
    } else if (direction === -1 && hidden && !isProgrammaticJump) {
      showNav();
    }

    lastY = y;
  };

  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
    cleanups.push(() => lenis.off?.('scroll', onScroll));
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));
  }

  // Dark navbar while a dark section crosses the navbar line.
  const sections = document.querySelectorAll('[data-navbar-theme="dark"]');
  sections.forEach((section) => {
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top+=80',
      end: 'bottom top+=80',
      onEnter: () => {
        activeSections.add(section);
        applyTheme();
      },
      onEnterBack: () => {
        activeSections.add(section);
        applyTheme();
      },
      onLeave: () => {
        activeSections.delete(section);
        applyTheme();
      },
      onLeaveBack: () => {
        activeSections.delete(section);
        applyTheme();
      },
    });
    cleanups.push(() => trigger.kill());
  });

  cleanups.push(() => {
    activeSections.clear();
    gsap.killTweensOf(nav);
    gsap.set(nav, { clearProps: 'transform' });
  });
}

export function cleanupNavbar() {
  cleanup();
}
