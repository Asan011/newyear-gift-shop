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

const boxes = [
  { id: 'aurora', name: 'Северное сияние', subtitle: 'Глубокий изумруд и золото', price: 450, color: '#236448', dark: '#113e2d', lid: '#347d59', ribbon: '#d8b66e', ribbonDark: '#986d31', bow: '#f0d28e', stamp: '✦', tag: 'БЕСТСЕЛЛЕР' },
  { id: 'ruby', name: 'Рубиновый вечер', subtitle: 'Бархатный красный и шампань', price: 490, color: '#9f343c', dark: '#5e1b28', lid: '#bd4d4c', ribbon: '#e6c48a', ribbonDark: '#ad814b', bow: '#f5dbac', stamp: '❋', tag: 'ПРАЗДНИЧНАЯ' },
  { id: 'ice', name: 'Ледяная сказка', subtitle: 'Морозный голубой и серебро', price: 520, color: '#668ca8', dark: '#31556d', lid: '#83a9c0', ribbon: '#dce7e7', ribbonDark: '#9aafb6', bow: '#f1f5ee', stamp: '❄', tag: 'НОВИНКА' },
  { id: 'caramel', name: 'Карамельное утро', subtitle: 'Нежный кремовый и клюква', price: 420, color: '#c9a77a', dark: '#896442', lid: '#ddc39a', ribbon: '#a63e45', ribbonDark: '#71232d', bow: '#d76c6c', stamp: '♡', tag: 'НЕЖНЫЙ СТИЛЬ' },
  { id: 'midnight', name: 'Полночное золото', subtitle: 'Ночной синий и сияющее золото', price: 550, color: '#283b67', dark: '#111f43', lid: '#3d5487', ribbon: '#d5ad58', ribbonDark: '#8c6828', bow: '#f0d18a', stamp: '★', tag: 'ПРЕМИУМ' }
];

const state = { category: 'all', search: '', cart: new Map(), selectedBox: 0, autoplay: null };
const $ = (selector) => document.querySelector(selector);
const productGrid = $('#productGrid');
const selectedList = $('#selectedList');
const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} сом`;
const currentBox = () => boxes[state.selectedBox];

function giftMarkup(box) {
  return `<div class="gift-art" style="--box-color:${box.color};--box-dark:${box.dark};--lid-color:${box.lid};--ribbon-color:${box.ribbon};--ribbon-dark:${box.ribbonDark};--bow-color:${box.bow}">
    <div class="gift-bow"><i></i></div>
    <div class="gift-lid-art"><span class="gift-lid-ribbon"></span></div>
    <div class="gift-body-art"><span class="gift-ribbon-v"></span><span class="gift-ribbon-h"></span><span class="gift-stamp">${box.stamp}</span></div>
  </div>`;
}

function renderCarousel() {
  const carousel = $('#boxCarousel');
  carousel.innerHTML = [-1, 0, 1].map((offset) => {
    const index = (state.selectedBox + offset + boxes.length) % boxes.length;
    const box = boxes[index];
    const position = offset === 0 ? 'is-active' : offset === -1 ? 'is-prev' : 'is-next';
    return `<button class="box-slide ${position}" type="button" data-box-index="${index}" aria-label="Выбрать коробку ${box.name}" aria-pressed="${offset === 0}">
      <div class="slide-topline"><span>${String(index + 1).padStart(2, '0')} / 05</span><span class="limited">${box.tag}</span></div>
      <div class="gift-stage"><span class="spark s1">✧</span><span class="spark s2">✦</span>${giftMarkup(box)}</div>
      <div class="slide-info"><h3>${box.name}</h3><p>${box.subtitle}</p><span class="slide-price">${formatPrice(box.price)}</span></div>
    </button>`;
  }).join('');
  $('#carouselDots').innerHTML = boxes.map((box, index) => `<button class="carousel-dot ${index === state.selectedBox ? 'active' : ''}" type="button" data-dot-index="${index}" aria-label="${box.name}" aria-current="${index === state.selectedBox ? 'true' : 'false'}"></button>`).join('');
  $('#boxCurrent').textContent = String(state.selectedBox + 1).padStart(2, '0');
  $('#boxTotal').textContent = String(boxes.length).padStart(2, '0');
}

function selectBox(index) {
  state.selectedBox = (index + boxes.length) % boxes.length;
  renderCarousel();
  renderCart();
}

function renderProducts() {
  const visible = products.filter((product) => {
    const categoryMatch = state.category === 'all' || product.category === state.category;
    const searchMatch = product.name.toLocaleLowerCase('ru').includes(state.search.toLocaleLowerCase('ru'));
    return categoryMatch && searchMatch;
  });
  productGrid.innerHTML = visible.map((product) => {
    const quantity = state.cart.get(product.id) || 0;
    return `<article class="product-card"><div class="product-art" style="--product-glow:${product.glow}"><span class="product-emoji" aria-hidden="true">${product.emoji}</span></div>
      <div class="product-info"><span class="product-category">${product.label}</span><h4>${product.name}</h4><div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span><button class="add-button ${quantity ? 'added' : ''}" type="button" data-add="${product.id}" aria-label="${quantity ? 'Добавить ещё' : 'Добавить'}: ${product.name}">${quantity ? `+${quantity}` : '+'}</button></div></div></article>`;
  }).join('');
  $('#emptyState').hidden = visible.length !== 0;
}

function renderCart() {
  const entries = [...state.cart.entries()].map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product && item.quantity > 0);
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + currentBox().price;
  $('#selectedCount').textContent = `${count} ${pluralize(count, 'предмет', 'предмета', 'предметов')}`;
  $('#subtotal').textContent = formatPrice(subtotal);
  $('#boxPrice').textContent = formatPrice(currentBox().price);
  $('#totalPrice').innerHTML = `${new Intl.NumberFormat('ru-RU').format(total)} <small>сом</small>`;
  $('#modalTotal').textContent = formatPrice(total);
  $('#checkoutButton').disabled = count === 0;
  $('#summaryBoxArt').innerHTML = giftMarkup(currentBox());
  $('#summaryBoxName').textContent = currentBox().name;
  if (!entries.length) {
    selectedList.innerHTML = '<div class="empty-basket"><span>✧</span><p>Пока здесь пусто</p><small>Добавь что-нибудь красивое из каталога</small></div>';
  } else {
    selectedList.innerHTML = entries.map(({ product, quantity }) => `<div class="selected-item"><span class="selected-item-emoji" aria-hidden="true">${product.emoji}</span><span class="selected-item-name">${product.name}${quantity > 1 ? ` × ${quantity}` : ''}</span><strong class="selected-item-price">${formatPrice(product.price * quantity)}</strong><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Убрать ${product.name}">×</button></div>`).join('');
  }
}

function pluralize(number, one, few, many) {
  const n = Math.abs(number) % 100; const last = n % 10;
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
  $('#navBox').classList.toggle('active', !isBuilder);
  $('#navFill').classList.toggle('active', isBuilder);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startAutoplay() {
  stopAutoplay();
  state.autoplay = window.setInterval(() => selectBox(state.selectedBox + 1), 5200);
}
function stopAutoplay() { if (state.autoplay) window.clearInterval(state.autoplay); state.autoplay = null; }
function userChangedSlide(index) { selectBox(index); startAutoplay(); }

$('#prevBox').addEventListener('click', () => userChangedSlide(state.selectedBox - 1));
$('#nextBox').addEventListener('click', () => userChangedSlide(state.selectedBox + 1));
$('#boxCarousel').addEventListener('click', (event) => {
  const slide = event.target.closest('[data-box-index]');
  if (!slide) return;
  userChangedSlide(Number(slide.dataset.boxIndex));
});
$('#carouselDots').addEventListener('click', (event) => {
  const dot = event.target.closest('[data-dot-index]');
  if (dot) userChangedSlide(Number(dot.dataset.dotIndex));
});
$('#carouselDots').addEventListener('mouseenter', stopAutoplay);
$('#carouselDots').addEventListener('mouseleave', startAutoplay);
$('#boxCarousel').addEventListener('mouseenter', stopAutoplay);
$('#boxCarousel').addEventListener('mouseleave', startAutoplay);
$('#chooseBox').addEventListener('click', () => { stopAutoplay(); setScreen('builder'); });
$('#backHome').addEventListener('click', () => { setScreen('home'); startAutoplay(); });
$('#changeBox').addEventListener('click', () => { setScreen('home'); startAutoplay(); });
$('#navBox').addEventListener('click', () => { setScreen('home'); startAutoplay(); });
$('#navFill').addEventListener('click', () => setScreen('builder'));
$('#brandHome').addEventListener('click', (event) => { event.preventDefault(); setScreen('home'); startAutoplay(); });
$('#footerTop').addEventListener('click', (event) => { event.preventDefault(); setScreen('home'); startAutoplay(); });

$('#categoryTabs').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.category-tab').forEach((tab) => tab.classList.toggle('active', tab === button));
  renderProducts();
});
$('#productSearch').addEventListener('input', (event) => { state.search = event.target.value.trim(); renderProducts(); });
productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = Number(button.dataset.add);
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderProducts(); renderCart();
});
selectedList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  const id = Number(button.dataset.remove); const quantity = state.cart.get(id) || 0;
  if (quantity <= 1) state.cart.delete(id); else state.cart.set(id, quantity - 1);
  renderProducts(); renderCart();
});

function closeModal() { $('#checkoutModal').hidden = true; }
$('#checkoutButton').addEventListener('click', () => { $('#checkoutModal').hidden = false; $('#successMessage').hidden = true; $('#orderForm').hidden = false; });
$('#closeModal').addEventListener('click', closeModal);
$('#checkoutModal').addEventListener('click', (event) => { if (event.target === $('#checkoutModal')) closeModal(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if (!$('#home').hidden && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) userChangedSlide(state.selectedBox + (event.key === 'ArrowRight' ? 1 : -1));
});
$('#orderForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $('#orderForm').hidden = true; $('#successMessage').hidden = false;
});
$('#finishOrder').addEventListener('click', () => {
  closeModal(); state.cart.clear(); renderProducts(); renderCart(); $('#orderForm').reset();
});

// Крупный, мягко падающий снег. Количество и движение подстраиваются под экран.
(function createSnow() {
  const canvas = $('#snow'); const ctx = canvas.getContext('2d');
  let width = 0; let height = 0; let flakes = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const amount = Math.min(105, Math.max(38, Math.round(width / 12)));
    flakes = Array.from({ length: amount }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() * 3.4 + 1.4,
      speed: Math.random() * .72 + .34,
      drift: (Math.random() - .5) * .62,
      alpha: Math.random() * .48 + .28,
      blur: Math.random() > .72
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const flake of flakes) {
      ctx.beginPath(); ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 251, 239, ${flake.alpha})`;
      if (flake.blur) { ctx.shadowBlur = 7; ctx.shadowColor = 'rgba(255,255,255,.75)'; } else ctx.shadowBlur = 0;
      ctx.fill();
      flake.y += flake.speed; flake.x += flake.drift + Math.sin(flake.y * .009) * .2;
      if (flake.y > height + 7) { flake.y = -7; flake.x = Math.random() * width; }
      if (flake.x < -7) flake.x = width + 7; if (flake.x > width + 7) flake.x = -7;
    }
    ctx.shadowBlur = 0;
    if (!reducedMotion) window.requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize); resize(); draw();
})();

renderCarousel(); renderProducts(); renderCart(); startAutoplay();
