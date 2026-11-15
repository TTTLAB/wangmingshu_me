/**
 * Footer navigation (home page only). The source site uses a SmoothLink that
 * overrides the hash jump and sends Lenis to the section's ScrollTrigger
 * boundary instead of the element's raw offset. Values are ported verbatim:
 *   case-histories -> trigger end
 *   about          -> trigger start
 *   services       -> trigger start + 50
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

  if (st && target.id !== 'case-histories') {
    top =
      target.id === 'about'
        ? st.start
        : target.id === 'services'
          ? st.start + 50
          : window.scrollY < st.start
            ? st.end
            : st.start;
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
