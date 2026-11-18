import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis';

const DURATION = 0.25;
// The veil is visible for at least VEIL_MIN_MS so the loading pass registers,
// but never longer than VEIL_MAX_MS once the new page has swapped in.
const VEIL_MIN_MS = 500;
const VEIL_MAX_MS = 2200;
const VEIL_SAFETY_MS = 8000;

let bound = false;
let inFlight = false;
let veilShownAt = 0;
let navToken = 0;

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getLayer() {
  return document.querySelector('.transition__container');
}

function getVeil() {
  return document.querySelector('[data-nav-loading]');
}

function showLoadingVeil() {
  const veil = getVeil();
  if (!veil) return;
  veilShownAt = performance.now();
  veil.classList.add('is-active');
  // Keep keyboard focus out of the page the veil is covering.
  getLayer()?.setAttribute('inert', '');
}

function hideLoadingVeil() {
  const veil = getVeil();
  if (veil) veil.classList.remove('is-active');
  getLayer()?.removeAttribute('inert');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Images in (or just below) the incoming viewport that are still loading.
function pendingFirstScreenImages() {
  const vh = window.innerHeight;
  return Array.from(document.images).filter((img) => {
    if (img.complete) return false;
    const rect = img.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < vh * 1.15;
  });
}

/**
 * Resolves once fonts and first-screen images are ready, the veil has been
 * visible for VEIL_MIN_MS, or VEIL_MAX_MS runs out — whichever comes first.
 */
async function waitForIncomingPage() {
  const assets = (async () => {
    try {
      await document.fonts.ready;
    } catch (error) {
      /* Older browsers: keep going without the font barrier. */
    }
    await Promise.all(
      pendingFirstScreenImages().map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
      )
    );
  })();

  await Promise.race([assets, wait(VEIL_MAX_MS)]);
  const spent = performance.now() - veilShownAt;
  if (spent < VEIL_MIN_MS) await wait(VEIL_MIN_MS - spent);
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
 * A navigation veil covers the swap and holds until the incoming page's
 * first-screen assets settle (bounded by VEIL_MIN_MS / VEIL_MAX_MS).
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

    const token = ++navToken;
    showLoadingVeil();

    // If the fetch fails or stalls, never leave the veil covering the page.
    setTimeout(() => {
      if (token === navToken) hideLoadingVeil();
    }, VEIL_SAFETY_MS);

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
  document.addEventListener('astro:after-swap', async () => {
    const layer = getLayer();
    if (!layer) {
      hideLoadingVeil();
      document.documentElement.classList.remove('is-page-transitioning');
      inFlight = false;
      return;
    }

    resetScroll();

    if (reducedMotion()) {
      hideLoadingVeil();
      gsap.set(layer, { clearProps: 'opacity' });
      document.documentElement.classList.remove('is-page-transitioning');
      inFlight = false;
      return;
    }

    const token = navToken;

    // Inline 0 written during after-swap keeps the first paint hidden while
    // the veil waits for the new page's fonts and first-screen images.
    gsap.set(layer, { opacity: 0 });
    document.documentElement.classList.remove('is-page-transitioning');

    await waitForIncomingPage();
    if (token !== navToken) return;

    // Fonts and first-screen images are in now, so this is the first moment
    // the new page can be measured for real; ScrollTrigger's start/end were
    // computed against the pre-image layout. Hash entries get realigned by
    // settleIncomingLayout() as well, but plain SPA swaps need this
    // remeasure too, or scrubbed reveals keep stale progress.
    try {
      ScrollTrigger.refresh();
    } catch {
      /* A broken trigger must not hold the veil or the fade-in. */
    }

    hideLoadingVeil();
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
