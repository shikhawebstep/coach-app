// BirthdayPartyDetails.jsx

import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function BirthdayPartyDetails({
  booking: initialBooking,
  onBack,
  onSyllabusClick,
}) {
  const [booking, setBooking] = useState(initialBooking || null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (initialBooking?.id) fetchBooking();
    else setLoading(false);
  }, [initialBooking?.id]);

  useEffect(() => {
    if (booking?.address) geocodeAddress(booking.address);
  }, [booking?.address]);

  const geocodeAddress = async (addressStr) => {
    try {
      const encoded = encodeURIComponent(addressStr);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`,
      );
      const data = await res.json();
      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (e) {
      console.error("Geocode error:", e);
    }
  };

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/birthday-party/booking/${initialBooking?.id}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await response.json();
      if (response.ok && result?.data) setBooking(result.data);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const student = booking?.students?.[0];
  const parent = booking?.parentDetails?.[0];
  const pkg = booking?.package;

  const studentName = student
    ? `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim()
    : "-";
  const parentName = parent
    ? `${parent.parentFirstName || ""} ${parent.parentLastName || ""}`.trim()
    : "-";

  const date = booking?.date
    ? new Date(booking.date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "-";
  const time = booking?.time || "-";
  const capacity = pkg?.numberOfChildren ?? booking?.capacity ?? "-";
  const status = booking?.status || "-";
  const address = booking?.address || "-";
  const phone = parent?.phoneNumber || "-";

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.centeredDark]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {studentName} birthday
          </Text>
        </View>
        <TouchableOpacity
          style={styles.syllabusButton}
          onPress={() => onSyllabusClick && onSyllabusClick(booking)}
        >
          <Text style={styles.syllabusText}>Syllabus</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Card */}
        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={isDark ? "#9CA3AF" : "#666"}
                  style={styles.infoIcon}
                />
                <Text
                  style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                >
                  Date
                </Text>
              </View>
              <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                {date}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isDark ? "#9CA3AF" : "#666"}
                  style={styles.infoIcon}
                />
                <Text
                  style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                >
                  Time
                </Text>
              </View>
              <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                {time}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={isDark ? "#9CA3AF" : "#666"}
                  style={styles.infoIcon}
                />
                <Text
                  style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                >
                  Students
                </Text>
              </View>
              <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                {capacity}
              </Text>
            </View>
            <View style={styles.infoItemSmall}>
              <Text
                style={[styles.statusLabel, isDark && styles.statusLabelDark]}
              >
                Status
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  status === "active"
                    ? styles.statusActive
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === "active" && { color: "#fff" },
                  ]}
                >
                  {status === "active" ? "Active" : "Pending"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Map */}
        {region ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapImage}
              initialRegion={region}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title={studentName}
                description={address}
              />
            </MapView>
          </View>
        ) : (
          <View
            style={[
              styles.mapContainer,
              styles.mapFallback,
              isDark && styles.mapFallbackDark,
            ]}
          >
            <Ionicons name="map-outline" size={32} color="#9CA3AF" />
            <Text style={styles.mapFallbackText}>Loading map...</Text>
          </View>
        )}

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={18}
            color={isDark ? "#9CA3AF" : "#666"}
            style={styles.locationIcon}
          />
          <Text
            style={[styles.locationText, isDark && styles.locationTextDark]}
          >
            {address}
          </Text>
        </View>

        {/* Package Info */}
        {pkg && (
          <>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Package
            </Text>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 2, marginRight: 16 }]}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Package Name
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                  ]}
                >
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    value={pkg.packageName || "-"}
                    editable={false}
                  />
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Duration
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                  ]}
                >
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    value={pkg.partyDuration ? `${pkg.partyDuration} min` : "-"}
                    editable={false}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {/* Student Information */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Student Information
        </Text>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 2, marginRight: 16 }]}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Full Name
            </Text>
            <View
              style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
              ]}
            >
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                value={studentName}
                editable={false}
              />
            </View>
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Age
            </Text>
            <View
              style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
              ]}
            >
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                value={student?.age ? `${student.age}` : "-"}
                editable={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
            Medical Info
          </Text>
          <View
            style={[styles.inputContainer, isDark && styles.inputContainerDark]}
          >
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={student?.medicalInfo || "-"}
              editable={false}
            />
          </View>
        </View>

        {/* Parent Information */}
        <Text
          style={[
            styles.sectionTitle,
            { marginTop: 16 },
            isDark && styles.sectionTitleDark,
          ]}
        >
          Parent Information
        </Text>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 16 }]}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Full Name
            </Text>
            <View
              style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
              ]}
            >
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                value={parentName}
                editable={false}
              />
            </View>
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Telephone
            </Text>
            <View
              style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
              ]}
            >
              <TextInput
                style={[styles.input, styles.inputLink]}
                value={phone}
                editable={false}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#121212" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  centeredDark: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  backButton: { marginRight: 10 },
  headerTitle: {
    fontSize: 22,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  headerTitleDark: { color: "#fff" },
  syllabusButton: {
    backgroundColor: "#1CAB4B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  syllabusText: { color: "#fff", fontSize: 14, fontFamily: "Urbanist_700Bold" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
    shadowOpacity: 0.3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoItem: { flex: 1 },
  infoItemSmall: { marginLeft: 8, alignItems: "flex-end" },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoIcon: { marginRight: 4 },
  infoLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
    fontFamily: "Urbanist_600SemiBold",
  },
  infoLabelDark: { color: "#8A8B93" },
  statusLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
    fontFamily: "Urbanist_600SemiBold",
  },
  statusLabelDark: { color: "#8A8B93" },
  infoValue: { fontSize: 14, color: "#1a1a1a", fontFamily: "Urbanist_700Bold" },
  infoValueDark: { color: "#fff" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusActive: { backgroundColor: "#1CAB4B" },
  statusPending: { backgroundColor: "#FFD700" },
  statusText: {
    fontSize: 12,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
  },
  mapImage: { width: "100%", height: "100%" },
  mapFallback: { justifyContent: "center", alignItems: "center", gap: 8 },
  mapFallbackDark: { backgroundColor: "#1E1E1E" },
  mapFallbackText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Urbanist_400Regular",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 16,
    marginBottom: 20,
  },
  locationIcon: { marginTop: 2 },
  locationText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    fontFamily: "Urbanist_400Regular",
  },
  locationTextDark: { color: "#9CA3AF" },
  sectionTitle: {
    fontSize: 18,
    color: "#4B5563",
    marginBottom: 16,
    fontFamily: "Urbanist_700Bold",
  },
  sectionTitleDark: { color: "#E5E7EB" },
  formRow: { flexDirection: "row", marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8,
    fontFamily: "Urbanist_700Bold",
  },
  inputLabelDark: { color: "#D1D5DB" },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  inputContainerDark: { backgroundColor: "#1E1E1E", borderColor: "#3A3A3C" },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Urbanist_400Regular",
  },
  inputDark: { color: "#E5E7EB" },
  inputLink: { color: "#3B82F6", fontFamily: "Urbanist_400Regular" },
});
