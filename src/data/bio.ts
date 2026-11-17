import type { Lang } from './site';

/** 引子里的强调片段：accent 的片段走信号朱红（VI 的 5% 高亮）。 */
export type BioSegment = { text: string; accent?: boolean };

export type BioSkill = { title: string; desc: string };

export type BioProject = {
  index: string;
  title: string;
  meta: string;
  desc: string;
  tags: string[];
  image?: { src: string; width: number; height: number; alt: string };
  video?: { src: string; poster?: string; width?: number; height?: number; alt?: string };
  mediaPending?: string;
  href?: string;
};

export type BioStage = { name: string; meta?: string; note?: string };

/**
 * FOR PRESS / 公众号简介：中英两页共用同一段中文原文。
 * 作者要求一个字都不改——不要润色，不要给 Nancy / Sid 加解释。
 */
export const pressBio = {
  label: 'FOR PRESS · 公众号简介',
  text: '王明鼠，互联网下水道里的老鼠人，也是没遇上Nancy的低配Sid。这一世叫惜得（是个值得珍惜的男孩），在触电边缘试探的二流电工、在抽象海洋里狗刨儿的乐子人、失业至今还没饿死的程序员。',
};

const zh = {
  meta: {
    title: '关于鼠王 — 独立灯光系统工程师 · 互动装置',
    description:
      '鼠王（王明鼠）：2013–2016 在北京公路商店做黑市电商前后端与运维，2017 年从 Wigwam 开业做起，2018 年起做俱乐部灯光成为自由灯光师，如今独立灯光系统工程师、互动装置开发。现居上海，常驻北京 Zhaodai、上海 Reactor 控灯。',
  },
  eyebrow: 'BIO / 关于鼠王',
  quote: [
    { text: '音乐生涯这些年，' },
    { text: '80%', accent: true },
    { text: '的时候平平淡淡，' },
    { text: '15%', accent: true },
    { text: '的时候灾难一般，只有' },
    { text: '5%', accent: true },
    { text: '才是高光时刻。那' },
    { text: '5%', accent: true },
    { text: '的高光足以让我们始终保持前进。' },
  ] as BioSegment[],
  quoteAttr: '—— Kode9（引自 OIL 的文章）',
  bridge: [
    { text: '这句话我抄在本子第一页。我做的所有事，都是为了把那 ' },
    { text: '5%', accent: true },
    { text: ' 变成现场——准点亮起来，别在最要紧的时候掉链子。' },
  ] as BioSegment[],
  lead: {
    name: '我是鼠王 / 王明鼠。独立灯光系统工程师 / 声音工程师，也做互动装置。',
    desc: '现居上海，常驻北京 Zhaodai 与上海 Reactor 控灯；活儿主要在北京、上海、深圳三地。',
    claim: '从图纸到现场，\n搞定灯光、声音系统的全流程。',
  },
  sections: {
    about: {
      index: '01',
      label: '自述',
      title: '自述',
      paragraphs: [
        '2013 到 2016 年，我在北京的公路商店做黑市电商——前后端和运维都是我，写 JavaScript 和 Node，也管服务器。2016 到 2017 年出来创业，没成，其间做过微信小游戏。',
        '真正的起点是 2017 年 Wigwam 开业。我先在 Wigwam 做兼职Bartender，后来兼职票口；离灯光最近的地方，是从门口往里看的那片舞池。2018 年开始接触并做俱乐部灯光，从换灯泡、跑线、思考灯光与舞池的关系，慢慢成了自由灯光师。',
        '再往后接俱乐部、音乐节和商业空间。活从需求排查、CAD 制图、供应商对接、信号与电源线路规划开始，到施工安装、现场调试、控台结束。单店 8 到 30 万元，商业项目 Lust 成都、北京双店总规模约 50 万元——数字不好看，但它决定了哪些灯能上、哪些方案得砍。',
        '俱乐部不只有灯。很多个夜晚，我和东坝好莱坞、沈阳变电所的主理人，靠一套并不贵的音响系统，一场接一场把派对撑了起来。设备清单不长，但每一次都把场子顶住了——这些夜晚到现在还记忆犹新。',
        '现场不浪漫。信号丢失、控台异常、灯具故障、网络不通、电源跳闸，这些才是常态；一场演出大半时间在处理这些。所以我把力气花在能被排查的系统上：每一路信号、每一条电源，都要说得清来路和去向。剩下那 5%，才轮得到好看。闲下来我会去 KTM 大贸店修摩托车——换件、刷 ECU，2021 年前后常去；拧螺丝和写代码还有思考灯光与舞池的关系，本来就是一回事。',
      ],
    },
    timeline: {
      index: '02',
      label: '时间线',
      title: '时间线',
      items: [
        {
          period: '2013 — 2016',
          role: '公路商店（北京）· 黑市电商',
          note: '前后端开发与运维，JavaScript / Node，也管服务器。',
        },
        {
          period: '2016 — 2017',
          role: '创业（未果）',
          note: '出来折腾了一年，做过微信小游戏。',
        },
        {
          period: '2017',
          role: 'Wigwam 开业 · 兼职吧员、票口',
          note: '故事从这儿开始；离舞池和灯光最近的位置。',
        },
        {
          period: '2018 — 至今',
          role: '自由灯光师 → 独立灯光系统工程师 · 互动装置开发',
          note: '2018 起做俱乐部灯光，逐步做到系统设计、控制编程、互动装置，从图纸到现场全流程。',
        },
      ],
    },
    skills: {
      index: '03',
      label: '核心能力',
      title: '核心能力',
      items: [
        {
          title: '灯光系统设计 / 搭建 / 落地',
          desc: '需求排查、CAD 制图、供应商对接、信号与电源线路规划、施工安装、现场调试，一条线跟到底。',
        },
        {
          title: '声音系统',
          desc: '用有限预算搭出能撑住整晚的音响；TD、JBL 等系统的搭建、摆位与现场调试，和场地主理人一起把声音守住。',
        },
        {
          title: '现场疑难排查',
          desc: '信号丢失、控台异常、灯具故障、网络通讯、电源问题——演出中途也能动手。',
        },
        {
          title: '控制编程',
          desc: 'Art-Net、DMX512、sACN、MIDI、Ableton Link、Dante。',
        },
        {
          title: '互动装置',
          desc: '单片机加距离、触摸、光感、红外、声音、加速度传感器；体感与动作捕捉。',
        },
        {
          title: '自研 iPad 无线灯控',
          desc: '不占控台也能实时调色、快捷编程；多俱乐部长期稳定运行。',
        },
        {
          title: '前端 JavaScript / Node',
          desc: '写控制界面和工具；和 Claude、ChatGPT、DeepSeek 一起写。',
        },
      ] as BioSkill[],
    },
    projects: {
      index: '04',
      label: '选做项目',
      title: '选做项目',
      items: [
        {
          index: '01',
          title: 'CDJ 波形 / BPM 实时联动灯光系统',
          meta: '北京 Pillbox · 2025.11',
          desc: 'Beat Link Trigger 实时读取 CDJ 的 BPM、波形与节拍，驱动灯光跟着节奏切换；MadMapper、Beyond 点控灯带、激光与继电器；iPad 无线界面实时调色与快捷编程，现场不占控台。Art-Net 通讯，多俱乐部稳定运行。独立完成，图纸到落地两周。',
          tags: ['Art-Net', 'Beat Link Trigger', 'iPad 灯控'],
          href: '/works/pillbox',
          image: {
            src: '/works/pillbox/pillbox-01.webp',
            width: 2000,
            height: 1333,
            alt: 'Pillbox 舞池上方的螺旋管道灯光装置',
          },
        },
        {
          index: '02',
          title: '声音系统 · 一场又一场派对',
          meta: '北京 / 沈阳 · 现场',
          desc: '和东坝好莱坞、沈阳变电所的主理人一起，用一套并不贵的音响系统，一场接一场把派对撑起来。设备不算豪华，但每次都能顶住现场；这些夜晚让人记忆犹新。',
          tags: ['声音系统', '现场调音', '派对'],
          image: { src: '/works/parties/dongba-hollywood.webp', width: 1280, height: 1600, alt: '东坝好莱坞舞池里的音响系统，一名穿 TTT 10 号球衣的人背对镜头（摄影 @ken.f.05）' },
        },
        {
          index: '03',
          title: '商业项目 — Lust 装置灯光与中央发光装置',
          meta: '成都 / 北京 · 2025.01',
          desc: '双店装置灯光设计、施工与落地，总规模约 50 万元；北京店中央发光装置独立设计制作，是空间的核心视觉，也承担氛围营造与品牌识别。',
          tags: ['装置灯光', '中央发光装置', '双店'],
          image: { src: '/works/lust/lust-beijing.webp', width: 1440, height: 960, alt: 'LUST Super Lounge 北京店入口与中央发光装置' },
        },
      ] as BioProject[],
    },
    stages: {
      index: '05',
      label: '舞台足迹',
      title: '舞台足迹',
      columns: [
        {
          label: '音乐节',
          items: [
            {
              name: '阿那亚户外音乐节',
              meta: '2023 · 河北',
              note: '户外主舞台、湿地舞台、沙滩舞台、室内 after 舞台',
            },
            { name: '上海 Wigwam 音乐节', meta: '2024 / 2025' },
            { name: '游山音乐节', meta: '2025', note: '主舞台 / 副舞台' },
          ] as BioStage[],
        },
        {
          label: '俱乐部',
          items: [
            { name: '北京', note: '莫须有、Pillbox、BBB、Wigwam、Solo 等' },
            { name: '上海', note: 'Heim、Wigwam、Reactor' },
            { name: '其他', note: '长沙 River、深圳 OIL、沈阳变电所 等' },
          ] as BioStage[],
        },
      ],
    },
    toolbox: {
      index: '06',
      label: '工具箱',
      title: '工具箱',
      groups: [
        {
          label: '灯光 / 控制',
          items: ['老虎控台 Tiger Touch', 'grandMA2', 'MadMapper', 'Beyond', 'Depence', 'Beat Link Trigger'],
        },
        { label: 'LED 屏', items: ['Arena', '迈爵士'] },
        { label: '协议', items: ['Art-Net', 'DMX512', 'Dante', 'sACN'] },
        { label: '声音系统（搭建 / 调试）', items: ['Funktion One', 'Void Acoustics', 'POWERSOFT'] },
        { label: 'AI', items: ['Claude', 'ChatGPT', 'DeepSeek'] },
        { label: '爱好', items: ['电子音乐', '机车', 'vibe coding'] },
      ],
    },
  },
  cta: {
    index: '07',
    label: '联系',
    heading: '聊聊你的场地、\n预算和时间。',
    text: '俱乐部、音乐节、商业空间、互动装置都接。能做就接，做不了直说。',
    button: '联系鼠王',
  },
};

const en: typeof zh = {
  meta: {
    title: 'About Ratking — Independent Lighting Systems Engineer · Interactive Installations',
    description:
      'Ratking (Wang Mingshu): front-end, back-end and operations for the black-market e-commerce operation at Highway Store in Beijing, 2013–2016; at Wigwam from its opening in 2017; freelance club lighting designer from 2018; now an independent lighting systems engineer and interactive installation developer. Based in Shanghai, with regular lighting work at Zhaodai in Beijing and Reactor in Shanghai.',
  },
  eyebrow: 'BIO / ABOUT RATKING',
  quote: [
    { text: 'Over a music career, ' },
    { text: '80%', accent: true },
    { text: ' of the time it is ordinary, ' },
    { text: '15%', accent: true },
    { text: ' of the time it is a disaster, and only ' },
    { text: '5%', accent: true },
    { text: ' are the highlights. That ' },
    { text: '5%', accent: true },
    { text: ' is enough to keep us moving forward.' },
  ],
  quoteAttr: '— Kode9 (quoted in an OIL article)',
  bridge: [
    { text: 'I copied that line onto the first page of my notebook. Everything I do is an attempt to turn that ' },
    { text: '5%', accent: true },
    { text: ' into a live show — lights up on cue, nothing failing at the moment that matters most.' },
  ],
  lead: {
    name: 'I am Ratking / Wang Mingshu — independent lighting systems engineer and sound engineer; I also build interactive installations.',
    desc: 'Based in Shanghai, with regular lighting work at Zhaodai in Beijing and Reactor in Shanghai. Most of my work is in Beijing, Shanghai and Shenzhen.',
    claim: 'From drawings to the room:\nlighting and sound systems, end to end.',
  },
  sections: {
    about: {
      index: '01',
      label: 'Statement',
      title: 'Statement',
      paragraphs: [
        'From 2013 to 2016 I worked at Highway Store in Beijing on its black-market e-commerce operation — front end, back end and operations were all mine: JavaScript and Node, servers included. From 2016 to 2017 I left to start a company; it did not work out, and in the meantime I built a WeChat mini game.',
        'The real starting point was Wigwam, which opened in 2017. I first worked there part-time as a bartender, later part-time at the ticket desk; the closest I got to the lights was the dance floor seen from the entrance. In 2018 I began working with club lighting — changing lamps, running cable, thinking about how light relates to a dance floor — and gradually became a freelance lighting designer.',
        'After that came clubs, festivals and commercial spaces. The work begins with scoping, CAD drawings, supplier coordination, and signal and power routing, and ends with installation, on-site commissioning and the console. A single venue comes to 80,000–300,000 RMB; the Lust project, two venues in Chengdu and Beijing, came to roughly 500,000 RMB in total. These are not impressive numbers, but they decide which fixtures can go in and which proposals have to be cut.',
        'A club is not only lights. On many nights, together with the people who run Dongba Hollywood and Shenyang Substation, I kept parties going one after another on a sound system that was anything but expensive. The equipment list was short, but it held the room every time — those nights are still vivid to me.',
        'Working on site is not romantic. Lost signal, a misbehaving console, a failed fixture, a network that will not connect, a tripped breaker — these are normal, and most of a show goes into dealing with them. So I put the effort into systems that can be diagnosed: every signal run and every power line must have a clear origin and destination. Only then does the remaining 5% get to look good. In quieter periods I work on motorcycles at the KTM dealer — parts and ECU flashing; I was a regular there around 2021. Turning bolts, writing code and thinking about the relationship between light and the dance floor are, to me, the same thing.',
      ],
    },
    timeline: {
      index: '02',
      label: 'Timeline',
      title: 'Timeline',
      items: [
        {
          period: '2013 — 2016',
          role: 'Highway Store (Beijing) · Black-market e-commerce',
          note: 'Front-end and back-end development plus operations — JavaScript / Node, servers included.',
        },
        {
          period: '2016 — 2017',
          role: 'Startup (did not work out)',
          note: 'A year spent trying something of my own; built a WeChat mini game along the way.',
        },
        {
          period: '2017',
          role: 'Wigwam opens · Part-time bartender and ticket desk',
          note: 'Where the story begins; the closest position to the dance floor and the lights.',
        },
        {
          period: '2018 — Present',
          role: 'Freelance Lighting Designer → Independent Lighting Systems Engineer · Interactive Installation Development',
          note: 'Club lighting since 2018, expanding into system design, control programming and interactive installations — drawing to site, end to end.',
        },
      ],
    },
    skills: {
      index: '03',
      label: 'Capabilities',
      title: 'Capabilities',
      items: [
        {
          title: 'Lighting system design / build / delivery',
          desc: 'Scoping, CAD drawings, supplier coordination, signal and power routing, installation and on-site commissioning — followed through end to end.',
        },
        {
          title: 'Sound systems',
          desc: 'Building sound that carries a whole night on a limited budget; installation, placement and on-site tuning of systems such as TD and JBL, working with venue owners to keep the room sounding right.',
        },
        {
          title: 'On-site troubleshooting',
          desc: 'Lost signal, console faults, failed fixtures, network communication, power problems — dealt with even mid-show.',
        },
        {
          title: 'Control programming',
          desc: 'Art-Net, DMX512, sACN, MIDI, Ableton Link, Dante.',
        },
        {
          title: 'Interactive installations',
          desc: 'Microcontrollers with distance, touch, light, infrared, sound and accelerometer sensors; motion sensing and motion capture.',
        },
        {
          title: 'Custom wireless iPad lighting control',
          desc: 'Real-time colour adjustment and quick programming without occupying the console; running reliably in several clubs over the long term.',
        },
        {
          title: 'Front-end JavaScript / Node',
          desc: 'Control interfaces and tools, written together with Claude, ChatGPT and DeepSeek.',
        },
      ],
    },
    projects: {
      index: '04',
      label: 'Selected Work',
      title: 'Selected Work',
      items: [
        {
          index: '01',
          title: 'Real-time CDJ waveform / BPM lighting system',
          meta: 'Pillbox, Beijing · Nov 2025',
          desc: 'Beat Link Trigger reads BPM, waveform and beat from the CDJs in real time and drives the lighting in time with the music; MadMapper and Beyond address LED strips, lasers and relays; a wireless iPad interface handles real-time colour and quick programming without occupying the console. Art-Net throughout, running reliably across several clubs. Delivered solo, from drawings to completion in two weeks.',
          tags: ['Art-Net', 'Beat Link Trigger', 'iPad control'],
          href: '/en/works/pillbox',
          image: {
            src: '/works/pillbox/pillbox-01.webp',
            width: 2000,
            height: 1333,
            alt: 'The spiral duct lighting installation above the Pillbox dance floor',
          },
        },
        {
          index: '02',
          title: 'Sound system · One party after another',
          meta: 'Beijing / Shenyang · Live',
          desc: 'Together with the people who run Dongba Hollywood and Shenyang Substation, I kept parties going one after another on a sound system that was anything but expensive. The equipment was not lavish, but it held the room every time; those nights are still vivid.',
          tags: ['Sound system', 'Live tuning', 'Parties'],
          image: { src: '/works/parties/dongba-hollywood.webp', width: 1280, height: 1600, alt: 'Sound system in the Dongba Hollywood dance floor; a person in a TTT no.10 jersey with their back to camera (photo @ken.f.05)' },
        },
        {
          index: '03',
          title: 'Commercial project — Lust installation lighting and the central light piece',
          meta: 'Chengdu / Beijing · Jan 2025',
          desc: 'Installation lighting design, construction and delivery for both venues, roughly 500,000 RMB in total; the central light piece in the Beijing venue was designed and built independently — the visual core of the space, carrying both atmosphere and brand identity.',
          tags: ['Installation lighting', 'Central light piece', 'Two venues'],
          image: { src: '/works/lust/lust-beijing.webp', width: 1440, height: 960, alt: 'Entrance and central light installation, LUST Super Lounge Beijing' },
        },
      ],
    },
    stages: {
      index: '05',
      label: 'Stages',
      title: 'Stages',
      columns: [
        {
          label: 'Festivals',
          items: [
            {
              name: 'Aranya Outdoor Music Festival',
              meta: '2023 · Hebei',
              note: 'Outdoor main stage, wetland stage, beach stage, indoor after stage',
            },
            { name: 'Wigwam Festival, Shanghai', meta: '2024 / 2025' },
            { name: 'Youshan Festival', meta: '2025', note: 'Main stage / second stage' },
          ],
        },
        {
          label: 'Clubs',
          items: [
            { name: 'Beijing', note: 'Moxuyou, Pillbox, BBB, Wigwam, Solo and others' },
            { name: 'Shanghai', note: 'Heim, Wigwam, Reactor' },
            { name: 'Other cities', note: 'River in Changsha, OIL in Shenzhen, Shenyang Substation and others' },
          ],
        },
      ],
    },
    toolbox: {
      index: '06',
      label: 'Toolbox',
      title: 'Toolbox',
      groups: [
        {
          label: 'Lighting / control',
          items: ['Tiger Touch', 'grandMA2', 'MadMapper', 'Beyond', 'Depence', 'Beat Link Trigger'],
        },
        { label: 'LED screens', items: ['Arena', 'Maijueshi'] },
        { label: 'Protocols', items: ['Art-Net', 'DMX512', 'Dante', 'sACN'] },
        { label: 'Sound systems (build / tuning)', items: ['Funktion One', 'Void Acoustics', 'POWERSOFT'] },
        { label: 'AI', items: ['Claude', 'ChatGPT', 'DeepSeek'] },
        { label: 'Off hours', items: ['Electronic music', 'Motorcycles', 'Vibe coding'] },
      ],
    },
  },
  cta: {
    index: '07',
    label: 'Contact',
    heading: 'Tell me about your venue,\nyour budget and your timeline.',
    text: 'Clubs, festivals, commercial spaces and interactive installations are all welcome. If I can do it, I will take it on; if I cannot, I will say so.',
    button: 'Contact Ratking',
  },
};

export const bioContent: Record<Lang, typeof zh> = { zh, en };
