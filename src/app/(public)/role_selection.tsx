import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <TouchableOpacity
        style={styles.buttonMentor}
        onPress={() =>
          router.push({
            pathname: '/(public)/register',
            params: { role: 'mentor' },
          })
        }
      >
        <Text style={styles.buttonText}>I am a Mentor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonMentee}>
        <Text style={styles.buttonText}>I am a Mentee</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F827C', // Background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EBEDF1',
    marginBottom: 40,
  },
  buttonMentor: {
    backgroundColor: '#563529', // Mentor button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonMentee: {
    backgroundColor: '#392C38', // Mentee button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#EBEDF1', // Text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});
