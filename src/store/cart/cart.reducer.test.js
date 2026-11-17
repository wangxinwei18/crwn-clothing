import { cartReducer, CART_INITIAL_STATE } from './cart.reducer';
import { setIsCartOpen } from './cart.action';

describe('cartReducer', () => {
  it('preserves cart items when the dropdown is closed', () => {
    const cartItems = [{ id: 'item-1', quantity: 1, price: 10 }];
    const stateWithItems = {
      ...CART_INITIAL_STATE,
      cartItems,
      isCartOpen: true,
    };

    expect(cartReducer(stateWithItems, setIsCartOpen(false))).toEqual({
      ...stateWithItems,
      isCartOpen: false,
    });
  });
});
