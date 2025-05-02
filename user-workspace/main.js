import { loadSellers, sellers } from './sellers.js';
import { loadAffiliates, affiliates } from './affiliates.js';
import { loadProducts, products } from './products.js';
import { loadSales, sales } from './sales.js';
import { fillSellers, getSelectedSellerId, fillProducts, updatePrecioVenta, setFechaHoy, initTabs, setupVendedorInputListener, removeProductSelect, initEventListeners } from './ui.js';

// Helper function filterProductsBySeller
function filterProductsBySeller(sellerId) {
  if (sellerId === 'godsplan') {
    return products.filter((p) => !p.name.startsWith('AF-'));
  } else {
    return products.filter((p) => p.name.startsWith('AF-'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load all data
  loadSellers();
  loadAffiliates();
  loadProducts();
  loadSales();

  // Initialize UI
  fillSellers();
  const vendedorId = getSelectedSellerId();
  fillProducts(vendedorId ? filterProductsBySeller(vendedorId) : []);
  setFechaHoy();
  initTabs();
  setupVendedorInputListener(filterProductsBySeller);
  removeProductSelect();
  initEventListeners();
});
