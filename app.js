/* ===== ユーティリティ ===== */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const yen = n => n.toLocaleString("ja-JP") + "円";
const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || "";

/* ===== 状態 ===== */
let cart = {};               // { productId: qty }
const filters = { keyword: "", category: "", price: "", sort: "popular" };

/* ===== 初期描画 ===== */
function init() {
  renderCategories();
  renderRanking();
  populateCategoryFilter();
  renderProducts();
  $("#statCount").textContent = PRODUCTS.length;
  animateStat($("#statCount"), PRODUCTS.length);
  bindEvents();
}

/* カテゴリカード */
function renderCategories() {
  $("#categoryGrid").innerHTML = CATEGORIES.map(c => `
    <div class="category-card" data-cat="${c.id}">
      <span class="ico">${c.icon}</span>
      <span class="name">${c.name}</span>
    </div>`).join("");
}

function populateCategoryFilter() {
  const sel = $("#categoryFilter");
  CATEGORIES.forEach(c => {
    const o = document.createElement("option");
    o.value = c.id; o.textContent = c.name;
    sel.appendChild(o);
  });
}

/* ランキング（人気順 TOP5） */
function renderRanking() {
  const top = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  $("#rankingList").innerHTML = top.map((p, i) => `
    <div class="rank-card" data-id="${p.id}">
      <span class="rank-card__badge">${i + 1}</span>
      <div class="rank-card__img" style="background:${p.grad}">${p.emoji}</div>
      <div class="rank-card__body">
        <p class="rank-card__name">${p.name}</p>
        <p class="rank-card__price">${yen(p.price)}</p>
      </div>
    </div>`).join("");
}

/* 返礼品一覧（フィルタ適用） */
function getFiltered() {
  let list = PRODUCTS.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      if (!(p.name + p.region + p.desc).toLowerCase().includes(k)) return false;
    }
    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number);
      if (p.price < min) return false;
      if (max && p.price > max) return false;
    }
    return true;
  });
  if (filters.sort === "price-asc")  list.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (filters.sort === "popular")    list.sort((a, b) => b.popularity - a.popularity);
  return list;
}

function renderProducts() {
  const list = getFiltered();
  $("#resultCount").innerHTML = `<strong>${list.length}</strong> 件の返礼品`;
  $("#emptyState").hidden = list.length > 0;
  $("#productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-card__img" style="background:${p.grad}">
        <span class="product-card__cat">${catName(p.category)}</span>
        ${p.emoji}
      </div>
      <div class="product-card__body">
        <p class="product-card__region">📍 ${p.region}</p>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__foot">
          <div class="product-card__price">
            <small>寄付金額</small>
            <strong>${yen(p.price)}</strong>
          </div>
          <button class="add-btn" data-add="${p.id}">カートに追加</button>
        </div>
      </div>
    </article>`).join("");
}

/* ===== カート ===== */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  const p = PRODUCTS.find(x => x.id === id);
  showToast(`「${p.name}」をカートに追加しました`);
}
function changeQty(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}
function removeItem(id) { delete cart[id]; updateCart(); }

function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, q]) => {
    const p = PRODUCTS.find(x => x.id === +id);
    return sum + (p ? p.price * q : 0);
  }, 0);
}

function updateCart() {
  $("#cartCount").textContent = cartCount();
  $("#cartTotal").textContent = yen(cartTotal());
  renderCartItems();
}

function renderCartItems() {
  const ids = Object.keys(cart);
  if (!ids.length) {
    $("#cartItems").innerHTML = `<p class="cart-empty">カートは空です。<br>気になる返礼品を追加してください。</p>`;
    return;
  }
  $("#cartItems").innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === +id);
    const q = cart[id];
    return `
      <div class="cart-item">
        <div class="cart-item__img" style="background:${p.grad}">${p.emoji}</div>
        <div class="cart-item__info">
          <p class="cart-item__name">${p.name}</p>
          <p class="cart-item__price">${yen(p.price)} × ${q} = ${yen(p.price * q)}</p>
          <div class="cart-item__qty">
            <button data-minus="${id}">−</button>
            <span>${q}</span>
            <button data-plus="${id}">＋</button>
          </div>
        </div>
        <button class="cart-item__remove" data-remove="${id}">削除</button>
      </div>`;
  }).join("");
}

function openDrawer()  { $("#cartDrawer").classList.add("open"); }
function closeDrawer() { $("#cartDrawer").classList.remove("open"); }

/* ===== シミュレーター ===== */
// 簡易計算：課税所得から住民税所得割額を概算し、上限額の目安を算出
function simulate() {
  const income = +$("#income").value || 0;
  const family = $("#family").value;
  if (income <= 0) {
    $("#limitAmount").textContent = "—";
    $("#limitDesc").textContent = "年収を正しく入力してください。";
    return;
  }
  // 給与所得控除（簡易）
  let salaryDeduction;
  if (income <= 1625000) salaryDeduction = 550000;
  else if (income <= 1800000) salaryDeduction = income * 0.4 - 100000;
  else if (income <= 3600000) salaryDeduction = income * 0.3 + 80000;
  else if (income <= 6600000) salaryDeduction = income * 0.2 + 440000;
  else if (income <= 8500000) salaryDeduction = income * 0.1 + 1100000;
  else salaryDeduction = 1950000;

  const socialInsurance = income * 0.15;           // 社会保険料 概算
  const basicDeduction = 430000;                   // 基礎控除（住民税）
  // 家族構成による扶養控除（住民税ベース 概算）
  const familyDeduction = {
    single: 0,
    spouse: 330000,
    spouse_child_hs: 330000 + 330000,
    spouse_child2: 330000 + 330000 + 450000,
  }[family] || 0;

  const taxableIncome = Math.max(0, income - salaryDeduction - socialInsurance - basicDeduction - familyDeduction);
  const residentTax = taxableIncome * 0.10;        // 住民税所得割 概算（10%）

  // 所得税率（課税所得に応じた限界税率の概算）
  let rate;
  const ti = taxableIncome;
  if (ti <= 1950000) rate = 0.05;
  else if (ti <= 3300000) rate = 0.10;
  else if (ti <= 6950000) rate = 0.20;
  else if (ti <= 9000000) rate = 0.23;
  else if (ti <= 18000000) rate = 0.33;
  else rate = 0.40;

  // 上限額の目安：住民税所得割×20% ÷ (90% − 所得税率×1.021) + 2000
  const limit = (residentTax * 0.20) / (0.9 - rate * 1.021) + 2000;
  const rounded = Math.max(0, Math.floor(limit / 1000) * 1000);

  $("#limitAmount").textContent = rounded.toLocaleString("ja-JP");
  $("#limitDesc").innerHTML = `この金額までの寄付なら、自己負担は実質2,000円が目安です。<br>（住民税所得割 約${Math.round(residentTax).toLocaleString("ja-JP")}円 を基に算出）`;
}

/* ===== 演出 ===== */
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function animateStat(el, target) {
  let cur = 0; const step = Math.ceil(target / 30);
  const tick = () => {
    cur = Math.min(target, cur + step);
    el.textContent = cur;
    if (cur < target) requestAnimationFrame(tick);
  };
  tick();
}

/* ===== イベント ===== */
function bindEvents() {
  // カテゴリカード → フィルタ
  $("#categoryGrid").addEventListener("click", e => {
    const card = e.target.closest("[data-cat]");
    if (!card) return;
    const cat = card.dataset.cat;
    filters.category = filters.category === cat ? "" : cat;
    $("#categoryFilter").value = filters.category;
    renderProducts();
    $("#products").scrollIntoView({ behavior: "smooth" });
  });

  // ランキング → 一覧へスクロール
  $("#rankingList").addEventListener("click", () => {
    $("#products").scrollIntoView({ behavior: "smooth" });
  });

  // 検索・絞り込み
  $("#searchInput").addEventListener("input", e => { filters.keyword = e.target.value; renderProducts(); });
  $("#categoryFilter").addEventListener("change", e => { filters.category = e.target.value; renderProducts(); });
  $("#priceFilter").addEventListener("change", e => { filters.price = e.target.value; renderProducts(); });
  $("#sortSelect").addEventListener("change", e => { filters.sort = e.target.value; renderProducts(); });

  // カート追加
  $("#productGrid").addEventListener("click", e => {
    const btn = e.target.closest("[data-add]");
    if (btn) addToCart(+btn.dataset.add);
  });

  // カートドロワー
  $("#cartBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#drawerOverlay").addEventListener("click", closeDrawer);
  $("#cartItems").addEventListener("click", e => {
    if (e.target.dataset.plus)   changeQty(+e.target.dataset.plus, +1);
    if (e.target.dataset.minus)  changeQty(+e.target.dataset.minus, -1);
    if (e.target.dataset.remove) removeItem(+e.target.dataset.remove);
  });
  $("#checkoutBtn").addEventListener("click", () => {
    if (cartCount() === 0) { showToast("カートが空です"); return; }
    showToast(`寄付申込みありがとうございます（合計 ${yen(cartTotal())}・デモ）`);
    cart = {}; updateCart(); closeDrawer();
  });

  // シミュレーター
  $("#simulateBtn").addEventListener("click", simulate);

  // ロゴ → トップ
  $("#homeLink").addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Escでドロワーを閉じる
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
}

document.addEventListener("DOMContentLoaded", init);
