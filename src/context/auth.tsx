import { useSegments, useRouter, useNavigationContainerRef } from 'expo-router';
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { usePocketBase } from './pocketbase';
import { RecordAuthResponse, ClientResponseError } from 'pocketbase';

interface AuthContextType {
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user?: any; error?: any }>;
  signOut: () => Promise<
    { user: null; error?: undefined } | { error: unknown; user?: undefined }
  >;
  createAccount: (data: {
    email: string;
    password: string;
    passwordConfirm: string;
    name?: string;
    role: string;
  }) => Promise<{ user?: any; error?: any }>;
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: any;
}

// Define the context with an initial value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This hook can be used to access the user info
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for handling protected routes
function useProtectedRoute(user: any, isInitialized: boolean) {
  const router = useRouter();
  const segments = useSegments();

  // Check that navigation is all good
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const rootNavRef = useNavigationContainerRef();

  // Set up a listener to check if the navigator is ready
  useEffect(() => {
    const unsubscribe = rootNavRef?.addListener('state', () => {
      setIsNavigationReady(true);
    });

    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavRef]);

  useEffect(() => {
    // Navigation isn't set up. Do nothing.
    if (!isNavigationReady) return;
    const inAuthGroup = segments[0] === '(public)';

    if (!isInitialized) return;

    if (
      // If the user is not signed in and the initial segment is not in the auth group
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page
      router.replace('/(public)/role_selection');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page
      router.replace('/(tabs)/');
    }
  }, [user, segments, isNavigationReady, isInitialized]);
}

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// The main AuthProvider component
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { pb } = usePocketBase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (pb) {
        // Check if the auth token is valid
        console.log(pb.authStore.token);
        const isLoggedIn = pb.authStore.isValid;
        setIsLoggedIn(isLoggedIn);
        setUser(isLoggedIn ? pb.authStore.model : null);
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, [pb]);

  const appSignIn = async (email: string, password: string) => {
    if (!pb) return { error: 'PocketBase not initialized' };

    try {
      const resp: RecordAuthResponse = await pb
        ?.collection('users')
        .authWithPassword(email, password);
      setUser(pb?.authStore.isValid ? pb.authStore.model : null);
      setIsLoggedIn(pb?.authStore.isValid ?? false);
      return { user: resp?.record };
    } catch (e) {
      return { error: e };
    }
  };

  const appSignOut = async (): Promise<
    { user: null; error?: undefined } | { error: unknown; user?: undefined }
  > => {
    if (!pb) return { error: 'PocketBase not initialized' };

    try {
      await pb?.authStore.clear();
      setUser(null);
      setIsLoggedIn(false);
      return { user: null };
    } catch (e) {
      return { error: e };
    }
  };

  const createAccount = async ({
    email,
    password,
    passwordConfirm,
    name,
    role,
  }: {
    email: string;
    password: string;
    passwordConfirm: string;
    name?: string;
    role: string;
  }) => {
    if (!pb) return { error: 'PocketBase not initialized' };
    console.log(FormData);
    try {
      const resp = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name: name ?? '',
        role,
      });

      return { user: resp };
    } catch (e) {
      const error = e as ClientResponseError;
      return { error: error.response };
    }
  };

  useProtectedRoute(user, isInitialized);

  return (
    <AuthContext.Provider
      value={{
        signIn: (email, password) => appSignIn(email, password),
        signOut: () => appSignOut(),
        createAccount: ({ email, password, passwordConfirm, name, role }) =>
          createAccount({ email, password, passwordConfirm, name, role }),
        isLoggedIn,
        isInitialized,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
