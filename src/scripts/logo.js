/**
 * Renders the VI rat mark into the static logo slots. The SVG source lives in
 * /assets/vi/rat.js (a verbatim copy of brand/vi/assets/rat.js) and exposes
 * `window.__VI_RAT__()` / `window.__VI_RAT_BADGE__()`.
 *
 * The mark is static: no tail, drill or rotation animation.
 */
export function renderBrandLogos(root = document) {
  const mainMark = window.__VI_RAT__;
  const badgeMark = window.__VI_RAT_BADGE__;

  if (typeof mainMark === 'function') {
    root.querySelectorAll('[data-vi-logo="main"]').forEach((slot) => {
      if (slot.dataset.rendered === 'true') return;
      slot.innerHTML = mainMark();
      slot.dataset.rendered = 'true';
    });
  }

  if (typeof badgeMark === 'function') {
    root.querySelectorAll('[data-vi-logo="badge"]').forEach((slot) => {
      if (slot.dataset.rendered === 'true') return;
      slot.innerHTML = badgeMark();
      slot.dataset.rendered = 'true';
    });
  }
}
