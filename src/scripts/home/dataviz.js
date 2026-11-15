import * as THREE from 'three';
import { Text, preloadFont } from 'troika-three-text';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EffectComposer, RenderPass, EffectPass, BloomEffect } from 'postprocessing';
import { reducedMotion } from './helpers';

/**
 * Home / data-viz — native Three.js port of the original React Three Fiber
 * scene (see the internal motion spec for data-viz).
 *
 * The original uses the R3F default camera: PerspectiveCamera(75, aspect,
 * 0.1, 1000) at (0, 0, 5). The four `Line` components are reproduced
 * verbatim: same seeds, amplitudes, position shifts, 100-point generator,
 * MeshLine geometry/material, troika labels and postprocessing bloom.
 */

const SEGMENTS = 100;
// troika-three-text does not support woff2; leave empty to use its built-in default font.
const FONT_URL = '';
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789!';
const CAMERA_FOV = 75;
const CAMERA_DISTANCE = 5;

// The original site's waveform clock is ~4s ahead of this port at mount: in
// the round-3 capture, original and clone frames grabbed at the same wall
// time (__dvMount + 10s) matched only after rolling the clone's
// performance.now back by 4s. Delay this line phase by that amount so the
// default (unparameterised) phase lines up. Derived from that same-wall
// frame comparison; tune here if a later capture shows a different origin.
const CLOCK_OFFSET_SECONDS = 4.0;

// VI v1.0: line/regular dots use stencil white (#F2EFE9) converted
// sRGB -> linear; the highlighted dot uses signal red (#FF3B1D) left as-is
// (the original does not convert it). The tween target is #FF3B1D in linear
// working space.
const LINE_COLOR = new THREE.Color(0xF2EFE9).convertSRGBToLinear();
const HIGHLIGHT_COLOR = 0xFF3B1D;
const HIGHLIGHT_TARGET = { r: 1, g: 0.043735, b: 0.012286 };

const LINE_CONFIGS = [
  { label: 'LIGHTING', seed: 650, amplitude: 1, positionShift: 2, isHighlighted: true },
  { label: 'CONTROL', seed: 350, amplitude: 2, positionShift: -3 },
  { label: 'INSTALLATION', seed: 750, amplitude: 1.5, positionShift: -2 },
  { label: 'SIGNAL', seed: 650, amplitude: 1.25, positionShift: -4 },
];

const ij = (x) => x * x * x;
const lerp = (a, b, t) => (1 - t) * a + t * b;

function makeLine(config) {
  const points = new Float32Array(SEGMENTS * 3);

  const geometry = new MeshLineGeometry();
  geometry.setPoints(points);

  const material = new MeshLineMaterial({
    color: new THREE.Color().copy(LINE_COLOR),
    lineWidth: 0.01,
  });

  const line = new THREE.Mesh(geometry, material);
  line.name = 'line';
  line.userData = {
    enterPosition: 12,
    fuseProgress: 0,
    seed: config.seed,
    amplitude: config.amplitude,
    positionShift: config.positionShift,
    isHighlighted: Boolean(config.isHighlighted),
  };

  const dotGeometry = new THREE.CircleGeometry(0.025, 32);
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: config.isHighlighted ? HIGHLIGHT_COLOR : new THREE.Color().copy(LINE_COLOR),
    transparent: true,
  });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);
  dot.name = 'dot';
  if (config.isHighlighted) dot.scale.setScalar(3.5);

  const baseTextMaterial = new THREE.MeshBasicMaterial({
    color: 0xF2EFE9,
    transparent: true,
  });
  const text = new Text();
  text.name = 'text';
  text.text = config.label;
  if (FONT_URL) text.font = FONT_URL;
  text.characters = CHARACTERS;
  text.fontSize = 0.1;
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.material = baseTextMaterial;

  return {
    config,
    points,
    geometry,
    material,
    line,
    dotGeometry,
    dotMaterial,
    dot,
    baseTextMaterial,
    text,
  };
}

export function initDataViz() {
  const section = document.querySelector('.data-viz-section');
  const container = section?.querySelector('.data-viz-section__container');
  const holder = section?.querySelector('[data-dataviz-canvas]');
  const canvas = holder?.querySelector('canvas');
  const bottomEl = section?.querySelector('.data-viz-section__bottom');
  const titleEl = section?.querySelector('.data-viz-section__title');
  const centerEl = section?.querySelector('.data-viz-section__center');
  const centerTitleEl = section?.querySelector('.data-viz-section__center-title');
  const centerTextEl = section?.querySelector('.data-viz-section__center-text');
  const centerButtonEl = section?.querySelector('.data-viz-section__center-button');

  if (!section || !container || !holder || !canvas) return () => {};

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      stencil: false,
      depth: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
  } catch {
    return () => {};
  }

  // R3F renderer defaults.
  renderer.setClearColor(0x09090B, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 1000);
  camera.position.set(0, 0, CAMERA_DISTANCE);

  const group = new THREE.Group();
  scene.add(group);

  let needsRender = true;

  const items = LINE_CONFIGS.map(makeLine);
  items.forEach(({ line, dot, text }) => {
    group.add(line, dot, text);
    text.sync(() => {
      needsRender = true;
    });
  });

  // Preload the same character set the original passes to its Text components.
  if (FONT_URL) {
    preloadFont({ font: FONT_URL, characters: CHARACTERS }, () => {
      needsRender = true;
    });
  }

  let composer = null;
  try {
    composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: 8,
    });
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          intensity: 1,
          mipmapBlur: false,
          luminanceThreshold: 0.25,
          luminanceSmoothing: 0.98,
          kernelSize: 0,
        })
      )
    );
  } catch {
    composer = null;
  }

  let width = 1;
  let height = 1;
  let viewportWidth = 1;
  let rafId = 0;
  let disposed = false;
  let inView = false;
  const clock = new THREE.Clock();
  window.__dvClockCreatedAt = performance.now();
  window.__dvClockState = () => ({
    now: performance.now(),
    startTime: clock.startTime,
    oldTime: clock.oldTime,
    elapsedTime: clock.elapsedTime,
    running: clock.running,
    autoStart: clock.autoStart,
  });

  function resize() {
    if (disposed) return;
    const rect = holder.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === width && h === height) return;

    width = w;
    height = h;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // R3F viewport width/height at z = 0 (camera at distance 5).
    const viewportHeight =
      2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * CAMERA_DISTANCE;
    viewportWidth = viewportHeight * camera.aspect;

    if (composer) composer.setSize(w, h, false);
    needsRender = true;
  }

  function updateItem(item, elapsed) {
    const { points, line, dot, text, config, baseTextMaterial } = item;
    const { enterPosition, fuseProgress, isHighlighted } = line.userData;
    const d = (elapsed + config.seed) * 0.8;
    const h = Math.sin(d + config.seed / 100);
    const p = points.length;
    const v = 0.25 * p;
    const mobile = window.innerWidth < 768;

    for (let i = 0; i < p; i += 1) {
      const g = Math.sin((i - d) * (1 - 0.002 * enterPosition) * 2);
      const x = 1 - fuseProgress;
      const y = ij(Math.sin((i / p) * 4 * Math.PI) * Math.sin(2 * config.amplitude) * 1.5);
      const S = lerp(config.amplitude, 0, ij(fuseProgress));
      const b = -v + 0.25 * i - enterPosition;
      const T = b + h + config.positionShift;
      const w = 0.1 * g;
      const E = b - (1 - 0.06 * viewportWidth);
      const C = y * fuseProgress;
      const D = x * g + 0.5;

      let px;
      let py;
      if (mobile) {
        px = C + g * S;
        py = -lerp(T, E, fuseProgress);
      } else {
        px = lerp(T, E, fuseProgress);
        py = C + g * S;
      }
      const pz = lerp(w, D, fuseProgress);

      if (i % 3 === 0) points[i] = px;
      else if (i % 3 === 1) points[i] = py;
      else points[i] = pz;

      if (i === points.length - 3) {
        dot.position.x = px;
        text.position.x = px;
      } else if (i === points.length - 2) {
        dot.position.y = py;
        text.position.y = py + 0.2 * (isHighlighted ? 1 : x);
        if (!isHighlighted) {
          text.material.opacity = x;
          baseTextMaterial.opacity = x;
        }
      } else if (i === points.length - 1) {
        dot.position.z = pz + (isHighlighted ? 0.008 : 0.001);
        text.position.z = pz - 0.001;
      }
    }

    line.geometry.setPoints(points);
  }

  function renderFrame() {
    if (disposed) return;
    const dt = clock.getDelta();
    window.__dvFrameAt = performance.now();
    window.__dvFrameCount = (window.__dvFrameCount || 0) + 1;
    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
    needsRender = false;
    canvas.dataset.ready = 'true';
  }

  function tick() {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    if (document.hidden) return;
    if (!inView && !needsRender) return;

    if (inView) {
      const elapsed = Math.max(0, clock.getElapsedTime() - CLOCK_OFFSET_SECONDS);
      window.__dvElapsed = elapsed;
      window.__dvTickAt = performance.now();
      window.__dvTickCount = (window.__dvTickCount || 0) + 1;
      items.forEach((item) => updateItem(item, elapsed));
      needsRender = true;
    }
    if (needsRender) renderFrame();
  }

  resize();
  // Draw the initial frame once even before the section enters the viewport.
  items.forEach((item) => updateItem(item, 0));
  renderFrame();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(holder);

  const intersectionObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              inView = entry.isIntersecting;
              if (inView) needsRender = true;
            });
          },
          { rootMargin: '25% 0px' }
        )
      : null;
  if (intersectionObserver) intersectionObserver.observe(section);
  else inView = true;

  const onVisibility = () => {
    if (!document.hidden) needsRender = true;
  };
  document.addEventListener('visibilitychange', onVisibility);

  const reduce = reducedMotion();
  let mediaContext = null;
  let reducedTrigger = null;
  let splits = [];

  function setReducedFrame() {
    items.forEach((item) => {
      item.line.userData.enterPosition = -0.5;
      item.line.userData.fuseProgress = 0;
      updateItem(item, 0);
    });
    group.position.x = 0;
    if (centerEl) centerEl.style.visibility = 'hidden';
    if (bottomEl) bottomEl.style.visibility = 'visible';
    needsRender = true;
  }

  if (reduce) {
    setReducedFrame();
    reducedTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: container,
    });
    // Render again once any remaining troika syncs have settled.
    requestAnimationFrame(() => {
      needsRender = true;
      renderFrame();
    });
  } else {
    mediaContext = gsap.matchMedia();
    mediaContext.add(
      { mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' },
      (context) => {
        const mobile = Boolean(context.conditions.mobile);
        splits = [];

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true,
            onEnter() {
              canvas.setAttribute('data-in-viewport', 'true');
            },
            onEnterBack() {
              canvas.setAttribute('data-in-viewport', 'true');
            },
            onLeave() {
              canvas.setAttribute('data-in-viewport', 'false');
            },
            onLeaveBack() {
              canvas.setAttribute('data-in-viewport', 'false');
            },
          },
          defaults: { ease: 'none' },
        });

        // Each line: enter 12 -> -0.5 over 0.6s, then fuse 0 -> 1 while the
        // entrance travels to -1.5 over 0.4s. The highlighted line also
        // brightens its dot at 0.92 and hides its label at 0.96.
        items.forEach((item) => {
          const { line, dot, text } = item;
          const proxy = { enterPosition: 12, fuseProgress: 0 };
          const timeline = gsap
            .timeline({
              onUpdate() {
                line.userData.enterPosition = proxy.enterPosition;
                line.userData.fuseProgress = proxy.fuseProgress;
              },
            })
            .to(proxy, { enterPosition: -0.5, duration: 0.6, ease: 'power1' }, 0)
            .to(
              proxy,
              { fuseProgress: 1, enterPosition: -1.5, duration: 0.4, ease: 'power1.inOut' },
              0.6
            );

          if (line.userData.isHighlighted) {
            timeline
              .to(
                dot.material.color,
                { ...HIGHLIGHT_TARGET, duration: 0.08, ease: 'power1.inOut' },
                0.92
              )
              .to(text.material, { opacity: 0, duration: 0.04, ease: 'power1.inOut' }, 0.96);
          }

          master.add(timeline, 0);
        });

        // The whole 3D group slides half a world unit left on desktop at the
        // end, which centres the convergence point under the CTA copy.
        master.to(
          group.position,
          { x: mobile ? 0 : -0.5, duration: 0.2, ease: 'power1.inOut' },
          0.9
        );

        let bottomTimeline = null;
        let centerTimeline = null;

        const bottomSplit = titleEl
          ? SplitText.create(titleEl, {
              tag: 'span',
              type: 'lines,words',
              linesClass: 'line',
              wordsClass: 'word',
              autoSplit: true,
              onRevert() {
                if (bottomTimeline) {
                  master.remove(bottomTimeline);
                  bottomTimeline.revert();
                  bottomTimeline = null;
                }
              },
              onSplit(self) {
                if (bottomTimeline) {
                  master.remove(bottomTimeline);
                  bottomTimeline.revert();
                }
                bottomTimeline = gsap
                  .timeline({ defaults: { ease: 'none' } })
                  .from(titleEl, { yPercent: 100, duration: 0.3, ease: 'power4' }, 0)
                  .from(
                    self.words,
                    {
                      opacity: 0,
                      duration: 0.2,
                      ease: 'bounce.inOut',
                      stagger: { amount: 0.1, from: 'random', grid: 'auto' },
                    },
                    0
                  )
                  .to(
                    self.words,
                    {
                      opacity: 0,
                      duration: 0.2,
                      ease: 'bounce.inOut',
                      stagger: { amount: 0.1, from: 'random', grid: 'auto' },
                    },
                    0.6
                  )
                  .to(titleEl, { yPercent: 100, duration: 0.4, ease: 'power4.in' }, 0.6);
                master.add(bottomTimeline, 0);
              },
            })
          : null;
        if (bottomSplit) splits.push(bottomSplit);

        const centerSplit =
          centerTitleEl && centerTextEl
            ? SplitText.create([centerTitleEl, centerTextEl], {
                tag: 'span',
                type: 'lines,words,chars',
                linesClass: 'line',
                wordsClass: 'word',
                autoSplit: true,
                onRevert() {
                  if (centerTimeline) {
                    master.remove(centerTimeline);
                    centerTimeline.revert();
                    centerTimeline = null;
                  }
                },
                onSplit(self) {
                  if (centerTimeline) {
                    master.remove(centerTimeline);
                    centerTimeline.revert();
                  }
                  const chars = self.chars.filter(
                    (el) =>
                      el.parentElement?.parentElement?.parentElement?.classList.contains(
                        'data-viz-section__center-title'
                      )
                  );
                  const words = self.words.filter((el) =>
                    el.parentElement?.parentElement?.classList.contains(
                      'data-viz-section__center-text'
                    )
                  );

                  centerTimeline = gsap
                    .timeline({ defaults: { ease: 'none' } })
                    .from(
                      [centerTitleEl, centerTextEl, centerButtonEl].filter(Boolean),
                      {
                        x: mobile ? 0 : 50,
                        y: mobile ? 50 : 0,
                        duration: 0.2,
                        ease: 'power1.inOut',
                      },
                      0.9
                    )
                    .from(
                      chars,
                      { opacity: 0, duration: 0.1, stagger: 0.008, ease: 'power4.inOut' },
                      0.9
                    )
                    .from(
                      words,
                      {
                        opacity: 0,
                        duration: 0.2,
                        ease: 'bounce.inOut',
                        stagger: { amount: 0.05, from: 'random', grid: 'auto' },
                      },
                      0.9
                    )
                    .from(
                      centerButtonEl,
                      { opacity: 0, yPercent: 25, duration: 0.1, ease: 'power2.inOut' },
                      0.95
                    );
                  master.add(centerTimeline, 0);
                },
              })
            : null;
        if (centerSplit) splits.push(centerSplit);

        return () => {
          splits.forEach((split) => split.revert());
          splits = [];
        };
      }
    );
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    if (reducedTrigger) {
      reducedTrigger.kill();
      reducedTrigger = null;
    }
    if (mediaContext) {
      mediaContext.revert();
      mediaContext = null;
    }
    splits.forEach((split) => split.revert());
    splits = [];
    resizeObserver.disconnect();
    if (intersectionObserver) intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);

    items.forEach((item) => {
      item.text.dispose();
      item.baseTextMaterial.dispose();
      item.geometry.dispose();
      item.material.dispose();
      item.dotGeometry.dispose();
      item.dotMaterial.dispose();
    });
    if (composer) {
      composer.dispose();
      composer = null;
    }
    renderer.dispose();

    canvas.removeAttribute('data-in-viewport');
    delete canvas.dataset.ready;
    if (centerEl) centerEl.style.visibility = '';
    if (bottomEl) bottomEl.style.visibility = '';
  };
}
