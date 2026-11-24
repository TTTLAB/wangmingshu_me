import gsap from 'gsap';

const loaded = new Set();

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealNoise(element) {
  if (reducedMotion()) {
    gsap.set(element, { opacity: 0.05 });
    return;
  }
  gsap.to(element, { opacity: 0.05, duration: 0.6, ease: 'power1.out' });
}

export function initNoise() {
  document.querySelectorAll('.noise[data-src]').forEach((element) => {
    const src = element.getAttribute('data-src');
    if (!src) return;
    element.removeAttribute('data-src');

    if (loaded.has(src)) {
      element.style.backgroundImage = `url("${src}")`;
      revealNoise(element);
      return;
    }

    const image = new Image();
    image.onload = () => {
      loaded.add(src);
      element.style.backgroundImage = `url("${src}")`;
      revealNoise(element);
    };
    image.src = src;
  });
}
