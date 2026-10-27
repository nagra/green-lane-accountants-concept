// Mobile navigation and the demonstration enquiry form. Nothing here sends,
// stores or logs anything: there are no network requests and no storage.

(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const label = toggle.querySelector('.nav-toggle__label');
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close' : 'Menu';
      document.documentElement.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 62rem)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  const form = document.querySelector('[data-demo-form]');
  if (!form) return;

  const summary = document.querySelector('[data-error-summary]');
  const summaryList = summary.querySelector('ul');
  const result = document.querySelector('[data-demo-result]');
  const resultHeading = result.querySelector('h3');

  // Links such as /contacts/?enquiry=payroll preselect the topic.
  const topic = new URLSearchParams(window.location.search).get('enquiry');
  if (topic && [...form.elements.topic.options].some((option) => option.value === topic)) {
    form.elements.topic.value = topic;
  }

  const rules = [
    { name: 'name', empty: 'Enter your name' },
    {
      name: 'email',
      empty: 'Enter your email address',
      invalid: 'Enter an email address in the correct format, like name@example.co.uk',
    },
    { name: 'message', empty: 'Enter a short message about what you need' },
  ];

  const showError = (input, message) => {
    const field = input.closest('.field');
    const error = document.getElementById(`${input.id}-error`);
    const hint = input.dataset.hint ? `${input.dataset.hint} ` : '';
    field.classList.toggle('field--error', Boolean(message));
    error.hidden = !message;
    error.innerHTML = message ? `<span class="visually-hidden">Error: </span>${message}` : '';
    const describedBy = (hint + (message ? error.id : '')).trim();
    if (describedBy) {
      input.setAttribute('aria-describedby', describedBy);
    } else {
      input.removeAttribute('aria-describedby');
    }
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const errors = [];
    for (const rule of rules) {
      const input = form.elements[rule.name];
      let message = '';
      if (!input.value.trim()) message = rule.empty;
      else if (rule.invalid && !input.validity.valid) message = rule.invalid;
      showError(input, message);
      if (message) errors.push({ id: input.id, message });
    }

    if (errors.length) {
      summaryList.replaceChildren(
        ...errors.map(({ id, message }) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${id}`;
          link.textContent = message;
          link.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            document.getElementById(id).focus();
          });
          item.append(link);
          return item;
        }),
      );
      summary.hidden = false;
      summary.focus();
      return;
    }

    // Demonstration only: clear what was typed and explain that nothing was sent.
    summary.hidden = true;
    form.reset();
    form.hidden = true;
    result.hidden = false;
    resultHeading.focus();
  });

  result.querySelector('[data-demo-reset]').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
