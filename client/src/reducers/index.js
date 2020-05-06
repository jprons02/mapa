import { combineReducers } from 'redux';
import mediaListReducer from './mediaListReducer';
import selectedFileReducer from './selectedFileReducer';
import signInReducer from './signInReducer';

export default combineReducers ({
    mediaList: mediaListReducer,
    selectedFile: selectedFileReducer,
    isSignedIn: signInReducer
});