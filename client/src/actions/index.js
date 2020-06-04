import axios from 'axios';
import {FETCH_LIST} from './types';
import {SELECTED_FILE} from './types';
import {SIGN_IN} from './types';
import {DOWNLOADING_FILE} from './types';
import {UPLOADING_FILE} from './types';

export const fetchList = () => async dispatch => {
    const res = await axios.get('/api/list-content/media');
    
    dispatch({type: FETCH_LIST, payload: res.data});
}


export const selectFile = (event) => dispatch => {
    const selectedFile = event.target.files[0];

    dispatch({type: SELECTED_FILE, payload: selectedFile});
}


export const setSignIn = (value) => dispatch => {
    dispatch({type: SIGN_IN, payload: value});
}


export const downloadingFile = value => {
    return {
        type: DOWNLOADING_FILE, payload: value
    }
}


export const uploadingFile = value => {
    return {
        type: UPLOADING_FILE, payload: value
    }
}