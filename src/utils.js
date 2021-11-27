export const copy = data => {

  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return [...data];
  }

  if (typeof data === 'object') {
    return {...data};
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
    key = path.substring(0, dotIndex);
    rest = path.substring(dotIndex + 1, path.length);
  }

  let value = obj[key];

  if (typeof value === 'object' && rest) {
    return getValueByPath(value, rest, fallback);
  }

  if (rest) {
    return fallback;
  }

  return copy(value) || fallback;
};

export const setValueByPath = (
  obj,
  path,
  value
) => {

  if (value === null || value === undefined) {
    return;
  }

  const dotIndex = path.indexOf('.');
  let key = path;
  let rest = null;

  if (dotIndex > -1) {
    key = path.substring(0, dotIndex);
    rest = path.substring(dotIndex + 1, path.length);
  }

  if (rest && (typeof obj[key] !== 'object' || Array.isArray(obj[key]))) {
    obj[key] = {};
  }

  obj[key] = rest
    ? setValueByPath(
        obj[key],
        rest,
        value
      )
    : value;

  return obj;
}

export const serialize = ({data, item}) => {

  return item.serialize
    ? item.serialize({data, item})
    : setValueByPath(data, item.path, item.value);
};

export const deserialize = ({data, item}) => {

  return item.deserialize
    ? item.deserialize({data, item})
    : getValueByPath(data, item.path, '');
};

export const serializeItems = (items) => {

  let serializedItems = {};

  for (const item of items) {
    serialize({
      data: serializedItems,
      item: item,
    });
  }

  return serializedItems;
}
