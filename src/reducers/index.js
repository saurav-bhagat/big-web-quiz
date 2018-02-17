import { combineReducers } from 'redux';
import Questions from './mainReducer';

const rootReducer = combineReducers ({
    questions : Questions
});

export default rootReducer;
