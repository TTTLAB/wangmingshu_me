export type Lang = 'zh' | 'en';

export const site = {
  name: '鼠王 Ratking',
  email: '',
  emailMenu: '',
  phone: '',
  phoneHref: '',
};

export const routes = {
  zh: {
    home: '/',
    bio: '/bio',
    works: '/works/pillbox',
    contact: '/contact',
    privacy: '/privacy',
    cookies: '/cookies',
  },
  en: {
    home: '/en/',
    bio: '/en/bio',
    works: '/en/works/pillbox',
    contact: '/en/contact',
    privacy: '/en/privacy',
    cookies: '/en/cookies',
  },
} as const;

export const shell = {
  zh: {
    menuLabel: '菜单',
    closeLabel: '关闭菜单',
    menuAria: '主导航',
    nav: [
      { label: '关于', href: '/bio' },
      { label: '服务', hash: 'services' },
      { label: '作品', hash: 'case-histories' },
      { label: '联系', href: '/contact' },
    ],
    info: {
      connect: 'Email:d0a1ccec@gmail.com',
      phone: 'IG:@wangmingshu.me',
      xiaohongshu: '小红书id: 949135495'
    },
    footerLabel: '联系我',
    footerMarquee: '让我们始终保持前进。',
    footerNav: [
      { label: '关于', index: '01', href: '/bio' },
      { label: '服务', index: '02', hash: 'services' },
      { label: '作品', index: '03', hash: 'case-histories' },
      { label: '联系', index: '04', href: '/contact' },
    ],
    privacy: '隐私政策',
    cookies: 'Cookie 政策',
    manage: '管理 Cookie 偏好',
    credits: '© 鼠王 Ratking',
  },
  en: {
    menuLabel: 'Menu',
    closeLabel: 'Close menu',
    menuAria: 'Main menu',
    nav: [
      { label: 'About', href: '/en/bio' },
      { label: 'Services', hash: 'services' },
      { label: 'Works', hash: 'case-histories' },
      { label: 'Contact', href: '/en/contact' },
    ],
    info: {
      connect: 'Email:d0a1ccec@gmail.com',
      phone: 'Instagram: @wangmingshu.me',
    },
    footerLabel: 'Contact',
    footerMarquee: "Let's keep moving forward.",
    footerNav: [
      { label: 'About', index: '01', href: '/en/bio' },
      { label: 'Services', index: '02', hash: 'services' },
      { label: 'Works', index: '03', hash: 'case-histories' },
      { label: 'Contact', index: '04', href: '/en/contact' },
    ],
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    manage: 'Manage cookie preferences',
    credits: '© Ratking',
  },
} as const;
