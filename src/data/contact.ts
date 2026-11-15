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
    title: 'Contact Ratking — Lighting Systems and Installations',
    description:
      'Tell me about your venue, budget and timeline. Club lighting systems, control programming and interactive installations.',
  },
  infoLabel: 'Contact',
  infoEmpty:
    'Email and phone are still to be added. The form is a front-end demo and does not send anything to a server.',
  title: 'Tell me about the room,<br>the budget and the timeline.',
  nav: ['Request', 'Details', 'Contact', 'Summary'],
  serviceTitle: 'What are you building?*',
  services: ['Lighting system', 'Interactive installation'],
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
    message: 'Where is the venue, how big is it, what is the budget, when should it open…',
  },
  summaryTitle: 'Summary',
  summary: {
    service: 'Type',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Project brief',
  },
  hint: 'press Enter',
  ok: 'OK',
  back: 'Back',
  next: 'Next',
  required: 'Please fill in this field.',
  invalidEmail: 'Please enter a valid email address.',
  successTitle: 'Demo form: nothing was sent.',
  successText:
    'This is a front-end demo. The content stays in your browser; it is not sent to a server and is not stored by this site. Official contact details are still to be added.',
  successAgain: 'Write another',
};

export const contactContent = { zh, en } satisfies Record<Lang, typeof zh>;
