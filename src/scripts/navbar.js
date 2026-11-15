import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis';

let cleanups = [];

function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
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
    } else if (direction === -1 && hidden) {
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
