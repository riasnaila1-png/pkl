const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const categories = ["Semua", "Paket", "Lauk", "Sayur", "Sambal", "Minuman", "Tambahan"];
const orderStatuses = [
  "Menunggu konfirmasi",
  "Diterima",
  "Sedang disiapkan",
  "Siap diambil",
  "Dalam pengiriman",
  "Selesai",
  "Dibatalkan",
];

const defaultMenus = [
  {
    id: "paket-rendang",
    name: "Paket Rendang Komplit",
    category: "Paket",
    description: "Nasi, rendang sapi, daun singkong, sambal hijau, dan kuah gulai.",
    price: 32000,
    stock: 12,
    available: true,
    color: "linear-gradient(135deg, #7c2f24, #d49a2a)",
    image: "assets/paket-rendang.svg",
  },
  {
    id: "paket-ayam-pop",
    name: "Paket Ayam Pop",
    category: "Paket",
    description: "Ayam pop lembut dengan nasi, sayur, sambal merah, dan kuah.",
    price: 28000,
    stock: 10,
    available: true,
    color: "linear-gradient(135deg, #d9b56d, #426b8f)",
    image: "assets/paket-ayam-pop.svg",
  },
  {
    id: "rendang",
    name: "Rendang Sapi",
    category: "Lauk",
    description: "Potongan daging sapi berbumbu pekat, dimasak lama sampai empuk.",
    price: 21000,
    stock: 8,
    available: true,
    color: "linear-gradient(135deg, #4d261f, #b83228)",
    image: "assets/rendang.svg",
  },
  {
    id: "ayam-bakar",
    name: "Ayam Bakar Padang",
    category: "Lauk",
    description: "Ayam berbumbu santan, dibakar harum, cocok dengan sambal hijau.",
    price: 19000,
    stock: 10,
    available: true,
    color: "linear-gradient(135deg, #9f4a22, #287347)",
    image: "assets/ayam-bakar.svg",
  },
  {
    id: "gulai-kikil",
    name: "Gulai Kikil",
    category: "Lauk",
    description: "Kikil kenyal dalam kuah gulai kuning yang gurih.",
    price: 22000,
    stock: 0,
    available: false,
    color: "linear-gradient(135deg, #d49a2a, #6f7f35)",
    image: "assets/gulai-kikil.svg",
  },
  {
    id: "daun-singkong",
    name: "Daun Singkong",
    category: "Sayur",
    description: "Rebusan daun singkong segar untuk pelengkap lauk.",
    price: 7000,
    stock: 15,
    available: true,
    color: "linear-gradient(135deg, #287347, #89a84f)",
    image: "assets/daun-singkong.svg",
  },
  {
    id: "sambal-hijau",
    name: "Sambal Hijau",
    category: "Sambal",
    description: "Sambal cabai hijau khas Padang dengan rasa segar dan gurih.",
    price: 4000,
    stock: 20,
    available: true,
    color: "linear-gradient(135deg, #1e5837, #7da94b)",
    image: "assets/sambal-hijau.svg",
  },
  {
    id: "es-teh",
    name: "Es Teh Manis",
    category: "Minuman",
    description: "Teh manis dingin untuk menyeimbangkan rasa pedas.",
    price: 6000,
    stock: 18,
    available: true,
    color: "linear-gradient(135deg, #b86828, #426b8f)",
    image: "assets/es-teh.svg",
  },
  {
    id: "nasi-tambah",
    name: "Nasi Tambah",
    category: "Tambahan",
    description: "Tambahan nasi putih hangat.",
    price: 6000,
    stock: 20,
    available: true,
    color: "linear-gradient(135deg, #f7f1df, #d49a2a)",
    image: "assets/nasi-tambah.svg",
  },
];

const state = {
  menus: normalizeMenus(load("padang_menus", defaultMenus)),
  cart: load("padang_cart", []),
  orders: load("padang_orders", []),
  selectedCategory: "Semua",
  selectedMenu: null,
};

save("padang_menus", state.menus);

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  categoryFilters: document.querySelector("#categoryFilters"),
  menuGrid: document.querySelector("#menuGrid"),
  searchMenu: document.querySelector("#searchMenu"),
  cartItems: document.querySelector("#cartItems"),
  cartCount: document.querySelector("#cartCount"),
  clearCartBtn: document.querySelector("#clearCartBtn"),
  checkoutForm: document.querySelector("#checkoutForm"),
  addressField: document.querySelector("#addressField"),
  subtotalText: document.querySelector("#subtotalText"),
  shippingText: document.querySelector("#shippingText"),
  totalText: document.querySelector("#totalText"),
  salesSummary: document.querySelector("#salesSummary"),
  orderList: document.querySelector("#orderList"),
  adminOrders: document.querySelector("#adminOrders"),
  reportStats: document.querySelector("#reportStats"),
  stockList: document.querySelector("#stockList"),
  itemDialog: document.querySelector("#itemDialog"),
  itemForm: document.querySelector("#itemForm"),
  dialogCategory: document.querySelector("#dialogCategory"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogDescription: document.querySelector("#dialogDescription"),
  dialogPreview: document.querySelector("#dialogPreview"),
  riceOption: document.querySelector("#riceOption"),
  sambalOption: document.querySelector("#sambalOption"),
  gravyOption: document.querySelector("#gravyOption"),
  itemQty: document.querySelector("#itemQty"),
  itemNote: document.querySelector("#itemNote"),
  addItemBtn: document.querySelector("#addItemBtn"),
  toast: document.querySelector("#toast"),
};

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeMenus(menus) {
  return menus.map((menu) => {
    const fresh = defaultMenus.find((item) => item.id === menu.id);
    const normalized = fresh ? { ...fresh, ...menu, image: fresh.image, color: fresh.color } : menu;
    const stock = Number.isFinite(Number(normalized.stock))
      ? Math.max(0, Number(normalized.stock))
      : normalized.available
        ? 10
        : 0;
    return { ...normalized, stock, available: stock > 0 && normalized.available !== false };
  });
}

function money(value) {
  return currency.format(value);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function init() {
  bindNavigation();
  bindCheckout();
  renderAll();
}

function bindNavigation() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      els.tabs.forEach((item) => item.classList.remove("active"));
      els.views.forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.view}View`).classList.add("active");
      renderAll();
    });
  });

  els.searchMenu.addEventListener("input", renderMenu);
  els.clearCartBtn.addEventListener("click", () => {
    state.cart = [];
    save("padang_cart", state.cart);
    renderCart();
    showToast("Keranjang dikosongkan.");
  });

  document.querySelectorAll("input[name='fulfillment']").forEach((radio) => {
    radio.addEventListener("change", renderCart);
  });

  els.itemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addConfiguredItem();
  });

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => els.itemDialog.close());
  });
}

function bindCheckout() {
  els.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.cart.length) {
      showToast("Tambahkan menu ke keranjang dulu.");
      return;
    }

    const fulfillment = getFulfillment();
    const address = document.querySelector("#deliveryAddress").value.trim();
    if (fulfillment === "Delivery" && !address) {
      showToast("Alamat pengiriman wajib diisi.");
      return;
    }

    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: document.querySelector("#customerName").value.trim(),
      phone: document.querySelector("#customerPhone").value.trim(),
      fulfillment,
      payment: document.querySelector("#paymentMethod").value,
      note: document.querySelector("#orderNote").value.trim(),
      address,
      status: "Menunggu konfirmasi",
      items: state.cart,
      subtotal: getSubtotal(),
      shipping: getShipping(),
      total: getSubtotal() + getShipping(),
      createdAt: new Date().toISOString(),
    };

    const stockIssue = getStockIssue(order.items);
    if (stockIssue) {
      showToast(`${stockIssue.name} hanya tersisa ${stockIssue.stock} porsi.`);
      renderAll();
      return;
    }

    reduceStock(order.items);
    state.orders.unshift(order);
    state.cart = [];
    save("padang_orders", state.orders);
    save("padang_cart", state.cart);
    els.checkoutForm.reset();
    document.querySelector("#customerName").value = "Afrianto";
    document.querySelector("#customerPhone").value = "081234567890";
    renderAll();
    showToast(`Pesanan ${order.id} berhasil dibuat. Pendapatan masuk ${money(order.total)}.`);
  });
}

function renderAll() {
  renderFilters();
  renderMenu();
  renderCart();
  renderOrders();
  renderAdmin();
}

function renderFilters() {
  els.categoryFilters.innerHTML = categories
    .map((category) => {
      const active = category === state.selectedCategory ? "active" : "";
      return `<button class="${active}" data-category="${category}">${category}</button>`;
    })
    .join("");

  els.categoryFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.dataset.category;
      renderFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  const query = els.searchMenu.value.trim().toLowerCase();
  const menus = state.menus.filter((menu) => {
    const categoryMatch = state.selectedCategory === "Semua" || menu.category === state.selectedCategory;
    const queryMatch = `${menu.name} ${menu.description}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });

  if (!menus.length) {
    els.menuGrid.innerHTML = `<p class="empty">Menu tidak ditemukan.</p>`;
    return;
  }

  els.menuGrid.innerHTML = menus
    .map((menu) => {
      const statusClass = menu.available ? "status" : "status danger";
      const disabled = menu.available ? "" : "disabled";
      const buttonText = menu.available ? "Tambah" : "Habis";
      return `
        <article class="menu-card">
          <div class="food-image">
            <img src="${menu.image}" alt="${menu.name}" loading="lazy" />
            <span>${menu.category}</span>
          </div>
          <div class="menu-card-body">
            <div class="price-row">
              <span class="${statusClass}">${menu.available ? `Stok ${menu.stock}` : "Habis"}</span>
              <span class="price">${money(menu.price)}</span>
            </div>
            <h3>${menu.name}</h3>
            <p>${menu.description}</p>
            <button class="primary-btn" data-menu="${menu.id}" ${disabled}>${buttonText}</button>
          </div>
        </article>
      `;
    })
    .join("");

  els.menuGrid.querySelectorAll("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => openItemDialog(button.dataset.menu));
  });
}

function openItemDialog(menuId) {
  const menu = state.menus.find((item) => item.id === menuId);
  if (!menu || !menu.available) return;
  state.selectedMenu = menu;
  els.dialogCategory.textContent = menu.category;
  els.dialogTitle.textContent = menu.name;
  els.dialogDescription.textContent = `${money(menu.price)} - ${menu.description}`;
  els.dialogPreview.style.setProperty("--image-color", menu.color);
  els.dialogPreview.innerHTML = `<img src="${menu.image}" alt="${menu.name}" />`;
  els.riceOption.value = "Normal";
  els.sambalOption.value = "Hijau";
  els.gravyOption.value = "Normal";
  els.itemQty.value = 1;
  els.itemQty.max = menu.stock;
  els.itemNote.value = "";
  els.itemDialog.showModal();
}

function addConfiguredItem() {
  const menu = state.selectedMenu;
  if (!menu) return;

  const qty = Math.max(1, Number(els.itemQty.value || 1));
  if (qty > menu.stock) {
    showToast(`${menu.name} hanya tersisa ${menu.stock} porsi.`);
    return;
  }

  const item = {
    uid: `${menu.id}-${Date.now()}`,
    menuId: menu.id,
    name: menu.name,
    category: menu.category,
    price: menu.price,
    quantity: qty,
    rice: els.riceOption.value,
    sambal: els.sambalOption.value,
    gravy: els.gravyOption.value,
    note: els.itemNote.value.trim(),
  };

  state.cart.push(item);
  save("padang_cart", state.cart);
  els.itemDialog.close();
  renderCart();
  showToast(`${menu.name} ditambahkan ke keranjang.`);
}

function getSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getFulfillment() {
  return document.querySelector("input[name='fulfillment']:checked").value;
}

function getShipping() {
  return getFulfillment() === "Delivery" && state.cart.length ? 8000 : 0;
}

function renderCart() {
  const fulfillment = getFulfillment();
  els.addressField.classList.toggle("hidden", fulfillment !== "Delivery");
  els.cartCount.textContent = state.cart.length
    ? `${state.cart.reduce((sum, item) => sum + item.quantity, 0)} item dipilih`
    : "Belum ada item";

  if (!state.cart.length) {
    els.cartItems.innerHTML = `<p class="empty">Keranjang masih kosong.</p>`;
  } else {
    els.cartItems.innerHTML = state.cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-row">
              <strong>${item.name}</strong>
              <span>${money(item.price * item.quantity)}</span>
            </div>
            <p>${item.rice}, sambal ${item.sambal.toLowerCase()}, kuah ${item.gravy.toLowerCase()}</p>
            ${item.note ? `<p>Catatan: ${item.note}</p>` : ""}
            <div class="cart-row">
              <div class="qty-controls">
                <button type="button" data-dec="${item.uid}">-</button>
                <strong>${item.quantity}</strong>
                <button type="button" data-inc="${item.uid}">+</button>
              </div>
              <button type="button" data-remove="${item.uid}">Hapus</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  els.subtotalText.textContent = money(getSubtotal());
  els.shippingText.textContent = money(getShipping());
  els.totalText.textContent = money(getSubtotal() + getShipping());

  els.cartItems.querySelectorAll("[data-inc]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.inc, 1));
  });
  els.cartItems.querySelectorAll("[data-dec]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.dec, -1));
  });
  els.cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeCartItem(button.dataset.remove));
  });
}

function updateQuantity(uid, delta) {
  const currentItem = state.cart.find((item) => item.uid === uid);
  const menu = state.menus.find((item) => item.id === currentItem?.menuId);
  if (delta > 0 && menu && currentItem.quantity >= menu.stock) {
    showToast(`${menu.name} hanya tersisa ${menu.stock} porsi.`);
    return;
  }

  state.cart = state.cart
    .map((item) => (item.uid === uid ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
  save("padang_cart", state.cart);
  renderCart();
}

function removeCartItem(uid) {
  state.cart = state.cart.filter((item) => item.uid !== uid);
  save("padang_cart", state.cart);
  renderCart();
}

function renderOrders() {
  renderSalesSummary();

  if (!state.orders.length) {
    els.orderList.innerHTML = `<article class="order-card"><p>Belum ada pesanan.</p></article>`;
    return;
  }

  els.orderList.innerHTML = state.orders.map(orderTemplate).join("");
  els.orderList.querySelectorAll("[data-reorder]").forEach((button) => {
    button.addEventListener("click", () => reorder(button.dataset.reorder));
  });
}

function renderSalesSummary() {
  const activeOrders = state.orders.filter((order) => order.status !== "Dibatalkan");
  const completedOrders = state.orders.filter((order) => order.status === "Selesai");
  const income = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const completedIncome = completedOrders.reduce((sum, order) => sum + order.total, 0);

  els.salesSummary.innerHTML = `
    <div>
      <span class="label">Pendapatan masuk</span>
      <strong>${money(income)}</strong>
    </div>
    <div>
      <span class="label">Pesanan berhasil</span>
      <strong>${activeOrders.length}</strong>
    </div>
    <div>
      <span class="label">Pendapatan selesai</span>
      <strong>${money(completedIncome)}</strong>
    </div>
  `;
}

function orderTemplate(order, admin = false) {
  const statusClass = order.status === "Dibatalkan" ? "status danger" : order.status === "Selesai" ? "status" : "status warning";
  const date = new Date(order.createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const actionButtons = admin
    ? statusButtons(order)
    : `<button type="button" data-reorder="${order.id}">Pesan ulang</button>`;

  return `
    <article class="order-card">
      <div class="price-row">
        <div>
          <h3>${order.id}</h3>
          <p>${order.customer} - ${date}</p>
        </div>
        <span class="${statusClass}">${order.status}</span>
      </div>
      <div class="order-meta">
        <span>${order.fulfillment}</span>
        <span>${order.payment}</span>
        <span>${money(order.total)}</span>
      </div>
      <ul class="order-items">
        ${order.items.map((item) => `<li>${item.quantity}x ${item.name} (${item.rice}, sambal ${item.sambal})</li>`).join("")}
      </ul>
      ${order.note ? `<p>Catatan: ${order.note}</p>` : ""}
      ${order.address ? `<p>Alamat: ${order.address}</p>` : ""}
      <div class="order-actions">${actionButtons}</div>
    </article>
  `;
}

function statusButtons(order) {
  return orderStatuses
    .filter((status) => status !== order.status)
    .map((status) => `<button type="button" data-status="${status}" data-order="${order.id}">${status}</button>`)
    .join("");
}

function reorder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  state.cart = order.items.map((item) => ({ ...item, uid: `${item.menuId}-${Date.now()}-${Math.random()}` }));
  save("padang_cart", state.cart);
  renderCart();
  switchView("customer");
  showToast(`Item dari ${order.id} masuk ke keranjang.`);
}

function switchView(viewName) {
  const tab = [...els.tabs].find((item) => item.dataset.view === viewName);
  tab?.click();
}

function renderAdmin() {
  renderAdminOrders();
  renderReport();
  renderStock();
}

function renderAdminOrders() {
  if (!state.orders.length) {
    els.adminOrders.innerHTML = `<article class="order-card"><p>Belum ada pesanan masuk.</p></article>`;
    return;
  }

  els.adminOrders.innerHTML = state.orders.map((order) => orderTemplate(order, true)).join("");
  els.adminOrders.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => updateOrderStatus(button.dataset.order, button.dataset.status));
  });
}

function updateOrderStatus(orderId, status) {
  state.orders = state.orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  save("padang_orders", state.orders);
  renderAll();
  showToast(`Status ${orderId} menjadi ${status}.`);
}

function renderReport() {
  const completed = state.orders.filter((order) => order.status === "Selesai");
  const activeOrders = state.orders.filter((order) => order.status !== "Dibatalkan");
  const income = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  const canceled = state.orders.filter((order) => order.status === "Dibatalkan").length;
  const bestSeller = getBestSeller();

  els.reportStats.innerHTML = `
    <div class="stat-row"><span>Total pesanan</span><strong>${state.orders.length}</strong></div>
    <div class="stat-row"><span>Pendapatan masuk</span><strong>${money(income)}</strong></div>
    <div class="stat-row"><span>Pesanan selesai</span><strong>${completed.length}</strong></div>
    <div class="stat-row"><span>Dibatalkan</span><strong>${canceled}</strong></div>
    <div class="stat-row"><span>Pendapatan selesai</span><strong>${money(revenue)}</strong></div>
    <div class="stat-row"><span>Menu terlaris</span><strong>${bestSeller}</strong></div>
  `;
}

function getBestSeller() {
  const counter = new Map();
  state.orders
    .filter((order) => order.status !== "Dibatalkan")
    .flatMap((order) => order.items)
    .forEach((item) => counter.set(item.name, (counter.get(item.name) || 0) + item.quantity));

  const sorted = [...counter.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : "-";
}

function renderStock() {
  els.stockList.innerHTML = state.menus
    .map(
      (menu) => `
        <div class="stock-row">
          <div>
            <strong>${menu.name}</strong>
            <span>${menu.category} - ${money(menu.price)} - Stok ${menu.stock}</span>
          </div>
          <form class="stock-form" data-stock-form="${menu.id}">
            <input type="number" min="1" value="1" aria-label="Jumlah stok ${menu.name}" />
            <button type="submit">Tambah</button>
          </form>
          <button type="button" data-stock="${menu.id}">
            ${menu.available ? "Tandai habis" : "Tandai tersedia"}
          </button>
        </div>
      `
    )
    .join("");

  els.stockList.querySelectorAll("[data-stock-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      addStock(form.dataset.stockForm, Number(input.value || 0));
      input.value = 1;
    });
  });

  els.stockList.querySelectorAll("[data-stock]").forEach((button) => {
    button.addEventListener("click", () => toggleStock(button.dataset.stock));
  });
}

function toggleStock(menuId) {
  state.menus = state.menus.map((menu) => {
    if (menu.id !== menuId) return menu;
    const nextAvailable = !menu.available;
    const nextStock = nextAvailable && menu.stock === 0 ? 1 : menu.stock;
    return {
      ...menu,
      stock: nextStock,
      available: nextAvailable && nextStock > 0,
    };
  });
  save("padang_menus", state.menus);
  renderAll();
  showToast("Status stok diperbarui.");
}

function addStock(menuId, amount) {
  const addedStock = Math.max(1, Math.floor(amount));
  state.menus = state.menus.map((menu) =>
    menu.id === menuId ? { ...menu, stock: menu.stock + addedStock, available: true } : menu
  );
  save("padang_menus", state.menus);
  renderAll();
  showToast(`Stok ditambah ${addedStock} porsi.`);
}

function getStockIssue(items) {
  const requested = new Map();
  items.forEach((item) => requested.set(item.menuId, (requested.get(item.menuId) || 0) + item.quantity));

  for (const [menuId, quantity] of requested.entries()) {
    const menu = state.menus.find((item) => item.id === menuId);
    if (!menu || !menu.available || quantity > menu.stock) {
      return { name: menu?.name || "Menu", stock: menu?.stock || 0 };
    }
  }

  return null;
}

function reduceStock(items) {
  const ordered = new Map();
  items.forEach((item) => ordered.set(item.menuId, (ordered.get(item.menuId) || 0) + item.quantity));

  state.menus = state.menus.map((menu) => {
    const remaining = Math.max(0, menu.stock - (ordered.get(menu.id) || 0));
    return { ...menu, stock: remaining, available: remaining > 0 };
  });
  save("padang_menus", state.menus);
}

init();
