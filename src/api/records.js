import {get} from 'common';

export const getRecords = (options) => get('records', options);
export const getRecord = id => get(`records/${id}`);

