let mq = null;
let onChange = null;

export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  const source = video?.querySelector('source[data-src-desktop]');
  if (!video || !source) return;

  mq = window.matchMedia('(max-width: 767px)');

  const apply = () => {
    const target = mq.matches
      ? source.dataset.srcMobile
      : source.dataset.srcDesktop;
    if (!target) return;

    if (source.getAttribute('src') === target) return;

    source.setAttribute('src', target);
    video.load();
    const playAttempt = video.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
  };

  onChange = apply;
  mq.addEventListener('change', onChange);
  apply();
}

export function cleanupHeroVideo() {
  if (mq && onChange) mq.removeEventListener('change', onChange);
  mq = null;
  onChange = null;
}
