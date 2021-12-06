import {get} from 'common';

export const getLocations = () => get('locations');
export const getLocation = id => get(`locations/${id}`);
export const getEvents = () => get('events');
export const getEvent = id => get(`events/${id}`);
