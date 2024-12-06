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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function RescheduleScreen() {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('Thursday, 30th of January 2022');

  const timeSlots = [
    '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
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
            <Text style={styles.sectionText}>Meeting with Mcom (room-208)</Text>
          </View>
        </View>

        {/* Scheduled Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scheduled</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>Thursday, 29th of January 2022</Text>
          </View>
        </View>

        {/* Rescheduled Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Re Scheduled</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{selectedDate}</Text>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionLabel}>Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Schedule Button */}
        <TouchableOpacity style={styles.addButton}>
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