// Combined full code for the Reportar Ventas app in one file for review and correction

// Data storage keys and data arrays
const STORAGE_KEY_SELLERS = 'reportar_ventas_sellers';
const STORAGE_KEY_AFFILIATES = 'reportar_ventas_affiliates';
const STORAGE_KEY_PRODUCTS = 'reportar_ventas_products';
const STORAGE_KEY_SALES = 'reportar_ventas_sales';

let sellers = [];
let affiliates = [];
let products = [];
let sales = [];

// Load and save functions for each data type
function loadData(key) {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadSellers() {
  sellers = loadData(STORAGE_KEY_SELLERS);
}

function saveSellers() {
  saveData(STORAGE_KEY_SELLERS, sellers);
}

function loadAffiliates() {
  affiliates = loadData(STORAGE_KEY_AFFILIATES);
}

function saveAffiliates() {
  saveData(STORAGE_KEY_AFFILIATES, affiliates);
}

function loadProducts() {
  products = loadData(STORAGE_KEY_PRODUCTS);
}

function saveProducts() {
  saveData(STORAGE_KEY_PRODUCTS, products);
}

function loadSales() {
  sales = loadData(STORAGE_KEY_SALES);
}

function saveSales() {
  saveData(STORAGE_KEY_SALES, sales);
}

// Filter products by seller id
function filterProductsBySeller(sellerId) {
  if (sellerId === 'godsplan') {
    return products.filter((p) => !p.name.startsWith('AF-'));
  } else {
    return products.filter((p) => p.name.startsWith('AF-'));
  }
}

// UI functions

function fillSellers() {
  const vendedorInput = document.getElementById('vendedor');
  const suggestions = document.getElementById('vendedor-suggestions');
  suggestions.innerHTML = '';
  const combined = [...sellers, ...affiliates];
  const sortedCombined = combined.sort((a, b) => {
    if (a.name === 'GODSPLAN') return -1;
    if (b.name === 'GODSPLAN') return 1;
    return a.name.localeCompare(b.name);
  });
  sortedCombined.forEach((person) => {
    const li = document.createElement('li');
    li.textContent = person.name;
    li.dataset.id = person.id;
    li.classList.add('cursor-pointer', 'px-2', 'py-1', 'hover:bg-blue-100');
    suggestions.appendChild(li);
  });

  vendedorInput.addEventListener('input', () => {
    const value = vendedorInput.value.toLowerCase();
    const items = suggestions.querySelectorAll('li');
    let visibleCount = 0;
    items.forEach((item) => {
      if (item.textContent.toLowerCase().includes(value)) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });
    suggestions.classList.toggle('hidden', visibleCount === 0);
  });

  vendedorInput.addEventListener('focus', () => {
    suggestions.classList.remove('hidden');
  });

  vendedorInput.addEventListener('blur', () => {
    setTimeout(() => {
      suggestions.classList.add('hidden');
    }, 200);
  });

  suggestions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      vendedorInput.value = e.target.textContent.trim();
      vendedorInput.dataset.selectedId = e.target.dataset.id;
      suggestions.classList.add('hidden');
      fillProducts(filterProductsBySeller(e.target.dataset.id));
    }
  });

  vendedorInput.addEventListener('input', () => {
    vendedorInput.dataset.selectedId = '';
  });
}

function getSelectedSellerId() {
  const vendedorInput = document.getElementById('vendedor');
  const name = vendedorInput.value.trim().toLowerCase();
  const person = [...sellers, ...affiliates].find((s) => s.name.toLowerCase() === name);
  if (person) {
    vendedorInput.dataset.selectedId = person.id;
    return person.id;
  }
  vendedorInput.dataset.selectedId = '';
  return null;
}

function fillProducts(productsList) {
  const productoBuscarInput = document.getElementById('producto-buscar');
  const suggestions = document.getElementById('producto-suggestions');
  suggestions.innerHTML = '';
  productsList.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = product.name;
    li.dataset.id = product.id;
    li.dataset.price = product.salePrice;
    li.classList.add('cursor-pointer', 'px-2', 'py-1', 'hover:bg-blue-100');
    suggestions.appendChild(li);
  });

  productoBuscarInput.addEventListener('input', () => {
    const value = productoBuscarInput.value.toLowerCase();
    const items = suggestions.querySelectorAll('li');
    let visibleCount = 0;
    items.forEach((item) => {
      if (item.textContent.toLowerCase().includes(value)) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });
    suggestions.classList.toggle('hidden', visibleCount === 0);
  });

  suggestions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      productoBuscarInput.value = e.target.textContent.trim();
      productoBuscarInput.dataset.selectedId = e.target.dataset.id;
      document.getElementById('precio').value = parseFloat(e.target.dataset.price).toFixed(2);
      suggestions.classList.add('hidden');
    }
  });

  productoBuscarInput.addEventListener('input', () => {
    productoBuscarInput.dataset.selectedId = '';
    document.getElementById('precio').value = '';
  });
}

function updatePrecioVenta() {
  const productoBuscarInput = document.getElementById('producto-buscar');
  const selectedId = productoBuscarInput.dataset.selectedId;
  const product = products.find((p) => p.id === selectedId);
  if (product) {
    document.getElementById('precio').value = product.salePrice.toFixed(2);
  } else {
    document.getElementById('precio').value = '';
  }
}

function setFechaHoy() {
  const fechaInput = document.getElementById('fecha');
  const today = new Date().toISOString().split('T')[0];
  fechaInput.value = today;
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => b.classList.remove('bg-blue-100', 'text-blue-700'));
      btn.classList.add('bg-blue-100', 'text-blue-700');
      tabContents.forEach((content) => {
        if (content.id === target) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  const activeBtn = document.querySelector('.tab-button.bg-blue-100');
  if (!activeBtn && tabButtons.length > 0) {
    tabButtons[0].classList.add('bg-blue-100', 'text-blue-700');
    tabContents[0].classList.remove('hidden');
  }
}

function initEventListeners() {
  // Prevent form submissions from reloading the page and handle data saving

  // Reportar ventas form
  const formReportar = document.getElementById('form-reportar');
  formReportar.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save sale data
    const vendedorId = getSelectedSellerId();
    const productoBuscarInput = document.getElementById('producto-buscar');
    const productoId = productoBuscarInput.dataset.selectedId;
    const precio = parseFloat(document.getElementById('precio').value);
    const fecha = document.getElementById('fecha').value;

    if (!vendedorId) {
      alert('Por favor, seleccione un vendedor válido.');
      return;
    }
    if (!productoId) {
      alert('Por favor, seleccione un producto válido.');
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      alert('Por favor, ingrese un precio válido.');
      return;
    }
    if (!fecha) {
      alert('Por favor, seleccione una fecha.');
      return;
    }

    sales.push({
      id: Date.now().toString(),
      sellerId: vendedorId,
      productId: productoId,
      price: precio,
      date: fecha,
    });
    saveSales();

    const mensaje = document.getElementById('mensaje-reportar');
    mensaje.textContent = 'Venta reportada correctamente.';
    formReportar.reset();
    setFechaHoy();
    fillProducts([]);
  });

  // Inventario form
  const formProducto = document.getElementById('form-producto');
  formProducto.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save product data
    const nombre = document.getElementById('producto-nombre').value.trim();
    const precioCompra = parseFloat(document.getElementById('producto-precio-compra').value);
    const precioVenta = parseFloat(document.getElementById('producto-precio-venta').value);
    const proveedoresSelect = document.getElementById('producto-proveedores');
    const proveedores = Array.from(proveedoresSelect.selectedOptions).map(opt => opt.value);

    if (!nombre) {
      alert('Por favor, ingrese el nombre del producto.');
      return;
    }
    if (isNaN(precioCompra) || precioCompra < 0) {
      alert('Por favor, ingrese un precio de compra válido.');
      return;
    }
    if (isNaN(precioVenta) || precioVenta < 0) {
      alert('Por favor, ingrese un precio de venta válido.');
      return;
    }
    if (proveedores.length > 3) {
      alert('Por favor, seleccione hasta 3 proveedores.');
      return;
    }

    products.push({
      id: Date.now().toString(),
      name: nombre,
      purchasePrice: precioCompra,
      salePrice: precioVenta,
      providers: proveedores,
    });
    saveProducts();

    alert('Producto guardado correctamente.');
    formProducto.reset();
  });

  // Proveedores form
  const formProveedor = document.getElementById('form-proveedor');
  formProveedor.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save provider data
    const nombre = document.getElementById('proveedor-nombre').value.trim();
    if (!nombre) {
      alert('Por favor, ingrese el nombre del proveedor.');
      return;
    }
    affiliates.push({
      id: Date.now().toString(),
      name: nombre,
    });
    saveAffiliates();

    alert('Proveedor guardado correctamente.');
    formProveedor.reset();
  });

  // Afiliados form
  const formAfiliado = document.getElementById('form-afiliado');
  formAfiliado.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save affiliate data
    const nombre = document.getElementById('afiliado-nombre').value.trim();
    if (!nombre) {
      alert('Por favor, ingrese el nombre del afiliado.');
      return;
    }
    affiliates.push({
      id: Date.now().toString(),
      name: nombre,
    });
    saveAffiliates();

    alert('Afiliado guardado correctamente.');
    formAfiliado.reset();
  });

  // Solicitar informes form
  const formInformes = document.getElementById('form-informes');
  formInformes.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement logic to generate report
    alert('Informe generado.');
  });
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadSellers();
  loadAffiliates();
  loadProducts();
  loadSales();

  fillSellers();
  const vendedorId = getSelectedSellerId();
  fillProducts(vendedorId ? filterProductsBySeller(vendedorId) : []);
  setFechaHoy();
  initTabs();
  initEventListeners();
});
