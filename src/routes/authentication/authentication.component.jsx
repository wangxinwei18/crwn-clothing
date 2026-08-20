import { useEffect, useState } from 'react';
import './authentication.styles.scss';

import {
  getGoogleRedirectResult,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

const Authentication = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result?.user) {
          await createUserDocumentFromAuth(result.user);
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        setError('Google sign-in failed. Please try again.');
      }
    };

    handleRedirectResult();
  }, []);

  return (
    <div className="authentication-container">
      {error && <p className="error-message">{error}</p>}
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

export default Authentication;
