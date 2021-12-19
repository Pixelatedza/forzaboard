import {writable} from 'svelte/store';

export const menuItems = writable({});

menuItems.subscribe(items => {
  console.log(items);
  // return items;
})

menuItems.register = (name, config) => {
  menuItems.update(items => {
    console.log(name, config, items);
    if (items[name]) {
      console.warn(`Menu with name ${name} already exists.`)
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
