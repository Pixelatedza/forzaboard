import {writable} from 'svelte/store';
import {
  getBrands,
  getCars,
} from 'api';

export const brands = writable([]);
export const cars = writable([]);

getCars().then(res => {
  if (!res.ok) {
    return;
  }

  cars.set(res.body);
})

getBrands().then(res => {
  if (!res.ok) {
    return;
  }

  brands.set(res.body);
})

