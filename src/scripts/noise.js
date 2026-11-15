import gsap from 'gsap';

const loaded = new Set();

export function initNoise() {
  document.querySelectorAll('.noise[data-src]').forEach((element) => {
    const src = element.getAttribute('data-src');
    if (!src) return;
    element.removeAttribute('data-src');

    if (loaded.has(src)) {
      element.style.backgroundImage = `url("${src}")`;
      gsap.to(element, { opacity: 0.05, duration: 0.6, ease: 'power1.out' });
      return;
    }

    const image = new Image();
    image.onload = () => {
      loaded.add(src);
      element.style.backgroundImage = `url("${src}")`;
      gsap.to(element, { opacity: 0.05, duration: 0.6, ease: 'power1.out' });
    };
    image.src = src;
  });
}
