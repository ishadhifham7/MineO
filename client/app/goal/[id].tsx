
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Task = { id: string; text: string; done: boolean; why?: string };
type Stage = {
  id: string;
  title: string;
  duration: string;
  xp: number;
  tasks: Task[];
  completed?: boolean;
};

export default function GoalDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeStage, setActiveStage] = useState(0);
  const [showWhyId, setShowWhyId] = useState<string | null>(null);
  const [tasksState, setTasksState] = useState<Record<string, boolean>>({});

  // Demo goal details (replace with real data by id)
  const goal = useMemo(() => {
    return {
      id,
      title: "My Goal Title",
      progress: 30,
      stages: [
        {
          id: "s1",
          title: "Foundation & Awareness",
          duration: "1 week",
          xp: 50,
          tasks: [
            { id: "t1", text: "Reflect on why this goal matters to you", done: false, why: "Understanding your motivation helps you stay committed." },
            { id: "t2", text: "Identify current habits related to this goal", done: false, why: "Knowing your habits helps you plan better." },
            { id: "t3", text: "Set up a simple tracking method", done: false, why: "Tracking progress keeps you accountable." },
          ],
        },
        { id: "s2", title: "Stage 2", duration: "1 week", xp: 50, tasks: [], completed: false },
        { id: "s3", title: "Stage 3", duration: "1 week", xp: 50, tasks: [], completed: false },
        { id: "s4", title: "Stage 4", duration: "1 week", xp: 50, tasks: [], completed: false },
      ] as Stage[],
    };
  }, [id]);

  const stage = goal.stages[activeStage];
  const completedTasks = stage.tasks.filter((t) => tasksState[t.id] || t.done).length;
  const totalTasks = stage.tasks.length;
  const stageProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskToggle = (taskId: string) => {
    setTasksState((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 18, paddingTop: Platform.OS === 'ios' ? 54 : 24, backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Pressable onPress={() => router.back()} style={styles.backFab}>
            <Ionicons name="arrow-back" size={20} color="#111" />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', marginLeft: 12, flex: 1 }} numberOfLines={1}>{goal.title}</Text>
        </View>
        {/* Overall Progress */}
        <View style={styles.overallCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#222' }}>Overall Progress</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>{Math.round(goal.progress)}%</Text>
          </View>
          <View style={{ width: '100%', height: 8, backgroundColor: '#E6E6E6', borderRadius: 8, overflow: 'hidden' }}>
            <LinearGradient
              colors={["#63D1E6", "#B39DDB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: `${goal.progress}%`, height: 8, borderRadius: 8 }}
            />
          </View>
        </View>
      </View>

      {/* Stage Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 8 }} contentContainerStyle={{ gap: 10 }}>
        {goal.stages.map((s, idx) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setActiveStage(idx)}
            style={[
              styles.stagePill,
              idx === activeStage ? styles.stagePillActive : s.completed ? styles.stagePillCompleted : styles.stagePillInactive,
            ]}
          >
            <Text style={[styles.stageText, idx === activeStage && styles.stageTextActive]}>
              {s.completed ? '✓ ' : ''}Stage {idx + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Stage Card */}
        <View style={styles.stageCard}>
          <Text style={styles.stageTitle}>{stage.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6B6B6B' }}>⏱️ {stage.duration}</Text>
            <Text style={{ fontSize: 12, color: '#F0B23D' }}>✦ {stage.xp} XP</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#6B6B6B' }}>{completedTasks} of {totalTasks} tasks completed</Text>
            <Text style={{ fontSize: 12, color: '#6B6B6B', fontWeight: '700' }}>{Math.round(stageProgress)}%</Text>
          </View>
          <View style={{ width: '100%', height: 6, backgroundColor: '#E6E6E6', borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
            <LinearGradient
              colors={["#B39DDB", "#F7B7A3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: `${stageProgress}%`, height: 6, borderRadius: 6 }}
            />
          </View>
        </View>

        {/* Tasks */}
        <View style={{ marginTop: 18 }}>
          {stage.tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                onPress={() => handleTaskToggle(task.id)}
                style={[styles.taskCircle, (tasksState[task.id] || task.done) && styles.taskCircleChecked]}
              >
                {(tasksState[task.id] || task.done) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskText, (tasksState[task.id] || task.done) && { textDecorationLine: 'line-through', color: '#B0B0B0' }]}>{task.text}</Text>
                {task.why && (
                  <>
                    <TouchableOpacity onPress={() => setShowWhyId(showWhyId === task.id ? null : task.id)}>
                      <Text style={styles.taskLink}>ⓘ Why this matters</Text>
                    </TouchableOpacity>
                    {showWhyId === task.id && (
                      <View style={styles.whyBox}>
                        <Text style={styles.whyText}>{task.why}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Encouragement */}
        {stageProgress > 0 && stageProgress < 100 && (
          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementText}>
              {stageProgress < 50
                ? "You're making progress! Small steps still count. 🌱"
                : "You're doing great! Keep going at your own pace. ✨"}
            </Text>
          </View>
        )}

        {/* Stage Completed */}
        {stage.completed && (
          <View style={styles.stageCompleteBox}>
            <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 6 }}>🎉</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 2 }}>Stage Complete!</Text>
            <Text style={{ fontSize: 12, color: '#6B6B6B', textAlign: 'center' }}>You earned {stage.xp} XP</Text>
          </View>
        )}
      </ScrollView>

      {/* AI Support Button */}
      <View style={styles.supportBtnFloating}>
        <TouchableOpacity style={styles.supportBtn}>
          <Ionicons name="sparkles-outline" size={18} color="#49B7D0" />
          <Text style={styles.supportTxt}>Need Support?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  overallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  stagePill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFF',
  },
  stagePillActive: {
    backgroundColor: '#63D1E6',
    borderColor: '#63D1E6',
  },
  stagePillCompleted: {
    backgroundColor: '#E6F9ED',
    borderColor: '#7ACD8C',
  },
  stagePillInactive: {
    backgroundColor: '#FFF',
    borderColor: '#E6E6E6',
  },
  stageText: { fontSize: 13, fontWeight: '700', color: '#6B6B6B' },
  stageTextActive: { color: '#fff' },
  stageCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  stageTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 2 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  taskCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  taskCircleChecked: {
    backgroundColor: '#7ACD8C',
    borderColor: '#7ACD8C',
  },
  taskText: { fontSize: 14, fontWeight: '700', color: '#222' },
  taskLink: { marginTop: 6, fontSize: 12, fontWeight: '700', color: '#49B7D0' },
  whyBox: { marginTop: 6, backgroundColor: '#E6F9ED', borderRadius: 8, padding: 10 },
  whyText: { fontSize: 12, color: '#222' },
  encouragementBox: { marginTop: 24, backgroundColor: '#E6F9ED', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#7ACD8C' },
  encouragementText: { fontSize: 13, color: '#222', textAlign: 'center' },
  stageCompleteBox: { marginTop: 24, backgroundColor: '#E6F9ED', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#7ACD8C', alignItems: 'center' },
  supportBtnFloating: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: Platform.OS === 'ios' ? 32 : 18,
    alignItems: 'center',
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  supportTxt: { fontSize: 15, fontWeight: '800', color: '#49B7D0', marginLeft: 8 },
});
