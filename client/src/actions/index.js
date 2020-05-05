import axios from 'axios';
import {FETCH_LIST} from './types';
import {SELECTED_FILE} from './types';

export const fetchList = () => async dispatch => {
    console.log("fetchlist was called.");
    const res = await axios.get('/api/list-content/media');
    
    dispatch({type: FETCH_LIST, payload: res.data});
}




export const selectFile = (event) => dispatch => {
    const selectedFile = event.target.files[0];

    dispatch({type: SELECTED_FILE, payload: selectedFile});
}



/*
var formData = new FormData();
var imagefile = document.querySelector('#file');
formData.append("image", imagefile.files[0]);
axios.post('upload_file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
})
*/