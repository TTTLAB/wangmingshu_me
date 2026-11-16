let mq = null;
let onChange = null;
let bindings = [];

function bind(target, type, handler) {
  target.addEventListener(type, handler);
  bindings.push([target, type, handler]);
}

export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  const source = video?.querySelector('source[data-src-desktop]');
  if (!video || !source) return;

  // 强制静音与内联，绕过移动端（含微信 WebView）的自动播放限制
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  ['muted', 'playsinline', 'webkit-playsinline'].forEach((name) => {
    if (!video.hasAttribute(name)) video.setAttribute(name, '');
  });

  const tryPlay = () => {
    if (!video.paused) return;
    try {
      const playAttempt = video.play();
      if (playAttempt?.catch) playAttempt.catch(() => {});
    } catch {}
  };

  mq = window.matchMedia('(max-width: 767px)');

  const apply = () => {
    const target = mq.matches
      ? source.dataset.srcMobile
      : source.dataset.srcDesktop;
    if (!target) return;

    if (source.getAttribute('src') !== target) {
      source.setAttribute('src', target);
      video.load();
    }
    tryPlay();
  };

  onChange = apply;
  mq.addEventListener('change', onChange);
  apply();

  // 媒体就绪后再补一次播放尝试
  bind(video, 'loadeddata', tryPlay);
  bind(video, 'canplay', tryPlay);

  // 微信 JSBridge 就绪后补一次播放尝试
  const onWeixinReady = () => {
    video.muted = true;
    tryPlay();
  };
  bind(document, 'WeixinJSBridgeReady', onWeixinReady);

  // 首次用户手势兜底：触发一次后解绑三个监听
  const removeGestureBindings = () => {
    ['touchstart', 'touchend', 'click'].forEach((type) => {
      document.removeEventListener(type, onGesture);
    });
  };
  const onGesture = () => {
    removeGestureBindings();
    tryPlay();
  };
  ['touchstart', 'touchend', 'click'].forEach((type) => {
    bind(document, type, onGesture);
  });

  // 页面回到可见时若仍暂停则再试
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible' && video.paused) tryPlay();
  };
  bind(document, 'visibilitychange', onVisibilityChange);
}

export function cleanupHeroVideo() {
  if (mq && onChange) mq.removeEventListener('change', onChange);
  mq = null;
  onChange = null;
  bindings.forEach(([target, type, handler]) => {
    target.removeEventListener(type, handler);
  });
  bindings = [];
}
