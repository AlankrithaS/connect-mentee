import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Index</Text>
      <Link href="/(public)/role_selection">Role</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
});
