import CustomLoader from "@/components/common/CustomLoader";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import AddTrialist from "../common/AddTrialist";

export default function WeeklySessionTrainingDetails({
  sessionId,
  onBack,
  onStudentSelect,
  sessionTitle,
  onSessionPlanClick,
  onSessionClick,
  sessionDate,
}) {
  const { token, coachProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("Members");
  const [members, setMembers] = useState([]);
  const [trials, setTrials] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTrialist, setShowAddTrialist] = useState(false);
  const [abilityModalVisible, setAbilityModalVisible] = useState(false);
  const [selectedStudentForAbility, setSelectedStudentForAbility] = useState(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  // Helper: pulls attendance from the per-session record when available
  // (student.session.attendanceStatus), falling back to the legacy
  // student.attendance field if no session record exists yet.
  const resolveAttendance = (student) =>
    student?.session?.attendanceStatus || student?.attendance || "pending";

  const flattenBookingGroup = (bookingGroup = []) => {
    const flattened = [];

    if (!Array.isArray(bookingGroup)) return flattened;

    bookingGroup.forEach((booking) => {
      const students = booking?.students;
      if (!Array.isArray(students)) return;

      students.forEach((student) => {
        flattened.push({
          bookingId: booking.id,
          studentId: student?.id,
          sessionId: student?.session?.id,
          name: `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim(),
          age: `${student.age} Years`,
          status: resolveAttendance(student),
          ability: student?.abilityLevel?.toLowerCase() || student?.session?.ability?.toLowerCase() || 'beginner',
          rawStudent: student,
          booking: booking,
        });
      });
    });
    return flattened;
  };

  // Coaches come back in a flat shape — { coachId, coach, attendance } —
  // not wrapped in bookings with a `students` array like members/trials.
  const flattenCoaches = (coachGroup = []) => {
    if (!Array.isArray(coachGroup)) return [];

    return coachGroup.map((entry) => ({
      studentId: entry?.coachId ?? entry?.coach?.id,
      name: `${entry?.coach?.firstName || ""} ${entry?.coach?.lastName || ""}`.trim(),
      age: entry?.rate ? `£${entry.rate}/hr` : "",
      status: entry?.attendance?.attendanceStatus || "pending",
      rawCoach: entry?.coach,
      rate: entry?.rate,
    }));
  };

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);

      let url = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/session/${sessionId}`;
      if (sessionDate) {
        url += `?sessionDate=${sessionDate}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
      );
      const result = await response.json();
      if (response.ok) {
        setSessionData(result.data);

        const bookingsMembers = result?.data?.bookings?.members || [];
        const bookingsTrials = result?.data?.bookings?.trials || [];
        const bookingsCoaches = result?.data?.bookings?.coaches || [];
        setMembers(flattenBookingGroup(bookingsMembers));
        setTrials(flattenBookingGroup(bookingsTrials));
        setCoaches(flattenCoaches(bookingsCoaches));
        setSessionName(result.data?.sessionPlan?.groupName);
      } else {
        console.error("Failed to fetch session details:", result);
      }
    } catch (error) {
      console.error("Failed to fetch session details:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  const handleAbilityChange = async (abilityValue) => {
    if (!selectedStudentForAbility) return;
    const { studentId, sessionId, listType, status } = selectedStudentForAbility;
    const setter = listType === "trials" ? setTrials : setMembers;

    // Capitalize the first letter for the payload
    const capitalizedAbility = abilityValue.charAt(0).toUpperCase() + abilityValue.slice(1);

    // Optimistic UI update
    setter((prev) =>
      prev.map((m) =>
        m.studentId === studentId ? { ...m, ability: abilityValue } : m
      )
    );
    setAbilityModalVisible(false);

    try {
      // Use the attendance endpoint as requested
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/session/${sessionId}/attendance/${studentId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendance: status !== "pending" ? status : "attended", // fallback to attended if pending based on example
            abilityLevel: capitalizedAbility
          }),
        }
      );
      if (!response.ok) {
        console.warn("Failed to update ability on server");
      }
      fetchSessionDetails();
    } catch (e) {
      console.error("Network error updating ability:", e);
    }
  };

  // listType tells us which local state ("members", "trials", or "coaches")
  // to optimistically update, since all three tabs share this handler.
  // Attendance can only be set ONCE, while it's still "pending" — once
  // marked attended/not attended it's locked (buttons are disabled in the UI,
  // and this is a belt-and-braces guard against stray calls).
  const handleAttendance = async (studentId, sessionId, status, listType = "members") => {
    const setter =
      listType === "trials"
        ? setTrials
        : listType === "coaches"
          ? setCoaches
          : setMembers;
    const previousList =
      listType === "trials" ? trials : listType === "coaches" ? coaches : members;

    const target = previousList.find((p) => p.studentId === studentId);
    if (target && target.status !== "pending") {
      return; // already marked — locked, no further changes allowed
    }

    setter((prev) =>
      prev.map((m) => (m.studentId === studentId ? { ...m, status } : m)),
    );

    try {
      let response;

      if (listType === "coaches") {
        // Coaches use a dedicated endpoint keyed by classScheduleId + date,
        // not the per-student session attendance route.
        response = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/coach/attendance`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              classScheduleId: sessionData?.classSchedule?.id,
              sessionDate: (sessionData?.sessionDate || "").slice(0, 10),
              attendance: status,
            }),
          },
        );
      } else {
        response = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/session/${sessionId}/attendance/${studentId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ attendance: status }),
          },
        );
      }
      fetchSessionDetails();
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ Failed to update attendance (${response.status}):`,
          errorText,
        );
        setter(previousList);
      }
    } catch (error) {
      console.error("❌ Network error updating attendance:", error.message);
      setter(previousList);
    }
  };

  // True once every member, trial, and coach has a non-"pending" status.
  const isAllAttendanceMarked = () => {
    const everyone = [...members, ...trials, ...coaches];
    if (everyone.length === 0) return true;
    return everyone.every((p) => p.status && p.status !== "pending");
  };

  const handleBackPress = () => {
    if (!isAllAttendanceMarked()) {
      Alert.alert(
        "Pending Attendance",
        "You haven't marked attendance for everyone. Are you sure you want to leave?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => onBack && onBack(),
          },
        ]
      );
      return;
    }
    onBack && onBack();
  };

  // Also guard the Android hardware back button the same way.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!isAllAttendanceMarked()) {
          Alert.alert(
            "Pending Attendance",
            "You haven't marked attendance for everyone. Are you sure you want to leave?",
            [
              { text: "Stay", style: "cancel" },
              {
                text: "Leave",
                style: "destructive",
                onPress: () => onBack && onBack(),
              },
            ]
          );
          return true; // block default back behavior and let Alert handle it
        }
        return false; // let default back behavior proceed
      },
    );
    return () => subscription.remove();
  }, [members, trials, coaches, onBack]);


  // Utility: formats "10:30 AM" + "11:30 AM" => "10:30-11:30am"
  // Also handles cross-period case: "11:30 AM" + "12:30 PM" => "11:30am-12:30pm"
  const formatTimeRange = (start, end) => {
    if (!start || !end) return '-';

    const parseTime = (t) => {
      if (!t) return null;

      // Handles "HH:mm", "HH:mm:ss", "hh:mm AM/PM", "hh:mm:ss AM/PM"
      const match = t.trim().match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?/);
      if (!match) return null;

      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const meridiemRaw = match[3];

      let period;
      if (meridiemRaw) {
        period = meridiemRaw.toLowerCase();
        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
      }

      // Derive 12-hour display + am/pm if not already given (24hr input case)
      const displayPeriod = hours >= 12 ? 'pm' : 'am';
      let displayHour = hours % 12;
      if (displayHour === 0) displayHour = 12;

      return {
        display: `${displayHour}:${minutes}`,
        period: displayPeriod,
      };
    };

    const startParsed = parseTime(start);
    const endParsed = parseTime(end);

    if (!startParsed || !endParsed) {
      return `${start} - ${end}`; // fallback, don't break UI
    }

    // Same period (both am or both pm) -> show suffix once at the end
    if (startParsed.period === endParsed.period) {
      return `${startParsed.display}-${endParsed.display}${endParsed.period}`;
    }

    // Different periods -> show suffix on both
    return `${startParsed.display}${startParsed.period}-${endParsed.display}${endParsed.period}`;
  };

  if (showAddTrialist) {
    return <AddTrialist onBack={() => setShowAddTrialist(false)} postcode={sessionData?.venue?.postal_code || sessionData?.classSchedule?.venue?.postcode || ''} />;
  }


  if (loading) {
    return (
      <View
        style={[
          styles.container,
          isDark && styles.containerDark,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <CustomLoader size={80} color="#3B82F6" />
      </View>
    );
  }

  // Shared row renderer used by the Members, Trials, and Coaches tabs
  // so attendance buttons behave identically everywhere.
  const renderPersonRow = (person, index, listType) => (
    <TouchableOpacity
      key={person.studentId}
      style={[styles.memberCard, isDark && styles.memberCardDark]}
      disabled={listType === "coaches"}
      onPress={() => onStudentSelect && onStudentSelect(person)}
    >
      <Text style={[styles.memberIndex, isDark && styles.memberIndexDark]}>
        {index + 1}
      </Text>
      <View style={styles.memberInfo}>
        <Text
          style={[styles.memberName, isDark && styles.memberNameDark]}
          numberOfLines={1}
        >
          {person.name}
        </Text>
        {listType !== "coaches" && (
          <TouchableOpacity
            style={[styles.abilityBadge, isDark && styles.abilityBadgeDark]}
            onPress={() => {
              setSelectedStudentForAbility({ ...person, listType });
              setAbilityModalVisible(true);
            }}
          >
            <Text style={styles.abilityBadgeText}>
              {(person.ability || "beginner").charAt(0).toUpperCase() + (person.ability || "beginner").slice(1)}
            </Text>
            <Ionicons name="chevron-down" size={10} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.memberAge, isDark && styles.memberAgeDark]}>
        {person.age}
      </Text>
      <View style={styles.attendanceButtons}>
        <TouchableOpacity
          disabled={person.status !== "pending"}
          style={[
            styles.attendanceBtn,
            person.status === "attended"
              ? styles.btnAttendedActive
              : isDark
                ? styles.btnAttendedInactiveDark
                : styles.btnAttendedInactive,
            person.status !== "pending" && person.status !== "attended" && styles.btnDisabled,
          ]}
          onPress={() => handleAttendance(person.studentId, person.sessionId, "attended", listType)}
        >
          <Ionicons
            name="checkmark"
            size={15}
            color={
              person.status === "attended"
                ? "#fff"
                : isDark
                  ? "#4ADE80"
                  : "#101014"
            }
            style={styles.btnIcon}
          />
          <Text
            style={[
              styles.btnText,
              person.status === "attended"
                ? styles.btnTextWhite
                : isDark
                  ? styles.btnTextGreenDark
                  : styles.btnTextGreen,
            ]}
          >
            Attended
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={person.status !== "pending"}
          style={[
            styles.attendanceBtn,
            person.status === "not attended"
              ? styles.btnNotAttendedActive
              : isDark
                ? styles.btnNotAttendedInactiveDark
                : styles.btnNotAttendedInactive,
            person.status !== "pending" && person.status !== "not attended" && styles.btnDisabled,
          ]}
          onPress={() => handleAttendance(person.studentId, person.sessionId, "not attended", listType)}
        >
          <Ionicons
            name="close"
            size={15}
            color={
              person.status === "not attended"
                ? "#fff"
                : isDark
                  ? "#F87171"
                  : "#101014"
            }
            style={styles.btnIcon}
          />
          <Text
            style={[
              styles.btnText,
              person.status === "not attended"
                ? styles.btnTextWhite
                : isDark
                  ? styles.btnTextRedDark
                  : styles.btnTextRed,
            ]}
          >
            Not Attended
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSessionClick("weeklySession")}
            style={{ flex: 1 }}
          >
            <Text
              style={[styles.headerTitle, isDark && styles.headerTitleDark]}
              ellipsizeMode="tail"
            >
              {sessionName}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.sessionPlanButton}
          onPress={() => {
            console.log("👉 Button Clicked: Session Plan");
            if (!sessionData) {
              console.log("⚠️ sessionData is empty or null!");
            } else {
              console.log("✅ sessionData exists. Calling onSessionPlanClick.");
            }
            onSessionPlanClick(sessionData);
          }}
        >
          <Text style={styles.sessionPlanText}>Session Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Card */}
        <TouchableOpacity
          style={[styles.infoCard, isDark && styles.infoCardDark]}
          onPress={() => onSessionClick("weeklySession")}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                Date
              </Text>
              <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                {formatDate(sessionData?.sessionDate)}{","}
                {formatTimeRange(sessionData?.classSchedule?.startTime, sessionData?.classSchedule?.endTime)}
              </Text>
            </View>
            <View style={styles.infoItemSmall}>
              <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                Years
              </Text>
              <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                {sessionData?.classSchedule?.className || "—"}
              </Text>
            </View>
            <View style={styles.infoItemSmall}>
              <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                Status
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  sessionData?.status === "completed" &&
                  styles.statusBadgeCompleted,
                  sessionData?.status === "pending" &&
                  styles.statusBadgePending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    sessionData?.status === "completed" &&
                    styles.statusTextCompleted,
                    sessionData?.status === "pending" &&
                    styles.statusTextPending,
                  ]}
                >
                  {sessionData?.status || "Pending"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Map */}
        <View style={styles.mapContainer}>
          <Image
            source={require("../../../assets/images/map.png")}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        {/* Tabs */}
        <View
          style={[styles.tabsContainer, isDark && styles.tabsContainerDark]}
        >
          {["Members", "Trials", "Coaches"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab
                    ? styles.activeTabText
                    : isDark
                      ? styles.inactiveTabTextDark
                      : styles.inactiveTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Members Tab */}
        {activeTab === "Members" && (
          <View style={styles.membersList}>
            {members.length === 0 ? (
              <Text style={styles.emptyText}>No members found.</Text>
            ) : (
              members.map((member, index) =>
                renderPersonRow(member, index, "members"),
              )
            )}
          </View>
        )}
        {activeTab === "Coaches" && (
          <View style={styles.membersList}>
            {coaches.length === 0 ? (
              <Text style={styles.emptyText}>No coaches found.</Text>
            ) : (
              coaches.map((member, index) =>
                renderPersonRow(member, index, "coaches"),
              )
            )}
          </View>
        )}

        {/* Trials Tab */}
        {activeTab === "Trials" && (
          <>
            <View style={styles.membersList}>
              {trials.length === 0 ? (
                <Text style={styles.emptyText}>No trialists found.</Text>
              ) : (
                trials.map((trial, index) =>
                  renderPersonRow(trial, index, "Trials"),
                )
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.addTrialistButton,
                  isDark && styles.addTrialistButtonDark,
                ]}
                onPress={() => setShowAddTrialist(true)}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="#3B82F6"
                  style={styles.addIcon}
                />
                <Text style={styles.addTrialistText}>Add walk by trialist</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Ability Modal */}
      <Modal visible={abilityModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAbilityModalVisible(false)}
        >
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Select Ability</Text>
            {["beginner", "intermediate", "advanced", "pro"].map((ability) => (
              <TouchableOpacity
                key={ability}
                style={[styles.modalOption, isDark && styles.modalOptionDark]}
                onPress={() => handleAbilityChange(ability)}
              >
                <Text style={[styles.modalOptionText, isDark && styles.modalOptionTextDark]}>
                  {ability.charAt(0).toUpperCase() + ability.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
    flexShrink: 1,
  },
  headerTitleDark: {
    color: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  sessionPlanButton: {
    backgroundColor: "#1CAB4B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexShrink: 0,
  },
  sessionPlanText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
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
  },
  infoItem: {
    flex: 2,
    paddingRight: 8,
  },
  infoItemSmall: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#989898",
    marginBottom: 4,
    fontFamily: "Urbanist_700Bold",
  },
  infoLabelDark: {
    color: "#8A8B93",
  },
  infoValue: {
    fontSize: 12,
    color: "#212121",
    lineHeight: 20,
    fontFamily: "Urbanist_400Regular",
  },
  infoValueDark: {
    color: "#E5E7EB",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusBadgeCompleted: {
    backgroundColor: "#1CAB4B",
  },
  statusBadgePending: {
    backgroundColor: "#D97706",
  },
  statusText: {
    fontSize: 12,
    textTransform: "capitalize",
    fontFamily: "Urbanist_700Bold",
  },
  statusTextCompleted: {
    color: "#F0FFF4",
  },
  statusTextPending: {
    color: "#FFFBEB",
  },
  mapContainer: {
    height: 140,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    paddingVertical: 5,
  },
  tabsContainerDark: {
    backgroundColor: "#1E1E1E",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 7,
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 15,
    fontFamily: "Urbanist_700Bold",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#1a1a1a",
  },
  inactiveTabTextDark: {
    color: "#E5E7EB",
  },
  membersList: {
    marginBottom: 24,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  memberCardDark: {
    borderBottomColor: "#2A2A2A",
  },
  memberIndex: {
    flex: 0.2,
    fontSize: 12,
    color: "#212121",
    fontFamily: "Urbanist_500Medium",
  },
  memberIndexDark: {
    color: "#9CA3AF",
  },
  memberInfo: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    fontSize: 12,
    color: "#1a1a1a",
    width: 100,
    fontFamily: "Urbanist_700Bold",
  },
  memberNameDark: {
    color: "#fff",
  },
  memberAge: {
    flex: 0.6,
    fontSize: 12,
    color: "#212121",
    marginLeft: 8,
    fontFamily: "Urbanist_400Regular",
  },
  memberAgeDark: {
    color: "#9CA3AF",
  },
  attendanceButtons: {
    flexDirection: "row",
    gap: 8,
    flex: 1.4,
  },
  attendanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  btnAttendedActive: {
    backgroundColor: "#1CAB4B",
    borderColor: "#1CAB4B",
  },
  btnAttendedInactive: {
    backgroundColor: "#fff",
    borderColor: "#1CAB4B",
  },
  btnAttendedInactiveDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#1CAB4B",
  },
  btnNotAttendedActive: {
    backgroundColor: "#E53E3E",
    borderColor: "#E53E3E",
  },
  btnNotAttendedInactive: {
    backgroundColor: "#fff",
    borderColor: "#E53E3E",
  },
  btnNotAttendedInactiveDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#E53E3E",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  abilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  abilityBadgeDark: {
    backgroundColor: "#2563EB",
  },
  abilityBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Urbanist_700Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalContentDark: {
    backgroundColor: "#1E1E1E",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    marginBottom: 16,
    color: "#1a1a1a",
    textAlign: "center",
  },
  modalTitleDark: {
    color: "#fff",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionDark: {
    borderBottomColor: "#2A2A2A",
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1a1a1a",
    textAlign: "center",
  },
  modalOptionTextDark: {
    color: "#fff",
  },
  btnIcon: {
    marginRight: 4,
  },
  btnText: {
    fontSize: 11,
    color: "#101014",
    fontFamily: "Urbanist_600SemiBold",
  },
  btnTextWhite: {
    color: "#fff",
  },
  btnTextGreen: {
    color: "#101014",
  },
  btnTextGreenDark: {
    color: "#4ADE80",
  },
  btnTextRed: {
    color: "#101014",
  },
  btnTextRedDark: {
    color: "#F87171",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 24,
    fontFamily: "Urbanist_400Regular",
  },
  addTrialistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#3B82F6",
    backgroundColor: "#fff",
    marginBottom: 24,
  },
  addTrialistButtonDark: {
    backgroundColor: "#1E1E1E",
  },
  addIcon: {
    marginRight: 8,
  },
  addTrialistText: {
    fontSize: 16,
    color: "#3B82F6",
    fontFamily: "Urbanist_700Bold",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
  },
});