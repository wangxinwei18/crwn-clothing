import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Routes, Route } from 'react-router-dom';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from './utils/firebase/firebase.utils';

import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import { setCurrentUser } from './store/user/user.action';
import ErrorBoundary from './components/error-boundary/error-boundary.component';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChangedListener((user) => {
        if (user) {
          createUserDocumentFromAuth(user);
        }
        dispatch(setCurrentUser(user));
      });
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      // Continue without auth listener if it fails
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="shop/*" element={<Shop />} />
          <Route path="auth" element={<Authentication />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
