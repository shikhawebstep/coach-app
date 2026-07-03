import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function WeeklyStudentClassDetails({
  onBack,
  onSave,
  onCancel,
  student,
}) {
  const raw = student?.rawStudent;
  const booking = student?.booking;
  const bookingId = student?.bookingId || booking?.id;
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fullName =
    student?.name ||
    `${raw?.studentFirstName || ""} ${raw?.studentLastName || ""}`.trim() ||
    "-";
  const age = raw?.age ? `${raw.age}` : student?.age || "-";
  const medical = raw?.medicalInformation || "-";
  const parent = raw?.parents?.[0];
  const parentName = parent
    ? `${parent.parentFirstName || ""} ${parent.parentLastName || ""}`.trim()
    : "-";
  const parentPhone = parent?.parentPhoneNumber || "-";

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!notes.trim()) {
      Alert.alert("Validation", "Please enter a note before saving.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/${bookingId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ additionalNote: notes.trim() }),
        },
      );
      const data = await response.json();
      if (!response.ok || data?.status === false) {
        throw new Error(data?.message || "Failed to save note");
      }
      Alert.alert("Success", "Note saved successfully.");
      onSave?.();
    } catch (error) {
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          {fullName} information
        </Text>
      </View>

      <View style={[styles.divider, isDark && styles.dividerDark]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Student Information
        </Text>
        <View style={styles.rowGroup}>
          <View style={styles.col}>
            <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              Full Name
            </Text>
            <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              {fullName}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              Age
            </Text>
            <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              {age}
            </Text>
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
            Medical information
          </Text>
          <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
            {medical}
          </Text>
        </View>

        <View style={[styles.divider, isDark && styles.dividerDark]} />

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Parent Information
        </Text>
        <View style={styles.rowGroup}>
          <View style={styles.col}>
            <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              Full Name
            </Text>
            <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              {parentName}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              Telephone number
            </Text>
            <Text style={[styles.fieldValue, styles.phone]}>{parentPhone}</Text>
          </View>
        </View>

        <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
          Notes
        </Text>
        <TextInput
          style={[styles.notesInput, isDark && styles.notesInputDark]}
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
          scrollEnabled={false}
          placeholderTextColor={isDark ? "#8A8B93" : "#a0a0a0"}
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, isDark && styles.cancelBtnDark]}
            onPress={onBack}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 8,
  },
  backButton: { marginRight: 4 },
  headerTitle: {
    fontSize: 26,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  headerTitleDark: { color: "#fff" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 16 },
  dividerDark: { backgroundColor: "#2A2A2A" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    color: "#4B4B56",
    marginBottom: 12,
    marginTop: 4,
    fontFamily: "Urbanist_600SemiBold",
  },
  sectionTitleDark: { color: "#D1D5DB" },
  rowGroup: { flexDirection: "row", marginBottom: 16, gap: 32 },
  col: { flex: 1 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
    fontFamily: "Urbanist_700Bold",
  },
  fieldLabelDark: { color: "#8A8B93" },
  fieldValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontFamily: "Urbanist_600SemiBold",
  },
  fieldValueDark: { color: "#E5E7EB" },
  phone: { color: "#3B82F6" },
  notesInput: {
    borderWidth: 1,
    borderColor: "#9E9FAA",
    borderRadius: 12,
    padding: 12,
    height: 140,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#F6F6F7",
    marginTop: 6,
    marginBottom: 32,
    fontFamily: "Urbanist_400Regular",
  },
  notesInputDark: {
    borderColor: "#3A3A3C",
    backgroundColor: "#1E1E1E",
    color: "#fff",
  },
  buttonRow: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnDark: {
    backgroundColor: "#1E1E1E",
  },
  cancelText: {
    color: "#3B82F6",
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 15, fontFamily: "Urbanist_600SemiBold" },
});
