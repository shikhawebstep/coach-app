import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function BirthdaySessionExercise({
  sessionData,
  onBack,
  onSearchSkillClick,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Parse imageUrl — stored as JSON string array e.g. '["https://..."]'
  let imageUri = null;
  try {
    const parsed = JSON.parse(sessionData?.imageUrl);
    imageUri = Array.isArray(parsed) ? parsed[0] : parsed;
  } catch {
    imageUri = sessionData?.imageUrl ?? null;
  }

  // Strip HTML tags from description
  const cleanDescription =
    sessionData?.description?.replace(/<[^>]+>/g, "").trim() ?? "";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.greenHeaderContainer}>
        <ImageBackground
          source={require("@/assets/images/greenoverlay.png")}
          style={styles.greenHeader}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {sessionData?.title ?? "Exercise"}
          </Text>
          <View style={{ width: 24 }} />
        </ImageBackground>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Main Image */}
        <View
          style={[styles.imageContainer, isDark && styles.imageContainerDark]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, styles.imageFallback]}>
              <Ionicons
                name="image-outline"
                size={48}
                color={isDark ? "#4B4B55" : "#ccc"}
              />
            </View>
          )}
        </View>

        {/* Duration */}
        <View style={styles.durationRow}>
          <View style={styles.durationTextContainer}>
            <Text
              style={[styles.durationLabel, isDark && styles.durationLabelDark]}
            >
              Time Duration:{" "}
            </Text>
            <Text
              style={[styles.durationValue, isDark && styles.durationValueDark]}
            >
              {sessionData?.duration ?? "N/A"}
            </Text>
          </View>
        </View>

        {/* Skill of the Day */}
        {sessionData?.skillOfTheDay ? (
          <>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Skill of the Day
            </Text>
            <Text style={[styles.paragraph, isDark && styles.paragraphDark]}>
              {sessionData.skillOfTheDay}
            </Text>
          </>
        ) : null}

        {/* Description */}
        {cleanDescription ? (
          <>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Description
            </Text>
            <Text style={[styles.paragraph, isDark && styles.paragraphDark]}>
              {cleanDescription}
            </Text>
          </>
        ) : null}

        {/* Level Description */}
        {sessionData?.levelDescription ? (
          <>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Level Notes
            </Text>
            <Text style={[styles.paragraph, isDark && styles.paragraphDark]}>
              {sessionData.levelDescription}
            </Text>
          </>
        ) : null}

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
  greenHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  greenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1CAB4B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontFamily: "Urbanist_700Bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  imageContainer: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#F3F4F6",
  },
  imageContainerDark: {
    backgroundColor: "#1E1E1E",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  durationTextContainer: {
    flexDirection: "row",
  },
  durationLabel: {
    fontSize: 16,
    color: "#2563EB",
    fontFamily: "Urbanist_700Bold",
  },
  durationLabelDark: {
    color: "#60A5FA",
  },
  durationValue: {
    fontSize: 16,
    color: "#3B82F6",
    fontFamily: "Urbanist_400Regular",
  },
  durationValueDark: {
    color: "#93B4F7",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 8,
    fontFamily: "Urbanist_700Bold",
  },
  sectionTitleDark: {
    color: "#fff",
  },
  paragraph: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: "Urbanist_400Regular",
  },
  paragraphDark: {
    color: "#A0A0A8",
  },
});
