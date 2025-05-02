// sales.js
export const STORAGE_KEY_SALES = 'reportar_ventas_sales';

export let sales = [];

export function loadSales() {
  const data = localStorage.getItem(STORAGE_KEY_SALES);
  if (data) {
    try {
      sales = JSON.parse(data);
    } catch {
      sales = [];
    }
  } else {
    sales = [];
  }
}

export function saveSales() {
  localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
}

export function addSale(sale) {
  sales.push(sale);
  saveSales();
}

export function updateSale(id, newData) {
  const index = sales.findIndex(s => s.id === id);
  if (index !== -1) {
    sales[index] = {...sales[index], ...newData};
    saveSales();
  }
}

export function deleteSale(id) {
  sales = sales.filter(s => s.id !== id);
  saveSales();
}

export function getSaleById(id) {
  return sales.find(s => s.id === id);
}

export function getSales() {
  return sales;
}
