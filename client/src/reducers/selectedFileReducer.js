import {SELECTED_FILE} from '../actions/types';

export default function(state={}, action) {
    switch(action.type) {
        case SELECTED_FILE:
            return action.payload;
        default: 
            return state;
    }
}