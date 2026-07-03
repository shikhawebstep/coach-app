import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PrivateStudentClassDetails({
  bookingId,
  onBack,
  onNotesClick,
}) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [updatingDate, setUpdatingDate] = useState(false);
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBookingDetails = async () => {
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
        `https://api.grabbite.com/api/coachpro/one-to-one/booking/${bookingId}`,
        requestOptions,
      );
      const result = await response.json();
      if (response.ok && result?.data) {
        setBooking(result.data);
        if (result.data.date) {
          setSelectedCalendarDate(result.data.date);
          const parts = result.data.date.split("-");
          if (parts.length === 3) {
            setCurrentYear(parseInt(parts[0], 10));
            setCurrentMonth(parseInt(parts[1], 10) - 1);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(selectedCalendarDate)) {
      Alert.alert("Invalid Date", "Please select a valid date.");
      return;
    }

    try {
      setUpdatingDate(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        date: selectedCalendarDate,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.grabbite.com/api/coachpro/one-to-one/booking/${bookingId}/date`,
        requestOptions,
      );
      const result = await response.json();

      if (response.ok && result.status !== false) {
        Alert.alert("Success", "Booking date changed successfully.");
        setDateModalVisible(false);
        fetchBookingDetails();
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to change booking date.",
        );
      }
    } catch (error) {
      console.error("Failed to update date:", error);
      Alert.alert("Error", "Something went wrong while updating the date.");
    } finally {
      setUpdatingDate(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarGrid = () => {
    const days = [];
    const totalDays = getDaysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i++) {
      days.push({ type: "empty", id: `empty-${i}` });
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        type: "day",
        day,
        dateString,
        id: `day-${day}`,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarGrid();

  const getStudentNames = (bookingData) => {
    if (bookingData?.students?.length > 0) {
      const student = bookingData.students[0];
      return `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim();
    }

    return (
      bookingData?.lead?.childName || bookingData?.lead?.parentName || "No Name"
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.centeredDark]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const studentNames = getStudentNames(booking);
  const displayDate = formatDate(booking?.date);
  const displayTime = booking?.time || "-";
  const displayStudentsCount = booking?.totalStudents
    ? `${booking.totalStudents}-to-1`
    : booking?.students?.length
      ? `${booking.students.length}-to-1`
      : "1-to-1";

  const displayAddress = booking?.address || booking?.location || "-";
  const statusStr = booking?.status
    ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    : "Pending";
  const isActiveOrCompleted =
    booking?.status === "active" || booking?.status === "Completed";

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
          <Text
            style={[styles.headerTitle, isDark && styles.headerTitleDark]}
            numberOfLines={1}
          >
            {studentNames} class
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.u5Badge}>
            <Text style={styles.u5Text}>U5</Text>
          </View>
          <View
            style={
              isActiveOrCompleted
                ? styles.statusBadgeCompleted
                : styles.statusBadgePending
            }
          >
            <Text
              style={
                isActiveOrCompleted
                  ? styles.statusTextWhite
                  : styles.statusTextBlack
              }
            >
              {statusStr}
            </Text>
          </View>
        </View>
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
                {displayDate}
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
                {displayTime}
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
                {displayStudentsCount}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changeDateBtn}
              onPress={() => setDateModalVisible(true)}
            >
              <Text style={styles.changeDateText}>Change date</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Map Placeholder */}
        <View style={[styles.mapContainer, isDark && styles.mapContainerDark]}>
          <Image
            source={require("../../../assets/images/map.png")}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={18}
            color={isDark ? "#9CA3AF" : "#666"}
          />
          <Text
            style={[styles.locationText, isDark && styles.locationTextDark]}
          >
            {displayAddress}
          </Text>
        </View>

        {/* Student Information Section */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Student Information
        </Text>

        {booking?.students && booking.students.length > 0 ? (
          booking.students.map((student, index) => (
            <View key={student.id || index} style={{ marginBottom: 20 }}>
              {booking.students.length > 1 && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#3B82F6",
                    marginBottom: 12,
                  }}
                >
                  Student #{index + 1}
                </Text>
              )}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 2, marginRight: 16 }]}>
                  <Text
                    style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                  >
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
                      value={
                        `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim() ||
                        "-"
                      }
                      editable={false}
                    />
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text
                    style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                  >
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
                      value={student.age ? String(student.age) : "-"}
                      editable={false}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Medical information
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                  ]}
                >
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    value={student.medicalInfo || "NA"}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Gender
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                  ]}
                >
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    value={
                      student.gender
                        ? student.gender.charAt(0).toUpperCase() +
                          student.gender.slice(1)
                        : "-"
                    }
                    editable={false}
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 2, marginRight: 16 }]}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
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
                    value={booking?.lead?.childName || "-"}
                    editable={false}
                  />
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
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
                    value={booking?.lead?.age ? String(booking.lead.age) : "-"}
                    editable={false}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
            Ability level
          </Text>
          <View
            style={[styles.inputContainer, isDark && styles.inputContainerDark]}
          >
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={booking?.abilityLevel || "Beginner"}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
            Areas to work on
          </Text>
          <View
            style={[
              styles.inputContainer,
              styles.textAreaContainer,
              isDark && styles.inputContainerDark,
            ]}
          >
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isDark && styles.inputDark,
              ]}
              value={
                booking?.areaWorkOn ||
                booking?.lead?.notes ||
                "Needs help on basic techniques."
              }
              multiline={true}
              editable={false}
            />
          </View>
        </View>

        {/* View Notes Button */}
        {/* <TouchableOpacity style={styles.viewNotesBtn} onPress={onNotesClick}>
                    <Text style={styles.viewNotesBtnText}>View Notes</Text>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity> */}
      </ScrollView>

      {/* Date Change Modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, isDark && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDark && styles.modalTitleDark]}
              >
                Select Date
              </Text>
              <TouchableOpacity
                onPress={() => setDateModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.monthSwitcher}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={styles.navArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={isDark ? "#D1D5DB" : "#4B5563"}
                />
              </TouchableOpacity>
              <Text style={[styles.monthText, isDark && styles.monthTextDark]}>
                {MONTHS[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity
                onPress={handleNextMonth}
                style={styles.navArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#D1D5DB" : "#4B5563"}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.calendarBox, isDark && styles.calendarBoxDark]}
            >
              {/* Weekdays Row */}
              <View style={styles.weekdaysRow}>
                {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.weekdayText,
                      isDark && styles.weekdayTextDark,
                    ]}
                  >
                    {w}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {calendarDays.map((item) => {
                  if (item.type === "empty") {
                    return <View key={item.id} style={styles.dayCellEmpty} />;
                  }
                  const isSelected = item.dateString === selectedCalendarDate;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dayCell}
                      onPress={() => setSelectedCalendarDate(item.dateString)}
                    >
                      <View
                        style={[
                          styles.dayTextContainer,
                          isSelected && styles.dayTextContainerSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isDark && !isSelected && styles.dayTextDark,
                            isSelected && styles.dayTextSelected,
                          ]}
                        >
                          {item.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSelectBtn}
              onPress={handleDateChange}
              disabled={updatingDate}
            >
              {updatingDate ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalSelectBtnText}>Select date</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  headerTitleDark: {
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  u5Badge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  u5Text: {
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
    fontSize: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: "#1CAB4B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusTextWhite: {
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
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
  infoItem: {
    flex: 1,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Urbanist_400Regular",
    color: "#666",
    marginBottom: 4,
  },
  infoLabelDark: {
    color: "#9CA3AF",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  infoValueDark: {
    color: "#fff",
  },
  changeDateBtn: {
    backgroundColor: "#FF4C4C",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeDateText: {
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
    fontSize: 13,
  },
  mapContainer: {
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
  },
  mapContainerDark: {
    backgroundColor: "#1E1E1E",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: "Urbanist_400Regular",
    color: "#4B5563",
    lineHeight: 18,
  },
  locationTextDark: {
    color: "#9CA3AF",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#4B5563",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#E5E7EB",
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: "Urbanist_700Bold",
    color: "#4B5563",
    marginBottom: 8,
  },
  inputLabelDark: {
    color: "#D1D5DB",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  inputContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#1a1a1a",
  },
  inputDark: {
    color: "#E5E7EB",
  },
  textAreaContainer: {
    height: 100,
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 12,
  },
  viewNotesBtn: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  viewNotesBtnText: {
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
    fontSize: 16,
    marginRight: 8,
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
  statusBadgePending: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusTextBlack: {
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: "#1E1E1E",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  modalTitleDark: {
    color: "#fff",
  },
  modalCloseBtn: {
    padding: 4,
  },
  monthSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#4B5563",
    minWidth: 140,
    textAlign: "center",
  },
  monthTextDark: {
    color: "#E5E7EB",
  },
  navArrow: {
    padding: 4,
  },
  calendarBox: {
    backgroundColor: "#F3F4F8",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  calendarBoxDark: {
    backgroundColor: "#181818",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    marginTop: 4,
  },
  weekdayText: {
    width: 36,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
    color: "#9CA3AF",
  },
  weekdayTextDark: {
    color: "#71717A",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  dayCellEmpty: {
    width: `${100 / 7}%`,
    height: 44,
  },
  dayTextContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayTextContainerSelected: {
    backgroundColor: "#2b66e3",
  },
  dayText: {
    fontSize: 14,
    fontFamily: "Urbanist_500Medium",
    color: "#1a1a1a",
  },
  dayTextDark: {
    color: "#E5E7EB",
  },
  dayTextSelected: {
    color: "#fff",
    fontFamily: "Urbanist_700Bold",
  },
  modalSelectBtn: {
    backgroundColor: "#2b66e3",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  modalSelectBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
  },
});
