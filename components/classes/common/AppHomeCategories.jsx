import {
  LuckiestGuy_400Regular,
  useFonts,
} from "@expo-google-fonts/luckiest-guy";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");
const CATEGORIES = [
  {
    id: "weekly",
    title: "WEEKLY\nCLASSES",
    image: require("../../../assets/images/weekly.png"),
    large: true,
  },
  {
    id: "private",
    title: "PRIVATE\nCLASSES",
    image: require("../../../assets/images/private.png"),
  },
  {
    id: "holiday",
    title: "HOLIDAY\nCAMPS",
    image: require("../../../assets/images/holiday (2).png"),
  },
  {
    id: "birthday",
    title: "BIRTHDAY\nPARTIES",
    image: require("../../../assets/images/bdy.png"),
  },
];

export default function AppHomeCategories({ onCategorySelect }) {
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Large Top Banner */}
        <TouchableOpacity
          style={[styles.card, styles.largeCard]}
          onPress={() => onCategorySelect && onCategorySelect(CATEGORIES[0].id)}
        >
          <Image source={CATEGORIES[0].image} style={styles.cardImage} />
          <View style={[styles.overlay, isDark && styles.overlayDark]} />
          <View style={styles.cardContent}>
            <Text style={styles.largeCardTitle}>{CATEGORIES[0].title}</Text>
            <View style={[styles.viewBadge, isDark && styles.viewBadgeDark]}>
              <Text
                style={[
                  styles.viewBadgeText,
                  isDark && styles.viewBadgeTextDark,
                ]}
              >
                View
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 2x2 Grid Layout below */}
        <View style={styles.gridContainer}>
          {CATEGORIES.slice(1).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, item.id === 'birthday' ? styles.mediumCard : styles.gridCard]}
              onPress={() => onCategorySelect && onCategorySelect(item.id)}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={[styles.overlay, isDark && styles.overlayDark]} />
              <View style={styles.cardContent}>
                <Text
                  style={
                    item.labelOnly
                      ? styles.singleLineTitle
                      : styles.gridCardTitle
                  }
                >
                  {item.title}
                </Text>
                <View
                  style={[styles.viewBadge, isDark && styles.viewBadgeDark]}
                >
                  <Text
                    style={[
                      styles.viewBadgeText,
                      isDark && styles.viewBadgeTextDark,
                    ]}
                  >
                    View
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
  },
  largeCard: {
    width: "100%",
    height: 220,
  },
  mediumCard: {
    width: "100%",
    height: 190,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  overlayDark: {
    backgroundColor: "rgba(0,0,0,0.45)", // stronger overlay so text/images pop against dark bg
  },
  cardContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  largeCardTitle: {
    fontSize: 32,
    fontFamily: "LuckiestGuy_400Regular",
    color: "#fff",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 16,
  },
  gridCardTitle: {
    fontSize: 24,
    fontFamily: "LuckiestGuy_400Regular",
    color: "#fff",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 16,
  },
  singleLineTitle: {
    fontSize: 26,
    fontFamily: "LuckiestGuy_400Regular",
    color: "#fff",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 16,
    letterSpacing: 1,
  },
  viewBadge: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBadgeDark: {
    backgroundColor: "#F59E0B", // slightly deeper amber for dark bg contrast
  },
  viewBadgeText: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Urbanist-Bold",
    color: "#1a1a1a",
  },
  viewBadgeTextDark: {
    color: "#0d0d0d",
  },
});
