/**
 * VI 14.4 tail wave for the navbar rat mark.
 *
 * Values are ported verbatim from brand/VI.md §14.4 and the reference driver
 * brand/vi/assets/rat-motion.js — random 4–9s interval, 480ms wag, pivot at
 * the tail root (`transform-box: fill-box`, `transform-origin: 100% 100%`),
 * Web Animations API only.
 *
 * Scope follows the same rules: only logos at least 64px wide animate (the
 * home navbar mark on desktop; the 47.5px inner-page and phone marks stay
 * static), motion is off under `prefers-reduced-motion: reduce`, and it
 * pauses while the page is hidden or printing. The loader rat is excluded —
 * VI forbids logo motion in loading states (it has its own loader driver).
 */

const MIN_WIDTH = 64;
const TAIL_MIN = 4000;
const TAIL_MAX = 9000;
const TAIL_DURATION = 480;

const TAIL_KEYFRAMES = [
  { transform: 'rotate(0deg)', easing: 'cubic-bezier(.22,1,.36,1)' },
  { transform: 'rotate(9deg)', offset: 0.23, easing: 'cubic-bezier(.37,0,.63,1)' },
  { transform: 'rotate(-3.5deg)', offset: 0.58, easing: 'cubic-bezier(.37,0,.63,1)' },
  { transform: 'rotate(1.2deg)', offset: 0.84, easing: 'cubic-bezier(.37,0,.63,1)' },
  { transform: 'rotate(0deg)' },
];

const randomBetween = (min, max) => min + Math.random() * (max - min);

function createTailController(slot, tail) {
  let timer = 0;
  let animation = null;
  let lastWidth = -1;
  let hidden = document.hidden;
  let printing = false;
  let wide = false;
  let destroyed = false;

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  let reduced = !!(motionQuery && motionQuery.matches);

  // The tail path's root sits at the bottom-right of its bbox.
  tail.style.transformBox = 'fill-box';
  tail.style.transformOrigin = '100% 100%';

  const canRun = () =>
    !destroyed && wide && !hidden && !printing && !reduced;

  const cancelAnimation = () => {
    if (!animation) return;
    try {
      animation.cancel();
    } catch {
      /* already finished */
    }
    animation = null;
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = 0;
    if (!canRun()) return;
    timer = window.setTimeout(() => {
      timer = 0;
      if (!canRun()) return;
      play();
      schedule();
    }, randomBetween(TAIL_MIN, TAIL_MAX));
  };

  const play = () => {
    if (animation || typeof tail.animate !== 'function') return;
    let next;
    try {
      next = tail.animate(TAIL_KEYFRAMES, {
        duration: TAIL_DURATION,
        fill: 'none',
      });
    } catch {
      // VI 14.4: no animation support must stay static and never throw —
      // otherwise the scheduler would report every interval.
      return;
    }
    animation = next;
    const settle = () => {
      if (animation === next) animation = null;
    };
    next.finished.then(settle, settle);
  };

  const sync = () => {
    // Layout width, not the transformed rect: an ancestor mid-animation
    // (scale) must not decide whether the mark qualifies.
    const width = slot.offsetWidth;
    if (Math.abs(width - lastWidth) >= 0.5) {
      lastWidth = width;
      wide = width >= MIN_WIDTH;
    }
    slot.dataset.motion = canRun() ? 'on' : 'off';
    if (canRun()) {
      if (!timer) schedule();
    } else {
      window.clearTimeout(timer);
      timer = 0;
      cancelAnimation();
    }
  };

  const onVisibility = () => {
    hidden = document.hidden;
    sync();
  };
  const onBeforePrint = () => {
    printing = true;
    sync();
  };
  const onAfterPrint = () => {
    printing = false;
    sync();
  };
  const onMotionPreference = () => {
    // No manual opt-in on the site: the system preference always wins.
    reduced = !!(motionQuery && motionQuery.matches);
    sync();
  };

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('beforeprint', onBeforePrint);
  window.addEventListener('afterprint', onAfterPrint);
  if (motionQuery) {
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionPreference);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(onMotionPreference);
    }
  }

  let observer = null;
  if (typeof ResizeObserver === 'function') {
    observer = new ResizeObserver(sync);
    observer.observe(slot);
  } else {
    window.addEventListener('resize', sync);
  }

  sync();

  return () => {
    if (destroyed) return;
    destroyed = true;
    window.clearTimeout(timer);
    timer = 0;
    cancelAnimation();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('beforeprint', onBeforePrint);
    window.removeEventListener('afterprint', onAfterPrint);
    if (motionQuery) {
      if (typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', onMotionPreference);
      } else if (typeof motionQuery.removeListener === 'function') {
        motionQuery.removeListener(onMotionPreference);
      }
    }
    observer?.disconnect();
    window.removeEventListener('resize', sync);
    slot.dataset.motion = 'off';
  };
}

export function initLogoTail(root = document) {
  const slots = Array.from(root.querySelectorAll('.vi-nav-rat'));
  const cleanups = [];

  slots.forEach((slot) => {
    const tail = slot.querySelector('[data-part="tail"]');
    if (!tail || typeof tail.animate !== 'function') {
      // VI 14.4 still expects the root to advertise motion state.
      slot.dataset.motion = 'off';
      return;
    }
    cleanups.push(createTailController(slot, tail));
  });

  return () => cleanups.splice(0).forEach((fn) => fn());
}
