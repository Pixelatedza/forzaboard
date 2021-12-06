export const addImage = (src, layer, options) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      let bg = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        ...options
      });

      layer.add(bg);
      resolve(bg);
    }
    image.src = src;
  })
}

export const copy = data => {

  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return [...data];
  }

  if (typeof data === 'object') {
    return { ...data };
  }

  return data;
};

export const getValueByPath = (
  obj,
  path,
  fallback,
) => {

  if (!obj || !path) {
    return fallback;
  }

  const dotIndex = path.indexOf('.');
  let key = path;
  let rest = null;

  if (dotIndex > -1) {
    key = path.substring(
      0,
      dotIndex,
    );

    rest = path.substring(
      dotIndex + 1,
      path.length,
    );
  }

  let value = obj[key];

  if (typeof value === 'object' && rest) {
    return getValueByPath(
      value,
      rest,
      fallback,
    );
  }

  if (rest) {
    return fallback;
  }

  return copy(value) || fallback;
};

export const setValueByPath = (
  obj,
  path,
  value,
) => {

  if (value === null || value === undefined || !path) {
    return;
  }

  const dotIndex = path.indexOf('.');
  let key = path;
  let rest = null;

  if (dotIndex > -1) {
    key = path.substring(
      0,
      dotIndex,
    );

    rest = path.substring(
      dotIndex + 1,
      path.length,
    );
  }

  if (rest && (typeof obj[key] !== 'object' || Array.isArray(obj[key]))) {
    obj[key] = {};
  }

  obj[key] = rest
    ? setValueByPath(
      obj[key],
      rest,
      value,
    )
    : value;

  return obj;
};

export const serialize = (config, obj = {}) => {
  for (const item of config) {
    if (item.isVisible === false) {
      continue;
    }

    if (!item.path) {
      item.path = item.name;
    }

    if (typeof item.serialize === 'function') {
      item.serialize({
        obj,
        item,
      });

      continue;
    }

    if (typeof item.component?.serialize === 'function') {
      item.component.serialize({
        obj,
        item,
      });

      continue;
    }

    setValueByPath(
      obj,
      item.path,
      item.value,
    );
  }

  return obj;
};

export const deserialize = (config, data, obj = {}) => {
  for (const item of config) {

    if (typeof item.deserialize === 'function') {
      item.deserialize({
        obj,
        item,
        data,
      });

      continue;
    }

    if (!item.component) {continue;}

    if (typeof item.component.deserialize === 'function') {
      item.component.deserialize({
        obj,
        item,
        data,
      });

      continue;
    }

    item.value = getValueByPath(
      data,
      item.path,
      item.component.default,
    );
  }

  return obj;
};
