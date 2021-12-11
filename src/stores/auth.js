import { writable } from 'svelte/store';

const parseStoredAuth = (storedAuth) => {
  try {
    return JSON.parse(storedAuth);
  } catch (e) {
    return null;
  }
}

const defaultAuth = {
  access: null,
  refresh: null,
  info: {},
};
const storedAuth = parseStoredAuth(localStorage.getItem('user'));
const initialAuth = storedAuth || defaultAuth;

export const auth = writable(initialAuth);

auth.subscribe(newAuth => {
  localStorage.setItem('user', JSON.stringify(newAuth));
});

auth.logout = () => {
  auth.set(defaultAuth);
}
