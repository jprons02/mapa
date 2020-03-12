import {SIGN_IN} from './types';
import history from '../history';


export const loginToggle = isSignedIn => (dispatch, getState) => {

    dispatch({type: SIGN_IN, payload: isSignedIn});

    if(getState().isSignedIn) {
        history.push('/');
    } else {
        history.push('/login');
    }
};

/*
example:
export const createStream = formValues => async (dispatch, getState) => {
    const {userId} = getState().auth;
    const response = await streams.post('/streams', {...formValues, userId});

    dispatch({type: CREATE_STREAM, payload: response.data});
    history.push('/');
};
*/

