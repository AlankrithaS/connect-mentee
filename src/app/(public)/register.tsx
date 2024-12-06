import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRegisterMutation } from '@/src/hooks/auth/useAuthMutation';
import { useLocalSearchParams, router } from 'expo-router';
import { registerSchema, RegisterFormData } from '@/src/utils/validation';

export default function RegisterScreen() {
  // Retrieve role from the query parameters
  const params = useLocalSearchParams();
  const role = Array.isArray(params.role) ? params.role[0] : params.role;

  // Mutation hook for registration
  const { mutate: register, isPending } = useRegisterMutation();

  // Form state
  const [formData, setFormData] = useState<
    Omit<RegisterFormData, 'emailVisibility' | 'role'>
  >({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  });

  // Error state
  const [errors, setErrors] = useState<
    Partial<
      Record<
        'username' | 'email' | 'password' | 'passwordConfirm' | 'name',
        string
      >
    >
  >({});

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = () => {
    // Add role and emailVisibility to formData before validating
    const formDataWithRoleAndVisibility: RegisterFormData = {
      ...formData,
      role: 'mentor', // Hardcoded role, can be dynamic if needed
      emailVisibility: true,
    };

    // Validate form data
    const validationResult = registerSchema.safeParse(
      formDataWithRoleAndVisibility
    );

    if (!validationResult.success) {
      const errorMessages: Partial<
        Record<
          'username' | 'email' | 'password' | 'passwordConfirm' | 'name',
          string
        >
      > = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formData;
        errorMessages[field] = issue.message;
      });

      setErrors(errorMessages);
    } else {
      // Trigger the register mutation
      register(formDataWithRoleAndVisibility);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account to get started!</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9B9B9B"
        value={formData.username}
        onChangeText={(value) => handleInputChange('username', value)}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9B9B9B"
        value={formData.email}
        keyboardType="email-address"
        onChangeText={(value) => handleInputChange('email', value)}
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#9B9B9B"
        secureTextEntry
        value={formData.passwordConfirm}
        onChangeText={(value) => handleInputChange('passwordConfirm', value)}
      />
      {errors.passwordConfirm && (
        <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#9B9B9B"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? 'Registering...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.loginText}
          onPress={() => router.navigate('/(public)/AddSchedule')}
        >
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark background
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
  loginText: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for "Log In" link
    textDecorationLine: 'underline',
  },
});
