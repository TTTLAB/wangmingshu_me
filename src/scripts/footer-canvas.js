import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './home/helpers';

/**
 * Footer WebGL: the perspective grid lifted from the reference bundle
 * (.scratch/34zl8se8l5ddc.js, uniforms uGridScale / uPointer / uTime).
 * Full-screen quad, orthographic camera, pointer glow and a slow grid drift.
 */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;

  uniform vec3 uColorGrid;
  uniform vec3 uColorGap;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  uniform float uDPR;
  uniform float uTime;
  uniform float uGridScale;
  uniform float uPointerStrength;
  uniform float uResolutionAspect;

  float calculateGrid(in vec2 uv, in float thickness) {
    vec2 fw = min(fwidth(uv), thickness);
    vec2 gridUV = abs(fract(uv - 0.5) - 0.5);
    vec2 grid = smoothstep(thickness + fw, thickness - fw, gridUV);
    return max(grid.x, grid.y);
  }

  float calculateGlow(in vec2 uv, in float thickness, in float glowRadius) {
    float distX = min(fract(uv.x), 1. - fract(uv.x));
    float distY = min(fract(uv.y), 1. - fract(uv.y));
    float dist  = min(distX, distY);
    return 1. - smoothstep(0., glowRadius, dist - thickness);
  }

  void main(){
    vec2 logicalCoord = gl_FragCoord.xy / uDPR;
    vec2 halfResolution = uResolution.xy * .5;
    vec2 st = (logicalCoord - halfResolution) / uGridScale;

    vec2 correctedPointer = (uPointer * uResolution - halfResolution) / uGridScale;

    float angle = radians(-80.);
    float cosA  = cos(angle);
    float sinA  = sin(angle);
    float yRot  = st.y * cosA;
    float zRot  = st.y * sinA;

    float d = 3.;
    float perspective = max(0.001, 1. + zRot / d);

    st.x = st.x / perspective;
    st.y = yRot / perspective;
    st.y /= cosA * .5;

    float pYRot  = correctedPointer.y * cosA;
    float pZRot  = correctedPointer.y * sinA;
    float pPersp = max(0.001, 1. + pZRot / d);

    correctedPointer.x = correctedPointer.x / pPersp;
    correctedPointer.y = pYRot / pPersp;
    correctedPointer.y /= cosA * .5;

    float rangeX = halfResolution.x / uGridScale;
    float rangeY = halfResolution.y / uGridScale;

    float fadeLeft  = smoothstep(-rangeX, -rangeX * 0.5, st.x);
    float fadeRight = smoothstep(rangeX, rangeX * 0.5, st.x);
    float fadeY     = 1. - smoothstep(-rangeY * 0.3, rangeY * 1.2, st.y);
    float fade      = fadeLeft * fadeRight * fadeY * .75;

    st.y -= uTime * 5.;
    correctedPointer.y -= uTime * 5.;

    float scaledThickness = .007;
    float grid = calculateGrid(st, scaledThickness);

    float glowRadius    = 0.04;
    float glowStrength  = 0.09;
    float glow          = calculateGlow(st, scaledThickness, glowRadius);
    float pointerRadius = 2.50;
    float pointerDist   = distance(st, correctedPointer);
    float pointerMask   = (1. - smoothstep(0., pointerRadius, pointerDist)) * 5.;
    pointerMask        *= uPointerStrength;

    float dist = distance(st, correctedPointer);

    vec3 finalColor = uColorGrid;
    finalColor     += uColorGap * glow * glowStrength * fade * max(pointerMask, 1.);
    finalColor      = mix(finalColor, uColorGap * .6, grid * fade);

    gl_FragColor = vec4(finalColor, 1.);
  }
`;

// The reference constructs these from sRGB strings and then explicitly
// converts linear -> sRGB before uploading, so the shader receives the same
// bytes the original GLSL saw. Values are kept as strings on purpose.
const THEMES = {
  dark: { grid: '#09090B', gap: '#FF3B1D' },
  light: { grid: '#F2EFE9', gap: '#FF3B1D' },
};

export function initFooterCanvas() {
  const footer = document.querySelector('.footer');
  const holder = document.querySelector('[data-footer-canvas]');
  const canvas = holder?.querySelector('canvas');
  if (!footer || !holder || !canvas) return () => {};

  let renderer;
  try {
    // Mirrors the reference <Canvas> defaults (R3F): alpha, antialias,
    // stencil off, depth on, high-performance + highp.
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

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const theme = footer.classList.contains('footer--light') ? THEMES.light : THEMES.dark;

  const uniforms = {
    uTime: { value: 0 },
    uGridScale: { value: 220 },
    uColorGap: { value: new THREE.Color(theme.gap).convertLinearToSRGB() },
    uColorGrid: { value: new THREE.Color(theme.grid).convertLinearToSRGB() },
    uDPR: { value: Math.min(window.devicePixelRatio || 1, 2) },
    uResolutionAspect: { value: 1 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uPointerStrength: { value: 0 },
  };

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: false,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(geometry, material);
  quad.frustumCulled = false;
  scene.add(quad);

  // Read-only inspection hook used by the screenshot QA scripts.
  if (typeof window !== 'undefined') {
    window.__rkFooter = {
      uniforms: () => ({
        uGridScale: uniforms.uGridScale.value,
        uDPR: uniforms.uDPR.value,
        uResolution: uniforms.uResolution.value.toArray(),
        uResolutionAspect: uniforms.uResolutionAspect.value,
        uPointer: uniforms.uPointer.value.toArray(),
        uPointerStrength: uniforms.uPointerStrength.value,
        uTime: uniforms.uTime.value,
        uColorGrid: uniforms.uColorGrid.value.toArray(),
        uColorGap: uniforms.uColorGap.value.toArray(),
      }),
    };
  }

  function resize() {
    // The reference feeds R3F's `size` (the canvas' CSS box) into
    // uResolution; the footer canvas is fixed inset:0, so this equals the
    // viewport but stays correct if the footer box ever changes.
    const rect = holder.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w, h);
    uniforms.uResolutionAspect.value = w / h;
    uniforms.uDPR.value = dpr;
  }
  resize();

  // Pointer: normalised to 0..1 with y pointing up, like the reference.
  const target = new THREE.Vector2(0.5, 0.5);
  const smooth = new THREE.Vector2(0.5, 0.5);
  let pointerActive = false;
  let lastMove = 0;
  let strength = 0;

  const setPointer = (clientX, clientY) => {
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    target.set(
      Math.min(1, Math.max(0, clientX / w)),
      Math.min(1, Math.max(0, 1 - clientY / h))
    );
    pointerActive = true;
    lastMove = performance.now();
  };

  const onMouseMove = (event) => setPointer(event.clientX, event.clientY);
  const onTouchMove = (event) => {
    const touch = event.touches?.[0];
    if (touch) setPointer(touch.clientX, touch.clientY);
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Reference: a scrubbed tween from 220 to 160 driven by the page content's
  // bottom edge crossing the viewport bottom, ending when the document
  // bottom reaches it (i.e. exactly the footer reveal range).
  let gridTimeline = null;
  let gridScrollTrigger = null;
  const pageContent = document.querySelector('.js-page-content');
  if (!reducedMotion() && pageContent) {
    gridTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: pageContent,
        endTrigger: document.documentElement,
        start: 'bottom bottom',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    gridTimeline.to(uniforms.uGridScale, { value: 160, ease: 'none' });
    gridScrollTrigger = gridTimeline.scrollTrigger;
  }

  function footerRevealed() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return true;
    return window.scrollY >= maxScroll - window.innerHeight;
  }

  let rafId = 0;
  let lastTime = performance.now();

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (document.hidden) {
      lastTime = now;
      return;
    }
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (pointerActive && now - lastMove > 50) pointerActive = false;
    const targetStrength = pointerActive ? 1 : 0;
    // Reference: strength += (target - strength) * (1 - exp(-1 * dt)).
    strength += (targetStrength - strength) * (1 - Math.exp(-1 * dt));
    smooth.lerp(target, 0.05);

    uniforms.uTime.value += 0.1 * dt;
    uniforms.uPointer.value.copy(smooth);
    uniforms.uPointerStrength.value = strength;

    // Keep the state advancing while hidden, but only draw once the footer
    // has actually been revealed (it is fixed behind the page content).
    if (!footerRevealed()) return;
    renderer.render(scene, camera);
  }

  const renderStatic = () => {
    if (!footerRevealed()) return;
    renderer.render(scene, camera);
  };

  const onResize = () => {
    resize();
    if (reducedMotion()) renderStatic();
  };
  window.addEventListener('resize', onResize);

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(holder);
  }

  if (reducedMotion()) {
    renderStatic();
    window.addEventListener('scroll', renderStatic, { passive: true });
  } else {
    rafId = requestAnimationFrame(tick);
  }

  return () => {
    cancelAnimationFrame(rafId);
    gridScrollTrigger?.kill();
    gridTimeline?.kill();
    if (window.__rkFooter) delete window.__rkFooter;
    resizeObserver?.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('scroll', renderStatic);
    window.removeEventListener('resize', onResize);
    geometry.dispose();
    material.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss?.();
  };
}
