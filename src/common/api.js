import { Environment } from 'common/environment';

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
      headers: { ...options.headers },
      credentials: 'same-origin',
    },
  )
    .then(res => {
      return res;
    });
};

export const get = (path, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'GET',
    },
  )
    .then(res => res.json());
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
  )
    .then(res => res.json());
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
  )
    .then(res => res.json() );
};

// Delete is a reserved word and cant be used for the function name
export const remove = (path, options = {}) => {
  return request(
    path,
    {
      ...options,
      method: 'DELETE',
    },
  )
    .then(res => res.json());
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
