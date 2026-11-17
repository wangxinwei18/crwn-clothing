import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { categoriesReducer } from './categories/category.reducer';
import { cartReducer } from './cart/cart.reducer';

export const rootReducer = combineReducers({
  // Add your reducers here
  user: userReducer,
  categories: categoriesReducer,
  cart: cartReducer,
});
