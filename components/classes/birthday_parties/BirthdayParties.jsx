// BirthdayParties.jsx

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

export default function BirthdayParties({ onBack, onBookingSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/birthday-party/bookings`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (response.ok) setBookings(result?.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const studentName =
      `${booking.students?.[0]?.studentFirstName || ""} ${booking.students?.[0]?.studentLastName || ""}`.toLowerCase();
    const parentName = booking.lead?.parentName?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return studentName.includes(q) || parentName.includes(q);
  });

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
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
          Birthday Parties
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          isDark && styles.searchContainerDark,
          searchQuery ? styles.searchFocused : null,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? "#8A8B93" : "#a0a0a0"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search students..."
          placeholderTextColor={isDark ? "#8A8B93" : "#a0a0a0"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearIcon}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? "#8A8B93" : "#a0a0a0"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={[styles.centered, isDark && styles.centeredDark]}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.listTitle, isDark && styles.listTitleDark]}>
            Your Birthday Party Bookings
          </Text>
          {filteredBookings.length === 0 ? (
            <Text style={styles.emptyText}>No bookings found</Text>
          ) : (
            filteredBookings.map((booking) => {
              const student = booking.students?.[0];
              const studentName =
                `${student?.studentFirstName || ""} ${student?.studentLastName || ""}`.trim();
              const date = booking.date
                ? new Date(booking.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-";
              const time = booking.time || "-";
              const packageType = booking.package?.packageName || "-";
              const status = booking.status;

              return (
                <TouchableOpacity
                  key={booking.id}
                  style={[styles.card, isDark && styles.cardDark]}
                  onPress={() => onBookingSelect && onBookingSelect(booking)}
                >
                  <View style={styles.cardInfo}>
                    <Text
                      style={[styles.cardTitle, isDark && styles.cardTitleDark]}
                    >
                      {studentName}
                    </Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text
                      style={[styles.cardText, isDark && styles.cardTextDark]}
                    >
                      {date}
                    </Text>
                    <Text
                      style={[styles.cardText, isDark && styles.cardTextDark]}
                    >
                      {time}
                    </Text>
                  </View>
                  <View style={styles.cardPackage}>
                    <Text
                      style={[
                        styles.packageText,
                        isDark && styles.packageTextDark,
                      ]}
                    >
                      {packageType}
                    </Text>
                  </View>
                  <View style={styles.cardStatusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        status === "active"
                          ? styles.statusCompleted
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          status === "active"
                            ? styles.statusTextWhite
                            : styles.statusTextBlack,
                        ]}
                      >
                        {status === "active" ? "Active" : "Pending"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? "#E5E7EB" : "#000"}
                      style={styles.chevron}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 24,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  headerTitleDark: { color: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  searchFocused: { borderColor: "#3B82F6" },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "Urbanist_400Regular",
  },
  searchInputDark: { color: "#fff" },
  clearIcon: { padding: 4 },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  listTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  listTitleDark: { color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
    fontFamily: "Urbanist_400Regular",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
    shadowOpacity: 0.3,
  },
  cardInfo: { width: 80, marginRight: 16 },
  cardTitle: { fontSize: 14, color: "#1a1a1a", fontFamily: "Urbanist_700Bold" },
  cardTitleDark: { color: "#fff" },
  cardDetails: { flex: 1, marginRight: 8 },
  cardText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontFamily: "Urbanist_400Regular",
  },
  cardTextDark: { color: "#9CA3AF" },
  cardPackage: { width: 45, alignItems: "flex-start", marginRight: 8 },
  packageText: {
    fontSize: 14,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  packageTextDark: { color: "#E5E7EB" },
  cardStatusContainer: { flexDirection: "row", alignItems: "center" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  statusCompleted: { backgroundColor: "#1CAB4B" },
  statusPending: { backgroundColor: "#FFD700" },
  statusText: { fontSize: 12, fontFamily: "Urbanist_600SemiBold" },
  statusTextWhite: { color: "#fff" },
  statusTextBlack: { color: "#1a1a1a" },
  chevron: { marginLeft: 4 },
});
