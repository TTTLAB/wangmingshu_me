/**
 * Loader-only assembly animation for the VI engineer rat.
 *
 * This is a loading-screen exception (see docs/gaps.md): it never touches
 * `rat.js`, the static SVG downloads or the VI source. It animates only the
 * `[data-part]` nodes of the SVG already injected into `.loader__rat`.
 *
 * Timeline (seconds):
 *   0.00-0.91  7 shards fly in, staggered .06s, power3.out
 *   0.10-0.90  tail / whiskers / eye / bolt fade in
 *   0.45-0.90  hard hat drops and settles, drill slides in from the right
 *   0.90-1.42  drill jitter (10 x .052s, steps(1)), body recoil, 3 red sparks
 *   1.45-1.70  settle, sparks gone, short eye blink
 *
 * The whole-logo node is never transformed; there is no glow, filter or loop.
 * Sparks are created at runtime only (SVG <line>, signal red, no filter).
 */
import gsap from 'gsap';

const SIGNAL_RED = '#FF3B1D';

// 7 shards: scattered start offsets (SVG user units) and light rotation.
const SHARD_ENTRY = [
  { part: 'body', x: 0, y: 30, rotation: -6, origin: '50% 90%' },
  { part: 'head', x: -46, y: -30, rotation: 15, origin: '50% 60%' },
  { part: 'ear', x: 26, y: -42, rotation: -20, origin: '50% 80%' },
  { part: 'arm', x: 44, y: 24, rotation: 18, origin: '50% 50%' },
  { part: 'hindfoot', x: -40, y: 34, rotation: 10, origin: '50% 50%' },
  { part: 'frontleg', x: 22, y: 40, rotation: -14, origin: '50% 50%' },
  { part: 'frontfoot', x: -28, y: 46, rotation: 18, origin: '50% 50%' },
];

// Values mirror the VI drill jitter (rat-motion.js), one frame per .052s.
const DRILL_SHAKE = [
  { x: -1.6, y: 0.7, rotation: -1.2 },
  { x: 1.7, y: -0.8, rotation: 1.3 },
  { x: -1.3, y: 0.9, rotation: -0.9 },
  { x: 1.4, y: -0.6, rotation: 1 },
  { x: -1, y: 0.5, rotation: -0.7 },
  { x: 1.1, y: -0.4, rotation: 0.7 },
  { x: -0.7, y: 0.3, rotation: -0.4 },
  { x: 0.5, y: -0.2, rotation: 0.3 },
  { x: 1.7, y: 0.6, rotation: 1.3 },
  { x: 0, y: 0, rotation: 0 },
];

const BODY_RECOIL = [
  { x: -0.8, y: 0.4 },
  { x: 0.7, y: -0.3 },
  { x: -0.4, y: 0.2 },
  { x: 0, y: 0 },
];

// Spark lines start at the drill tip (249,126) and fan right, as in VI.
const SPARK_LINES = [
  [249, 126, 267, 114],
  [249, 126, 269, 126],
  [249, 126, 267, 138],
];

function collectParts(svg) {
  const parts = {};
  svg.querySelectorAll('[data-part]').forEach((el) => {
    const name = el.getAttribute('data-part');
    if (name && !parts[name]) parts[name] = el;
  });
  return parts;
}

function createSparks(root) {
  const ns = 'http://www.w3.org/2000/svg';
  const group = document.createElementNS(ns, 'g');
  group.setAttribute('data-part', 'sparks');
  group.setAttribute('aria-hidden', 'true');
  group.setAttribute('fill', 'none');
  group.setAttribute('stroke', SIGNAL_RED);
  group.setAttribute('stroke-width', '2.5');
  group.setAttribute('stroke-linecap', 'round');
  group.style.opacity = '0';
  // Appended to the SVG root: fill-box would resolve against the drill bbox
  // and throw the sparks far away from the drill tip.
  group.style.transformBox = 'view-box';
  group.style.transformOrigin = '249px 126px';

  SPARK_LINES.forEach(([x1, y1, x2, y2]) => {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    group.appendChild(line);
  });

  root.appendChild(group);
  return group;
}

/**
 * Starts the one-shot loader rat timeline. Safe to call with a missing SVG:
 * it returns silently and leaves the static mark untouched.
 */
export function startLoaderRat(loader) {
  if (!loader || loader.dataset.ratMotion === 'started') return null;

  const svg = loader.querySelector('.loader__rat svg');
  if (!svg) return null;

  const parts = collectParts(svg);
  if (!parts.body || !parts.head) return null;

  loader.dataset.ratMotion = 'started';

  const { hat, drill, tail, whiskers, eye, bolt } = parts;

  // Initial state is applied synchronously so the assembled mark never shows
  // before the first timeline tick.
  SHARD_ENTRY.forEach((entry) => {
    const el = parts[entry.part];
    if (!el) return;
    gsap.set(el, {
      x: entry.x,
      y: entry.y,
      rotation: entry.rotation,
      opacity: 0,
      transformOrigin: entry.origin,
    });
  });

  if (tail) gsap.set(tail, { opacity: 0 });
  if (whiskers) gsap.set(whiskers, { opacity: 0 });
  if (eye) gsap.set(eye, { opacity: 0, transformOrigin: '50% 50%' });
  if (bolt) gsap.set(bolt, { opacity: 0 });
  if (hat) {
    gsap.set(hat, {
      y: -78,
      rotation: -12,
      opacity: 0,
      transformOrigin: '50% 80%',
    });
  }
  if (drill) {
    // Sparks live on the SVG root now, so this origin only affects the drill.
    gsap.set(drill, {
      x: 84,
      rotation: 8,
      opacity: 0,
      transformOrigin: '28% 72%',
    });
  }

  const sparks = drill ? createSparks(svg) : null;

  const tl = gsap.timeline();

  // 0-0.9s: shard assembly.
  SHARD_ENTRY.forEach((entry, i) => {
    const el = parts[entry.part];
    if (!el) return;
    tl.to(
      el,
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
      },
      i * 0.06
    );
  });

  // Tail, whiskers and the fixed-red accents fade in with their parent shards.
  if (tail) {
    tl.to(tail, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.1);
  }
  if (whiskers) {
    tl.to(whiskers, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.28);
  }
  if (bolt) {
    tl.to(bolt, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.6);
  }
  if (eye) {
    tl.to(eye, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.6);
  }

  // 0.45-0.9s: hat drops in with a slight overshoot; drill slides in.
  if (hat) {
    tl.to(hat, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.42);
    tl.to(
      hat,
      { y: 0, rotation: 0, duration: 0.45, ease: 'back.out(1.6)' },
      0.45
    );
  }
  if (drill) {
    tl.to(drill, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.42);
    tl.to(
      drill,
      { x: 0, rotation: 0, duration: 0.45, ease: 'power3.out' },
      0.45
    );
  }

  // 0.9-1.42s: drill jitter, body recoil and the two-flash spark burst.
  if (drill) {
    tl.to(
      drill,
      {
        keyframes: DRILL_SHAKE.map((frame) => ({
          ...frame,
          duration: 0.052,
          ease: 'steps(1)',
        })),
        ease: 'none',
      },
      0.9
    );
  }
  if (parts.body) {
    tl.to(
      parts.body,
      {
        keyframes: BODY_RECOIL.map((frame) => ({
          ...frame,
          duration: 0.075,
          ease: 'steps(1)',
        })),
        ease: 'none',
      },
      0.9
    );
  }
  if (sparks) {
    tl.set(sparks, { opacity: 1 }, 0.9);
    // Two flashes inside 520ms: visible .90-1.02, off, visible 1.06-1.14,
    // then off until the drill stops. Opacity only — no scale, so the sparks
    // stay anchored at the drill tip instead of being pushed away.
    tl.to(
      sparks,
      {
        keyframes: [
          { opacity: 1, duration: 0.12, ease: 'none' },
          { opacity: 0, duration: 0.04, ease: 'none' },
          { opacity: 1, duration: 0.08, ease: 'none' },
          { opacity: 0, duration: 0.06, ease: 'none' },
          { opacity: 0, duration: 0.22, ease: 'none' },
        ],
      },
      0.9
    );
    tl.set(sparks, { opacity: 0 }, 1.42);
  }

  // 1.45-1.7s: settle everything, then one short blink (colour untouched).
  const rest = [parts.body, ...SHARD_ENTRY.slice(1).map((e) => parts[e.part]), hat, drill].filter(Boolean);
  if (rest.length) {
    tl.set(rest, { x: 0, y: 0, rotation: 0 }, 1.45);
  }
  if (sparks) tl.set(sparks, { opacity: 0 }, 1.45);
  if (eye) {
    tl.to(
      eye,
      {
        scaleY: 0.2,
        duration: 0.09,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
        transformOrigin: '50% 50%',
      },
      1.52
    );
  }

  // Visibility: pause the rat while the tab is hidden, resume once. The
  // timeline is one-shot; after completion the listener removes itself.
  let pausedByVisibility = false;

  function onVisibilityChange() {
    if (document.hidden) {
      if (tl.isActive()) {
        pausedByVisibility = true;
        tl.pause();
      }
    } else if (pausedByVisibility) {
      pausedByVisibility = false;
      tl.resume();
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  tl.eventCallback('onComplete', () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    pausedByVisibility = false;
  });

  // Debug / verification hooks only; no page code reads them.
  window.__loaderRatTimeline = tl;
  window.__loaderRat = {
    timeline: tl,
    seek(t) {
      pausedByVisibility = false;
      tl.pause(t);
    },
    get paused() {
      return tl.paused();
    },
  };

  return tl;
}
