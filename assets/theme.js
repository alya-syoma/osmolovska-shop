(() => {
  // mobile menu
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobile = document.querySelector('[data-mobile-menu]');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.hidden;
      mobile.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // back to top button
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const onScroll = () => toTop.classList.toggle('show', window.scrollY > window.innerHeight);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // "In your room" switcher
  document.querySelectorAll('.rooms').forEach((section) => {
    const imgs = section.querySelectorAll('[data-room-stage] img');
    const tabs = section.querySelectorAll('.room-tab');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      const i = Number(tab.dataset.r);
      tabs.forEach((t, j) => t.classList.toggle('on', j === i));
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
    }));
  });

  // drop countdown
  document.querySelectorAll('[data-drop]').forEach((drop) => {
    const start = new Date(drop.dataset.start);
    if (isNaN(start)) return;
    const q = (s) => drop.querySelector(s);
    const pad = (n) => String(n).padStart(2, '0');
    const when = q('[data-drop-when]');
    if (when) when.textContent = 'Opens ' + start.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) + ' (your time)';
    const tick = () => {
      let ms = start - Date.now();
      if (ms <= 0) {
        q('[data-countdown]').hidden = true;
        q('[data-drop-before]').hidden = true;
        q('[data-drop-after]').hidden = false;
        if (when) when.textContent = 'The drop is open.';
        return false;
      }
      const s = Math.floor(ms / 1000);
      q('[data-d]').textContent = pad(Math.floor(s / 86400));
      q('[data-h]').textContent = pad(Math.floor(s / 3600) % 24);
      q('[data-m]').textContent = pad(Math.floor(s / 60) % 60);
      q('[data-s]').textContent = pad(s % 60);
      return true;
    };
    if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
  });

  // product page: variant switching
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const section = form.closest('.product');
    const dataEl = section && section.querySelector('[data-product-json]');
    if (!dataEl) return;
    const data = JSON.parse(dataEl.textContent);
    const selects = form.querySelectorAll('[data-option]');
    const idInput = form.querySelector('[data-variant-id]');
    const addBtn = form.querySelector('[data-add]');
    const addLabel = addBtn.textContent.trim() === 'Sold' ? 'Add to cart' : addBtn.textContent.trim();
    const price = section.querySelector('[data-price]');
    const money = (cents) => (cents / 100).toLocaleString(undefined, { style: 'currency', currency: (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD' });
    selects.forEach((sel) => sel.addEventListener('change', () => {
      const chosen = [...selects].map((s) => s.value);
      const v = data.variants.find((x) => x.options.every((o, i) => o === chosen[i]));
      if (!v) { addBtn.disabled = true; addBtn.textContent = 'Unavailable'; return; }
      idInput.value = v.id;
      addBtn.disabled = !v.available;
      addBtn.textContent = v.available ? addLabel : 'Sold';
      price.textContent = v.available ? money(v.price) : 'Sold';
      const url = new URL(location.href); url.searchParams.set('variant', v.id); history.replaceState(null, '', url);
    }));

    // add to cart without leaving the page
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = form.querySelector('[data-form-error]');
      err.hidden = true;
      addBtn.disabled = true;
      try {
        const res = await fetch(window.Shopify && Shopify.routes ? Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
          method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.description || 'Could not add to cart');
        const cart = await (await fetch('/cart.js')).json();
        document.querySelectorAll('[data-cart-count]').forEach((c) => { c.textContent = cart.item_count; c.hidden = cart.item_count === 0; });
        addBtn.textContent = 'Added ✓';
        setTimeout(() => { addBtn.textContent = addLabel; addBtn.disabled = false; }, 1800);
      } catch (ex) {
        err.textContent = ex.message; err.hidden = false; addBtn.disabled = false;
      }
    });
  });

  // product photo zoom
  document.querySelectorAll('[data-zoom]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const box = document.createElement('div');
    box.className = 'zoom';
    box.innerHTML = `<img src="${a.href}" alt="">`;
    box.addEventListener('click', () => box.remove());
    document.addEventListener('keydown', function esc(ev) { if (ev.key === 'Escape') { box.remove(); document.removeEventListener('keydown', esc); } });
    document.body.append(box);
  }));
})();
