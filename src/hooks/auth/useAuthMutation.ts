import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/auth';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  user?: any;
  error?: any;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
  emailVisibility: boolean;
  role: string;
}

interface RegisterResponse {
  user?: any;
  error?: any;
}

// Login Mutation Hook
export function useAuthMutation() {
  const { signIn } = useAuth();

  const loginMutation = useMutation<LoginResponse, unknown, LoginData>({
    mutationFn: async ({ email, password }: LoginData) =>
      signIn(email, password),
    onError: (error: any) => {
      // Handle error (e.g., show error message)
      console.error('Login error:', error);
    },
    onSuccess: (data: LoginResponse) => {
      if (data.error) {
        // Handle error response
        console.error('Login error:', data.error);
      } else {
        // Handle success (e.g., navigate to the next screen)
        console.log('Login successful:', data.user);
      }
    },
  });

  return loginMutation;
}

// Register Mutation Hook
export function useRegisterMutation() {
  const { createAccount } = useAuth();

  const registerMutation = useMutation<
    RegisterResponse,
    unknown,
    RegisterFormData
  >({
    mutationFn: async (formData: RegisterFormData) => {
      console.log('Sending data to createAccount:', formData); // Debugging log
      return createAccount(formData);
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
    },
    onSuccess: (data: RegisterResponse) => {
      if (data.error) {
        console.error('Registration error:', data.error);
      } else {
        console.log('Registration successful:', data.user);
      }
    },
  });

  return registerMutation;
}
