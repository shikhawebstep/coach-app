import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import CustomLoader from '@/components/common/CustomLoader';

export default function SelectHolidayCampSessionList({ venueId, onBack, onSessionSelect }) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (venueId) fetchSessions();
    else setLoading(false);
  }, [venueId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/holiday-camp/${venueId}/detail`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await response.json();
      if (response.ok) {
        const camp = result?.data?.holidayCamps?.[0];
        const campDates = camp?.holidayCampDates?.[0];
        const sessionsMap = campDates?.sessionsMap ?? [];
        setSessions(sessionsMap);
        setSchedule(result?.data?.classSchedules?.[0]);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => {
    if (loading)
      return (
        <CustomLoader size={80} color="#3B82F6" />
      );

    const formatTimeRange = (startTime, endTime) => {
      if (!startTime || !endTime) return "";
      const formatTime = (timeString) => {
          const [hours, minutes] = timeString.split(':');
          let h = parseInt(hours, 10);
          const ampm = h >= 12 ? 'pm' : 'am';
          h = h % 12 || 12;
          return { time: `${h}:${minutes}`, ampm };
      };
      
      const s = formatTime(startTime);
      const e = formatTime(endTime);
      
      if (s.ampm === e.ampm) {
          return `${s.time}-${e.time}${e.ampm}`;
      } else {
          return `${s.time}${s.ampm}-${e.time}${e.ampm}`;
      }
    };

    const timeLabel = schedule
      ? formatTimeRange(schedule.startTime, schedule.endTime)
      : "";

    const displaySessions = sessions.filter(
      (s, index) =>
        !searchQuery ||
        `Day ${index + 1}`.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (displaySessions.length === 0) {
      return (
        <Text
          style={[
            { textAlign: "center", marginTop: 20, color: "#666" },
            isDark && { color: "#9CA3AF" },
          ]}
        >
          No sessions found.
        </Text>
      );
    }
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const [year, month, day] = dateStr.split("-").map(Number);
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
              ? "rd"
              : "th";
      const monthName = new Date(year, month - 1, day).toLocaleString("en-GB", {
        month: "long",
      });
      return `${day}${suffix} ${monthName} ${year}`;
    };

    return (
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {displaySessions.map((item, index) => {
          const isCompleted = item.sessionPlan?.status === "completed";
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, isDark && styles.cardDark]}
              onPress={() => onSessionSelect(item.sessionPlan?.mapId || item.mapId || index)}
            >
              <View style={styles.colSession}>
                <Text
                  style={[
                    styles.sessionLabel,
                    isDark && styles.sessionLabelDark,
                  ]}
                >
                  Day {index + 1}
                </Text>
              </View>

              <View style={styles.colDate}>
                <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                  {formatDate(item.sessionDate)}
                </Text>
                <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                  {timeLabel}
                </Text>
              </View>

              <View style={styles.colPlayer}>
                <Text
                  style={[styles.playerText, isDark && styles.playerTextDark]}
                  numberOfLines={1}
                >
                  {item?.sessionPlan?.groupName || "Session"}
                </Text>
              </View>

              <View style={styles.colStatus}>
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted ? styles.statusCompleted : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isCompleted
                        ? styles.statusTextWhite
                        : styles.statusTextBlack,
                    ]}
                  >
                    {isCompleted ? "Completed" : "Pending"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isDark ? "#E5E7EB" : "#0B0B26"}
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

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
          Select a Session
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
          placeholder="Search sessions..."
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

      {renderList()}
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
    fontSize: 24,
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
    backgroundColor: "#F6F6F7",
    borderWidth: 1,
    borderColor: "#9E9FAA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
    shadowOpacity: 0.3,
  },
  colSession: {
    width: 78,
  },
  sessionLabel: {
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  sessionLabelDark: {
    color: "#fff",
  },
  colDate: {
    width: 100,
  },
  cardText: {
    fontSize: 12,
    fontFamily: "Urbanist_400Regular",
    color: "#666",
    lineHeight: 18,
  },
  cardTextDark: {
    color: "#A0A0A8",
  },
  colPlayer: {
    flex: 1,
    paddingRight: 8,
  },
  playerText: {
    fontSize: 14,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1a1a1a",
  },
  playerTextDark: {
    color: "#E5E7EB",
  },
  colStatus: {
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
});
