import gsap from 'gsap';

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs `callback` once the intro loader has finished. On ClientRouter
 * navigations the loader is already gone, so the callback runs immediately.
 */
export function onLoaderDone(callback) {
  if (window.__rkLoaderDone) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  document.addEventListener('rk:loader-done', handler, { once: true });
  return () => document.removeEventListener('rk:loader-done', handler);
}

/**
 * Small per-module bookkeeping so every ScrollTrigger, split and listener
 * is reverted on astro:before-swap.
 */
export function createStore() {
  const triggers = [];
  const splits = [];
  const tweens = [];
  const cleanups = [];

  return {
    trigger(trigger) {
      if (trigger) triggers.push(trigger);
      return trigger;
    },
    split(split) {
      if (split) splits.push(split);
      return split;
    },
    tween(tween) {
      if (tween) tweens.push(tween);
      return tween;
    },
    onCleanup(fn) {
      if (fn) cleanups.push(fn);
      return fn;
    },
    cleanup() {
      cleanups.splice(0).forEach((fn) => {
        try {
          fn();
        } catch {
          /* already gone */
        }
      });
      triggers.splice(0).forEach((trigger) => trigger.kill());
      tweens.splice(0).forEach((tween) => tween.kill());
      splits.splice(0).forEach((split) => split.revert());
    },
  };
}
