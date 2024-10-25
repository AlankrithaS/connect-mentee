import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/auth';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.user === null) {
      router.push('/(public)/login');
    } else if (result.error) {
      console.log('Error signing out:', result.error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Profile Information */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>Miss. Nirmala</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.profileDetail}>Department</Text>
        <Text style={styles.profileValue}>Computer Science</Text>
        <Text style={styles.profileDetail}>Email</Text>
        <Text style={styles.profileValue}>
          punithraj@mca.christuniversity.in
        </Text>
      </View>

      {/* Courses and Classes Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={30} color="#FFFFFF" />
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="school-outline" size={30} color="#FFFFFF" />
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
      </View>

      {/* Classes Statistic */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Classes Statistic</Text>
        <BarChart
          data={{
            labels: ['MCA A', 'MCA B', 'BCOM A', 'BBA B', 'BCA A'],
            datasets: [
              {
                data: [30, 20, 40, 15, 55],
              },
            ],
          }}
          width={screenWidth - 40} // Ensure chart fits within container
          height={220}
          yAxisLabel="%"
          chartConfig={{
            backgroundColor: '#585759', // Updated background color
            backgroundGradientFrom: '#585759',
            backgroundGradientTo: '#585759',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: 'center', // Center the chart horizontally
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  profileCard: {
    backgroundColor: '#343429',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutText: {
    color: '#9B9B9B',
    fontSize: 16,
  },
  profileDetail: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  profileValue: {
    fontSize: 16,
    color: '#9B9B9B',
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#585759', // Updated background color
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#9B9B9B',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: '#585759', // Updated background color
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
});
