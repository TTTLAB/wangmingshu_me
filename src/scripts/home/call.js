import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createStore, reducedMotion } from './helpers';

/**
 * Call to action: circles bloom outward, the title/description reveal and the
 * CTA slides up, all driven by a pinned scrub timeline.
 */
export function initCall() {
  const store = createStore();
  const section = document.querySelector('.call-section');
  if (!section) return store.cleanup;

  if (reducedMotion()) return store.cleanup;

  const title = section.querySelector('.js-title');
  const text = section.querySelector('.js-text');
  const cta = section.querySelector('.js-cta-inner');
  const circles = section.querySelectorAll('.js-circles-pattern-item');

  const mm = gsap.matchMedia();

  mm.add(
    {
      none: '(pointer: none)',
      coarse: '(pointer: coarse)',
      fine: '(pointer: fine)',
    },
    (context) => {
      const pointerNone = context.conditions.none;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: pointerNone ? '+=3000' : '+=1500',
          pin: true,
          scrub: true,
          id: 'contact',
          invalidateOnRefresh: true,
        },
      });

      if (circles.length) {
        timeline
          .fromTo(
            circles,
            { scale: 0, y: 120, transformOrigin: '50% 50%' },
            {
              scale: 1.8,
              y: 0,
              duration: 3.2,
              stagger: { each: 0.1, from: 'end' },
            },
            0
          )
          .from(
            circles,
            {
              opacity: 0,
              duration: 0.8,
              stagger: { each: 0.1, from: 'end' },
            },
            0.1
          );
      }

      if (cta) {
        timeline.from(
          cta,
          { yPercent: 110, duration: 0.8, ease: 'menuEase' },
          0.8
        );
      }

      let titleSplit = null;
      let textSplit = null;
      let titleTimeline = null;
      let textTimeline = null;

      if (title) {
        titleSplit = SplitText.create(title, {
          type: 'words, chars',
          wordsClass: 'word',
          charsClass: 'char',
          autoSplit: true,
          onRevert() {
            if (titleTimeline) {
              timeline.remove(titleTimeline);
              titleTimeline.revert();
              titleTimeline = null;
            }
          },
          onSplit(self) {
            titleTimeline = gsap
              .timeline()
              .from(
                self.chars,
                {
                  opacity: 0,
                  duration: 0.3,
                  stagger: 0.05,
                  ease: 'power4.inOut',
                },
                0
              )
              .from(
                title,
                { yPercent: 120, duration: 1, ease: 'power1' },
                0
              );

            timeline.add(titleTimeline, 0);
            return titleTimeline;
          },
        });
        store.split(titleSplit);
      }

      if (text) {
        textSplit = SplitText.create(text, {
          type: 'lines, words, chars',
          linesClass: 'line',
          wordsClass: 'word',
          charsClass: 'char',
          autoSplit: true,
          onRevert() {
            if (textTimeline) {
              timeline.remove(textTimeline);
              textTimeline.revert();
              textTimeline = null;
            }
          },
          onSplit(self) {
            textTimeline = gsap.timeline();

            self.lines.forEach((line, index) => {
              const chars = line.querySelectorAll('.char');

              textTimeline
                .from(
                  chars,
                  {
                    opacity: 0,
                    duration: 0.2,
                    stagger: 0.005,
                    ease: 'power4.inOut',
                  },
                  0.15 * index
                )
                .from(
                  line,
                  { y: 30, duration: 0.8, ease: 'power4' },
                  0.15 * index
                );
            });

            timeline.add(textTimeline, 0.8);
            return textTimeline;
          },
        });
        store.split(textSplit);
      }

      store.tween(timeline);
      store.trigger(timeline.scrollTrigger);

      return () => {
        titleSplit?.revert();
        textSplit?.revert();
      };
    }
  );

  store.onCleanup(() => mm.revert());

  return store.cleanup;
}
