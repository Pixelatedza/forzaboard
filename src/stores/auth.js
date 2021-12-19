import { writable } from 'svelte/store';
import {
  defaultHeaders,
  parseJwt,
} from 'common';
import {refreshToken} from 'api';

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
let refreshTimeout;

export const auth = writable(initialAuth);

auth.subscribe(newAuth => {
  localStorage.setItem('user', JSON.stringify(newAuth));
  newAuth.access
    ? defaultHeaders['Authorization'] = `Bearer ${newAuth.access}`
    : delete defaultHeaders['Authorization'];
  clearTimeout(refreshTimeout);

  if (newAuth.access) {
    const exp = parseJwt(newAuth.access).exp;
    const expDate = new Date((exp - 60) * 1000) // exp date - 1 minutes;
    const timeToRefresh = expDate - new Date();
    refreshTimeout = setTimeout(() => {
      refreshToken({refresh: newAuth.refresh})
        .then(res => {
          if (!res.ok) {
            auth.logout();
            return;
          }

          auth.setAuth({
            access: res.body.access,
            refresh: newAuth.refresh,
          })
        });
    }, timeToRefresh);
  }
});

auth.setAuth = (newAuth) => {
  const claims = parseJwt(newAuth.access);
  auth.set({
    access: newAuth.access,
    refresh: newAuth.refresh,
    permissions: new Set(claims.permissions),
    isStaff: claims.isStaff,
    isSuperuser: claims.isSuperuser,
    lastLogin: claims.lastLogin,
    userId: claims.user_id
  })
};

auth.logout = () => {
  auth.set(defaultAuth);
}
