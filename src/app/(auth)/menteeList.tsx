import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useAuth } from '@/src/context/auth';
import PocketBase from 'pocketbase';

type Mentee = {
  id: string;
  name: string;
};

export default function MenteeListScreen() {
  const { user } = useAuth();
  const pb = new PocketBase('http://localhost:8090');
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMentees = async () => {
      if (!user || !user.id) {
        return;
      }

      try {
        setLoading(true);

        // Fetch allocations for the mentor
        const allocations = await pb.collection('allocations').getList(1, 50, {
          filter: `mentor_id="${user.id}"`,
        });

        // Extract all mentee IDs from allocations
        const menteeIds = allocations.items
          .flatMap((allocation) => allocation.mentee_ids)
          .filter((id) => id); // Ensure no empty IDs

        // Remove duplicates from mentee IDs
        const uniqueMenteeIds = Array.from(new Set(menteeIds));

        // Fetch mentees from the users collection
        const menteeDetailsPromises = uniqueMenteeIds.map(async (menteeId) => {
          try {
            const mentee = await pb.collection('users').getOne(menteeId);
            return {
              id: mentee.id,
              name: mentee.name,
            } as Mentee;
          } catch (error) {
            console.error(
              `Failed to fetch mentee details for ID: ${menteeId}`,
              error
            );
            return null;
          }
        });

        const menteeDetails = (await Promise.all(menteeDetailsPromises)).filter(
          (mentee) => mentee !== null
        ) as Mentee[];

        setMentees(menteeDetails);
      } catch (error) {
        console.error('Error fetching mentees:', error);
        Alert.alert('Error', 'Failed to load mentees.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [user]);

  const renderMenteeItem = ({ item }: { item: Mentee }) => (
    <View style={styles.menteeItem}>
      <Text style={styles.menteeName}>{item.name}</Text>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return <Text style={styles.emptyText}>Loading...</Text>;
    }
    return <Text style={styles.emptyText}>No mentees found</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student’s</Text>
      </View>

      {/* Mentee List */}
      <FlatList
        data={mentees}
        keyExtractor={(item) => item.id}
        renderItem={renderMenteeItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
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
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  menteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 10,
  },
  menteeName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    marginTop: 20,
  },
});
