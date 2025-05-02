import { sellers, getSellers } from './sellers.js';
import { affiliates, getAffiliates } from './affiliates.js';
import { products, getProducts, filterProductsBySeller } from './products.js';
import { sales, getSales, addSale, updateSale, deleteSale } from './sales.js';

export function fillSellers() {
  const vendedorInput = document.getElementById('vendedor');
  const suggestions = document.getElementById('vendedor-suggestions');
  suggestions.innerHTML = '';
  const combined = [...getSellers(), ...getAffiliates()];
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

export function getSelectedSellerId() {
  const vendedorInput = document.getElementById('vendedor');
  const name = vendedorInput.value.trim().toLowerCase();
  const person = [...getSellers(), ...getAffiliates()].find((s) => s.name.toLowerCase() === name);
  if (person) {
    vendedorInput.dataset.selectedId = person.id;
    return person.id;
  }
  vendedorInput.dataset.selectedId = '';
  return null;
}

export function fillProducts(productsList) {
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

export function updatePrecioVenta() {
  const productoBuscarInput = document.getElementById('producto-buscar');
  const selectedId = productoBuscarInput.dataset.selectedId;
  const product = getProducts().find((p) => p.id === selectedId);
  if (product) {
    document.getElementById('precio').value = product.salePrice.toFixed(2);
  } else {
    document.getElementById('precio').value = '';
  }
}

export function setFechaHoy() {
  const fechaInput = document.getElementById('fecha');
  const today = new Date().toISOString().split('T')[0];
  fechaInput.value = today;
}

export function initTabs() {
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

export function setupVendedorInputListener(filterProductsBySeller) {
  const vendedorInput = document.getElementById('vendedor');
  const suggestions = document.getElementById('vendedor-suggestions');

  vendedorInput.addEventListener('input', () => {
    const sellerId = getSelectedSellerId();
    if (sellerId) {
      fillProducts(filterProductsBySeller(sellerId));
    } else {
      fillProducts([]);
    }
  });
}

export function removeProductSelect() {
  const productoSelect = document.getElementById('producto');
  if (productoSelect) {
    productoSelect.parentNode.removeChild(productoSelect);
  }
}

export function initEventListeners() {
  // Prevent form submissions from reloading the page and handle data saving

  // Reportar ventas form
  const formReportar = document.getElementById('form-reportar');
  formReportar.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement logic to save the sale
    const mensaje = document.getElementById('mensaje-reportar');
    mensaje.textContent = 'Venta reportada correctamente.';
    formReportar.reset();
    setFechaHoy();
  });

  // Inventario form
  const formProducto = document.getElementById('form-producto');
  formProducto.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement logic to save the product
    alert('Producto guardado correctamente.');
    formProducto.reset();
  });

  // Proveedores form
  const formProveedor = document.getElementById('form-proveedor');
  formProveedor.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement logic to save the provider
    alert('Proveedor guardado correctamente.');
    formProveedor.reset();
  });

  // Afiliados form
  const formAfiliado = document.getElementById('form-afiliado');
  formAfiliado.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement logic to save the affiliate
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
