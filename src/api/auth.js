import {post} from 'common';

export const signIn = data => post('auth/token', data);

