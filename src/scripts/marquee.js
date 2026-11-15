import gsap from 'gsap';

const SPEED = 95; // pixels per second

let tween = null;
let resizeHandler = null;
let resizeTimer = 0;

function stop() {
  tween?.kill();
  tween = null;
}

function start() {
  const marquee = document.querySelector('.js-marquee');
  const wrap = marquee?.querySelector('.marquee__wrap');
  if (!marquee || !wrap) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(wrap, { xPercent: 0 });
    return;
  }

  stop();
  gsap.set(wrap, { xPercent: 0 });

  const width = wrap.scrollWidth;
  if (!width) return;

  // The wrap contains four copies; moving it by 50% is one seamless cycle.
  const distance = width / 2;
  const duration = distance / SPEED;

  tween = gsap.to(wrap, {
    xPercent: -50,
    duration,
    ease: 'none',
    repeat: -1,
  });
}

export function initMarquee() {
  start();

  resizeHandler = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(start, 200);
  };
  window.addEventListener('resize', resizeHandler);
}

export function cleanupMarquee() {
  stop();
  window.clearTimeout(resizeTimer);
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  resizeHandler = null;
  document.querySelectorAll('.js-marquee .marquee__wrap').forEach((wrap) => {
    gsap.set(wrap, { clearProps: 'transform' });
  });
}
