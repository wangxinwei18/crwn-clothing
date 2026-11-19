export const loggerMiddleware = (store) => (next) => (action) => {
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
