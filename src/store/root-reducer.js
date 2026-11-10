import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';

export const rootReducer = combineReducers({
  // Add your reducers here
  user: userReducer,
});
