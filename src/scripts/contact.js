const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  zh: {
    required: '这项还没填。',
    invalidEmail: '邮箱格式不对。',
    serviceRequired: '选一个类型。',
    next: '下一步',
    submit: '生成邮件',
    mailMissing: '收件邮箱未配置，请直接用页面上的邮箱联系。',
    successCopy: '复制邮件内容',
    successCopyDone: '已复制邮件内容',
    successCopyFail: '复制失败，请手动选中邮件内容。',
    mailSubject: (service, name) => `【网站联系】${service} · ${name}`,
    mail: {
      to: '收件人',
      subject: '主题',
      service: '服务类型',
      name: '称呼',
      email: '邮箱',
      phone: '电话',
      phoneEmpty: '未填写',
      message: '项目情况',
    },
  },
  en: {
    required: 'Please fill in this field.',
    invalidEmail: 'Please enter a valid email address.',
    serviceRequired: 'Please choose the type of service.',
    next: 'Next',
    submit: 'Create email',
    mailMissing: 'No recipient is configured. Please use the email address shown on this page.',
    successCopy: 'Copy email contents',
    successCopyDone: 'Email contents copied',
    successCopyFail: 'Copy failed. Please select the text manually.',
    mailSubject: (service, name) => `Website enquiry: ${service} — ${name}`,
    mail: {
      to: 'To',
      subject: 'Subject',
      service: 'Service',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      phoneEmpty: 'Not provided',
      message: 'Project brief',
    },
  },
};

function initCopyEmail() {
  const button = document.querySelector('[data-copy-email]');
  const status = document.querySelector('[data-copy-status]');
  if (!button || !status || button.dataset.copyInit === '1') return;
  button.dataset.copyInit = '1';
  const copied = status.dataset.copied || '';
  const failed = status.dataset.copyFailed || '';

  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail || '';
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = copied;
    } catch {
      status.textContent = failed;
    }
  });
}

export function initContactForm() {
  initCopyEmail();

  const root = document.querySelector('[data-contact-form]');
  if (!root || root.dataset.dcInit === '1') return;
  root.dataset.dcInit = '1';

  const form = root.querySelector('[data-form]');
  const steps = Array.from(root.querySelectorAll('[data-step]'));
  const navItems = Array.from(root.querySelectorAll('[data-step-nav]'));
  const serviceButtons = Array.from(root.querySelectorAll('[data-service]'));
  const back = root.querySelector('[data-back]');
  const next = root.querySelector('[data-next]');
  const nextLabel = next?.querySelector('.multi-step-form__footer-button-label');
  const enter = root.querySelector('[data-enter]');
  const footer = root.querySelector('[data-form-footer]');
  const success = root.querySelector('[data-success]');
  const successLink = root.querySelector('[data-mailto-link]');
  const copyMail = root.querySelector('[data-copy-mail]');
  const mailCopyStatus = root.querySelector('[data-mail-copy-status]');
  const restart = root.querySelector('[data-restart]');
  let lastDraft = null;

  if (!form || steps.length === 0) return;

  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const messages = MESSAGES[lang];

  const fields = {
    name: root.querySelector('#full_name'),
    email: root.querySelector('#email'),
    phone: root.querySelector('#phone_number'),
    message: root.querySelector('#message'),
  };

  // The DOM has four nav labels but three form panes: "Dettagli" and
  // "Contatto" both belong to the detail pane.
  const NAV_STEP = [0, 1, 1, 2];
  const ACTIVE_NAV = [0, 2, 3];
  const NAV_COMPLETE_UP_TO = [0, 2, 3];

  let current = 0;
  let maxVisited = 0;
  let selectedService = '';

  const setError = (field, message) => {
    const target = root.querySelector(`[data-error-for="${field}"]`);
    if (target) target.textContent = message;
    const input = fields[field === 'full_name' ? 'name' : field];
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const clearErrors = () => {
    ['service', 'full_name', 'email', 'message'].forEach((key) => setError(key, ''));
  };

  const validateService = () => {
    if (!selectedService) {
      setError('service', messages.serviceRequired);
      return false;
    }
    setError('service', '');
    return true;
  };

  const validateDetails = () => {
    clearErrors();
    let valid = true;

    if (!fields.name?.value.trim()) {
      setError('full_name', messages.required);
      valid = false;
    }

    const email = fields.email?.value.trim() || '';
    if (!email) {
      setError('email', messages.required);
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      setError('email', messages.invalidEmail);
      valid = false;
    }

    if (!fields.message?.value.trim()) {
      setError('message', messages.required);
      valid = false;
    }

    return valid;
  };

  const buildMailto = () => {
    const to = (root.dataset.mailtoTo || '').trim();
    if (!to) return null;

    const m = messages.mail;
    // Single-line fields never carry CR/LF into the mailto headers.
    const oneLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
    const service = oneLine(selectedService);
    const name = oneLine(fields.name?.value || '');
    const email = oneLine(fields.email?.value || '');
    const phone = oneLine(fields.phone?.value || m.phoneEmpty);
    const message = (fields.message?.value.trim() || '');
    const body = [
      `${m.service}: ${service}`,
      `${m.name}: ${name}`,
      `${m.email}: ${email}`,
      `${m.phone}: ${phone}`,
      '',
      `${m.message}:`,
      message,
    ].join('\r\n');

    const subject = messages.mailSubject(service, name);
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const text = `${m.to}: ${to}\r\n${m.subject}: ${subject}\r\n\r\n${body}`;
    return { url, text };
  };

  const fillSummary = () => {
    const values = {
      service: selectedService,
      name: fields.name?.value.trim() || '',
      email: fields.email?.value.trim() || '',
      message: fields.message?.value.trim() || '',
    };
    Object.entries(values).forEach(([key, value]) => {
      const target = root.querySelector(`[data-summary="${key}"]`);
      if (target) target.textContent = value;
    });
  };

  const renderNav = () => {
    navItems.forEach((item, index) => {
      const targetStep = NAV_STEP[index];
      item.classList.toggle('is-active', index === ACTIVE_NAV[current]);
      item.classList.toggle(
        'is-complete',
        current > targetStep || (current === 1 && index === 1)
      );
      const reachable = targetStep <= maxVisited;
      item.disabled = !reachable;
      item.classList.toggle('is-disabled', !reachable);
      item.setAttribute('aria-current', index === ACTIVE_NAV[current] ? 'step' : 'false');
    });
  };

  const showStep = (step) => {
    current = Math.max(0, Math.min(2, step));
    maxVisited = Math.max(maxVisited, current);

    steps.forEach((element, index) => {
      element.style.display = index === current ? 'block' : 'none';
    });

    if (back) {
      back.disabled = current === 0;
      back.classList.toggle('is-disabled', current === 0);
    }

    if (nextLabel) nextLabel.textContent = current === 2 ? messages.submit : messages.next;

    if (footer) footer.hidden = false;
    if (success) success.hidden = true;

    renderNav();
  };

  const showSuccess = () => {
    steps.forEach((element) => {
      element.style.display = 'none';
    });
    if (success) success.hidden = false;
    if (footer) footer.hidden = true;
  };

  const goNext = () => {
    if (current === 0) {
      if (!validateService()) return;
      showStep(1);
      return;
    }

    if (current === 1) {
      if (!validateDetails()) return;
      fillSummary();
      showStep(2);
      return;
    }

    // Final step: build a mailto: draft in the browser. The site never posts
    // or stores the form contents; the visitor's mail client sends the email.
    fillSummary();
    const draft = buildMailto();
    if (!draft) {
      window.alert(messages.mailMissing);
      return;
    }
    lastDraft = draft;
    if (successLink) {
      successLink.href = draft.url;
      successLink.hidden = false;
    }
    if (copyMail) copyMail.hidden = false;
    if (mailCopyStatus) mailCopyStatus.textContent = '';
    showSuccess();
    window.location.href = draft.url;
  };

  const goBack = () => {
    if (current === 0) return;
    showStep(current - 1);
  };

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      serviceButtons.forEach((item) => {
        item.setAttribute('aria-pressed', 'false');
        item.classList.remove('is-active');
      });
      button.setAttribute('aria-pressed', 'true');
      button.classList.add('is-active');
      selectedService = button.dataset.service || '';
      setError('service', '');
    });
  });

  back?.addEventListener('click', goBack);
  next?.addEventListener('click', goNext);
  enter?.addEventListener('click', goNext);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    goNext();
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.disabled) return;
      const target = NAV_STEP[Number(item.dataset.stepNav)];

      if (target === 1 && !validateService()) return;
      if (target === 1 && current === 0) {
        showStep(1);
        return;
      }
      if (target === 2) {
        if (!validateDetails()) {
          showStep(1);
          return;
        }
        fillSummary();
        showStep(2);
        return;
      }
      showStep(target);
    });
  });

  copyMail?.addEventListener('click', async () => {
    if (!lastDraft) return;
    try {
      await navigator.clipboard.writeText(lastDraft.text);
      if (mailCopyStatus) mailCopyStatus.textContent = messages.successCopyDone;
    } catch {
      if (mailCopyStatus) mailCopyStatus.textContent = messages.successCopyFail;
    }
  });

  restart?.addEventListener('click', () => {
    form.reset();
    clearErrors();
    serviceButtons.forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('is-active');
    });
    selectedService = '';
    maxVisited = 0;
    lastDraft = null;
    if (copyMail) copyMail.hidden = true;
    if (mailCopyStatus) mailCopyStatus.textContent = '';
    if (successLink) successLink.hidden = true;
    root.querySelectorAll('[data-summary]').forEach((element) => {
      element.textContent = '';
    });
    showStep(0);
  });

  // Keyboard: Enter advances unless focus is in a textarea, button or link.
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.target instanceof HTMLButtonElement) return;
    if (event.target instanceof HTMLAnchorElement) return;
    event.preventDefault();
    goNext();
  });

  showStep(0);
}
