// affiliates.js
export const STORAGE_KEY_AFFILIATES = 'reportar_ventas_affiliates';

export let affiliates = [];

export function loadAffiliates() {
  const data = localStorage.getItem(STORAGE_KEY_AFFILIATES);
  if (data) {
    try {
      affiliates = JSON.parse(data);
    } catch {
      affiliates = [];
    }
  } else {
    affiliates = [];
  }
}

export function saveAffiliates() {
  localStorage.setItem(STORAGE_KEY_AFFILIATES, JSON.stringify(affiliates));
}

export function addAffiliate(affiliate) {
  affiliates.push(affiliate);
  saveAffiliates();
}

export function updateAffiliate(id, newData) {
  const index = affiliates.findIndex(a => a.id === id);
  if (index !== -1) {
    affiliates[index] = {...affiliates[index], ...newData};
    saveAffiliates();
  }
}

export function deleteAffiliate(id) {
  affiliates = affiliates.filter(a => a.id !== id);
  saveAffiliates();
}

export function getAffiliateById(id) {
  return affiliates.find(a => a.id === id);
}

export function getAffiliates() {
  return affiliates;
}
