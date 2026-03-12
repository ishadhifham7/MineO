import React, { useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { TextBlock as TextBlockType, ImageBlock as ImageBlockType } from '../../../types/journal';
import type { JournalEntryWithBlocks } from '../../features/journal/journal.types';

// ---- constants -------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = 520;
const VIEWER_PADDING = 28;
const CANVAS_EXTRA = 400;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

// ---- helpers ---------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

function computeBoundingBox(blocks: JournalEntryWithBlocks['blocks']) {
  if (blocks.length === 0) {
    return { minX: 0, minY: 0, contentWidth: CARD_WIDTH - 40, contentHeight: 300 };
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  blocks.forEach((b) => {
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  });
  return {
    minX: minX - VIEWER_PADDING,
    minY: minY - VIEWER_PADDING,
    contentWidth: maxX - minX + VIEWER_PADDING * 2,
    contentHeight: maxY - minY + VIEWER_PADDING * 2,
  };
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const suffix =
      day === 1 || day === 21 || day === 31 ? 'st' :
      day === 2 || day === 22 ? 'nd' :
      day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} of ${month}`;
  } catch {
    return dateString;
  }
};

// ---- types -----------------------------------------------------------------

interface JournalModalProps {
  isVisible: boolean;
  journal: JournalEntryWithBlocks | null;
  loading?: boolean;
  onClose: () => void;
  onShowInCanvas?: () => void;
}

// ---- component -------------------------------------------------------------

export const JournalModal = ({ isVisible, journal, loading, onClose, onShowInCanvas }: JournalModalProps) => {
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const scrollToCenter = useCallback(() => {
    const half = CANVAS_EXTRA / 2;
    horizontalScrollRef.current?.scrollTo({ x: half, animated: true });
    verticalScrollRef.current?.scrollTo({ y: half, animated: true });
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 120 });
      savedScale.value = 1;
      runOnJS(scrollToCenter)();
    });

  const composed = Gesture.Exclusive(doubleTap, pinchGesture);

  const canvasAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!journal && !loading) return null;

  const sortedBlocks = journal?.blocks
    ? [...journal.blocks].sort((a, b) => a.zIndex - b.zIndex)
    : [];
  const { minX, minY, contentWidth, contentHeight } = computeBoundingBox(sortedBlocks);
  const canvasWidth = Math.max(contentWidth, CARD_WIDTH - 40) + CANVAS_EXTRA;
  const canvasHeight = Math.max(contentHeight, 300) + CANVAS_EXTRA;

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
              {/* Header: date + close */}
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.dateText}>
                    {journal?.date ? formatDate(journal.date) : 'Unknown date'}
                  </Text>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {journal?.title?.trim() || 'Untitled'}
                  </Text>
                </View>
                <Pressable onPress={onClose} hitSlop={10}>
                  <Ionicons name="close-circle" size={26} color="#B5A993" />
                </Pressable>
              </View>

              {/* Hint */}
              <Text style={styles.hint}>
                Pinch to zoom · scroll to pan · double-tap to reset
              </Text>

              {/* Canvas viewport */}
              <View style={styles.viewportWrapper}>
                <View style={styles.viewport}>
                <ScrollView
                  ref={verticalScrollRef}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ minHeight: canvasHeight }}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  bounces
                  keyboardShouldPersistTaps="handled"
                >
                  <ScrollView
                    ref={horizontalScrollRef}
                    horizontal
                    contentContainerStyle={{ minWidth: canvasWidth }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    bounces
                    keyboardShouldPersistTaps="handled"
                  >
                    <GestureDetector gesture={composed}>
                      <Reanimated.View
                        style={[
                          { width: canvasWidth, height: canvasHeight, backgroundColor: '#FAF8F5' },
                          canvasAnimStyle,
                        ]}
                      >
                        <View
                          style={{
                            position: 'absolute',
                            left: CANVAS_EXTRA / 2,
                            top: CANVAS_EXTRA / 2,
                            width: Math.max(contentWidth, CARD_WIDTH - 40),
                            height: Math.max(contentHeight, 300),
                          }}
                          pointerEvents="none"
                        >
                          {sortedBlocks.length === 0 && (
                            <Text style={styles.emptyText}>No content in this entry.</Text>
                          )}

                          {sortedBlocks.map((block) => {
                            const adjX = block.x - minX;
                            const adjY = block.y - minY;

                            if (block.type === 'text') {
                              const tb = block as TextBlockType;
                              const textStyle: TextStyle = {
                                fontSize: tb.fontSize,
                                lineHeight: tb.lineHeight,
                                letterSpacing: tb.letterSpacing,
                                fontWeight: tb.isBold ? 'bold' : 'normal',
                                fontStyle: tb.isItalic ? 'italic' : 'normal',
                                textDecorationLine: tb.isUnderline ? 'underline' : 'none',
                                color: tb.textColor,
                                textAlign: tb.textAlign,
                              };
                              return (
                                <View
                                  key={block.id}
                                  style={[
                                    styles.blockBase,
                                    {
                                      left: adjX,
                                      top: adjY,
                                      width: block.width,
                                      height: block.height,
                                      zIndex: block.zIndex,
                                      transform: [{ rotate: `${block.rotation}deg` }],
                                    },
                                  ]}
                                >
                                  <Text style={textStyle}>{tb.text}</Text>
                                </View>
                              );
                            }

                            if (block.type === 'image') {
                              const ib = block as ImageBlockType;
                              return (
                                <View
                                  key={block.id}
                                  style={[
                                    styles.imageBlockBase,
                                    {
                                      left: adjX,
                                      top: adjY,
                                      width: block.width,
                                      height: block.height,
                                      zIndex: block.zIndex,
                                      transform: [{ rotate: `${block.rotation}deg` }],
                                    },
                                  ]}
                                >
                                  <Image
                                    source={{ uri: ib.imageUri }}
                                    style={styles.blockImage}
                                    resizeMode="cover"
                                  />
                                </View>
                              );
                            }

                            return null;
                          })}
                        </View>
                      </Reanimated.View>
                    </GestureDetector>
                  </ScrollView>
                </ScrollView>
                </View>

                {/* Show in Canvas button — bottom-right corner */}
                {onShowInCanvas && (
                  <Pressable style={styles.showInCanvasBtn} onPress={onShowInCanvas}>
                    <Ionicons name="expand-outline" size={13} color="#6366F1" />
                    <Text style={styles.showInCanvasTxt}>Show in Canvas</Text>
                  </Pressable>
                )}
              </View>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 0,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  dateText: {
    color: '#B5A993',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E2A26',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#B5A993',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  viewportWrapper: {
    flex: 1,
    position: 'relative',
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
  },
  showInCanvasBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: '#6366F1',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  showInCanvasTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
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
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
  blockBase: {
    position: 'absolute',
    padding: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  imageBlockBase: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
  },
  blockImage: {
    width: '100%',
    height: '100%',
  },
});