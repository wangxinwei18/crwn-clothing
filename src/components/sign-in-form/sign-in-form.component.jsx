import { useState, useContext } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { UserContext } from '../../contexts/user.context';
import {
  signInWithGoogleRedirect,
  signInAuthUserWithEmailAndPassword,
} from '../../utils/firebase/firebase.utils';

import './sign-in-form.styles.scss';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [error, setError] = useState('');
  const { email, password } = formFields;

  const { setCurrentUser } = useContext(UserContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
    setError('');
  };

  const signInWithGoogle = async () => {
    try {
      setError('');
      await signInWithGoogleRedirect();
    } catch (error) {
      console.error('Google sign-in error:', error);

      // Handle different types of Google sign-in errors
      let errorMessage = 'An error occurred during Google sign-in.';

      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage =
            'Pop-up blocker prevented sign-in. Please allow pop-ups for this site.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in window was closed before completion.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized for OAuth operations.';
          break;
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your internet connection.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not enabled in Firebase console.';
          break;
        case 'auth/user-cancelled':
          errorMessage = 'Sign-in was cancelled.';
          break;
        default:
          if (error.message?.includes('popup')) {
            errorMessage =
              'Pop-up blocker prevented sign-in. Please allow pop-ups for this site.';
          }
      }

      setError(errorMessage);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      const { user } = await signInAuthUserWithEmailAndPassword(
        email,
        password,
      );
      setCurrentUser(user);

      resetFormFields();
    } catch (error) {
      console.error('Email/password sign-in error:', error);

      // Handle different types of authentication errors
      let errorMessage = 'An error occurred during sign-in.';

      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect email or password.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage =
            'Email/password sign-in is not enabled in Firebase console.';
          break;
        default:
          if (error.message?.includes('network')) {
            errorMessage =
              'Network error. Please check your internet connection.';
          }
      }

      setError(errorMessage);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
