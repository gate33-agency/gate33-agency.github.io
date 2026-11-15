// Contact form (Stage 5-3). Same validation pattern as the checkout (checkout.js): inline errors with aria-invalid +
// aria-describedby, a short alert naming how many fields need attention, focus on the first one. NOTHING is sent or
// stored: there is no action, no fetch, and the data never leaves the page. A valid form shows the inline
// "Preview: messages are not sent yet" confirmation. The button ships as type="button", so without JS nothing submits.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const form = $('[data-contact-form]');
if (form) {
  const submit = $('[data-ct-submit]', form);
  const summary = $('[data-ct-summary]', form);
  const status = $('[data-ct-status]', form);
  const done = $('[data-ct-done]', form);
  submit.type = 'submit';
  form.noValidate = true;
  let tried = false;

  const checks = {
    email: (v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(v),
    phone: (v) => /^\+?\d{8,15}$/.test(v.replace(/[\s\-().]/g, '').replace(/^00/, '+')),
  };
  const fields = $$('input, select, textarea', form).filter((el) => el.dataset.errMissing || el.dataset.check);

  function messageFor(el) {
    const v = el.type === 'checkbox' ? el.checked : el.value.trim();
    if (el.required && (el.type === 'checkbox' ? !v : v.length < (el.name === 'name' ? 2 : 1))) return el.dataset.errMissing;
    if (el.dataset.check && el.value.trim() && !checks[el.dataset.check](el.value.trim())) return el.dataset.errFormat;
    return '';
  }
  function show(el, msg) {
    const box = el.closest('[data-field]'); const out = $('[data-error]', box);
    box.classList.toggle('is-invalid', !!msg);
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (out) out.textContent = msg;
  }
  const validate = (el) => { const m = messageFor(el); show(el, m); return !m; };

  fields.forEach((el) => {
    const ev = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(ev, () => { if (tried || el.getAttribute('aria-invalid')) validate(el); });
    el.addEventListener('blur', () => { if (el.type !== 'checkbox' && el.value.trim()) validate(el); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // always: the preview never submits anywhere
    tried = true;
    done.hidden = true;
    const bad = fields.filter((el) => !validate(el));
    if (bad.length) {
      const msg = bad.length === 1 ? form.dataset.msgOne : bad.length === 2 ? form.dataset.msgTwo : form.dataset.msgMany.replace('{n}', bad.length);
      summary.hidden = false; summary.textContent = '';
      requestAnimationFrame(() => { summary.textContent = msg; });
      status.textContent = '';
      bad[0].focus();
      return;
    }
    summary.hidden = true; summary.textContent = '';
    status.textContent = submit.dataset.working || '';
    submit.disabled = true; submit.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      status.textContent = '';
      submit.disabled = false; submit.removeAttribute('aria-busy');
      done.hidden = false;
      done.focus();
    }, 350);
  });
}
