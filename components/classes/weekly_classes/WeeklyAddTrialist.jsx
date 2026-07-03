import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function WeeklyAddTrialist({ onBack }) {
  const [studentName, setStudentName] = useState("Donald Johnson");
  const [parentName, setParentName] = useState("Mark Johnson");
  const [phone, setPhone] = useState("123456789");
  const [notes, setNotes] = useState("");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Add a walk by trialist
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Inputs */}
        <View
          style={[styles.inputContainer, isDark && styles.inputContainerDark]}
        >
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Student Full Name"
            placeholderTextColor={isDark ? "#8A8B93" : "#797A88"}
            value={studentName}
            onChangeText={setStudentName}
          />
        </View>

        <View
          style={[styles.inputContainer, isDark && styles.inputContainerDark]}
        >
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Parent Full Name"
            placeholderTextColor={isDark ? "#8A8B93" : "#797A88"}
            value={parentName}
            onChangeText={setParentName}
          />
        </View>

        <View
          style={[styles.inputContainer, isDark && styles.inputContainerDark]}
        >
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Phone Number"
            placeholderTextColor={isDark ? "#8A8B93" : "#797A88"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Text Area */}
        <View
          style={[
            styles.textAreaContainer,
            isDark && styles.textAreaContainerDark,
          ]}
        >
          <TextInput
            style={[styles.textArea, isDark && styles.textAreaDark]}
            multiline={true}
            placeholderTextColor={isDark ? "#8A8B93" : "#797A88"}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
            onPress={onBack}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add student</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  headerTitleDark: {
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#9E9FAA",
    borderRadius: 12,
    backgroundColor: "#F6F6F7",
    marginBottom: 16,
  },
  inputContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Urbanist_400Regular",
  },
  inputDark: {
    color: "#fff",
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#9E9FAA",
    borderRadius: 12,
    backgroundColor: "#F6F6F7",
    marginBottom: 24,
    height: 150,
  },
  textAreaContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  textArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 16,
    color: "#1a1a1a",
    flex: 1,
    fontFamily: "Urbanist_400Regular",
  },
  textAreaDark: {
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cancelButtonDark: {
    backgroundColor: "#1E1E1E",
  },
  cancelButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
  },
});
