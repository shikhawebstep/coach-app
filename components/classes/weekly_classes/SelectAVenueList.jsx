import CustomLoader from "@/components/common/CustomLoader";
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

export default function SelectAVenueList({ venueId, onBack, onSessionSelect }) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClassTab, setActiveClassTab] = useState(null);
  const [activeTermTab, setActiveTermTab] = useState(null);
  const [classes, setClasses] = useState([]);
  const [termsByClass, setTermsByClass] = useState({});
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (venueId) fetchClasses();
    else setLoading(false);
  }, [venueId]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/${venueId}/detail`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await response.json();
      if (response.ok) {
        const classSchedules = result?.data?.classSchedules || [];
        setClasses(classSchedules);

        const map = {};
        const termGroups = result?.data?.termGroups || [];
        termGroups.forEach((tg) => {
          tg.terms?.forEach((term) => {
            const termSessions = term.sessionsMap || [];
            termSessions.forEach((session) => {
              const csId = session.sessionPlan?.classScheduleId;
              if (!csId) return;
              if (!map[csId]) map[csId] = [];
              let bucket = map[csId].find((b) => b.termId === term.id);
              if (!bucket) {
                bucket = {
                  termId: term.id,
                  termName: term.termName,
                  sessions: [],
                };
                map[csId].push(bucket);
              }
              bucket.sessions.push(session);
            });
          });
        });
        setTermsByClass(map);

        if (classSchedules.length > 0) {
          const firstClassId = classSchedules[0].id;
          setActiveClassTab(firstClassId);
          const firstTerms = map[firstClassId] || [];
          if (firstTerms.length > 0) setActiveTermTab(firstTerms[0].termId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassTabPress = (classId) => {
    setActiveClassTab(classId);
    setSearchQuery("");
    const terms = termsByClass[classId] || [];
    setActiveTermTab(terms.length > 0 ? terms[0].termId : null);
  };

  const renderList = () => {
    if (loading)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CustomLoader size={80} color="#3B82F6" />
        </View>
      );
    const formatTimeRange = (startTime, endTime) => {
      if (!startTime || !endTime) return "";
      const startStripped = startTime.replace(/\s*(AM|PM)$/i, "");
      return `${startStripped} - ${endTime}`;
    };
    const terms = termsByClass[activeClassTab] || [];
    const activeTerm = terms.find((t) => t.termId === activeTermTab);
    const sessions = activeTerm?.sessions || [];

    const activeClass = classes.find((c) => c.id === activeClassTab);
    const timeLabel = activeClass
      ? formatTimeRange(activeClass.startTime, activeClass.endTime)
      : "";

    const displaySessions = sessions.filter(
      (s) =>
        !searchQuery ||
        s.sessionPlan?.groupName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
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
        month: "short",
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
              key={item.sessionPlan?.mapId ?? index}
              style={[styles.card, isDark && styles.cardDark]}
              onPress={() => onSessionSelect(item.sessionPlan?.mapId)}
            >
              <View style={styles.colSession}>
                <Text
                  style={[
                    styles.sessionLabel,
                    isDark && styles.sessionLabelDark,
                  ]}
                >
                  Session {index + 1}
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
                  {item?.sessionPlan?.groupName}
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

  const currentTerms = termsByClass[activeClassTab] || [];

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

      {/* Class Tabs */}
      {!loading && classes.length > 0 && (
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {classes.map((cls, i) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.tab,
                  activeClassTab === cls.id
                    ? styles.activeTab
                    : isDark
                      ? styles.inactiveTabDark
                      : styles.inactiveTab,
                ]}
                onPress={() => handleClassTabPress(cls.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeClassTab === cls.id
                      ? styles.activeTabText
                      : isDark
                        ? styles.inactiveTabTextDark
                        : styles.inactiveTabText,
                  ]}
                >
                  Class {i + 1}: {cls.className}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Term Tabs */}
      {!loading && currentTerms.length > 1 && (
        <View style={[styles.tabsWrapper, { marginBottom: 12 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {currentTerms.map((term) => (
              <TouchableOpacity
                key={term.termId}
                style={[
                  styles.termTab,
                  activeTermTab === term.termId
                    ? isDark
                      ? styles.activeTermTabDark
                      : styles.activeTermTab
                    : isDark
                      ? styles.inactiveTermTabDark
                      : styles.inactiveTermTab,
                ]}
                onPress={() => setActiveTermTab(term.termId)}
              >
                <Text
                  style={[
                    styles.termTabText,
                    activeTermTab === term.termId
                      ? styles.activeTermTabText
                      : isDark
                        ? styles.inactiveTermTabTextDark
                        : styles.inactiveTermTabText,
                  ]}
                >
                  {term.termName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
  tabsWrapper: {
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 2,
  },
  inactiveTab: {
    backgroundColor: "#fff",
    borderColor: "#0E35AD",
  },
  inactiveTabDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#5B8DEF",
  },
  activeTab: {
    backgroundColor: "#3B82F6",
    borderColor: "#0E35AD",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
  },
  inactiveTabText: {
    color: "#0E35AD",
  },
  inactiveTabTextDark: {
    color: "#93B4F7",
  },
  activeTabText: {
    color: "#fff",
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
    flex:1,
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
     flex:1,
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
  termTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  activeTermTab: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  activeTermTabDark: {
    backgroundColor: "#1E2A4A",
    borderColor: "#3B82F6",
  },
  inactiveTermTab: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  inactiveTermTabDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  termTabText: {
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
  },
  activeTermTabText: {
    color: "#3B82F6",
  },
  inactiveTermTabText: {
    color: "#6B7280",
  },
  inactiveTermTabTextDark: {
    color: "#9CA3AF",
  },
});
