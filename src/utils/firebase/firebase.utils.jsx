import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  writeBatch,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC1pYPuddNdZRm7pNWjbJE7LCcyiiBd_Yc',
  authDomain: 'crwn-clothing-db-19df5.firebaseapp.com',
  projectId: 'crwn-clothing-db-19df5',
  storageBucket: 'crwn-clothing-db-19df5.firebasestorage.app',
  messagingSenderId: '1063421804538',
  appId: '1:1063421804538:web:1ac275f7999cf43cb26e43',
};

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    // 捕获所有弹窗关闭相关的错误
    const errorMessage = error?.message || error?.code || '';
    if (
      error.code === 'auth/popup-closed-by-user' ||
      errorMessage.includes('window.closed') ||
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('popup')
    ) {
      console.log('Google sign-in popup was closed by user');
      return null;
    }
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);
export const getGoogleRedirectResult = () => getRedirectResult(auth);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field = 'title',
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object[field].toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('Done');
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {},
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
