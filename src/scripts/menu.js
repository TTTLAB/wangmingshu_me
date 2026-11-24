import gsap from 'gsap';
import { getLenis } from './lenis';

const MENU_EASE = 'menuEase';

let menu = null;
let toggle = null;
let closeButton = null;
let bg = null;
let links = [];
let values = [];
let navbar = null;
let logoLink = null;
let logo = null;
let petals = [];
let menuTimeline = null;
let hoverTimeline = null;
let hoverTween = null;
let isOpen = false;
let hoverIdle = true;
let bound = false;

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setClosedState() {
  if (!menu) return;
  menu.setAttribute('inert', '');
  closeButton?.setAttribute('inert', '');
  menu.style.pointerEvents = 'none';
  menu.style.visibility = 'hidden';
  menu.style.opacity = '0';
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-menu-open');
}

function buildTimeline() {
  // Original timeline: container (.05s) -> bg (.8s) -> values (-=.55) -> links (-=.75).
  menuTimeline = gsap
    .timeline({
      paused: true,
      onReverseComplete: () => {
        if (!menu || isOpen) return;
        menu.style.pointerEvents = 'none';
        menu.style.visibility = 'hidden';
        getLenis()?.start();
      },
    })
    .fromTo(
      menu,
      { pointerEvents: 'none', opacity: 0, zIndex: -1 },
      { pointerEvents: 'auto', opacity: 1, duration: 0.05, zIndex: 89 }
    )
    .fromTo(bg, { scale: 0 }, { scale: 1, duration: 0.8, ease: 'power4.inOut' })
    .fromTo(
      values,
      { yPercent: 105, pointerEvents: 'none' },
      {
        yPercent: 0,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: MENU_EASE,
        stagger: { amount: 0.05, from: 'end' },
      },
      '-=0.55'
    )
    .fromTo(
      links,
      { yPercent: 105, pointerEvents: 'none' },
      {
        yPercent: 0,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: MENU_EASE,
        stagger: { amount: 0.05, from: 'end' },
      },
      '-=0.75'
    );
}

function buildHoverTimeline() {
  // The VI rat mark is static: it has no Cattaneo petals and must never be
  // rotated as a whole. Keep the menu open/close timeline untouched.
  if (petals.length === 0) return;

  gsap.set(petals, { transformOrigin: '50% 50%' });

  hoverTimeline = gsap
    .timeline({ paused: true, repeat: -1 })
    .to(
      petals,
      {
        scale: 0,
        stagger: { amount: 0.05 },
        duration: 0.5,
        ease: 'power2.inOut',
      },
      0
    )
    .to(
      petals,
      {
        scale: 1,
        stagger: { amount: 0.05 },
        duration: 0.5,
        ease: 'power2.inOut',
      },
      0.5
    )
    .to(logo, { rotation: 180, duration: 1, ease: 'power2.inOut' }, 0);

  // GSAP 3.13 ignores `label` inside tween vars (CSSPlugin warns about an
  // invalid property and tweenTo() would auto-create a label at the timeline
  // end instead of time 0). Register the label explicitly so onLogoLeave()
  // can rewind to the start over 1s.
  hoverTimeline.addLabel('rotate', 0);
  hoverTimeline.pause(0);
}

function onLogoEnter() {
  if (!hoverTimeline || !hoverIdle) return;
  hoverIdle = false;
  hoverTimeline.play();
}

function onLogoLeave() {
  if (!hoverTimeline || !logoLink || hoverIdle) return;
  hoverTimeline.pause();
  logoLink.classList.add('is-exiting-hover');
  hoverTween = hoverTimeline.tweenTo('rotate', {
    duration: 1,
    ease: 'linear',
    onComplete: () => {
      hoverTween = null;
      logoLink?.classList.remove('is-exiting-hover');
      hoverTimeline?.progress(0);
      hoverIdle = true;
    },
  });
}

function openMenu() {
  if (!menu || isOpen) return;
  isOpen = true;

  document.body.classList.add('is-menu-open');
  menu.removeAttribute('inert');
  closeButton?.removeAttribute('inert');
  toggle?.setAttribute('aria-expanded', 'true');
  menu.style.visibility = 'visible';

  // Move focus into the now-visible menu; rAF waits for the visibility write.
  requestAnimationFrame(() => {
    if (!isOpen) return;
    closeButton?.focus({ preventScroll: true });
  });

  getLenis()?.stop();

  if (navbar) {
    gsap.to(navbar, {
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: true,
    });
  }
  if (reducedMotion()) {
    gsap.set(menu, { pointerEvents: 'auto', opacity: 1, zIndex: 89 });
    gsap.set(bg, { scale: 1 });
    gsap.set(values, { yPercent: 0, pointerEvents: 'auto' });
    gsap.set(links, { yPercent: 0, pointerEvents: 'auto' });
    return;
  }

  menuTimeline?.play(0);
}

function closeMenu() {
  if (!menu || !isOpen) return;
  isOpen = false;

  // Hand focus back before inert blurs the active element to <body>.
  const activeElement = document.activeElement;
  if (
    toggle &&
    (menu.contains(activeElement) || activeElement === closeButton)
  ) {
    toggle.focus({ preventScroll: true });
  }

  document.body.classList.remove('is-menu-open');
  menu.setAttribute('inert', '');
  closeButton?.setAttribute('inert', '');
  toggle?.setAttribute('aria-expanded', 'false');

  if (reducedMotion()) {
    gsap.set(menu, { pointerEvents: 'none', opacity: 0, zIndex: -1 });
    gsap.set(bg, { scale: 0 });
    gsap.set(values, { yPercent: 105 });
    gsap.set(links, { yPercent: 105 });
    menu.style.visibility = 'hidden';
    getLenis()?.start();
    return;
  }

  menuTimeline?.reverse();
}

function onKeydown(event) {
  if (event.key === 'Escape' && isOpen) {
    event.preventDefault();
    closeMenu();
  }
}

export function initMenu() {
  menu = document.querySelector('[data-navmenu]');
  if (!menu) return;

  toggle = document.querySelector('.js-navbar-toggle');
  closeButton = document.querySelector('.navmenu__close');
  bg = menu.querySelector('.js-navmenu-bg');
  links = Array.from(menu.querySelectorAll('.js-navmenu-link'));
  values = Array.from(menu.querySelectorAll('.js-navmenu-value-item'));
  navbar = document.querySelector('[data-navbar]');
  logoLink = document.querySelector('.js-logo-nav');
  logo = logoLink?.querySelector('svg') ?? null;
  petals = [
    '.js-ln-ptr',
    '.js-ln-pbr',
    '.js-ln-ptl',
    '.js-ln-pbl',
  ]
    .map((selector) => logoLink?.querySelector(selector))
    .filter(Boolean);

  setClosedState();
  buildTimeline();
  buildHoverTimeline();

  logoLink?.addEventListener('mouseenter', onLogoEnter);
  logoLink?.addEventListener('mouseleave', onLogoLeave);

  if (!bound) {
    bound = true;
    document.addEventListener('keydown', onKeydown);
  }
}

export function bindMenuTriggers() {
  if (!menu) return;

  const toggleHandler = (event) => {
    event.preventDefault();
    isOpen ? closeMenu() : openMenu();
  };
  const closeHandler = (event) => {
    event.preventDefault();
    closeMenu();
  };
  const linkHandler = () => closeMenu();

  toggle?.addEventListener('click', toggleHandler);
  closeButton?.addEventListener('click', closeHandler);
  links.forEach((link) => link.addEventListener('click', linkHandler));
}

export function cleanupMenu() {
  // The rewind tween runs on the global timeline and survives hoverTimeline.kill().
  hoverTween?.kill();
  hoverTween = null;
  menuTimeline?.kill();
  menuTimeline = null;
  hoverTimeline?.kill();
  hoverTimeline = null;
  logoLink?.removeEventListener('mouseenter', onLogoEnter);
  logoLink?.removeEventListener('mouseleave', onLogoLeave);
  isOpen = false;
  hoverIdle = true;
  document.body.classList.remove('is-menu-open');

  if (menu) {
    menu.setAttribute('inert', '');
  }
  closeButton?.setAttribute('inert', '');
  toggle?.setAttribute('aria-expanded', 'false');
  menu = null;
  toggle = null;
  closeButton = null;
  bg = null;
  links = [];
  values = [];
  navbar = null;
  logoLink = null;
  logo = null;
  petals = [];
}

export function isMenuOpen() {
  return isOpen;
}
