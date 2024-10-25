import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/auth';
import DatePicker from '@/src/components/DatePicker';

export default function ScheduleScreen() {
  const screenWidth = Dimensions.get('window').width;

  // Assuming `useAuth` returns an object with a `user` property
  const { user } = useAuth();

  console.log(user);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
      </View>

      {/* Date Picker */}
      <DatePicker />

      {/* Week Schedule */}
      <Text style={styles.weekScheduleTitle}>Week Schedule</Text>

      <ScrollView contentContainerStyle={styles.scheduleList}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>11:35</Text>
              <Text style={styles.timeText}>13:05</Text>
            </View>
            <View style={styles.scheduleContent}>
              <View style={styles.scheduleHeader}>
                <Text style={styles.weekText}>Week 1</Text>
                <Text style={styles.sessionText}>Upcoming session</Text>
                <Text style={styles.timeInfoText}>Tomorrow 10:25-11:25</Text>
                <Text style={styles.locationText}>Room 205 - 1st floor</Text>
              </View>
              <View style={styles.scheduleActions}>
                <TouchableOpacity style={styles.confirmButton}>
                  <Text style={styles.buttonText}>CONFIRM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton}>
                  <Text style={styles.buttonText}>RESCHEDULE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weekScheduleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scheduleList: {
    paddingBottom: 40, // Space for the end of the list
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#585759',
    borderRadius: 16,
    padding: 10,
  },
  timeColumn: {
    width: 60,
    justifyContent: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  scheduleContent: {
    flex: 1,
    paddingLeft: 10,
  },
  scheduleHeader: {
    marginBottom: 10,
  },
  weekText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 16,
    color: '#9B9B9B',
    marginBottom: 5,
  },
  timeInfoText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  locationText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4A4E69',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rescheduleButton: {
    backgroundColor: '#2A2D34',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
