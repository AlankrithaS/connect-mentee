import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { z } from 'zod';
import { useAuthMutation } from '@/src/hooks/auth/useAuthMutation';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const { mutate: login, isPending } = useAuthMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<'email' | 'password', string>>
  >({});

  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error for the field once the user starts typing
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      const errorMessages: Partial<Record<'email' | 'password', string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formData;
        errorMessages[field] = issue.message;
      });

      setErrors(errorMessages);
    } else {
      // Trigger the login mutation
      login(formData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9B9B9B"
        value={formData.email}
        keyboardType="email-address"
        onChangeText={(value) => handleInputChange('email', value)}
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9B9B9B"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text
          style={styles.registerText}
          onPress={() => router.navigate('/(public)/register')}
        >
          Sign Up <Link href="/(public)/role_selection">View user</Link>
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark background similar to the image
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color for title
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF', // White text color for subtitle
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#585759', // Dark gray background for input fields
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: '#FFFFFF', // White text color for inputs
    fontSize: 16,
  },
  errorText: {
    color: '#FF4C4C', // Red color for error messages
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#9B9B9B', // Gray background color for the button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF', // White text color for the button
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF', // White text color for footer
    textAlign: 'center',
    marginTop: 20,
  },
  registerText: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for "Sign Up" link
    textDecorationLine: 'underline',
  },
});
