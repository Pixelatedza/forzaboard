import { Environment } from 'common/environment';

const handleJSON = (res) => {
  if (res.headers.get('content-type') !== 'application/json') {
    throw new Error('Invalid content type');
  }

  return res.json()
    .then(json => {
      return {
        body: json,
        ok: res.ok,
        status: res.status,
      }
    });
}

export const defaultHeaders = {};

export const request = async (path, options = {}) => {
  const url = `${Environment.apiHref}/${path}`;

  const query = Object.entries(options.query || {})
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return fetch(
    `${url}${query.length > 0 ? `?${query}` : ''}`,
    {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'same-origin',
    },
  )
    .then(res => {
      return res;
    })
};



export const get = (path, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'GET',
    },
  ).then(handleJSON);
};

export const patch = (path, data, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    },
  ).then(handleJSON);
};

export const post = (path, data, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    },
  ).then(handleJSON);
};

// Delete is a reserved word and cant be used for the function name
export const remove = (path, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'DELETE',
    },
  ).then(handleJSON);
};

export const download = async (path, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'GET',
    },
  );
};
