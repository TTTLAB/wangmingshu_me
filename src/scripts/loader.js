import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { startLoaderRat } from './loader-rat-motion';
import { getLenis } from './lenis';

gsap.registerPlugin(ScrambleTextPlugin);

// Verbatim from the reference bundle (eight boxShadow keyframes, no easing
// between them; the durations are part of the tween).
const DOTS = [
  { boxShadow: '0px 0px 35px 10px rgba(255, 59, 29, 0.85)', duration: 0.03 },
  { boxShadow: '0px 0px 9px 0px rgba(255, 59, 29, 0.5)', duration: 0.02 },
  { boxShadow: '0px 0px 42px 15px rgba(255, 59, 29, 0.8)', duration: 0.04 },
  { boxShadow: '0px 0px 8px 1px rgba(255, 59, 29, 0.6)', duration: 0.02 },
  { boxShadow: '0px 0px 38px 12px rgba(255, 59, 29, 0.85)', duration: 0.03 },
  { boxShadow: '0px 0px 10px 2px rgba(255, 59, 29, 0.7)', duration: 0.02 },
  { boxShadow: '0px 0px 45px 18px rgba(255, 59, 29, 0.8)', duration: 0.04 },
  { boxShadow: '0px 0px 9px 0px rgba(255, 59, 29, 0.5)', duration: 0.05 },
];

/**
 * Reference: `call(() => setIsPageVisible(true), [], "hide-loader+=0.2")`.
 * The page becomes interactive while the loader is still fading out; the
 * hero intro listens for `rk:loader-done`, so it must fire here and not
 * when the 1.5s fade lands.
 */
function onPageReady() {
  getLenis()?.start();

  if (!window.__rkLoaderDone) {
    window.__rkLoaderDone = true;
    document.dispatchEvent(new CustomEvent('rk:loader-done'));
  }
}

/**
 * Reference: timeline onComplete -> setIsLoading(false), which removes the
 * loader. This is the only place that hides the node, 1.5s after
 * "hide-loader".
 */
function finishLoader(loader) {
  document.documentElement.classList.add('loader-hidden');
  if (loader) gsap.set(loader, { autoAlpha: 0 });
}

function buildTimeline(loader) {
  const dots = loader.querySelectorAll('.js-loader-dot');
  const labelTop = loader.querySelector('.js-loader-label-top');
  const labelBottom = loader.querySelector('.js-loader-label-bottom');

  // Explicit positions keep the reference rhythm: scramble 0-1.5, dots at
  // 0.4, collapse at 1.4, hide label at 2.0, fade 1.5s. The page becomes
  // interactive at hide+0.2 while the fade is still running.
  const tl = gsap.timeline({ onComplete: () => finishLoader(loader) });

  tl.to([labelTop, labelBottom], {
    duration: 1.5,
    ease: 'sine.in',
    scrambleText: {
      text: (i, el) => el.innerText,
      speed: 1,
      chars: (i, el) => el.innerText.replace(/\s/g, ''),
    },
  })
    .to(
      dots,
      {
        keyframes: DOTS,
        ease: 'none',
        stagger: { each: 0.1, from: 'random' },
      },
      0.4
    )
    .to(
      [dots, labelTop, labelBottom],
      {
        scale: 0,
        duration: 0.6,
        ease: 'power4.inOut',
      },
      1.4
    )
    .addLabel('hide-loader', 2.0)
    .to(loader, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' }, 'hide-loader')
    .call(onPageReady, [], 'hide-loader+=0.2');

  return tl;
}

/**
 * Plays the intro only once per full page load. The persisted loader node is
 * shared across ClientRouter navigations, so later page-loads are a no-op.
 */
export function playLoaderOnce() {
  const loader = document.querySelector('[data-loader]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!loader) {
    window.__rkLoaderPlayed = true;
    window.__rkLoaderDone = true;
    document.dispatchEvent(new CustomEvent('rk:loader-done'));
    return;
  }

  // ClientRouter syncs <html> attributes from the incoming document, which
  // can drop the class even though the persisted loader is already hidden.
  if (window.__rkLoaderPlayed) {
    document.documentElement.classList.add('loader-hidden');
    getLenis()?.start();
    return;
  }

  window.__rkLoaderPlayed = true;

  if (reduced) {
    // Static rat (already rendered) + a short fade; no assembly, drill or
    // sparks. The page becomes ready when the fade completes (~0.7s).
    gsap
      .timeline({ onComplete: () => finishLoader(loader) })
      .set(loader, { autoAlpha: 1 })
      .to(loader, {
        autoAlpha: 0,
        duration: 0.35,
        delay: 0.35,
        ease: 'power1.out',
      })
      .call(onPageReady);
    return;
  }

  getLenis()?.stop();
  startLoaderRat(loader);
  buildTimeline(loader);
}
