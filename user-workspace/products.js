// products.js
export const STORAGE_KEY_PRODUCTS = 'reportar_ventas_products';

export let products = [];

export function loadProducts() {
  const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (data) {
    try {
      products = JSON.parse(data);
    } catch {
      products = [];
    }
  } else {
    products = [];
  }
}

export function saveProducts() {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

export function addProduct(product) {
  products.push(product);
  saveProducts();
}

export function updateProduct(id, newData) {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {...products[index], ...newData};
    saveProducts();
  }
}

export function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts();
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProducts() {
  return products;
}

export function filterProductsBySeller(sellerId) {
  if (sellerId === 'godsplan') {
    return products.filter((p) => !p.name.startsWith('AF-'));
  } else {
    return products.filter((p) => p.name.startsWith('AF-'));
  }
}
