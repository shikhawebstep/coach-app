import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const TRAINING_DATA = [
  {
    id: 1,
    session: "Session 1",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 2,
    session: "Session 2",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 3,
    session: "Session 3",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 4,
    session: "Session 4",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 5,
    session: "Session 5",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 6,
    session: "Session 6",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 7,
    session: "Session 7",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 1",
    status: "Completed",
  },
  {
    id: 8,
    session: "Session 8",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    block: "Block 2",
    status: "Pending",
  },
];

const TEAMS_DATA = [
  {
    id: 1,
    name: "SS F.C. Under 11's (Kings Cross)",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 2,
    name: "SS F.C. Under 12's (Kings Cross)",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 3,
    name: "SS F.C. Under 13's (Kings Cross)",
    image: require("../../../assets/images/sslogo.png"),
  },
];

const MATCHES_DATA = [
  {
    id: 1,
    match: "Match 8",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Pending",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 2,
    match: "Match 7",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 3,
    match: "Match 6",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 4,
    match: "Match 5",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 5,
    match: "Match 4",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 6,
    match: "Match 3",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 7,
    match: "Match 2",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
  {
    id: 8,
    match: "Match 1",
    date: "3rd April 2023",
    time: "10:30-11:30am",
    vs: "Vs. Dragons",
    status: "Completed",
    image: require("../../../assets/images/sslogo.png"),
  },
];

// ---- Theme palettes ----
const Colors = {
  light: {
    background: "#fff",
    headerTitle: "#1a1a1a",
    searchBg: "#F8F9FB",
    searchBorder: "#E5E7EB",
    searchFocusBorder: "#3B82F6",
    searchIcon: "#a0a0a0",
    searchText: "#000",
    placeholder: "#a0a0a0",
    tabActiveBg: "#3B82F6",
    tabActiveBorder: "#3B82F6",
    tabInactiveBg: "#fff",
    tabInactiveBorder: "#3B82F6",
    tabActiveText: "#fff",
    tabInactiveText: "#3B82F6",
    listTitle: "#1a1a1a",
    teamCardBg: "#F3F4F6",
    teamImageBg: "#fff",
    teamCardTitle: "#1a1a1a",
    cardBg: "#fff",
    cardBorder: "#F0F0F0",
    cardShadow: "#000",
    cardTitle: "#1a1a1a",
    cardText: "#666",
    blockText: "#1a1a1a",
    statusCompleted: "#1CAB4B",
    statusPending: "#FFD700",
    statusTextWhite: "#fff",
    statusTextBlack: "#1a1a1a",
    chevron: "#000",
  },
  dark: {
    background: "#121212",
    headerTitle: "#F5F5F5",
    searchBg: "#1E1E1E",
    searchBorder: "#2C2C2E",
    searchFocusBorder: "#5B9BFF",
    searchIcon: "#8E8E93",
    searchText: "#F5F5F5",
    placeholder: "#8E8E93",
    tabActiveBg: "#5B9BFF",
    tabActiveBorder: "#5B9BFF",
    tabInactiveBg: "#1E1E1E",
    tabInactiveBorder: "#5B9BFF",
    tabActiveText: "#0D0D0D",
    tabInactiveText: "#5B9BFF",
    listTitle: "#F5F5F5",
    teamCardBg: "#1E1E1E",
    teamImageBg: "#2C2C2E",
    teamCardTitle: "#F5F5F5",
    cardBg: "#1A1A1A",
    cardBorder: "#2C2C2E",
    cardShadow: "#000",
    cardTitle: "#F5F5F5",
    cardText: "#A1A1A6",
    blockText: "#F5F5F5",
    statusCompleted: "#1CAB4B",
    statusPending: "#E6C200",
    statusTextWhite: "#fff",
    statusTextBlack: "#0D0D0D",
    chevron: "#F5F5F5",
  },
};

export default function SelectATeam({
  onBack,
  onSessionSelect,
  onMatchSelect,
}) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  const [searchQuery, setSearchQuery] = useState(
    "SS F.C. Under 11's (Kings Cross)",
  );
  const [activeTab, setActiveTab] = useState("Training");

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderList = () => {
    if (!searchQuery) {
      return (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.listTitle}>Your teams</Text>
          {TEAMS_DATA.map((team) => (
            <TouchableOpacity
              key={team.id}
              style={styles.teamCard}
              onPress={() => setSearchQuery(team.name)}
            >
              <View style={styles.teamImageContainer}>
                <Image
                  source={team.image}
                  style={styles.teamImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.teamCardTitle}>{team.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    const data = activeTab === "Training" ? TRAINING_DATA : MATCHES_DATA;

    return (
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={
              activeTab === "Training"
                ? () => onSessionSelect(item.id)
                : () => onMatchSelect && onMatchSelect(item.id)
            }
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                {activeTab === "Training" ? item.session : item.match}
              </Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardText}>{item.date}</Text>
              <Text style={styles.cardText}>{item.time}</Text>
            </View>
            <View style={styles.cardBlock}>
              <Text style={styles.blockText}>
                {activeTab === "Training" ? item.block : item.vs}
              </Text>
            </View>
            <View style={styles.cardStatusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "Completed"
                    ? styles.statusCompleted
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "Completed"
                      ? styles.statusTextWhite
                      : styles.statusTextBlack,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.chevron}
                style={styles.chevron}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.headerTitle} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a team</Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          searchQuery ? styles.searchFocused : null,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.searchIcon}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Select a team..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearIcon}
          >
            <Ionicons name="close-circle" size={20} color={colors.searchIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      {searchQuery.length > 0 && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Training" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab("Training")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Training"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Training
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Matches" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab("Matches")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Matches"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Matches
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {renderList()}
    </View>
  );
}
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.headerTitle,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      backgroundColor: colors.searchBg,
      borderWidth: 1,
      borderColor: colors.searchBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 24,
    },
    searchFocused: {
      borderColor: colors.searchFocusBorder,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.searchText,
      fontFamily: "Urbanist_400Regular",
    },
    clearIcon: {
      padding: 4,
    },
    tabsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 24,
      gap: 16,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 32,
      borderRadius: 30,
      borderWidth: 1.5,
    },
    activeTab: {
      backgroundColor: colors.tabActiveBg,
      borderColor: colors.tabActiveBorder,
    },
    inactiveTab: {
      backgroundColor: colors.tabInactiveBg,
      borderColor: colors.tabInactiveBorder,
    },
    tabText: {
      fontSize: 14,
      fontFamily: "Urbanist_700Bold",
    },
    activeTabText: {
      color: colors.tabActiveText,
    },
    inactiveTabText: {
      color: colors.tabInactiveText,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    listTitle: {
      fontSize: 16,
      fontFamily: "Urbanist_700Bold",
      marginBottom: 16,
      color: colors.listTitle,
    },
    teamCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.teamCardBg,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    teamImageContainer: {
      width: 40,
      height: 40,
      marginRight: 12,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: colors.teamImageBg,
      alignItems: "center",
      justifyContent: "center",
    },
    teamImage: {
      width: 30,
      height: 30,
    },
    teamCardTitle: {
      fontSize: 16,
      color: colors.teamCardTitle,
      fontFamily: "Urbanist_400Regular",
    },
    cardImageContainer: {
      width: 32,
      height: 32,
      marginRight: 12,
      borderRadius: 16,
      backgroundColor: colors.teamCardBg,
      alignItems: "center",
      justifyContent: "center",
    },
    cardImageIcon: {
      width: 24,
      height: 24,
    },
    cardInfo: {
      width: 70,
      marginRight: 8,
    },
    cardTitle: {
      fontSize: 14,
      fontFamily: "Urbanist_700Bold",
      color: colors.cardTitle,
    },
    cardDetails: {
      flex: 1,
      marginRight: 8,
    },
    cardText: {
      fontSize: 13,
      color: colors.cardText,
      fontFamily: "Urbanist_400Regular",
      lineHeight: 18,
    },
    cardBlock: {
      width: 70,
      alignItems: "center",
      marginRight: 8,
    },
    blockText: {
      fontSize: 13,
      fontFamily: "Urbanist_700Bold",
      color: colors.blockText,
      textAlign: "center",
    },
    cardStatusContainer: {
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
      backgroundColor: colors.statusCompleted,
    },
    statusPending: {
      backgroundColor: colors.statusPending,
    },
    statusText: {
      fontSize: 12,
      fontFamily: "Urbanist_700Bold",
    },
    statusTextWhite: {
      color: colors.statusTextWhite,
    },
    statusTextBlack: {
      color: colors.statusTextBlack,
    },
    chevron: {
      marginLeft: 4,
    },
  });
