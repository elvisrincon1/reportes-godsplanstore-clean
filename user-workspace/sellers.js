// sellers.js
export const STORAGE_KEY_SELLERS = 'reportar_ventas_sellers';

export let sellers = [];

export function loadSellers() {
  const data = localStorage.getItem(STORAGE_KEY_SELLERS);
  if (data) {
    try {
      sellers = JSON.parse(data);
    } catch {
      sellers = [];
    }
  } else {
    sellers = [];
  }
}

export function saveSellers() {
  localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(sellers));
}

export function addSeller(seller) {
  // Prevent adding duplicate seller by name (case-insensitive)
  const exists = sellers.some(s => s.name.toLowerCase() === seller.name.toLowerCase());
  if (exists) {
    throw new Error('Seller with this name already exists');
  }
  sellers.push(seller);
  saveSellers();
}

export function updateSeller(id, newData) {
  const index = sellers.findIndex(s => s.id === id);
  if (index !== -1) {
    sellers[index] = {...sellers[index], ...newData};
    saveSellers();
  }
}

export function deleteSeller(id) {
  sellers = sellers.filter(s => s.id !== id);
  saveSellers();
}

export function getSellerById(id) {
  return sellers.find(s => s.id === id);
}

export function getSellers() {
  return sellers;
}
