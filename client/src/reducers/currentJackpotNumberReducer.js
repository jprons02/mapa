import {CURRENT_JACKPOT_NUMBER} from '../actions/types';

export default function(state='', action) {
    switch(action.type) {
        case CURRENT_JACKPOT_NUMBER:
            return action.payload;
        default: 
            return state;
    }
}