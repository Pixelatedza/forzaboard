import {post} from 'common';

export const signIn = data => post('auth/token', data);
export const signUp = data => post('users', data);

