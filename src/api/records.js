import {get, post, remove} from 'common';

export const getRecords = options => get('records', options);
export const getRecord = id => get(`records/${id}`);
export const createRecord = data => post('records', data);
export const removeRecord = id => remove(`records/${id}`);

