import { SIGN_IN } from '../actions/types';

export default (state=false, action) => {
    if(action.type === SIGN_IN) {
        return action.payload;
    }
    return state;
}
