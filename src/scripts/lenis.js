import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;
let tickerFn = null;

export function createLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    autoRaf: false,
    syncTouch: true,
  });

  gsap.ticker.lagSmoothing(0);

  tickerFn = (time) => {
    if (lenis) lenis.raf(1000 * time);
  };
  gsap.ticker.add(tickerFn);

  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: lenis.rootElement || document.documentElement });
  ScrollTrigger.clearScrollMemory('manual');

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroyLenis() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}
