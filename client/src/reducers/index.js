import { combineReducers } from 'redux';
import mediaListReducer from './mediaListReducer';
import selectedFileReducer from './selectedFileReducer';

export default combineReducers ({
    mediaList: mediaListReducer,
    selectedFile: selectedFileReducer
});