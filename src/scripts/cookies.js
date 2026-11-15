import * as CookieConsent from 'vanilla-cookieconsent';

/**
 * Consent UI for this site.
 * The site loads no tracker: the only thing stored is the consent record
 * itself, kept in localStorage so nothing is sent to a server.
 */

const privacy = {
  zh: '/privacy',
  en: '/en/privacy',
};

const translations = {
  zh: {
    consentModal: {
      title: '本站使用本地存储',
      description:
        '本站不做统计、广告或第三方追踪。为了记住你是否看过这条提示，只会在浏览器 localStorage 中保存一条同意记录。 <button type="button" data-cc="show-preferencesModal">管理偏好。</button>',
      acceptAllBtn: '知道了',
      acceptNecessaryBtn: '仅必要',
    },
    preferencesModal: {
      title: 'Cookie 偏好',
      acceptAllBtn: '知道了',
      acceptNecessaryBtn: '仅必要',
      savePreferencesBtn: '保存选择',
      closeIconLabel: '关闭',
      sections: [
        {
          title: '为什么会有这条提示？',
          description: `本站不使用追踪 Cookie。同意记录仅保存在你的浏览器里，用来避免重复弹出提示。详情见完整的<a href="${privacy.zh}">隐私政策</a>。`,
        },
        {
          title: '严格必要的存储',
          description:
            '用于记住你的 Cookie 选择，保存在浏览器 localStorage 中，不会发送到服务器。',
          linkedCategory: 'necessary',
        },
      ],
    },
  },
  en: {
    consentModal: {
      title: 'This site uses local storage',
      description:
        'This site has no analytics, advertising or third-party tracking. To remember that you have seen this notice, a single consent record is stored in your browser\'s localStorage. <button type="button" data-cc="show-preferencesModal">Manage preferences.</button>',
      acceptAllBtn: 'Got it',
      acceptNecessaryBtn: 'Necessary only',
    },
    preferencesModal: {
      title: 'Cookie preferences',
      acceptAllBtn: 'Got it',
      acceptNecessaryBtn: 'Necessary only',
      savePreferencesBtn: 'Save choices',
      closeIconLabel: 'Close',
      sections: [
        {
          title: 'Why this notice?',
          description: `This site uses no tracking cookies. The consent record stays in your browser and only prevents this notice from showing again. See the full <a href="${privacy.en}">privacy policy</a>.`,
        },
        {
          title: 'Strictly necessary storage',
          description:
            'Remembers your cookie choice in browser localStorage. It is never sent to a server.',
          linkedCategory: 'necessary',
        },
      ],
    },
  },
};

let started = false;
let currentLang = null;

function getLang() {
  if (document.body?.dataset.lang === 'en') return 'en';
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

export function initCookies() {
  const root = document.querySelector('.cookie__container');
  if (!root) return;

  const lang = getLang();

  if (started) {
    if (currentLang !== lang) {
      currentLang = lang;
      CookieConsent.setLanguage(lang).catch(() => {});
    }
    return;
  }

  started = true;
  currentLang = lang;

  CookieConsent.run({
    root: '.cookie__container',
    categories: {
      necessary: { enabled: true, readOnly: true },
    },
    cookie: { name: 'consent__cookie', path: '/', useLocalStorage: true },
    language: {
      autoDetect: false,
      default: lang,
      translations,
    },
    guiOptions: {
      consentModal: { layout: 'cloud', equalWeightButtons: false },
    },
    onModalShow: ({ modalName }) => {
      if (modalName === 'preferencesModal') {
        document.querySelector('.pm__body')?.setAttribute('data-lenis-prevent', 'true');
      }
    },
  });
}

let cookieTriggerBound = false;
function bindCookieTrigger() {
  if (cookieTriggerBound) return;
  cookieTriggerBound = true;
  document.addEventListener('click', (event) => {
    const trigger = event.target && event.target.closest ? event.target.closest('[data-open-cookie]') : null;
    if (!trigger) return;
    event.preventDefault();
    try { CookieConsent.showPreferences(); } catch (e) { /* noop */ }
  });
}
bindCookieTrigger();
