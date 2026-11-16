let mq = null;
let reducedMq = null;
let onChange = null;
let onReduceChange = null;
let observer = null;
let bindings = [];
// load 之后排的空闲回调：离开页面时必须取消，否则会给已经脱离文档的
// <source> 设 src，照样把那 933KB / 4.25MB 拉下来。
let idleHandle = null;
let idleType = null;
let disposed = false;

function bind(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  bindings.push([target, type, handler, options]);
}

export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  const source = video?.querySelector('source[data-src-desktop]');
  if (!video || !source) return;

  disposed = false;

  // 强制静音与内联，绕过移动端（含微信 WebView）的自动播放限制
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  ['muted', 'playsinline', 'webkit-playsinline'].forEach((name) => {
    if (!video.hasAttribute(name)) video.setAttribute(name, '');
  });

  let sourceApplied = false;
  let inView = false;

  /**
   * 挂载许可。首屏关键路径（HTML / CSS / 字体 / poster）没走完之前不给
   * `<source>` 设 src，`preload="none"` 才真正生效。触发点有两个：
   * window 的 load 之后（空闲时）或首次用户交互。
   */
  let activated = false;

  mq = window.matchMedia('(max-width: 767px)');
  reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 命中 reduced-motion 时连 source 都不挂：不发请求，停在 poster 上。
  const skipMotion = () => reducedMq.matches;

  const tryPlay = () => {
    // 还没进入视口、还没挂上 source、或用户要求减少动效时不空转
    if (disposed || !sourceApplied || !inView || skipMotion()) return;
    if (!video.paused) return;
    try {
      const playAttempt = video.play();
      if (playAttempt?.catch) playAttempt.catch(() => {});
    } catch {}
  };

  const apply = () => {
    if (disposed || !activated || skipMotion()) return;

    const target = mq.matches
      ? source.dataset.srcMobile
      : source.dataset.srcDesktop;
    if (!target) return;

    if (source.getAttribute('src') !== target) {
      source.setAttribute('src', target);
      sourceApplied = true;
      video.load();
    } else {
      sourceApplied = true;
    }
    tryPlay();
  };

  const activate = () => {
    if (disposed || activated) return;
    activated = true;
    apply();
  };

  // load 之后先让主线程空下来，把带宽和解析时间留给首屏。
  const whenIdle = (fn) => {
    if ('requestIdleCallback' in window) {
      idleType = 'idle';
      idleHandle = window.requestIdleCallback(
        () => {
          idleHandle = null;
          fn();
        },
        { timeout: 2000 }
      );
    } else {
      idleType = 'timeout';
      idleHandle = window.setTimeout(() => {
        idleHandle = null;
        fn();
      }, 200);
    }
  };

  if (document.readyState === 'complete') {
    // ClientRouter 的站内导航回来时 window 的 load 不会再触发，直接排空闲。
    whenIdle(activate);
  } else {
    bind(window, 'load', () => whenIdle(activate), { once: true });
  }

  onChange = () => {
    // 只在视频仍处于视口附近时切换片源，避免把已经离开视口的视频重新拉起来
    if (inView) apply();
  };
  mq.addEventListener('change', onChange);

  onReduceChange = () => {
    if (skipMotion()) {
      // 已经在播就停在当前帧，不回退 poster，避免闪一下
      if (!video.paused) video.pause();
    } else {
      apply();
    }
  };
  reducedMq.addEventListener('change', onReduceChange);

  const onEnter = () => {
    inView = true;
    apply();
  };
  const onLeave = () => {
    inView = false;
    if (!video.paused) video.pause();
  };

  // 视频接近视口时才挂 source；离开视口暂停，回来再续播。
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onEnter();
          else onLeave();
        });
      },
      { rootMargin: '300px' }
    );
    observer.observe(video);
  } else {
    onEnter();
  }

  // 媒体就绪后再补一次播放尝试
  bind(video, 'loadeddata', tryPlay);
  bind(video, 'canplay', tryPlay);

  // 微信 JSBridge 就绪后补一次播放尝试
  const onWeixinReady = () => {
    video.muted = true;
    if (inView) apply();
    else tryPlay();
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
    // 用户已经动手了，不必再等 load 之后的空闲回调
    activate();
    if (inView) apply();
    else tryPlay();
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
  disposed = true;
  if (idleHandle !== null) {
    if (idleType === 'idle' && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleHandle);
    } else {
      window.clearTimeout(idleHandle);
    }
    idleHandle = null;
  }
  idleType = null;
  if (observer) observer.disconnect();
  observer = null;
  if (mq && onChange) mq.removeEventListener('change', onChange);
  mq = null;
  onChange = null;
  if (reducedMq && onReduceChange) {
    reducedMq.removeEventListener('change', onReduceChange);
  }
  reducedMq = null;
  onReduceChange = null;
  bindings.forEach(([target, type, handler, options]) => {
    target.removeEventListener(type, handler, options);
  });
  bindings = [];
}
