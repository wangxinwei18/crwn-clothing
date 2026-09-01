import { Fragment, useContext, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import './navigation.styles.scss';
const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigationRef = useRef(null);
  const location = useLocation();

  const closeCartDropdown = () => setIsCartOpen(false);

  useEffect(() => {
    closeCartDropdown();
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isCartOpen &&
        navigationRef.current &&
        !navigationRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    <Fragment>
      <div className="navigation" ref={navigationRef}>
        <Link className="logo-container" to="/" onClick={closeCartDropdown}>
          <CrwnLogo className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to="/shop" onClick={closeCartDropdown}>
            Shop
          </Link>
          {currentUser ? (
            <span
              className="nav-link"
              onClick={() => {
                closeCartDropdown();
                signOutUser();
              }}
            >
              SIGN OUT
            </span>
          ) : (
            <Link className="nav-link" to="/auth" onClick={closeCartDropdown}>
              Sign In
            </Link>
          )}
          <CartIcon />
        </div>
        {isCartOpen && <CartDropdown />}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
