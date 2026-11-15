// Checkout shell (Stage 5-2). No payment provider: nothing is sent, stored or charged.
// Checkout page: client-side validation with inline errors (aria-invalid + aria-describedby), a short alert that names
// how many fields need attention, focus on the first one; when valid, the success page opens with ?preview=1&package=<slug>
// (no personal data in the URL). Result pages: read ?package and ?preview to show the package, the sample reference and
// point "Try again" / "Request a proposal" at that package.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── Checkout form ─────────────────────────────────────────────────────
const form = $('[data-checkout-form]');
if (form) {
  const submit = $('[data-checkout-submit]', form);
  const summary = $('[data-co-summary]', form);
  const status = $('[data-co-status]', form);
  submit.type = 'submit'; // markup ships type="button": without JS the form can never be submitted anywhere
  form.noValidate = true;
  let tried = false;

  const checks = {
    email: (v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(v),
    phone: (v) => /^\+?\d{8,15}$/.test(v.replace(/[\s\-().]/g, '').replace(/^00/, '+')),
    trn: (v) => /^\d{15}$/.test(v.replace(/[\s-]/g, '')),
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
    // after the first attempt, errors clear (or update) as the visitor types; before it, a field is only checked on leave
    el.addEventListener(ev, () => { if (tried || el.getAttribute('aria-invalid')) validate(el); });
    el.addEventListener('blur', () => { if (el.type !== 'checkbox' && el.value.trim()) validate(el); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tried = true;
    const bad = fields.filter((el) => !validate(el));
    if (bad.length) {
      const msg = bad.length === 1 ? form.dataset.msgOne : bad.length === 2 ? form.dataset.msgTwo : form.dataset.msgMany.replace('{n}', bad.length);
      summary.hidden = false; summary.textContent = '';
      requestAnimationFrame(() => { summary.textContent = msg; }); // re-announced on every attempt
      status.textContent = '';
      bad[0].focus();
      return;
    }
    summary.hidden = true; summary.textContent = '';
    status.textContent = submit.dataset.working || '';
    submit.disabled = true; submit.setAttribute('aria-busy', 'true');
    // No gateway yet: preview route straight to the success page. The gateway hand-off replaces this line.
    const url = `${form.dataset.success}?preview=1&package=${encodeURIComponent(form.dataset.slug)}`;
    setTimeout(() => location.assign(url), 350);
  });
}

// ── Result pages (success / failed) ──────────────────────────────────
const result = $('[data-co-result]');
if (result) {
  const q = new URLSearchParams(location.search);
  const preview = q.get('preview') === '1';
  const slug = (q.get('package') || '').replace(/[^a-z0-9-]/g, '');
  const name = slug && $(`[data-pkg-name="${slug}"]`, result);
  const facts = $('[data-co-facts]', result);
  if (name) { name.hidden = false; $('[data-co-pkg]', result).hidden = false; facts.hidden = false; }
  const ref = $('[data-co-ref]', result);
  if (ref && preview) { ref.hidden = false; facts.hidden = false; }

  const retry = $('[data-co-retry]', result);
  if (retry && name) {
    retry.href = `/${result.dataset.lang}/checkout/${slug}/`;
    retry.firstChild.textContent = retry.dataset.labelRetry;
  }
  const proposal = $('[data-co-proposal]', result);
  if (proposal && name) { proposal.dataset.package = name.textContent.trim(); proposal.dataset.service = name.dataset.service; }

  // The language switch keeps ?package / ?preview, so the other language shows the same result.
  if (location.search) $$('a[hreflang]').forEach((a) => { if (/\/checkout\//.test(a.getAttribute('href'))) a.search = location.search; });
}
