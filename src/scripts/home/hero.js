import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createStore, onLoaderDone, reducedMotion } from './helpers';

/**
 * Home hero: split-text intro gated by the loader, then a scrubbed pin that
 * lifts the hero by 20% while the next section covers it.
 */
export function initHero() {
  const store = createStore();
  const hero = document.querySelector('.js-main-hero');
  if (!hero) return store.cleanup;

  if (reducedMotion()) {
    gsap.set(hero, { yPercent: 0 });
    return store.cleanup;
  }

  const pinTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    },
  });
  pinTimeline.to(hero, { yPercent: -20, ease: 'none' });

  store.tween(pinTimeline);
  store.trigger(pinTimeline.scrollTrigger);

  const description = hero.querySelector('.js-description');
  const title = hero.querySelector('.js-title');
  const scroll = hero.querySelector('.main-hero__scroll');
  const splitTargets = [description, title].filter(Boolean);

  if (!splitTargets.length) return store.cleanup;

  let split = null;

  const startIntro = () => {
    split = SplitText.create(splitTargets, {
      tag: 'span',
      type: 'words,chars',
      wordsClass: 'word',
      charsClass: 'char',
      autoSplit: true,
      onSplit() {
        const timeline = gsap.timeline();

        if (description) {
          timeline.from(
            description.querySelectorAll('.word'),
            {
              opacity: 0,
              ease: 'bounce.inOut',
              stagger: { amount: 0.5, from: 'random', grid: 'auto' },
            },
            0
          );

          timeline.from(
            description,
            { yPercent: 100, ease: 'power4', duration: 1.25 },
            0
          );
        }

        if (title) {
          const chars = title.querySelectorAll('.char');

          timeline
            .from(
              [title, scroll].filter(Boolean),
              { y: 50, ease: 'power4.inOut', duration: 1.75 },
              0
            )
            .from(
              scroll,
              { opacity: 0, ease: 'power4.inOut', duration: 1.25 },
              0
            )
            .from(
              chars,
              { opacity: 0, ease: 'power4.inOut', stagger: 0.02 },
              0.2
            )
            .from(chars, { y: 30, ease: 'power4', stagger: 0.02 }, 0.25);
        }

        return timeline;
      },
    });

    store.split(split);
  };

  store.onCleanup(onLoaderDone(startIntro));

  return store.cleanup;
}
