import * as types from './../actions/actionTypes';

export default function questionReducer(state =[] , action) {
    switch(action.type)
    {
        case types.QUESTION_SUBMIT:
            return [
                ...state, Object.assign({}, action.question)
            ];
        default:
            return state;
    }
}
