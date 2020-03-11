import {SIGN_IN} from './types';

export const loginToggle = (isSignedIn) => {
    return {
        type: SIGN_IN,
        payload: isSignedIn
    };
};