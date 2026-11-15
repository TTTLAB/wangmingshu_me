const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  zh: {
    required: '这项还没填。',
    invalidEmail: '邮箱格式不对。',
    serviceRequired: '选一个类型。',
    next: '下一步',
    submit: '提交',
  },
  en: {
    required: 'Please fill in this field.',
    invalidEmail: 'Please enter a valid email address.',
    serviceRequired: 'Please choose the type of service.',
    next: 'Next',
    submit: 'Send',
  },
};

export function initContactForm() {
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
  const restart = root.querySelector('[data-restart]');

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
    const input = fields[field === 'name' ? 'name' : field];
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

    // Final step: purely local mock, no fetch / XHR / form action.
    fillSummary();
    showSuccess();
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

  restart?.addEventListener('click', () => {
    form.reset();
    clearErrors();
    serviceButtons.forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('is-active');
    });
    selectedService = '';
    maxVisited = 0;
    root.querySelectorAll('[data-summary]').forEach((element) => {
      element.textContent = '';
    });
    showStep(0);
  });

  // Keyboard: Enter advances unless focus is in a textarea.
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
    goNext();
  });

  showStep(0);
}
