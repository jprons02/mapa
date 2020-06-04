import {UPLOADING_FILE} from '../actions/types';

export default function(state=null, action) {
    switch(action.type) {
        case UPLOADING_FILE:
            return action.payload
        default: 
            return state;
    }
}