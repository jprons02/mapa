import {GA_TOKEN} from '../actions/types';

export default function(state='', action) {
    switch(action.type) {
        case GA_TOKEN:
            return action.payload;
        default: 
            return state;
    }
}