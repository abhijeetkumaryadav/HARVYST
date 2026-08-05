import { defaultProducts } from '../data/products';

const STORAGE_KEY = 'harvyst_products';

export const getProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
};

export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};