import type { Lang } from './site';

const zh = {
  meta: {
    title: '联系鼠王 Ratking — 灯光系统与互动装置',
    description:
      '说说你的场地、预算和时间。俱乐部灯光系统、控制编程、互动装置，能做就接，做不了直说。',
  },
  infoLabel: '联系方式',
  infoEmpty: 'd0a1ccec@gmail.com <br>instagram: @wangmingshu.me <br>小红书id: 949135495',
  title: '说说你的场地、<br>预算和时间。',
  nav: ['需求', '信息', '联系', '确认'],
  serviceTitle: '你想做哪一类？*',
  services: ['灯光系统', '声音系统', '交互装置', '音乐节舞美'],
  detailsTitle: '你的信息',
  fields: {
    name: '怎么称呼*',
    email: '邮箱*',
    phone: '电话（选填）',
    message: '项目情况*',
  },
  placeholders: {
    name: '你的名字',
    email: 'you@example.com',
    phone: '选填',
    message: '场地在哪、多大、预算多少、希望什么时候落地……',
  },
  summaryTitle: '确认',
  summary: {
    service: '类型',
    name: '称呼',
    email: '邮箱',
    phone: '电话',
    message: '项目情况',
  },
  hint: '按回车继续',
  ok: '好',
  back: '返回',
  next: '下一步',
  required: '这项还没填。',
  invalidEmail: '邮箱格式不对。',
  successTitle: '演示表单：没有发送。',
  successText:
    '这是前端演示，内容只留在你的浏览器里，不会发送到服务器，也不会被本站保存。正式联系方式待补充。',
  successAgain: '再填一条',
};

const en: typeof zh = {
  meta: {
    title: 'Contact Ratking — Lighting Systems and Interactive Installations',
    description:
      'Tell me about your venue, your budget and your timeline. Club lighting systems, control programming, interactive installations — if I can do it, I take it on; if not, I say so.',
  },
  infoLabel: 'Contact',
  infoEmpty:
    'd0a1ccec@gmail.com <br>Instagram: @wangmingshu.me <br>Xiaohongshu ID: 949135495',
  title: 'Tell me about your venue,<br>your budget and your timeline.',
  nav: ['Request', 'Details', 'Contact', 'Confirm'],
  serviceTitle: 'Which of these do you need?*',
  services: [
    'Lighting system',
    'Sound system',
    'Interactive installation',
    'Festival stage design',
  ],
  detailsTitle: 'Your details',
  fields: {
    name: 'Name*',
    email: 'Email*',
    phone: 'Phone (optional)',
    message: 'Project brief*',
  },
  placeholders: {
    name: 'Your name',
    email: 'you@example.com',
    phone: 'Optional',
    message: "Where is the venue, how big is it, what's the budget, and when do you want it up and running…",
  },
  summaryTitle: 'Confirm',
  summary: {
    service: 'Type',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Project brief',
  },
  hint: 'Press Enter to continue',
  ok: 'OK',
  back: 'Back',
  next: 'Next',
  required: "You haven't filled this one in yet.",
  invalidEmail: "That email doesn't look right.",
  successTitle: 'Demo form: nothing was sent.',
  successText:
    'This is a front-end demo. What you type stays in your browser — it is not sent to a server, and this site does not store it. Proper contact details are still to be added.',
  successAgain: 'Fill in another',
};

export const contactContent = { zh, en } satisfies Record<Lang, typeof zh>;
