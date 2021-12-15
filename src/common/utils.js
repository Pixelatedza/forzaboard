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
};

// TODO: Look at a better approach to load/cache these in future.
// IMPORTANT TO NOTE! These SVGs are still being cached with normal
// http cache headers. The first fetches will still hit the CDN and
// check the cache headers. This is simply a minor speed up, to avoid
// the delay when doing the follow up requests. Avoiding the whole
// http cache lifecycle and network latency by just returning
// immediately.
const inflight = {};
const svgCache = {};
export const fetchCanvasSVG = (src, options) => {

  // If the svg object url is already made simply return it.
  if (svgCache[src]) {
    return Promise.resolve(svgCache[src]);
  }

  // If we already have a request for this svg then return the current
  // request promise.
  if (inflight[src]) {
    return inflight[src];
  }

  const request = fetch(src)
    .then(res => {
      return res.text();
    }).then(data => {
      const svg = new DOMParser().parseFromString(data, 'image/svg+xml');
      svg.documentElement.setAttribute("width",  options.width || '48px');
      svg.documentElement.setAttribute("height", options.height || '48px');
      const customSvg = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([customSvg], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      // Remove inflight fetch
      delete inflight[src];
      // Cache this svg url
      svgCache[src] = url;
      return url;
    });

  // Add request promise to inflight requests
  inflight[src] = request;
  return request;
};

export const addSVG = (src, parent, options) => {
  fetchCanvasSVG(src, options)
    .then(url => {
      addImage(url, parent, options).catch(e => console.error(e));
    });
};

export const addMarker = (parent) => {
  const line = new Konva.Line({
    points: [
      -5, -6,
      +5, -6,
      0, 0,
    ],
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    closed: true,
  })
  parent.add(line);
};

// This method was ripped straight from stackoverflow
// Thanks to https://stackoverflow.com/a/38552302
export const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

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

export const formatTime = duration => {

  let milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = ("0" + hours).slice(-2);
  minutes = ("0" + minutes).slice(-2);
  seconds = ("0" + seconds).slice(-2);
  milliseconds = ("0000" + milliseconds).slice(-3);

  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}
