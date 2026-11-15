import gsap from 'gsap';
import { reducedMotion } from './helpers';

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * The green blob that trails the cursor across the pixel grids used by the
 * about, services, contact and case-hero sections.
 */
export function initInteractiveGrids(store) {
  if (reducedMotion()) return;
  if (!window.matchMedia(HOVER_QUERY).matches) return;

  const cleanups = [];

  document.querySelectorAll('[data-interactive-grid]').forEach((grid) => {
    const container = grid.querySelector('.interactive-grid__container');
    const point = grid.querySelector('.interactive-grid__background');
    if (!container || !point) return;

    gsap.set(point, { opacity: 0 });

    const xTo = gsap.quickTo(point, 'x', { duration: 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(point, 'y', { duration: 0.3, ease: 'power3' });
    const opacityTo = gsap.quickTo(point, 'opacity', {
      duration: 0.4,
      ease: 'bounce',
    });

    opacityTo(0);

    let fadeTimer = 0;

    const onMove = (event) => {
      const containerRect = container.getBoundingClientRect();
      const pointRect = point.getBoundingClientRect();

      xTo(event.clientX - containerRect.left - pointRect.width / 2);
      yTo(event.clientY - containerRect.top - pointRect.height / 2);
      opacityTo(1);

      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => opacityTo(0), 750);
    };

    container.addEventListener('mousemove', onMove);

    cleanups.push(() => {
      container.removeEventListener('mousemove', onMove);
      window.clearTimeout(fadeTimer);
      gsap.killTweensOf(point);
      gsap.set(point, { clearProps: 'transform,opacity' });
    });
  });

  if (!cleanups.length) return;

  const cleanup = () => cleanups.splice(0).forEach((fn) => fn());
  store?.onCleanup(cleanup);
}
