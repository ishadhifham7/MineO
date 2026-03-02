import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface JournalData {
  id: string;
  date: string;
  title?: string;
  blocks?: Array<{
    type: string;
    text?: string;
    [key: string]: any;
  }>;
}

interface JournalModalProps {
  isVisible: boolean;
  journal: JournalData | null;
  loading?: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} of ${month}`;
  } catch {
    return dateString;
  }
};

export const JournalModal = ({ isVisible, journal, loading, onClose }: JournalModalProps) => {
  if (!journal && !loading) return null;

  const getTextContent = () => {
    if (!journal?.blocks || journal.blocks.length === 0) {
      return 'No content yet...';
    }
    return journal.blocks
      .filter(block => block.type === 'text' && block.text)
      .map(block => block.text)
      .join('\n\n');
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Loading journal...</Text>
            </View>
          ) : (
            <>
              {/* Header with Date and Close Icon */}
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>
                  {journal?.date ? formatDate(journal.date) : 'Unknown date'}
                </Text>
                <Pressable onPress={onClose} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#999" />
                </Pressable>
              </View>
              
              {/* Title */}
              <Text style={styles.titleText}>
                {journal?.title || 'Untitled'}
              </Text>
              
              {/* Content Area */}
              <ScrollView 
                style={styles.contentContainer} 
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.paperBody}>
                  <Text style={styles.contentText}>
                    {getTextContent()}
                  </Text>
                </View>
              </ScrollView>

              {/* Action Button: Edit */}
              <Pressable 
                style={styles.editBtn} 
                onPress={() => console.log("Edit Pressed for Journal:", journal?.id)}
              >
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  card: { 
    width: '85%', 
    backgroundColor: '#FFFCF5', // Off-white/cream paper color
    borderRadius: 24, 
    padding: 25, 
    height: 520,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10 
  },
  dateText: { 
    color: '#AAA', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  titleText: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#444', 
    marginBottom: 15 
  },
  contentContainer: { 
    flex: 1,
  },
  paperBody: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    fontWeight: '400',
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
  editBtn: { 
    backgroundColor: '#4B5563', 
    paddingVertical: 14, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  editText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 16 
  }
});