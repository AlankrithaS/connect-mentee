import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DatePicker: React.FC = () => {
  // Function to get the current week's dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(
      today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    ); // Set to Monday (adjust for Sunday)

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i); // Get each day of the week
      weekDates.push(date);
    }

    return weekDates;
  };

  const weekDates = getWeekDates();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.datePickerContainer}
    >
      {weekDates.map((date, index) => (
        <View
          key={index}
          style={[
            styles.dateItem,
            index === 2 && styles.selectedDateItem, // Highlight a specific date (e.g., Wednesday)
          ]}
        >
          <Text style={styles.dayText}>
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </Text>
          <Text style={styles.dateText}>
            {date.getDate()} {/* Render the day of the month */}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  dateItem: {
    paddingVertical: 8, // Reduced padding for a more compact design
    paddingHorizontal: 10, // Reduced padding for a smaller pill shape
    backgroundColor: '#585759',
    borderRadius: 20, // Ensure a pill-like shape with rounded corners
    marginRight: 8, // Smaller spacing between items
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Reduced width for a more compact look
    height: 50, // Reduced height to balance with the width
  },
  selectedDateItem: {
    backgroundColor: '#9B9B9B', // Keep the selected date highlighted
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 12, // Slightly smaller font for weekday text
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14, // Slightly smaller font for the day of the month
  },
  selectedDateText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DatePicker;
