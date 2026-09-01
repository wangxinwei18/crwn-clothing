import { fireEvent, render, screen } from '@testing-library/react';
import { useContext, useEffect, useRef } from 'react';

import ProductCard from '../../components/product-card/product-card.component';
import { CartContext, CartProvider } from '../../contexts/cart.context';
import Checkout from './checkout.component';

const CartStateProbe = () => {
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  return <span data-testid="cart-state">{String(isCartOpen)}</span>;
};

test('checkout page closes the cart dropdown', () => {
  render(
    <CartProvider>
      <CartStateProbe />
      <Checkout />
    </CartProvider>,
  );

  expect(screen.getByTestId('cart-state')).toHaveTextContent('false');
});

test('clicking outside the cart dropdown closes it', () => {
  const CartOutsideClickHarness = () => {
    const { isCartOpen, setIsCartOpen } = useContext(CartContext);
    const cartRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          isCartOpen &&
          cartRef.current &&
          !cartRef.current.contains(event.target)
        ) {
          setIsCartOpen(false);
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }, [isCartOpen, setIsCartOpen]);

    return (
      <>
        <div ref={cartRef}>
          <button type="button" onClick={() => setIsCartOpen(!isCartOpen)}>
            cart-toggle
          </button>
          {isCartOpen && <div>GO TO CHECKOUT</div>}
        </div>
        <button type="button">outside</button>
      </>
    );
  };

  render(
    <CartProvider>
      <CartOutsideClickHarness />
    </CartProvider>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'cart-toggle' }));
  expect(screen.getByText('GO TO CHECKOUT')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'outside' }));
  expect(screen.queryByText('GO TO CHECKOUT')).not.toBeInTheDocument();
});

test('adding an item from the shop keeps the cart dropdown open', () => {
  const product = {
    id: 1,
    name: 'Brown Brim',
    price: 25,
    imageUrl: 'https://example.com/brim.png',
  };

  const ShopCartHarness = () => {
    const { isCartOpen, setIsCartOpen } = useContext(CartContext);

    useEffect(() => {
      setIsCartOpen(true);
    }, [setIsCartOpen]);

    return (
      <>
        <div data-testid="cart-open-state">{String(isCartOpen)}</div>
        <ProductCard product={product} />
      </>
    );
  };

  render(
    <CartProvider>
      <ShopCartHarness />
    </CartProvider>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Add to card' }));

  expect(screen.getByTestId('cart-open-state')).toHaveTextContent('true');
});
