import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/auth';
import DatePicker from '@/src/components/DatePicker';
import { Link } from 'expo-router';
import PocketBase from 'pocketbase';
import { useRouter } from 'expo-router';

type Venue = {
  id: string;
  room_number: string;
  block: string;
  floor: number;
};

type Session = {
  id: string;
  session_week: number;
  status: string;
  time_slot: string;
  venue_id?: string;
  venue: Venue | null;
  collectionId: string;
  collectionName: string;
  session_date: string;
  updated: string;
};

export default function ScheduleScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const pb = new PocketBase('http://localhost:8090');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const fetchSessions = async () => {
    if (!user.id) return; // Prevent calls if user is not ready
    try {
      setRefreshing(true);
      const allocationResult = await pb
        .collection('allocations')
        .getList(1, 50, {
          filter: `mentor_id="${user.id}"`,
        });

      const sessionWithVenuePromises = allocationResult.items.map(
        async (session) => {
          let venue: Venue | null = null;
          if (session.venue_id) {
            try {
              const venueResult = await pb
                .collection('venues')
                .getOne(session.venue_id);
              venue = {
                id: venueResult.id,
                room_number: venueResult.room_number,
                block: venueResult.block,
                floor: venueResult.floor,
              };
            } catch (err) {
              console.error(
                `Error fetching venue for session: ${session.id}`,
                err
              );
            }
          }
          return {
            id: session.id,
            session_week: session.session_week ?? 0,
            status: session.status ?? 'unknown',
            time_slot: session.time_slot ?? 'Not Specified',
            venue_id: session.venue_id,
            venue: venue,
            collectionId: session.collectionId,
            collectionName: session.collectionName,
            session_date: session.session_date ?? '',
            updated: session.updated,
          } as Session;
        }
      );

      const sessionsWithVenues = await Promise.all(sessionWithVenuePromises);
      setSessions(sessionsWithVenues);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to fetch sessions');
    } finally {
      setRefreshing(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (!isMounted) {
      fetchSessions();
      setIsMounted(true); // Set as mounted to prevent future unnecessary calls
    }
  }, [isMounted]);

  const renderSessionItem = ({ item }: { item: Session }) => {
    const sessionDate = new Date(item.session_date);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = sessionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const venueDetails = item.venue
      ? `Meeting with ${item.venue.room_number}, Block ${item.venue.block}, Floor ${item.venue.floor}`
      : 'Meeting with Unknown Venue';

    return (
      <TouchableOpacity
        onPress={() =>
          router.push(
            `/menteeList?allocationId=${
              item.id
            }&classDetails=${encodeURIComponent(venueDetails)}`
          )
        }
      >
        <View style={styles.scheduleItem}>
          <View style={styles.scheduleContent}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.weekText}>Week {item.session_week}</Text>
              <Text style={styles.sessionText}>
                {item.status === 'upcoming'
                  ? 'Upcoming session'
                  : 'Past session'}
              </Text>
              <Text style={styles.timeInfoText}>
                {formattedDate} at {formattedTime}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                <Text style={styles.locationText}>
                  {item.venue
                    ? `${item.venue.room_number}, ${item.venue.block}, Floor ${item.venue.floor}`
                    : 'Location not set'}
                </Text>
              </View>
            </View>
            <View style={styles.scheduleActions}>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.buttonText}>CONFIRM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Link
                  href={`/(auth)/reschedule?allocationId=${
                    item.id
                  }&classDetails=${encodeURIComponent(
                    venueDetails
                  )}&scheduledDate=${
                    sessionDate.toISOString().split('T')[0]
                  }&scheduledTime=${sessionDate
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 5)}`}
                  style={styles.linkText}
                >
                  Reschedule
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

      {/* FlatList for sessions */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchSessions} />
        }
        contentContainerStyle={styles.scheduleList}
      />
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
    marginVertical: 10,
  },
  scheduleList: {
    paddingBottom: 40,
  },
  scheduleItem: {
    flexDirection: 'column',
    marginBottom: 10,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    marginBottom: 15,
  },
  weekText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 5,
  },
  timeInfoText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  confirmButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  rescheduleButton: {
    backgroundColor: '#6A6A6A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
