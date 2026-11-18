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

/**
 * Home scroll spy: appears once the about intro reaches the viewport centre,
 * follows the page through the contact section and hides when the footer
 * takes over. The root also gets the state class used by site.css to swap
 * the link colours on the light about/case sections.
 */
export function initNavSpy() {
  const root = document.querySelector('[data-nav-spy]');
  if (!root) return () => {};

  const links = Array.from(root.querySelectorAll('.nav-spy__link'));
  const entries = links
    .map((link) => {
      const id = (link.getAttribute('href') || '').replace(/^#/, '');
      const el = id ? document.getElementById(id) : null;
      return el ? { link, id, el } : null;
    })
    .filter(Boolean);

  if (entries.length === 0) return () => {};

  const about = document.getElementById('about');
  const aboutIntro = document.querySelector('.about-section');
  const contact = document.getElementById('contact');
  if (!about || !aboutIntro || !contact) return () => {};

  const onNavClick = (event) => {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    event.preventDefault();
    if (!target) return;
    scrollToTarget(target, getLenis(), false);
  };
  const navLinks = Array.from(root.querySelectorAll('.nav-spy__link[href^="#"]'));
  navLinks.forEach((a) => a.addEventListener('click', onNavClick));

  let frame = 0;
  let visible = false;

  const update = () => {
    frame = 0;
    const viewportCenter = window.innerHeight / 2;
    const activationY = window.innerHeight * 0.3;
    const aboutRect = about.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    const introRect = aboutIntro.getBoundingClientRect();

    // Show after the hero: the about block has crossed the centre line.
    // Keep it until the contact section has scrolled past the centre.
    const shouldShow = aboutRect.top <= viewportCenter && contactRect.bottom > viewportCenter;
    if (shouldShow !== visible) {
      visible = shouldShow;
      root.classList.toggle('is-hidden', !shouldShow);
    }
    if (!shouldShow) return;

    let active = entries[0];
    entries.forEach((entry) => {
      if (entry.el.getBoundingClientRect().top <= activationY + 1) active = entry;
    });

    entries.forEach((entry) => {
      const isActive = entry.link === active.link;
      entry.link.classList.toggle('is-active', isActive);
      entry.link.style.setProperty('--scroll-progress', isActive ? '1' : '0');
    });

    const overIntro =
      introRect.top <= viewportCenter && introRect.bottom > viewportCenter;
    const overCases =
      active.id === 'case-histories' &&
      active.el.getBoundingClientRect().top <= viewportCenter;

    root.classList.toggle('is-active--about-intro', overIntro);
    root.classList.toggle('is-active--case-histories', overCases && !overIntro);
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
  };
}
