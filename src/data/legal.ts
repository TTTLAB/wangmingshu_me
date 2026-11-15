import legal from './legal.json';

export type LegalKind = 'privacy' | 'cookies';
export type LegalLang = 'zh' | 'en';

export const legalPages = {
  zh: {
    privacy: {
      title: '隐私政策',
      metaTitle: '鼠王 Ratking 隐私政策',
      metaDescription: '鼠王 Ratking 个人作品展示站的隐私政策。',
      content: legal.zh.privacy.content,
    },
    cookies: {
      title: 'Cookie 政策',
      metaTitle: '鼠王 Ratking Cookie 政策',
      metaDescription: '鼠王 Ratking 个人作品展示站的 Cookie 政策。',
      content: legal.zh.cookies.content,
    },
  },
  en: {
    privacy: {
      title: 'Privacy Policy',
      metaTitle: 'Ratking Privacy Policy',
      metaDescription: 'Privacy policy for the personal portfolio of Ratking.',
      content: legal.en.privacy.content,
    },
    cookies: {
      title: 'Cookie Policy',
      metaTitle: 'Ratking Cookie Policy',
      metaDescription: 'Cookie policy for the personal portfolio of Ratking.',
      content: legal.en.cookies.content,
    },
  },
} as const;
