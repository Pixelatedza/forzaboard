import {post} from 'common';

export const signIn = data => post('token', data);

