// import * as React from 'react';
// import { useFirebase } from './firebase-context';
// import { useAsync } from 'utils/hooks';
// import { FullPageSpinner, FullPageErrorFallback } from 'components/lib';
// import { useNavigate } from 'react-router';
// import { useTheme } from '@material-ui/core';

// const AuthContext = React.createContext();
// AuthContext.displayName = 'AuthContext';

// function AuthProvider(props) {
//   const {
//     data: user,
//     status,
//     error,
//     isLoading,
//     isIdle,
//     isError,
//     isSuccess,
//     setData,
//   } = useAsync();

//   const { firebase, auth } = useFirebase();
//   const { resetTheme } = useTheme();
//   const navigate = useNavigate();

//   // Auth state change observer
//   React.useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setData(user);
//         navigate('dashboard');
//       } else {
//         setData(null);
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [auth, setData, navigate]);

//   // Sign in (email, password)
//   const signIn = React.useCallback(
//     ({ email, password }) => {
//       return auth.signInWithEmailAndPassword(email, password);
//     },
//     [auth]
//   );

//   // Sign in with Auth Provider
//   const signInWithAuthProvider = React.useCallback(
//     ({ id, scopes }) => {
//       const authProvider = new firebase.auth.OAuthProvider(id);

//       if (scopes) {
//         scopes.forEach((scope) => {
//           authProvider.addScope(scope);
//         });
//       }

//       return auth.signInWithPopup(authProvider);
//     },
//     [firebase, auth]
//   );

//   // Sign in as guest
//   const signInAsGuest = React.useCallback(() => {
//     return auth.signInAnonymously();
//   }, [auth]);

//   // Sign up (email, password)
//   const signUp = React.useCallback(
//     ({ email, password }) => {
//       return auth.createUserWithEmailAndPassword(email, password);
//     },
//     [auth]
//   );

//   // Sign out
//   const signOut = React.useCallback(() => {
//     return auth.signOut().then(() => {
//       resetTheme();
//     });
//   }, [auth, resetTheme]);

//   // Reset password
//   const resetPassword = React.useCallback(
//     ({ email }) => {
//       return auth.sendPasswordResetEmail(email);
//     },
//     [auth]
//   );

//   const deleteAccount = React.useCallback(() => {
//     return auth.currentUser.delete();
//   }, [auth]);

//   // Context value
//   const value = React.useMemo(
//     () => ({
//       user,
//       signIn,
//       signInWithAuthProvider,
//       signInAsGuest,
//       signUp,
//       signOut,
//       resetPassword,
//       deleteAccount,
//     }),
//     [
//       user,
//       signIn,
//       signInWithAuthProvider,
//       signInAsGuest,
//       signUp,
//       signOut,
//       resetPassword,
//       deleteAccount,
//     ]
//   );

//   if (isLoading || isIdle) {
//     return <FullPageSpinner />;
//   }

//   if (isError) {
//     return <FullPageErrorFallback error={error} />;
//   }

//   if (isSuccess) {
//     return <AuthContext.Provider value={value} {...props} />;
//   }

//   throw new Error(`Unhandled status: ${status}`);
// }

// function useAuth() {
//   const context = React.useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error(`useAuth must be used within a AuthProvider`);
//   }
//   return context;
// }

// export { AuthProvider, useAuth };



// import * as React from 'react';
// import firebase from 'firebase/app';
// import 'firebase/auth';

// const AuthContext = React.createContext();

// function AuthProvider({ children }) {
//   const [user, setUser] = React.useState(null);
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
//       setUser(user);
//       setIsLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signOut = () => firebase.auth().signOut();

//   const value = {
//     user,
//     isLoading,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// function useAuth() {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

// export { AuthProvider, useAuth };


import * as React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // 🔹 Observe auth state
  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🔹 Email / Password signup
  const signUp = ({ email, password }) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  // 🔹 Email / Password login
  const signIn = ({ email, password }) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  // 🔹 OAuth login (Google, Github, etc.)
  const signInWithAuthProvider = ({ id, scopes }) => {
    const provider = new firebase.auth.OAuthProvider(id);

    if (scopes?.length) {
      scopes.forEach((scope) => provider.addScope(scope));
    }

    return firebase.auth().signInWithPopup(provider);
  };

  // 🔹 Anonymous login
  const signInAsGuest = () => {
    return firebase.auth().signInAnonymously();
  };

  // 🔹 Logout
  const signOut = () => {
    return firebase.auth().signOut();
  };

  // 🔹 Reset password
  const resetPassword = ({ email }) => {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  // 🔹 Delete account
  const deleteAccount = () => {
    return firebase.auth().currentUser.delete();
  };

  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signInWithAuthProvider,
    signInAsGuest,
    signOut,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
