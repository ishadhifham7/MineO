import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string | null;
  onEditPress: () => void;
  onAvatarPress?: () => void;
};

export function ProfileHeaderCard({
  name,
  username,
  email,
  bio,
  avatarUrl,
  onEditPress,
  onAvatarPress,
}: Props) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onAvatarPress} style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>👤</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.handle}>@{username}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.bio}>{bio}</Text>

      <Pressable style={styles.editBtn} onPress={onEditPress}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatarWrap: { marginBottom: 10 },
  avatar: { width: 78, height: 78, borderRadius: 39 },
  avatarPlaceholder: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: { fontSize: 26 },
  name: { fontSize: 22, fontWeight: "800", color: "#111", marginTop: 4 },
  handle: { fontSize: 14, fontWeight: "600", color: "#6b7280", marginTop: 2 },
  email: { fontSize: 13, color: "#9ca3af", marginTop: 6 },
  bio: { fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 10, lineHeight: 18 },
  editBtn: {
    marginTop: 14,
    width: "100%",
    backgroundColor: "#2f80ed",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});