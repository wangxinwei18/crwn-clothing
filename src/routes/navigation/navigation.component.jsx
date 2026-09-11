import { Fragment, useCallback, useContext, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import {
  NavigationContainer,
  NavLinks,
  NavLink,
  LogoContainer,
} from './navigation.styles';
const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigationRef = useRef(null);
  const location = useLocation();

  const closeCartDropdown = useCallback(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  useEffect(() => {
    closeCartDropdown();
  }, [closeCartDropdown, location.pathname]);

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
      <NavigationContainer ref={navigationRef}>
        <LogoContainer to="/" onClick={closeCartDropdown}>
          <CrwnLogo className="logo" />
        </LogoContainer>
        <NavLinks>
          <NavLink to="/shop" onClick={closeCartDropdown}>
            SHOP
          </NavLink>
          {currentUser ? (
            <NavLink
              as="span"
              onClick={() => {
                closeCartDropdown();
                signOutUser();
              }}
            >
              SIGN OUT
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/auth"
              onClick={closeCartDropdown}
            >
              Sign In
            </NavLink>
          )}
          <CartIcon />
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
