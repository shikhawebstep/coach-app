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
import CustomLoader from "@/components/common/CustomLoader";

export default function SelectAVenue({ onBack, onVenueSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/venues`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (response.ok) setVenues(result?.data || []);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.area.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Select a venue
        </Text>
      </View>

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
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={isDark ? "#8A8B93" : "#a0a0a0"}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={isDark ? "#8A8B93" : "#a0a0a0"}
            />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <CustomLoader size={80} color="#3B82F6" />
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.listTitle, isDark && styles.listTitleDark]}>
            Your venues
          </Text>
          {filteredVenues.length === 0 ? (
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              No venues found
            </Text>
          ) : (
            filteredVenues.map((venue) => (
              <TouchableOpacity
                key={venue.id}
                style={[styles.card, isDark && styles.cardDark]}
                onPress={() => onVenueSelect && onVenueSelect(venue)}
              >
                <View>
                  <Text
                    style={[styles.cardArea, isDark && styles.cardAreaDark]}
                  >
                    {venue.area}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#121212" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    textAlign: "center",
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    marginTop: 20,
  },
  emptyTextDark: { color: "#9CA3AF" },
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
    fontFamily: "Urbanist_700Bold",
    color: "#1a1a1a",
  },
  headerTitleDark: { color: "#fff" },
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
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },
  searchInputDark: { color: "#fff" },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  listTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    marginBottom: 16,
    color: "#212121",
  },
  listTitleDark: { color: "#E5E7EB" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF2F5",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardDark: { backgroundColor: "#1E1E1E" },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1a1a1a",
  },
  cardArea: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#14172D",
    marginTop: 2,
  },
  cardAreaDark: { color: "#E5E7EB" },
});
