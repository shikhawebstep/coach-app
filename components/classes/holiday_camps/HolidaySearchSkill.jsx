import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

const SKILLS_DATA = [
  {
    id: 1,
    name: "Fatia",
    level: "Beginner",
    image: require("../../../assets/images/skill1.png"),
  },
  {
    id: 2,
    name: "Macaw",
    level: "Beginner",
    image: require("../../../assets/images/skill2.png"),
  },
  {
    id: 3,
    name: "Dedinho",
    level: "Beginner",
    image: require("../../../assets/images/skill3.png"),
  },
  {
    id: 4,
    name: "Gancho",
    level: "Intermediate",
    image: require("../../../assets/images/skill4.png"),
  },
];

export default function HolidaySearchSkill({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const filters = ["All", "Beginner", "Intermediate", "Advanced"];

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
          Search a skill
        </Text>
      </View>

      {/* Search Input */}
      <View
        style={[styles.searchContainer, isDark && styles.searchContainerDark]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? "#8A8B93" : "#a0a0a0"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search a skill..."
          placeholderTextColor={isDark ? "#8A8B93" : "#a0a0a0"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                isDark && styles.filterPillDark,
                activeFilter === filter
                  ? isDark
                    ? styles.activeFilterPillDark
                    : styles.activeFilterPill
                  : null,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  isDark && styles.filterTextDark,
                  activeFilter === filter ? styles.activeFilterText : null,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Skills Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        {SKILLS_DATA.map((skill) => (
          <TouchableOpacity key={skill.id} style={styles.gridItem}>
            <Image
              source={skill.image}
              style={styles.skillImage}
              resizeMode="cover"
            />

            <View style={styles.textOverlay}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{skill.level}</Text>
            </View>

            <View style={styles.playButtonOverlay}>
              <View style={styles.playButtonCircle}>
                <Ionicons name="play" size={24} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    fontSize: 24,
    color: "#1a1a1a",
    fontFamily: "Urbanist_700Bold",
  },
  headerTitleDark: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A3A3C",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "Urbanist_400Regular",
  },
  searchInputDark: {
    color: "#fff",
  },
  filtersWrapper: {
    marginBottom: 24,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    backgroundColor: "#fff",
  },
  filterPillDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#60A5FA",
  },
  activeFilterPill: {
    backgroundColor: "#EBF5FF",
  },
  activeFilterPillDark: {
    backgroundColor: "#1E2A4A",
    borderColor: "#60A5FA",
  },
  filterText: {
    color: "#3B82F6",
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
  },
  filterTextDark: {
    color: "#60A5FA",
  },
  activeFilterText: {
    color: "#2563EB",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  gridItem: {
    width: "48%",
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#333",
    position: "relative",
  },
  skillImage: {
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  skillName: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 4,
    fontFamily: "Urbanist_700Bold",
  },
  skillLevel: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Urbanist_400Regular",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonCircle: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
