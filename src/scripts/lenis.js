import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isWeChat } from './wechat';

let lenis = null;
let tickerFn = null;

export function createLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    autoRaf: false,
    // 微信 WebView 里接管触摸滚动会和下拉回弹、底部工具栏收放打架，
    // 低端 Android XWeb 上还会掉帧；微信内交还原生触摸滚动，
    // 滚轮/触控板仍走 Lenis，ScrollTrigger 照常由 scroll 事件驱动。
    syncTouch: !isWeChat(),
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
