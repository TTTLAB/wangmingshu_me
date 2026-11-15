import gsap from 'gsap';
import { createStore, reducedMotion } from './helpers';

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Case histories: pattern bars slide in on hover, and the container fades in
 * as the section scrolls into view.
 */
export function initCases() {
  const store = createStore();
  const section = document.querySelector('#case-histories');
  if (!section) return store.cleanup;

  const container = section.querySelector('.case-histories__container');
  const rows = section.querySelectorAll('.js-case-histories-item');

  section.querySelectorAll('.js-case-row-rect').forEach((rect) => {
    gsap.set(rect, { scaleX: 0, transformOrigin: '0% 50%' });
  });

  if (reducedMotion()) {
    section.querySelectorAll('.js-case-row-rect').forEach((rect) => {
      gsap.set(rect, { scaleX: 0 });
    });
    return store.cleanup;
  }

  const mm = gsap.matchMedia();

  mm.add(HOVER_QUERY, () => {
    const cleanups = [];

    rows.forEach((row) => {
      const rects = row.querySelectorAll('.js-case-row-rect');
      if (!rects.length) return;

      const enter = () => {
        gsap.set(rects, { transformOrigin: '0% 50%' });
        gsap.to(rects, {
          scaleX: 1.05,
          stagger: { each: 0.01, from: 'start' },
          ease: 'power4.inOut',
        });
      };

      const leave = () => {
        gsap.set(rects, { transformOrigin: '100% 50%' });
        gsap.to(rects, {
          scaleX: 0,
          stagger: { each: 0.01, from: 'start' },
          ease: 'power4.inOut',
        });
      };

      row.addEventListener('mouseenter', enter);
      row.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        row.removeEventListener('mouseenter', enter);
        row.removeEventListener('mouseleave', leave);
        gsap.killTweensOf(rects);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  });

  store.onCleanup(() => mm.revert());

  if (!container) return store.cleanup;

  // Fade the rows in as the section approaches, finishing before it reaches
  // the top of the viewport. The previous pin:true + from(opacity:0) scrub
  // started fully transparent at the pinned top, so landing on
  // /#case-histories (or clicking "作品") showed an empty band.
  const fadeTween = gsap.fromTo(
    container,
    { opacity: 0 },
    {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 30%',
        scrub: true,
        invalidateOnRefresh: true,
        id: 'case-histories',
      },
    }
  );

  store.tween(fadeTween);
  store.trigger(fadeTween.scrollTrigger);

  return store.cleanup;
}
