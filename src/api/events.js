import {get, patch} from 'common';

export const getLocations = (options) => get('locations', options);
export const getLocation = id => get(`locations/${id}`);
export const updateLocation = (id, data) => patch(`locations/${id}`, data);
export const getEvents = (options) => get('events', options);
export const getEvent = id => get(`events/${id}`);
