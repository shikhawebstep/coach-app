import CustomLoader from "@/components/common/CustomLoader";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Image,
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
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("Members");
  const [members, setMembers] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTrialist, setShowAddTrialist] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/session/${sessionId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (response.ok) {
        setSessionData(result.data);

        const bookingsMembers = result?.data?.bookings?.members || [];
        const flattened = [];
        bookingsMembers.forEach((booking) => {
          booking.students.forEach((student) => {
            flattened.push({
              bookingId: booking.id,
              studentId: student.id,
              name: `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim(),
              age: `${student.age} Years`,
              status: student.attendance,
              rawStudent: student,
              booking: booking,
            });
          });
        });
        setMembers(flattened);
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

  const handleAttendance = async (studentId, status) => {
    const previousMembers = members;
    setMembers((prev) =>
      prev.map((m) => (m.studentId === studentId ? { ...m, status } : m)),
    );

    try {
      const response = await fetch(
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

      if (response.ok) {
        console.log("✅ Attendance updated successfully");
      } else {
        const errorText = await response.text();
        console.error(
          `❌ Failed to update attendance (${response.status}):`,
          errorText,
        );
        setMembers(previousMembers);
      }
    } catch (error) {
      console.error("❌ Network error updating attendance:", error.message);
      setMembers(previousMembers);
    }
  };

  if (showAddTrialist) {
    return <AddTrialist onBack={() => setShowAddTrialist(false)} />;
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
          <TouchableOpacity
            onPress={() => onSessionClick("weeklySession")}
            style={{ flex: 1 }}
          >
            <Text
              style={[styles.headerTitle, isDark && styles.headerTitleDark]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {sessionName}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.sessionPlanButton}
          onPress={() => onSessionPlanClick(sessionData)}
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
                {formatDate(sessionData?.sessionDate)}{" "}
                {sessionData?.classSchedule?.startTime} -{" "}
                {sessionData?.classSchedule?.endTime}
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
              members.map((member, index) => (
                <TouchableOpacity
                  key={member.studentId}
                  style={[styles.memberCard, isDark && styles.memberCardDark]}
                  onPress={() => onStudentSelect && onStudentSelect(member)}
                >
                  <Text
                    style={[
                      styles.memberIndex,
                      isDark && styles.memberIndexDark,
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <View style={styles.memberInfo}>
                    <Text
                      style={[
                        styles.memberName,
                        isDark && styles.memberNameDark,
                      ]}
                      numberOfLines={1}
                    >
                      {member.name}
                    </Text>
                    <Text
                      style={[styles.memberAge, isDark && styles.memberAgeDark]}
                    >
                      {member.age}
                    </Text>
                  </View>
                  <View style={styles.attendanceButtons}>
                    <TouchableOpacity
                      style={[
                        styles.attendanceBtn,
                        member.status === "attended"
                          ? styles.btnAttendedActive
                          : isDark
                            ? styles.btnAttendedInactiveDark
                            : styles.btnAttendedInactive,
                      ]}
                      onPress={() =>
                        handleAttendance(member.studentId, "attended")
                      }
                    >
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={
                          member.status === "attended"
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
                          member.status === "attended"
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
                      style={[
                        styles.attendanceBtn,
                        member.status === "not attended"
                          ? styles.btnNotAttendedActive
                          : isDark
                            ? styles.btnNotAttendedInactiveDark
                            : styles.btnNotAttendedInactive,
                      ]}
                      onPress={() =>
                        handleAttendance(member.studentId, "not attended")
                      }
                    >
                      <Ionicons
                        name="close"
                        size={18}
                        color={
                          member.status === "not attended"
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
                          member.status === "not attended"
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
              ))
            )}
          </View>
        )}

        {/* Trials Tab */}
        {activeTab === "Trials" && (
          <>
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

        {/* Coaches Tab — placeholder */}
        {activeTab === "Coaches" && (
          <Text style={styles.emptyText}>No coaches assigned.</Text>
        )}
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
    fontSize: 24,
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
    width: 24,
    fontSize: 12,
    color: "#212121",
    fontFamily: "Urbanist_500Medium",
  },
  memberIndexDark: {
    color: "#9CA3AF",
  },
  memberInfo: {
    flex: 1,
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
  },
  attendanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
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
  btnIcon: {
    marginRight: 4,
  },
  btnText: {
    fontSize: 12,
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
