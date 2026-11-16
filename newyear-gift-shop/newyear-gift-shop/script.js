const BOX_PRICE = 350;
const products = [
  { id: 1, name: 'Шоколад ручной работы', category: 'sweet', label: 'СЛАДКОЕ', price: 290, emoji: '🍫', glow: 'rgba(164,101,65,.32)' },
  { id: 2, name: 'Набор праздничных конфет', category: 'sweet', label: 'СЛАДКОЕ', price: 420, emoji: '🍬', glow: 'rgba(216,119,137,.3)' },
  { id: 3, name: 'Ароматный какао-микс', category: 'sweet', label: 'СЛАДКОЕ', price: 250, emoji: '☕', glow: 'rgba(194,145,86,.3)' },
  { id: 4, name: 'Мягкие зимние носочки', category: 'cozy', label: 'УЮТ', price: 390, emoji: '🧦', glow: 'rgba(197,111,108,.28)' },
  { id: 5, name: 'Тёплый шарф', category: 'cozy', label: 'УЮТ', price: 850, emoji: '🧣', glow: 'rgba(119,151,126,.3)' },
  { id: 6, name: 'Кружка для какао', category: 'cozy', label: 'УЮТ', price: 450, emoji: '🍵', glow: 'rgba(201,181,135,.3)' },
  { id: 7, name: 'Аромасвеча с корицей', category: 'beauty', label: 'ЗАБОТА', price: 520, emoji: '🕯️', glow: 'rgba(214,171,104,.3)' },
  { id: 8, name: 'Бомбочка для ванны', category: 'beauty', label: 'ЗАБОТА', price: 280, emoji: '🫧', glow: 'rgba(132,173,181,.3)' },
  { id: 9, name: 'Крем для рук', category: 'beauty', label: 'ЗАБОТА', price: 360, emoji: '🧴', glow: 'rgba(205,147,155,.3)' },
  { id: 10, name: 'Ёлочная игрушка', category: 'decor', label: 'ДЕКОР', price: 310, emoji: '🎄', glow: 'rgba(105,153,118,.3)' },
  { id: 11, name: 'Мини-снежный шар', category: 'decor', label: 'ДЕКОР', price: 490, emoji: '❄️', glow: 'rgba(140,180,190,.3)' },
  { id: 12, name: 'Открытка с пожеланием', category: 'decor', label: 'ДЕКОР', price: 120, emoji: '💌', glow: 'rgba(198,147,130,.3)' }
];

const state = { category: 'all', search: '', cart: new Map() };
const $ = (selector) => document.querySelector(selector);
const productGrid = $('#productGrid');
const selectedList = $('#selectedList');

function formatPrice(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} сом`;
}

function renderProducts() {
  const visible = products.filter((product) => {
    const categoryMatch = state.category === 'all' || product.category === state.category;
    const searchMatch = product.name.toLocaleLowerCase('ru').includes(state.search.toLocaleLowerCase('ru'));
    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = visible.map((product) => {
    const quantity = state.cart.get(product.id) || 0;
    return `
      <article class="product-card">
        <div class="product-art" style="--product-glow: ${product.glow}">
          <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
        </div>
        <div class="product-info">
          <span class="product-category">${product.label}</span>
          <h4>${product.name}</h4>
          <div class="product-bottom">
            <span class="product-price">${formatPrice(product.price)}</span>
            <button class="add-button ${quantity ? 'added' : ''}" type="button" data-add="${product.id}" aria-label="${quantity ? 'Добавить ещё' : 'Добавить'}: ${product.name}">${quantity ? `+${quantity}` : '+'}</button>
          </div>
        </div>
      </article>`;
  }).join('');
  $('#emptyState').hidden = visible.length !== 0;
}

function renderCart() {
  const entries = [...state.cart.entries()]
    .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
    .filter((item) => item.product && item.quantity > 0);
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + BOX_PRICE;

  $('#selectedCount').textContent = `${count} ${pluralize(count, 'предмет', 'предмета', 'предметов')}`;
  $('#subtotal').textContent = formatPrice(subtotal);
  $('#boxPrice').textContent = formatPrice(BOX_PRICE);
  $('#totalPrice').innerHTML = `${new Intl.NumberFormat('ru-RU').format(total)} <small>сом</small>`;
  $('#modalTotal').textContent = formatPrice(total);
  $('#checkoutButton').disabled = count === 0;

  if (!entries.length) {
    selectedList.innerHTML = '<div class="empty-basket"><span>✧</span><p>Пока здесь пусто</p><small>Добавь что-нибудь красивое из каталога</small></div>';
  } else {
    selectedList.innerHTML = entries.map(({ product, quantity }) => `
      <div class="selected-item">
        <span class="selected-item-emoji" aria-hidden="true">${product.emoji}</span>
        <span class="selected-item-name">${product.name}${quantity > 1 ? ` × ${quantity}` : ''}</span>
        <strong class="selected-item-price">${formatPrice(product.price * quantity)}</strong>
        <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Убрать ${product.name}">×</button>
      </div>`).join('');
  }
}

function pluralize(number, one, few, many) {
  const n = Math.abs(number) % 100;
  const last = n % 10;
  if (n > 10 && n < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

function setScreen(screen) {
  const isBuilder = screen === 'builder';
  $('#home').hidden = isBuilder;
  $('#home').classList.toggle('active', !isBuilder);
  $('#catalog').hidden = !isBuilder;
  $('#catalog').classList.toggle('active', isBuilder);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#openGift').addEventListener('click', () => {
  const art = document.querySelector('.hero-art');
  art.classList.add('opening');
  $('#heroGiftBox').classList.add('is-opening');
  window.setTimeout(() => setScreen('builder'), 650);
});
$('#backHome').addEventListener('click', () => setScreen('home'));
$('#brandHome').addEventListener('click', (event) => { event.preventDefault(); setScreen('home'); });
$('#footerTop').addEventListener('click', (event) => { event.preventDefault(); setScreen('home'); });
$('#catalogLink').addEventListener('click', (event) => { event.preventDefault(); setScreen('builder'); });
$('#howLink').addEventListener('click', (event) => { event.preventDefault(); setScreen('home'); document.querySelector('.hero-bottom').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });

$('#categoryTabs').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.category-tab').forEach((tab) => tab.classList.toggle('active', tab === button));
  renderProducts();
});
$('#productSearch').addEventListener('input', (event) => {
  state.search = event.target.value.trim();
  renderProducts();
});
productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = Number(button.dataset.add);
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderProducts();
  renderCart();
});
selectedList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  const id = Number(button.dataset.remove);
  const quantity = state.cart.get(id) || 0;
  if (quantity <= 1) state.cart.delete(id);
  else state.cart.set(id, quantity - 1);
  renderProducts();
  renderCart();
});

function closeModal() { $('#checkoutModal').hidden = true; }
$('#checkoutButton').addEventListener('click', () => { $('#checkoutModal').hidden = false; $('#successMessage').hidden = true; $('#orderForm').hidden = false; });
$('#closeModal').addEventListener('click', closeModal);
$('#checkoutModal').addEventListener('click', (event) => { if (event.target === $('#checkoutModal')) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
$('#orderForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $('#orderForm').hidden = true;
  $('#successMessage').hidden = false;
});
$('#finishOrder').addEventListener('click', () => {
  closeModal();
  state.cart.clear();
  renderProducts();
  renderCart();
  $('#orderForm').reset();
});

// Ненавязчивый анимированный снег на canvas — подстраивается под размер экрана.
(function createSnow() {
  const canvas = $('#snow');
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let flakes = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const amount = Math.min(100, Math.max(32, Math.round(width / 13)));
    flakes = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.1 + .45,
      speed: Math.random() * .75 + .3,
      drift: (Math.random() - .5) * .55,
      alpha: Math.random() * .48 + .18
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const flake of flakes) {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 250, 235, ${flake.alpha})`;
      ctx.fill();
      flake.y += flake.speed;
      flake.x += flake.drift + Math.sin(flake.y * .012) * .18;
      if (flake.y > height + 5) { flake.y = -5; flake.x = Math.random() * width; }
      if (flake.x < -5) flake.x = width + 5;
      if (flake.x > width + 5) flake.x = -5;
    }
    if (!reducedMotion) window.requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();

renderProducts();
renderCart();
