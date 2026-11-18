/**
 * Footer navigation (home page only). The source site uses a SmoothLink that
 * overrides the hash jump and sends Lenis to the section's ScrollTrigger
 * boundary instead of the element's raw offset. Values are ported verbatim:
 *   case-histories -> element's own document offset
 *   about          -> trigger start
 *   services       -> element's own document offset +8px (the phone trigger
 *                     starts at `bottom bottom`, so its start is not the
 *                     section top; the +8 clears the `once` reveal trigger
 *                     line so the copy does not stay at opacity 0)
 *   anything else  -> end when scrolling up, start when scrolling down
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis';

function scrollToTarget(target, lenis, immediate) {
  if (!target) return;

  ScrollTrigger.refresh();
  ScrollTrigger.update();

  const rect = target.getBoundingClientRect();
  let top = window.scrollY + rect.top;
  const st = ScrollTrigger.getById(target.id);

  // `services` deliberately skips the ScrollTrigger boundary: on phones its
  // trigger starts at `bottom bottom`, so `st.start` sits most of a viewport
  // past the section top and the jump lands mid-section. Use the element's
  // own document offset (what a plain #hash jump does) plus a few pixels so
  // the section's `once` reveal (start: 'top top') actually fires instead of
  // parking exactly on its trigger line with the copy still at opacity 0.
  if (st && target.id !== 'case-histories' && target.id !== 'services') {
    top =
      target.id === 'about'
        ? st.start
        : window.scrollY < st.start
          ? st.end
          : st.start;
  } else if (target.id === 'services') {
    top += 8;
  }

  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { duration: 1.2, immediate, force: immediate });
  } else {
    window.scrollTo({
      top: document.documentElement.scrollTop + rect.top,
      behavior: immediate ? 'instant' : 'smooth',
    });
  }

  try {
    history.replaceState(null, '', '#' + target.id);
  } catch (e) {
    /* ignore */
  }
}

export function initFooterNav() {
  if (document.body.dataset.page !== 'home') return () => {};

  const links = Array.from(document.querySelectorAll('.footer__nav-link[href^="#"]'));
  if (links.length === 0) return () => {};

  const onClick = (event) => {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    const target = href ? document.querySelector(href) : null;

    event.preventDefault();
    if (!target) return;

    scrollToTarget(target, getLenis(), false);
  };

  links.forEach((link) => link.addEventListener('click', onClick));

  return () => {
    links.forEach((link) => link.removeEventListener('click', onClick));
  };
}
