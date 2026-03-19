import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type HeroStat = {
  value: string | number;
  label: string;
};

type HomeStyleScreenProps = {
  title: string;
  subtitle: string;
  kicker?: string;
  rightAccessory?: React.ReactNode;
  stats?: HeroStat[];
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
};

export function HomeStyleScreen({
  title,
  subtitle,
  kicker,
  rightAccessory,
  stats,
  children,
  scrollable = true,
  contentContainerStyle,
}: HomeStyleScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.heroShell}>
        <LinearGradient
          colors={["#2E2A26", "#6B645C", "#B5A993"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.orbOne} />
          <View style={styles.orbTwo} />

          <View style={styles.topRow}>
            <View style={styles.titleWrap}>
              {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {rightAccessory ? (
              <View style={styles.accessoryWrap}>{rightAccessory}</View>
            ) : null}
          </View>

          {stats && stats.length > 0 ? (
            <View style={styles.statRow}>
              {stats.slice(0, 3).map((stat) => (
                <View key={stat.label} style={styles.statPill}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </LinearGradient>
      </View>

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

type SectionCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SectionCard({ children, style }: SectionCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  heroShell: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 10,
  },
  hero: {
    minHeight: 180,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  orbOne: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  orbTwo: {
    position: "absolute",
    bottom: -36,
    left: -24,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(12,22,33,0.2)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  accessoryWrap: {
    marginTop: 2,
  },
  kicker: {
    fontSize: 11,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Roboto_500Medium",
  },
  title: {
    marginTop: 6,
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Roboto_400Regular",
  },
  statRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "rgba(255,255,255,0.84)",
    fontFamily: "Roboto_400Regular",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 118,
    gap: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 118,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
