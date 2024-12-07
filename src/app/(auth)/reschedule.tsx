import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PocketBase from 'pocketbase';
import { useAuth } from '@/src/context/auth'; // Ensure this path is correct

const { width } = Dimensions.get('window');

export default function RescheduleScreen() {
  const router = useRouter();
  const { allocationId, classDetails, scheduledDate, scheduledTime } =
    useLocalSearchParams();
  const { user } = useAuth(); // Get the logged-in user's details
  console.log(classDetails);

  const [selectedDate, setSelectedDate] = useState<string>(
    scheduledDate as string
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    scheduledTime as string
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pb = new PocketBase('http://localhost:8090'); // Replace with your PocketBase URL

  // Time slots starting from 2 PM in 1-hour intervals
  const timeSlots = ['14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // ISO format (YYYY-MM-DD)
      setSelectedDate(formattedDate);
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a valid date and time.');
      return;
    }

    const updatedDateTime = `${selectedDate}T${selectedTime}:00.000Z`; // Combine date and time in ISO format

    try {
      // Validate the user is logged in
      if (!user || !user.id) {
        throw new Error('You must be logged in to reschedule.');
      }

      // Update the session date and time in PocketBase
      await pb.collection('allocations').update(allocationId as string, {
        session_date: updatedDateTime,
      });

      Alert.alert(
        'Success',
        `Session rescheduled to ${selectedDate} at ${selectedTime}`
      );
      router.back(); // Navigate back to the previous screen
    } catch (error: any) {
      console.error('Error updating allocation:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update the session schedule.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()} // Navigate back
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Re Schedule</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Class Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Class</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{classDetails}</Text>
          </View>
        </View>

        {/* Scheduled Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scheduled</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              {scheduledDate} at {scheduledTime}
            </Text>
          </View>
        </View>

        {/* Rescheduled Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Re Scheduled</Text>
          <TouchableOpacity
            style={styles.sectionContent}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.sectionText}>{selectedDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(scheduledDate as string)} // Default to the current scheduled date
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time Slots */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionLabel}>Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Schedule Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
          <Text style={styles.addButtonText}>Add Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
  },
  sectionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timeSection: {
    marginTop: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeSlot: {
    width: (width - 60) / 2,
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#4A4E69',
  },
  timeSlotText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#585759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
