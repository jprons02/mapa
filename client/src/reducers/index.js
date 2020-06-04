import { combineReducers } from 'redux';
import mediaListReducer from './mediaListReducer';
import selectedFileReducer from './selectedFileReducer';
import signInReducer from './signInReducer';
import downloadingStatusReducer from './downloadingStatusReducer';
import uploadingStatusReducer from './uploadingStatusReducer';

export default combineReducers ({
    mediaList: mediaListReducer,
    selectedFile: selectedFileReducer,
    isSignedIn: signInReducer,
    isDownloading: downloadingStatusReducer,
    isUploading: uploadingStatusReducer
});