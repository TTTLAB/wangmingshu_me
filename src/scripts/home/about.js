import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createStore, reducedMotion } from './helpers';

/**
 * About: masked line/word/char reveal on the statement, a random pixel-grid
 * dissolve near the end of the pinned section, then the section fades out.
 */
export function initAbout() {
  const store = createStore();
  const section = document.querySelector('.about-section');
  if (!section) return store.cleanup;

  const title = section.querySelector('.about-section__title');
  const pixelRects = section.querySelectorAll('.js-pixel-rect');
  const patternRects = section.querySelectorAll('.js-pattern-rect');

  if (reducedMotion()) {
    gsap.set([...pixelRects, ...patternRects], { opacity: 1 });
    return store.cleanup;
  }

  if (title) {
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
            start: 'top top+=18%',
            once: true,
          },
        });

        timeline.set(
          patternRects,
          { opacity: 0, stagger: { each: 0.025, from: 'random' } },
          0
        );

        self.lines.forEach((line, index) => {
          const words = line.querySelectorAll('.word');
          const chars = line.querySelectorAll('.char');

          timeline
            .from(
              words,
              { yPercent: 100, duration: 0.5, ease: 'power2' },
              0.1 * index
            )
            .from(
              chars,
              { opacity: 0, stagger: 0.01, ease: 'power2' },
              0.1 * index
            );
        });

        return timeline;
      },
    });

    store.split(split);
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
    },
    (context) => {
      const { desktop } = context.conditions;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scrub: true,
          id: 'about',
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .from(
          pixelRects,
          {
            opacity: 0,
            duration: 0.01,
            stagger: { each: desktop ? 0.025 : 0.06, from: 'random' },
          },
          desktop ? 9 : 11
        )
        .set(section, { opacity: 0 });

      store.tween(timeline);
      store.trigger(timeline.scrollTrigger);
    }
  );

  store.onCleanup(() => mm.revert());

  return store.cleanup;
}
