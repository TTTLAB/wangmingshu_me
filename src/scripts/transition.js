import gsap from 'gsap';
import { getLenis } from './lenis';

const DURATION = 0.25;

let bound = false;
let inFlight = false;

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getLayer() {
  return document.querySelector('.transition__container');
}

function resetScroll() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * Site-wide out-in fade, mirroring the original:
 * exit 0 -> .25s, swap, enter .25s -> .5s on the whole page container.
 */
export function initPageTransitions() {
  if (bound) return;
  bound = true;

  document.addEventListener('astro:before-preparation', (event) => {
    inFlight = true;
    if (reducedMotion()) return;

    const layer = getLayer();
    const originalLoader = event.loader;
    if (!layer) return;

    // Start the fetch immediately (prefetched data is ready) and fade the old
    // page out in parallel. The URL only changes once both resolve, so the
    // out-in swap still happens on a fully faded page.
    event.loader = async () => {
      const request = typeof originalLoader === 'function'
        ? originalLoader()
        : Promise.resolve();

      await new Promise((resolve) => {
        gsap.to(layer, {
          opacity: 0,
          duration: DURATION,
          ease: 'power1.inOut',
          overwrite: true,
          onComplete: resolve,
        });
      });

      return await request;
    };
  });

  // after-swap runs before the browser paints the new page.
  document.addEventListener('astro:after-swap', () => {
    const layer = getLayer();
    if (!layer) {
      document.documentElement.classList.remove('is-page-transitioning');
      inFlight = false;
      return;
    }

    resetScroll();

    if (reducedMotion()) {
      gsap.set(layer, { clearProps: 'opacity' });
      document.documentElement.classList.remove('is-page-transitioning');
      inFlight = false;
      return;
    }

    // Inline 0 written during after-swap keeps the first paint hidden, then
    // the tween starts in the same task — no extra frame of delay.
    gsap.set(layer, { opacity: 0 });
    document.documentElement.classList.remove('is-page-transitioning');
    gsap.to(layer, {
      opacity: 1,
      duration: DURATION,
      ease: 'power1.inOut',
      overwrite: true,
      onComplete: () => {
        gsap.set(layer, { clearProps: 'opacity' });
        inFlight = false;
      },
    });
  });
}

export function isTransitioning() {
  return inFlight;
}
