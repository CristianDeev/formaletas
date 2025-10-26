/* ---------------- Datos base ---------------- */
const PRODUCTS = [
  { id: "p1", title: "Formaleta Modular 120x60", price: 480000, image: "https://via.placeholder.com/600x450?text=Formaleta+120x60", category: "modular" },
  { id: "p2", title: "Formaleta Curva 90",       price: 690000, image: "https://via.placeholder.com/600x450?text=Formaleta+Curva",   category: "curva" },
  { id: "p3", title: "Puntal Telescopico",       price: 250000, image: "https://via.placeholder.com/600x450?text=Puntal",           category: "accesorio" },
  { id: "p4", title: "Viga Aluminio 3m",         price: 410000, image: "https://via.placeholder.com/600x450?text=Viga+3m",          category: "vigas" },
  { id: "p5", title: "Viga Aluminio 4m",         price: 520000, image: "https://via.placeholder.com/600x450?text=Viga+4m",          category: "vigas" },
  { id: "p6", title: "Accesorios de Ensamble",   price:  90000, image: "https://via.placeholder.com/600x450?text=Accesorios",       category: "accesorio" }
];

const fmtCOP = n =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(n);

/* ---------------- Router (hash) ---------------- */
const routes = ["inicio", "catalogo", "nosotros"];

function setActiveLink() {
  const hash = location.hash.replace("#/", "") || "inicio";
  document.querySelectorAll(".nav-center a").forEach(a => {
    const to = a.getAttribute("href").replace("#/", "");
    a.classList.toggle("active", to === hash);
  });
}

function showRoute() {
  const current = location.hash.replace("#/", "") || "inicio";
  document.querySelectorAll("[data-route]").forEach(sec => {
    sec.hidden = sec.getAttribute("data-route") !== current;
  });
  setActiveLink();
}

window.addEventListener("hashchange", showRoute);

/* ---------------- Catálogo ---------------- */
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  // Evitar duplicar si se vuelve a llamar
  if (select.options.length <= 1) {
    const cats = ["all", ...new Set(PRODUCTS.map(p => p.category))];
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
      select.appendChild(opt);
    });
  }
}

function renderProducts(list) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:#64748b">No hay productos.</p>`;
    return;
  }
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <span class="card__meta">${p.category}</span>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span class="price">${fmtCOP(p.price)}</span>
          <button class="btn primary" data-info="${p.id}">Ver</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilters() {
  const qEl = document.getElementById("searchInput");
  const cEl = document.getElementById("categoryFilter");
  if (!qEl || !cEl) return;
  const q = qEl.value.trim().toLowerCase();
  const cat = cEl.value;
  const filtered = PRODUCTS.filter(p => {
    const byCat = cat === "all" || p.category === cat;
    const byText = p.title.toLowerCase().includes(q);
    return byCat && byText;
  });
  renderProducts(filtered);
}

/* ---------------- Eventos globales ---------------- */
document.addEventListener("click", e => {
  // Botón "Ver" (puedes cambiarlo por un modal más adelante)
  const info = e.target.closest("[data-info]");
  if (info) {
    const p = PRODUCTS.find(x => x.id === info.getAttribute("data-info"));
    if (p) {
      alert(`${p.title}\nPrecio: ${fmtCOP(p.price)}\nCategoría: ${p.category}`);
    }
  }
});

/* ---------------- Init ---------------- */
document.getElementById("year").textContent = new Date().getFullYear();

// Listeners de filtros si existen (solo en la ruta Catálogo)
const searchEl = document.getElementById("searchInput");
const categoryEl = document.getElementById("categoryFilter");
if (searchEl) searchEl.addEventListener("input", applyFilters);
if (categoryEl) categoryEl.addEventListener("change", applyFilters);

// Cargar catálogo
populateCategories();
renderProducts(PRODUCTS);
applyFilters();

// Asegurar ruta por defecto
const initial = location.hash.replace("#/", "");
if (!routes.includes(initial)) {
  location.hash = "#/inicio";
}
showRoute();
