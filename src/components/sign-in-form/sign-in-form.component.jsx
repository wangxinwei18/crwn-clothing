import { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
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

      if (error.code === 'auth/popup-blocked') {
        errorMessage =
          'Pop-up blocker prevented sign-in. Please allow pop-ups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in window was closed before completion.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for OAuth operations.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled in Firebase console.';
      } else if (error.code === 'auth/user-cancelled') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.message?.includes('popup')) {
        errorMessage =
          'Pop-up blocker prevented sign-in. Please allow pop-ups for this site.';
      }

      setError(errorMessage);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await signInAuthUserWithEmailAndPassword(
        email,
        password,
      );
      console.log(response);
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        alert('incorrect password or email');
      }
      console.log(error);
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
