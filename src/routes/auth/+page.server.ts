import { signIn, signOut, signUp } from '$lib/auth';
import type { Actions } from './$types';

export const actions: Actions = {
    signin: signIn,
    signout: signOut,
    signup: signUp
};
