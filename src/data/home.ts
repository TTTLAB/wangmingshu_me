import type { Lang } from './site';

type Service = { title: string; index: string; text: string; image: string };
type CaseItem = { href: string; index: string; title: string; year: string; type: string };

const zh = {
  meta: {
    title: '鼠王 Ratking - WANGMINGSHU.ME',
    description:
      '鼠王 Ratking / 王明鼠，7年前端开发程序员，目前在做地下电子音乐俱乐部的灯光系统、声音系统、电子音乐节舞美、控制编程和互动装置。设计、编程、施工，一个人跟到底。',
  },
  video: '/works/pillbox/pillbox-led.mp4',
  videoMobile: '/works/pillbox/pillbox-led.mp4',
  heroDescription: '“音乐生涯这些年，80%的时候平平淡淡，15%的时候灾难一般，只有<span class="hl-5">5%</span>才是高光时刻。那<span class="hl-5">5%</span>的高光足以让我们始终保持前进。” <span class="hero__quote-attr">— Kode9（引自 OIL 的文章）</span>',
  heroTitle: '让灯光与音乐<br>共筑氛围。',
  scrollLabel: '往下滑',
  aboutTitle:
    '我是鼠王 / 王明鼠，SDS TEAM成员，现居上海。专注灯光与声音系统、互动装置及音乐节项目，从设计、编程到现场落地，长期参与国内地下俱乐部与电子音乐节的创作与建设。',
  dataVizText:
    '让声音成为灯光的线索，让节奏、波形与节拍化作光的变化，与现场一同呼吸。',
  dataVizCenterTitle: '为了那<span class="hl-5">5%</span>，值得一起认真。',
  dataVizCenterText: '不是每个夜晚都能成为高光。但如果你也愿意为那少数难忘的时刻投入心力，我们可以从一个想法开始，把音乐、灯光与现场，一点点打磨到一起。',
  dataVizCta: '让美好发生',
  servicesTitle: '如何交付',
  servicesText:
    '从第一张布线图，到现场最后一盏灯。把对现场的想象，落到预算、工期与每一处细节里，让值得期待的时刻，有扎实的支撑。',
  services: [
    {
      title: '系统设计',
      index: '001',
      text: '灯具、点位、配电、桥架、控制链路。先出图和清单，再报一个能落地的预算。',
      image: '/works/pillbox/pillbox-lineart.webp',
    },
    {
      title: '控制编程',
      index: '002',
      text: 'Art-Net、DMX、MIDI、Ableton Link。让灯跟着 CDJ 的 BPM 和波形走，不靠手点。',
      image: '/works/pillbox/pillbox-signal-flow.webp',
    },
    {
      title: '现场落地',
      index: '003',
      text: '布线、安装、调试、交付。把图纸上的每一处细节，变成现场稳定运行的一部分。',
      image: '/works/pillbox/pillbox-03.webp',
    },
  ] satisfies Service[],
  casesTitle: '做过的事',
  casesText: '不止是灯光。还有我的期望。',
  caseItems: [
    {
      href: '/works/pillbox',
      index: '01',
      title: 'Pillbox 舞池主视觉',
      year: '2025',
      type: '灯光装置 / 控制编程',
    },
  ] satisfies CaseItem[],
  callTitle: '值得让，<span>美好发生。</span>',
  callText:
    '从灯光系统、声音系统再到互动装置，让每一处设计与技术，都服务于那<span class="hl-5">5%</span>的高光。',
  callCta: '联系鼠王',
};

const en: typeof zh = {
  meta: {
    title: 'Ratking - WANGMINGSHU.ME',
    description:
      "Ratking / Wang Mingshu is a frontend developer with seven years' experience, now working on lighting and sound systems for underground electronic-music clubs, stage design for electronic music festivals, control programming and interactive installations. Design, programming and build — one person, all the way through.",
  },
  video: '/works/pillbox/pillbox-led.mp4',
  videoMobile: '/works/pillbox/pillbox-led.mp4',
  heroDescription: '“Over a music career, 80% of the time it is ordinary, 15% of the time it is a disaster, and only <span class="hl-5">5%</span> are the highlights. That <span class="hl-5">5%</span> is enough to keep us moving forward.” <span class="hero__quote-attr">— Kode9 (quoted in an OIL article)</span>',
  heroTitle: 'Let light and music<br>build the atmosphere.',
  scrollLabel: 'Scroll down',
  aboutTitle:
    "I'm Ratking / Wang Mingshu, a member of SDS TEAM, based in Shanghai. I work on lighting and sound systems, interactive installations and festival projects — from design and programming through to on-site delivery — and have long been involved in creating and building underground clubs and electronic music festivals in China.",
  dataVizText:
    'Let sound cue the light — rhythm, waveform and beat turned into shifting light that breathes with the room.',
  dataVizCenterTitle: 'For that <span class="hl-5">5%</span>, it is worth getting right together.',
  dataVizCenterText:
    "Not every night can be a highlight. But if you're also willing to put care into those few unforgettable moments, we can start with an idea and, little by little, polish music, light and the room into one.",
  dataVizCta: 'Let something beautiful happen',
  servicesTitle: 'How I deliver',
  servicesText:
    'From the first wiring diagram to the last light on site. Turning the vision for a room into a budget, a schedule and every detail — so the moments worth looking forward to stand on something solid.',
  services: [
    {
      title: 'System design',
      index: '001',
      text: 'Fixtures, positions, power, cable tray, control chain. Drawings and a list first, then a budget you can actually build to.',
      image: '/works/pillbox/pillbox-lineart.webp',
    },
    {
      title: 'Control programming',
      index: '002',
      text: "Art-Net, DMX, MIDI, Ableton Link. Lights follow the CDJ's BPM and waveform, not a hand on a fader.",
      image: '/works/pillbox/pillbox-signal-flow.webp',
    },
    {
      title: 'On-site delivery',
      index: '003',
      text: 'Cabling, installation, commissioning, handover. Every detail on the drawings becomes part of a system that runs reliably on site.',
      image: '/works/pillbox/pillbox-03.webp',
    },
  ] satisfies Service[],
  casesTitle: 'Work',
  casesText: 'Not just lighting. What I hope for, too.',
  caseItems: [
    {
      href: '/en/works/pillbox',
      index: '01',
      title: 'Pillbox Main Floor Visual',
      year: '2025',
      type: 'Lighting installation / control programming',
    },
  ] satisfies CaseItem[],
  callTitle: 'Worth it — <span>let something beautiful happen.</span>',
  callText:
    'From lighting systems and sound systems to interactive installations, let every design and technical decision serve that <span class="hl-5">5%</span> of highlights.',
  callCta: 'Contact Ratking',
};

export const homeContent = { zh, en } satisfies Record<Lang, typeof zh>;
