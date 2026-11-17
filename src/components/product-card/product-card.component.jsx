import { useDispatch, useSelector } from 'react-redux';

import './product-card.styles.scss';

import { selectCartItems } from '../../store/cart/cart.selector';
import {
  addItemToCart,
  setIsCartOpen,
} from '../../store/cart/cart.action';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

const ProductCard = ({ product }) => {
  const { name, price, imageUrl } = product;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const addProductToCart = (event) => {
    event.stopPropagation();
    dispatch(addItemToCart(cartItems, product));
    dispatch(setIsCartOpen(true));
  };

  return (
    <div className="product-card-container">
      <img src={imageUrl} alt={`${name}`} />
      <div className="footer">
        <span className="name">{name}</span>
        <span className="price">{price}</span>
      </div>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={addProductToCart}
      >
        Add to card
      </Button>
    </div>
  );
};

export default ProductCard;
