import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createStore, onLoaderDone, reducedMotion } from './helpers';

function introSplit(element, store, { lineStagger = 0.1, charStagger = 0.02 } = {}) {
  if (!element) return null;

  const split = SplitText.create(element, {
    type: 'lines, words, chars',
    mask: 'lines',
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'char',
    autoSplit: true,
    onSplit(self) {
      const timeline = gsap.timeline();

      self.lines.forEach((line, index) => {
        timeline
          .from(
            line.querySelectorAll('.char'),
            {
              opacity: 0,
              duration: 0.4,
              stagger: charStagger,
              ease: 'power2',
            },
            lineStagger * index
          )
          .from(
            line,
            { yPercent: 110, duration: 0.9, ease: 'power4' },
            lineStagger * index
          );
      });

      return timeline;
    },
  });

  store.split(split);
  return split;
}

function scrollSplit(element, store, { trigger = element, start = 'top 85%' } = {}) {
  if (!element) return null;

  const split = SplitText.create(element, {
    type: 'lines, words, chars',
    mask: 'lines',
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'char',
    autoSplit: true,
    onSplit(self) {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger, start, once: true },
      });

      self.lines.forEach((line, index) => {
        timeline
          .from(
            line.querySelectorAll('.char'),
            {
              opacity: 0,
              duration: 0.4,
              stagger: 0.012,
              ease: 'power2',
            },
            0.08 * index
          )
          .from(
            line,
            { yPercent: 110, duration: 0.8, ease: 'power4' },
            0.08 * index
          );
      });

      return timeline;
    },
  });

  store.split(split);
  return split;
}

function fadeIn(elements, store, vars = {}) {
  const list = Array.from(elements || []).filter(Boolean);
  if (!list.length) return null;

  const {
    trigger = list[0],
    start = 'top 88%',
    y = 24,
    duration = 0.7,
    stagger = 0.08,
    delay = 0,
    scroll = true,
  } = vars;

  const tween = gsap.from(list, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: 'power3.out',
    ...(scroll ? { scrollTrigger: { trigger, start, once: true } } : {}),
  });

  store.tween(tween);
  if (scroll && tween.scrollTrigger) store.trigger(tween.scrollTrigger);
  return tween;
}

function initCaseHero(store) {
  const hero = document.querySelector('.js-case-hero');
  const title = hero?.querySelector('.js-main-title');
  if (!hero || !title) return;

  const intro = gsap.timeline({ paused: true });
  store.tween(intro);

  const split = SplitText.create(title, {
    tag: 'span',
    type: 'words,chars',
    wordsClass: 'word',
    charsClass: 'char',
    autoSplit: true,
    onSplit() {
      const chars = title.querySelectorAll('.char');
      const index = hero.querySelector('.js-main-index');
      const scroll = hero.querySelector('.case-hero__scroll');

      hero.querySelectorAll('.js-info-group').forEach((group, i) => {
        intro.from(
          group,
          {
            y: 30,
            opacity: 0,
            ease: 'power4.inOut',
            duration: 1,
            delay: 0.11 * i,
          },
          0.5 + 0.05 * i
        );
      });

      intro
        .from(
          [title, index, scroll].filter(Boolean),
          { y: 50, ease: 'power4.inOut', duration: 1.75 },
          0
        )
        .from(scroll, { opacity: 0, ease: 'power4.inOut', duration: 1.25 }, 0)
        .from(index, { opacity: 0, ease: 'power4.inOut', duration: 1.25 }, 0)
        .from(chars, { opacity: 0, ease: 'power4.inOut', stagger: 0.02 }, 0.2)
        .from(chars, { y: 30, ease: 'power4', stagger: 0.02 }, 0.3);

      return intro;
    },
  });
  store.split(split);

  const label = hero.querySelector('.case-hero__scroll-label');
  if (label) {
    const icon = hero.querySelector('.case-hero__scroll-icon');
    const labelSplit = SplitText.create(label, {
      tag: 'span',
      type: 'chars',
      charsClass: 'char',
      autoSplit: true,
      onSplit(self) {
        const tween = gsap.to([...self.chars, icon].filter(Boolean), {
          opacity: 0,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top+=25%',
            scrub: true,
          },
        });
        store.trigger(tween.scrollTrigger);
        return tween;
      },
    });
    store.split(labelSplit);
  }

  store.onCleanup(onLoaderDone(() => intro.play()));
}

function initCaseHead(store) {
  document.querySelectorAll('.case-head').forEach((section) => {
    const title = section.querySelector('.js-anim-title');
    if (!title) return;

    const split = SplitText.create(title, {
      type: 'lines, words, chars',
      mask: 'lines',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      autoSplit: true,
      onSplit(self) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top+=35%',
            once: true,
          },
        });

        self.lines.forEach((line, index) => {
          timeline
            .from(
              line.querySelectorAll('.word'),
              { yPercent: 100, duration: 0.5, ease: 'power2' },
              0.1 * index
            )
            .from(
              line.querySelectorAll('.char'),
              { opacity: 0, stagger: 0.01, ease: 'power2' },
              0.1 * index
            );
        });

        store.tween(timeline);
        store.trigger(timeline.scrollTrigger);
        return timeline;
      },
    });

    store.split(split);
  });
}

function initCaseInfo(store) {
  document.querySelectorAll('.case-info').forEach((section) => {
    const title = section.querySelector('.js-anim-title');
    const description = section.querySelector('.js-anim-description');
    const content = section.querySelector('.js-anim-content');
    const statLabels = [...section.querySelectorAll('.js-anim-stat-label')];
    const targets = [title, description, ...statLabels].filter(Boolean);
    if (!targets.length) return;

    const split = SplitText.create(targets, {
      type: 'lines, words, chars',
      mask: 'lines',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      autoSplit: true,
      reduceWhiteSpace: false,
      onSplit() {
        const timeline = gsap.timeline({
          onStart() {
            section.classList.add('is-visible');
          },
          scrollTrigger: {
            trigger: section,
            start: 'top top+=35%',
            once: true,
          },
        });

        const titleWords = title?.querySelectorAll('.word');
        const titleChars = title?.querySelectorAll('.char');
        const descriptionWords = description?.querySelectorAll('.word');
        const descriptionChars = description?.querySelectorAll('.char');

        if (title) {
          timeline
            .from(
              titleWords,
              { yPercent: 100, duration: 0.5, ease: 'power2' },
              0
            )
            .from(
              titleChars,
              { opacity: 0, stagger: 0.01, ease: 'power2' },
              0.1
            );
        }

        if (description) {
          timeline
            .from(
              descriptionWords,
              { yPercent: 100, duration: 0.3, ease: 'power2' },
              0.2
            )
            .from(
              descriptionChars,
              { opacity: 0, stagger: 0.007, ease: 'power2' },
              0.15
            );
        }

        if (content) {
          timeline.from(
            content,
            { opacity: 0, y: 20, duration: 0.5, ease: 'power2' },
            0.25
          );
        }

        section.querySelectorAll('.js-anim-stat').forEach((stat, i) => {
          const value = stat.querySelector('.js-anim-stat-value');
          const label = stat.querySelector('.js-anim-stat-label');

          if (value) {
            timeline.from(
              value,
              { opacity: 0, y: 10, duration: 0.3, ease: 'power2' },
              0.3 + 0.1 * i
            );
          }
          if (label) {
            timeline.from(
              label,
              { opacity: 0, y: 10, duration: 0.3, ease: 'power2' },
              0.35 + 0.1 * i
            );
          }
        });

        store.tween(timeline);
        store.trigger(timeline.scrollTrigger);
        return timeline;
      },
    });

    store.split(split);
  });
}

function initCaseNext(store) {
  document.querySelectorAll('.case-next').forEach((section) => {
    const elements = section.querySelectorAll('.js-anim-el');
    if (!elements.length) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top+=65%',
        once: true,
      },
    });

    timeline.from(elements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2',
      stagger: 0.1,
    });

    store.tween(timeline);
    store.trigger(timeline.scrollTrigger);
  });
}

/** Case study pages: hero intro plus scroll reveals for the content blocks. */
export function initCaseReveal() {
  const store = createStore();
  const page = document.querySelector('.js-page-content');
  if (!page) return store.cleanup;
  if (reducedMotion()) return store.cleanup;

  initCaseHero(store);
  initCaseHead(store);
  initCaseInfo(store);
  initCaseNext(store);

  return store.cleanup;
}

/** Contact page: title, side details and form shell. Fields stay untouched. */
export function initContactReveal() {
  const store = createStore();
  const title = document.querySelector('.js-main-title');
  if (!title) return store.cleanup;
  if (reducedMotion()) return store.cleanup;

  store.onCleanup(
    onLoaderDone(() => {
      introSplit(title, store, { lineStagger: 0.12, charStagger: 0.015 });

      const side = document.querySelectorAll('.js-side-el');
      if (side.length) {
        fadeIn(side, store, {
          scroll: false,
          y: 18,
          duration: 0.6,
          stagger: 0.06,
          delay: 0.1,
        });
      }

      const body = document.querySelector('.js-contacts-body');
      if (body) {
        store.tween(
          gsap.from(body, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2,
          })
        );
      }
    })
  );

  return store.cleanup;
}

/** Legal pages: title split and a soft reveal for the copy. */
export function initLegalReveal() {
  const store = createStore();
  const title = document.querySelector('.privacy__title');
  const content = document.querySelector('.privacy__content');
  if (!title && !content) return store.cleanup;
  if (reducedMotion()) return store.cleanup;

  store.onCleanup(
    onLoaderDone(() => {
      introSplit(title, store, { lineStagger: 0.1, charStagger: 0.012 });

      if (content) {
        const children = content.querySelectorAll(':scope > *');
        children.forEach((child) => {
          const tween = gsap.from(child, {
            opacity: 0,
            y: 18,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: child, start: 'top 90%', once: true },
          });
          store.tween(tween);
          store.trigger(tween.scrollTrigger);
        });
      }
    })
  );

  return store.cleanup;
}
