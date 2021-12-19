import {writable} from 'svelte/store';

export const menuItems = writable({});

menuItems.register = (name, config) => {
  menuItems.update(items => {
    if (items[name]) {
      return items;
    }

    items[name] = config;
    return items;
  })
};

menuItems.unregister = (name) => {
  menuItems.update(items => {
    delete items[name];
    return items;
  })
};
