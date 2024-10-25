import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirm: z
      .string()
      .min(8, { message: 'Password confirmation is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
    emailVisibility: z.boolean(),
    role: z.string().min(1, { message: 'Role is required' }), // Ensuring role is present
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
