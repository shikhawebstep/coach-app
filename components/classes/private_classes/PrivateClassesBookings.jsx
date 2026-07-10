import CustomLoader from "@/components/common/CustomLoader";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function PrivateClassesBookings({ onBack, onStudentSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/one-to-one/bookings`,
        requestOptions
      );
      const result = await response.json();
      if (response.ok) {
        setBookings(result?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentNames = (booking) => {
    if (booking.students && booking.students.length > 0) {
      return booking.students
        .map((s) =>
          `${s.studentFirstName || ""} ${s.studentLastName || ""}`.trim(),
        )
        .join(", ");
    }
    return booking.lead?.childName || booking.lead?.parentName || "No Student";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const studentNames = getStudentNames(booking).toLowerCase();
    const parentName = booking.lead?.parentName?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return studentNames.includes(q) || parentName.includes(q);
  });

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.centeredDark]}>
        <CustomLoader size={80} color="#3B82F6" />
      </View>
    );
  }

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
          Private classes bookings
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

      {/* Content */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length > 0 ? (
          <>
            <Text style={[styles.listTitle, isDark && styles.listTitleDark]}>
              Your private students
            </Text>
            {filteredBookings.map((booking) => {
              const studentNames = getStudentNames(booking);
              const displayDate = formatDate(booking.date);
              const displayTime = booking.time || "-";
              const displayCountText =
                booking.totalStudents || booking.students?.length || 0;
              const statusStr = booking.status
                ? booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)
                : "Pending";
              const isActiveOrCompleted =
                booking.status === "active" || booking.status === "Completed";

              return (
                <TouchableOpacity
                  key={booking.id}
                  style={[styles.card, isDark && styles.cardDark]}
                  onPress={() => onStudentSelect && onStudentSelect(booking.id)}
                >
                  <View style={styles.cardInfo}>
                    <Text
                      style={[styles.cardTitle, isDark && styles.cardTitleDark]}
                      numberOfLines={2}
                    >
                      {studentNames}
                    </Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text
                      style={[styles.cardText, isDark && styles.cardTextDark]}
                    >
                      {displayDate}
                    </Text>
                    <Text
                      style={[styles.cardText, isDark && styles.cardTextDark]}
                    >
                      {displayTime}
                    </Text>
                  </View>
                  <View style={styles.cardCount}>
                    <Text
                      style={[styles.countText, isDark && styles.countTextDark]}
                    >
                      {displayCountText}
                    </Text>
                  </View>
                  <View style={styles.cardStatusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        isActiveOrCompleted
                          ? styles.statusCompleted
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isActiveOrCompleted
                            ? styles.statusTextWhite
                            : styles.statusTextBlack,
                        ]}
                      >
                        {statusStr}
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
            })}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/images/noBooking.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
              No Bookings
            </Text>
            <Text
              style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}
            >
              {"You don't have any bookings at this time"}
            </Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    fontSize: 22,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  headerTitleDark: {
    color: "#fff",
  },
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
  searchFocused: {
    borderColor: "#3B82F6",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },
  searchInputDark: {
    color: "#fff",
  },
  clearIcon: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  listTitleDark: {
    color: "#fff",
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
  cardInfo: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  cardTitleDark: {
    color: "#fff",
  },
  cardDetails: {
    flex: 1,
    marginRight: 8,
  },
  cardText: {
    fontSize: 13,
    fontFamily: "Urbanist_400Regular",
    color: "#666",
    lineHeight: 18,
  },
  cardTextDark: {
    color: "#9CA3AF",
  },
  cardCount: {
    flex: 1,
    alignItems: "center",
    marginRight: 8,
  },
  countText: {
     flex: 1,
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  countTextDark: {
    color: "#fff",
  },
  cardStatusContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  statusCompleted: {
    backgroundColor: "#1CAB4B",
  },
  statusPending: {
    backgroundColor: "#FFD700",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
  },
  statusTextWhite: {
    color: "#fff",
  },
  statusTextBlack: {
    color: "#1a1a1a",
  },
  chevron: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: "#fff",
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: "Urbanist_400Regular",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  emptySubtitleDark: {
    color: "#9CA3AF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centeredDark: {
    backgroundColor: "#121212",
  },
});
