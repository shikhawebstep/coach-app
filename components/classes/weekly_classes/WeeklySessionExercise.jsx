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

// ─── HTML Parser ────────────────────────────────────────────────────────────
function parseDescriptionHTML(html = "") {
  if (!html) return [];

  const SECTION_KEYWORDS = [
    "Time Duration",
    "Organisation",
    "Description",
    "Rules",
    "Conditions",
    "How to maintain the tone",
  ];

  const withNewlines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

  const lines = withNewlines
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const sections = [];
  let current = null;

  for (const line of lines) {
    const matchedKeyword = SECTION_KEYWORDS.find((k) =>
      line.toLowerCase().startsWith(k.toLowerCase()),
    );

    if (matchedKeyword) {
      if (current) sections.push(current);
      const inlineValue = line
        .slice(matchedKeyword.length)
        .replace(/^[:\s]+/, "")
        .trim();
      current = {
        title: matchedKeyword,
        lines: inlineValue ? [inlineValue] : [],
      };
    } else if (current) {
      current.lines.push(line);
    } else {
      sections.push({ title: null, lines: [line] });
    }
  }
  if (current) sections.push(current);

  return sections;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WeeklySessionExercise({
  excercise,
  onBack,
  onSearchSkillClick,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  let imageUri = null;
  try {
    const parsed = JSON.parse(excercise?.imageUrl);
    imageUri = Array.isArray(parsed) ? parsed[0] : parsed;
  } catch {
    imageUri = excercise?.imageUrl ?? null;
  }

  const sections = parseDescriptionHTML(excercise?.description);

  const durationSection = sections.find((s) => s.title === "Time Duration");
  const durationValue =
    durationSection?.lines?.[0] ?? excercise?.duration ?? "N/A";
  const contentSections = sections.filter(
    (s) => s.title !== "Time Duration" && s.title !== null,
  );

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
            {excercise?.title ?? "Exercise"}
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

        {/* Duration + Search Skill */}
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
              {durationValue}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchButton, isDark && styles.searchButtonDark]}
            onPress={onSearchSkillClick}
          >
            <Text
              style={[
                styles.searchButtonText,
                isDark && styles.searchButtonTextDark,
              ]}
            >
              Search a skill
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Sections */}
        {contentSections.map((section, idx) => (
          <View key={idx}>
            {section.title && (
              <Text
                style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
              >
                {section.title}
              </Text>
            )}
            {section.lines.map((line, lineIdx) =>
              line.startsWith("•") ? (
                <Text
                  key={lineIdx}
                  style={[styles.bulletItem, isDark && styles.bulletItemDark]}
                >
                  {line}
                </Text>
              ) : /^\d+[-.]/.test(line) ? (
                <Text
                  key={lineIdx}
                  style={[
                    styles.numberedItem,
                    isDark && styles.numberedItemDark,
                  ]}
                >
                  {line}
                </Text>
              ) : (
                <Text
                  key={lineIdx}
                  style={[styles.paragraph, isDark && styles.paragraphDark]}
                >
                  {line}
                </Text>
              ),
            )}
            <View style={{ height: 8 }} />
          </View>
        ))}

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
  backButton: { padding: 4 },
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
  searchButton: {
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButtonDark: {
    borderColor: "#60A5FA",
    backgroundColor: "#1E1E1E",
  },
  searchButtonText: {
    color: "#2563EB",
    fontSize: 15,
    fontFamily: "Urbanist_700Bold",
  },
  searchButtonTextDark: {
    color: "#60A5FA",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 8,
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
    marginBottom: 4,
    fontFamily: "Urbanist_400Regular",
  },
  paragraphDark: {
    color: "#A0A0A8",
  },
  bulletItem: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 24,
    marginLeft: 8,
    fontFamily: "Urbanist_400Regular",
  },
  bulletItemDark: {
    color: "#A0A0A8",
  },
  numberedItem: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 24,
    marginLeft: 8,
    fontFamily: "Urbanist_400Regular",
  },
  numberedItemDark: {
    color: "#A0A0A8",
  },
});
