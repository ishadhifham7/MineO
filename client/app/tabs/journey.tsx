import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, Text, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { JourneyCanvas } from '../../src/components/journey/JourneyCanvas';
import { JourneyNode } from '../../src/components/journey/JourneyNode';
import { TimelinePath } from '../../src/components/journey/TimelinePath';
import { JournalModal } from '../../src/components/journey/JournalModal';
import { useAuth } from '../../src/providers/AuthProvider';
import { useJourney } from '../../src/providers/JourneyProvider';
import { JournalApi } from '../../src/services/journal.service';

const SCREEN_WIDTH = Dimensions.get("window").width;

// Generate positions dynamically for journals
const generatePositions = (count: number) => {
  const positions = [];
  const verticalSpacing = 180;
  const leftX = SCREEN_WIDTH * 0.15;
  const middleX = SCREEN_WIDTH * 0.50;
  const rightX = SCREEN_WIDTH * 0.78;
  
  for (let i = 0; i < count; i++) {
    let centerX;
    const pattern = i % 3;
    
    if (pattern === 0) centerX = leftX;
    else if (pattern === 1) centerX = middleX;
    else centerX = rightX;
    
    positions.push({
      centerX,
      centerY: 120 + (i * verticalSpacing),
    });
  }
  
  return positions;
};

export default function JourneyScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { journals, isLoading, error, refreshJourneys } = useJourney();
  const [selectedJournal, setSelectedJournal] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);

  const handleNodePress = async (journalId: string) => {
    try {
      setLoadingJournal(true);
      setModalVisible(true);
      console.log('📖 Fetching journal:', journalId);
      
      const response = await JournalApi.getById(journalId);
      console.log('✅ Journal fetched:', response.data);
      setSelectedJournal(response.data);
    } catch (error: any) {
      console.error('❌ Failed to fetch journal:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Show error alert to user
      const errorMsg = error.response?.data?.message || 
                       error.message || 
                       'Failed to load journal content';
      alert(`Error: ${errorMsg}`);
      
      setModalVisible(false);
      setSelectedJournal(null);
    } finally {
      setLoadingJournal(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedJournal(null);
  };

  // Sort journals by date (newest first) so oldest appears at bottom
  const sortedJournals = [...journals].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Descending: newest date first (top), oldest last (bottom)
  });

  const positions = generatePositions(sortedJournals.length);
  const stages = sortedJournals.map((journal, index) => ({
    id: journal.id,
    centerX: positions[index].centerX,
    centerY: positions[index].centerY,
  }));

  // Calculate content height based on last stage position + padding
  const contentHeight = stages.length > 0 ? stages[stages.length - 1].centerY + 200 : 800;

  // Show loading while checking auth or loading journals
  if (authLoading || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading your journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>Please Login</Text>
          <Text style={styles.emptySubtitle}>You need to be logged in to view your journey</Text>
          <Pressable style={styles.loginButton} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Error Loading Journey</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <Pressable style={styles.loginButton} onPress={refreshJourneys}>
            <Text style={styles.loginButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (journals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📔</Text>
          <Text style={styles.emptyTitle}>No journals yet</Text>
          <Text style={styles.emptySubtitle}>Start writing to see your journey unfold</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <Text style={styles.headerSubtitle}>Every step tells a story</Text>
      </View>

      <JourneyCanvas contentHeight={contentHeight}>
        {/* Render the timeline path */}
        <TimelinePath nodes={stages} height={contentHeight} />

        {/* Render journey nodes */}
        {stages.map((stage, index) => (
          <JourneyNode
            key={stage.id}
            stage={index + 1}
            status="current"
            position={{ x: stage.centerX, y: stage.centerY }}
            onPress={() => handleNodePress(stage.id)}
          />
        ))}
      </JourneyCanvas>

      {/* Journal Modal */}
      <JournalModal
        isVisible={modalVisible}
        journal={selectedJournal}
        loading={loadingJournal}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});