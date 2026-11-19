import {
  compose,
  legacy_createStore as createStore,
  applyMiddleware,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// import logger from 'redux-logger';

import { rootReducer } from './root-reducer';

const loggerMiddleware = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log('type: ', action.type);
  console.log(
    'payload: ',
    action.payload !== undefined ? action.payload : 'No payload',
  );
  console.log('current state: ', store.getState());

  next(action);

  console.log('next state: ', store.getState());
};

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['user'], // user will not be persisted
  whitelist: ['cart', 'categories'], // only persist cart and categories
  timeout: 0, // disable timeout
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares = [loggerMiddleware];

const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store = createStore(
  persistedReducer,
  undefined,
  composedEnhancers,
);

// Handle potential persistStore issues

export const persistor = persistStore(store);
