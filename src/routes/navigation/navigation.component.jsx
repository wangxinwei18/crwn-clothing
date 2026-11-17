import { Fragment, useCallback, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { setIsCartOpen } from '../../store/cart/cart.action';
import { selectIsCartOpen } from '../../store/cart/cart.selector';
import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';

import { selectCurrentUser } from '../../store/user/user.selector';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import {
  NavigationContainer,
  NavLinks,
  NavLink,
  LogoContainer,
} from './navigation.styles';
const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);
  const navigationRef = useRef(null);
  const location = useLocation();

  const closeCartDropdown = useCallback(() => {
    dispatch(setIsCartOpen(false));
  }, [dispatch]);

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
        dispatch(setIsCartOpen(false));
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dispatch, isCartOpen]);

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
              SIGN IN
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
