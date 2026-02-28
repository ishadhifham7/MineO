import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

type JournalModalProps = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
};

export const JournalModal: React.FC<JournalModalProps> = ({
  visible,
  onClose,
  onEdit,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Journal Content (View Only) */}
              <View style={styles.content}>
                <Text style={styles.title}>Journal Title</Text>
                <Text style={styles.body}>
                  This is the journal content preview. 
                  Later we will pass real journal data here.
                </Text>
              </View>

              {/* Edit Button */}
              <Pressable style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editText}>Edit Journal</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: "#444",
  },
  editButton: {
    padding: 16,
    backgroundColor: "#6C63FF",
    alignItems: "center",
  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
});