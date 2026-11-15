import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createStore, reducedMotion } from './helpers';

function initCardHover(card, store) {
  const bg = card.querySelector('.service-card__bg');
  if (!bg) return;

  const normalize = (angle) => {
    let value = angle;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
  };

  let rotation = 0;
  let rotateTween = null;

  const enter = () => {
    gsap.to(bg, { opacity: 1, duration: 0.3, ease: 'power2.out' });
  };

  const leave = () => {
    gsap.to(bg, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    rotation = 0;
  };

  const move = (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = x / rect.width;
    const ny = y / rect.height;

    const pointerAngle = normalize(
      (180 / Math.PI) * Math.atan2(y - rect.height / 2, x - rect.width / 2)
    );
    const delta = normalize(pointerAngle - normalize(rotation));
    const target = rotation + delta;

    if (!rotateTween || rotateTween.progress() > 0.5) rotation = target;

    gsap.set(bg, { '--mouse-x': nx, '--mouse-y': ny });
    rotateTween?.kill();
    rotateTween = gsap.to(bg, {
      '--rotate': target,
      duration: 0.6,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  };

  card.addEventListener('mouseenter', enter);
  card.addEventListener('mouseleave', leave);
  card.addEventListener('mousemove', move);

  store.onCleanup(() => {
    card.removeEventListener('mouseenter', enter);
    card.removeEventListener('mouseleave', leave);
    card.removeEventListener('mousemove', move);
    rotateTween?.kill();
    gsap.killTweensOf(bg);
  });
}

/**
 * Services: masked title/copy reveal, cards rise in, then the section pins and
 * its pixel grid dissolves near the end.
 */
export function initServices() {
  const store = createStore();
  const section = document.querySelector('.services-section');
  if (!section) return store.cleanup;

  const container = section.querySelector('.services-section__container');
  const title = section.querySelector('.services-section__title');
  const text = section.querySelector('.services-section__text');
  const cards = section.querySelectorAll('.js-service-card');
  const pixelRects = section.querySelectorAll('.js-pixel-rect');

  if (reducedMotion()) {
    gsap.set(pixelRects, { opacity: 1 });
    return store.cleanup;
  }

  cards.forEach((card) => initCardHover(card, store));

  const splitTargets = [title, text].filter(Boolean);
  if (splitTargets.length) {
    const split = SplitText.create(splitTargets, {
      type: 'lines, words, chars',
      mask: 'lines',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      autoSplit: true,
      onSplit() {
        const words = title?.querySelectorAll('.word');
        const titleChars = title?.querySelectorAll('.char');
        const textWords = text?.querySelectorAll('.word');
        const textChars = text?.querySelectorAll('.char');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            once: true,
          },
        });

        if (words?.length) {
          timeline.from(
            words,
            { yPercent: 100, duration: 0.5, ease: 'power2' },
            0
          );
        }
        if (textChars?.length) {
          timeline.from(
            textChars,
            { opacity: 0, stagger: 0.007, ease: 'power2' },
            0
          );
        }
        if (titleChars?.length) {
          timeline.from(
            titleChars,
            { opacity: 0, stagger: 0.01, ease: 'power2' },
            0.1
          );
        }
        if (textWords?.length) {
          timeline.from(
            textWords,
            { yPercent: 100, duration: 0.3, ease: 'power2' },
            0.1
          );
        }
        if (cards.length) {
          timeline.from(
            cards,
            {
              opacity: 0,
              yPercent: 30,
              duration: 1,
              stagger: 0.1,
              ease: 'power4.inOut',
            },
            0.1
          );
        }

        return timeline;
      },
    });

    store.split(split);
  }

  if (!container) return store.cleanup;

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 1025px)',
      mobile: '(max-width: 1024px)',
    },
    (context) => {
      const { desktop } = context.conditions;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          endTrigger: section,
          start: desktop ? 'top top' : 'bottom bottom',
          end: 'bottom top',
          pin: true,
          scrub: true,
          id: 'services',
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
