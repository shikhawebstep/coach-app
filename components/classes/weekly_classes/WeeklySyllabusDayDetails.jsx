import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
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

const LEVEL_KEYS = ["beginner", "intermediate", "advanced", "pro"];

const LEVEL_LABELS = {
  beginner: "Beginners (4–5)",
  intermediate: "Intermediate (6–7)",
  advanced: "Advanced (8-9)",
  pro: "Pro (10-12)",
};

export default function WeeklySyllabusDayDetails({
  onBack,
  onSessionItemSelect,
  sessionPlan,
}) {
  const levels = sessionPlan?.levels || {};

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  console.log("=== DEBUG WeeklySyllabusDayDetails ===");
  console.log(sessionPlan);
  console.log("sessionPlan.levels keys:", Object.keys(levels));

  const availableLevels = LEVEL_KEYS.filter((key) => {
    const lvl = levels[key];
    if (!lvl) return false;
    if (Array.isArray(lvl)) return lvl.length > 0;
    return Object.keys(lvl).length > 0;
  });

  console.log("availableLevels:", availableLevels);

  const [activeTab, setActiveTab] = useState(availableLevels[0] || "beginner");

  const levelRaw = levels[activeTab];
  console.log(`levelRaw for ${activeTab}:`, JSON.stringify(levelRaw, null, 2));

  const activeLevelData = Array.isArray(levelRaw) ? levelRaw[0] : levelRaw;
  const exercises = activeLevelData?.sessionExercises || [];
  
  console.log("activeLevelData sessionExercises count:", exercises.length);
  console.log("======================================");

  const bannerKey = `${activeTab}_banner`;
  const videoKey = `${activeTab}_video`;
  const bannerUrl = sessionPlan?.[bannerKey];
  const videoUrl = sessionPlan?.[videoKey];

  const parseImageUrls = (imageUrlStr) => {
    try {
      return JSON.parse(imageUrlStr) || [];
    } catch {
      return [];
    }
  };

  const totalDuration = exercises.reduce((sum, ex) => {
    const match = ex.duration?.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const displayDuration =
    totalDuration >= 60
      ? `${Math.floor(totalDuration / 60)} ${Math.floor(totalDuration / 60) === 1 ? "Hour" : "Hours"}`
      : `${totalDuration} mins`;

  if (!sessionPlan) {
    return (
      <View
        style={[
          styles.container,
          isDark && styles.containerDark,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: isDark ? "#9CA3AF" : "#666" }}>
          No session plan available.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Green Full-Width Header ── */}
        <View style={{ padding: 20 }}>
          <ImageBackground
            source={require("@/assets/images/greenoverlay.png")}
            style={styles.greenHeader}
            imageStyle={{ borderRadius: 20 }}
          >
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Syllabus</Text>
            <View style={{ width: 22 }} />
          </ImageBackground>
        </View>

        {/* ── Level Pill Tabs ── */}
        <View style={[styles.tabOuter, isDark && styles.tabOuterDark]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {availableLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.tab,
                  activeTab === level ? styles.tabActive : styles.tabInactive,
                ]}
                onPress={() => setActiveTab(level)}
                activeOpacity={0.8}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.tabText,
                    activeTab === level
                      ? styles.tabTextActive
                      : isDark
                        ? styles.tabTextInactiveDark
                        : styles.tabTextInactive,
                  ]}
                >
                  {LEVEL_LABELS[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.body}>
          {/* ── Banner Image / Video ── */}
          <View style={styles.bannerWrap}>
            {bannerUrl ? (
              <Image
                source={{ uri: bannerUrl }}
                style={styles.bannerImg}
                resizeMode="cover"
              />
            ) : videoUrl ? (
              <Video
                source={{ uri: videoUrl }}
                style={styles.bannerImg}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                useNativeControls
              />
            ) : (
              <View
                style={[
                  styles.bannerPlaceholder,
                  isDark && styles.bannerPlaceholderDark,
                ]}
              >
                <Text
                  style={[
                    styles.bannerPlaceholderText,
                    isDark && styles.bannerPlaceholderTextDark,
                  ]}
                >
                  PLAY LIKE PELÉ
                </Text>
              </View>
            )}
          </View>

          {/* ── Skill Of The Day ── */}
          {activeLevelData && (
            <View style={styles.skillSection}>
              <Text
                style={[
                  styles.skillOfDayLabel,
                  isDark && styles.skillOfDayLabelDark,
                ]}
              >
                Skill Of The Day
              </Text>
              <View style={styles.skillNameRow}>
                <Text
                  style={[styles.skillName, isDark && styles.skillNameDark]}
                >
                  {activeLevelData.skillOfTheDay}
                </Text>
                <TouchableOpacity style={styles.soundBtn}>
                  <Ionicons name="volume-medium" size={18} color="#22c55e" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.skillDesc, isDark && styles.skillDescDark]}>
                {activeLevelData.description}
              </Text>
            </View>
          )}

          {/* ── Player Video / Photo ── */}
          {videoUrl ? (
            <View style={styles.playerPhotoWrap}>
              <Video
                source={{ uri: videoUrl }}
                style={styles.playerPhoto}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                useNativeControls
              />
            </View>
          ) : activeLevelData?.player ? (
            <View style={styles.playerPhotoWrap}>
              <View
                style={[
                  styles.playerPhotoPlaceholder,
                  isDark && styles.playerPhotoPlaceholderDark,
                ]}
              >
                <Ionicons
                  name="person"
                  size={60}
                  color={isDark ? "#4B4B55" : "#ccc"}
                />
                <Text
                  style={[styles.playerName, isDark && styles.playerNameDark]}
                >
                  {activeLevelData.player}
                </Text>
              </View>
            </View>
          ) : null}

          {/* ── Session Plan Header ── */}
          {exercises.length > 0 && (
            <View style={styles.sessionHeader}>
              <View style={styles.sessionTitleRow}>
                <Text
                  style={[
                    styles.sessionTitle,
                    isDark && styles.sessionTitleDark,
                  ]}
                >
                  Session Plan
                </Text>
                <View
                  style={[
                    styles.durationPill,
                    isDark && styles.durationPillDark,
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.durationText,
                      isDark && styles.durationTextDark,
                    ]}
                  >
                    {displayDuration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.downloadBtn, isDark && styles.downloadBtnDark]}
              >
                <Ionicons name="download-outline" size={20} color="#22c55e" />
              </TouchableOpacity>
            </View>
          )}

          {/* ── Exercise Cards ── */}
          <View style={styles.exerciseList}>
            {exercises.map((exercise) => {
              const images = parseImageUrls(exercise.imageUrl);
              const imageUri = images[0];
              return (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() =>
                    onSessionItemSelect && onSessionItemSelect(exercise)
                  }
                  activeOpacity={0.85}
                >
                  {/* Thumbnail */}
                  <View style={styles.thumbWrap}>
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.thumbImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.fieldThumb}>
                        <View style={styles.fieldCenter}>
                          <View style={styles.fieldCircle} />
                          <View style={styles.fieldLine} />
                        </View>
                        <View style={styles.fieldGoalLeft} />
                        <View style={styles.fieldGoalRight} />
                      </View>
                    )}
                  </View>

                  {/* Text */}
                  <View style={styles.exerciseInfo}>
                    <Text
                      style={[styles.exTitle, isDark && styles.exTitleDark]}
                    >
                      {exercise.title}
                    </Text>
                    <Text
                      style={[styles.exDesc, isDark && styles.exDescDark]}
                      numberOfLines={3}
                    >
                      {exercise.description?.replace(/<[^>]+>/g, "") || ""}
                    </Text>
                    <Text
                      style={[
                        styles.exDuration,
                        isDark && styles.exDurationDark,
                      ]}
                    >
                      {exercise.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 48 }} />
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

  /* ── Header ── */
  greenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#22c55e",
    borderRadius: 15,
    paddingHorizontal: 16,
    padding: 28,
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 32,
    color: "#fff",
    letterSpacing: 0.3,
    fontFamily: "Urbanist_700Bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  /* ── Level Tabs ── */
  tabsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    gap: 10,
  },
  tabOuter: {
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    padding: 2,
    marginBottom: 20,
    width: "93%",
    alignSelf: "center",
  },
  tabOuterDark: {
    backgroundColor: "#1E1E1E",
  },
  tab: {
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  tabActive: {
    backgroundColor: "#3771E0",
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabTextInactive: {
    color: "#1a1a1a",
  },
  tabTextInactiveDark: {
    color: "#E5E7EB",
  },
  /* ── Body ── */
  body: {
    paddingHorizontal: 14,
  },

  /* ── Banner ── */
  bannerWrap: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImg: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
  },
  bannerPlaceholderDark: {
    backgroundColor: "#0F2A1A",
    borderColor: "#1CAB4B",
  },
  bannerPlaceholderText: {
    fontSize: 22,
    color: "#15803d",
    letterSpacing: 1,
    fontFamily: "Urbanist_700Bold",
  },
  bannerPlaceholderTextDark: {
    color: "#4ADE80",
  },

  /* ── Skill Section ── */
  skillSection: {
    marginBottom: 18,
  },
  skillOfDayLabel: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 4,
    fontFamily: "Urbanist_700Bold",
  },
  skillOfDayLabelDark: {
    color: "#fff",
  },
  skillNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 20,
    color: "#374151",
    fontFamily: "Urbanist_600SemiBold",
  },
  skillNameDark: {
    color: "#E5E7EB",
  },
  soundBtn: {
    padding: 2,
  },
  skillDesc: {
    fontSize: 14,
    color: "#88909D",
    lineHeight: 19,
    fontFamily: "Urbanist_400Regular",
  },
  skillDescDark: {
    color: "#9CA3AF",
  },

  /* ── Player Photo ── */
  playerPhotoWrap: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 22,
  },
  playerPhoto: {
    width: "100%",
    height: "100%",
  },
  playerPhotoPlaceholder: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playerPhotoPlaceholderDark: {
    backgroundColor: "#1E1E1E",
  },
  playerName: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Urbanist_600SemiBold",
  },
  playerNameDark: {
    color: "#9CA3AF",
  },

  /* ── Session Plan Header ── */
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sessionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sessionTitle: {
    fontSize: 17,
    color: "#111827",
    fontFamily: "Urbanist_700Bold",
  },
  sessionTitleDark: {
    color: "#fff",
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationPillDark: {
    backgroundColor: "#1E1E1E",
  },
  durationText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Urbanist_600SemiBold",
  },
  durationTextDark: {
    color: "#9CA3AF",
  },
  downloadBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtnDark: {
    backgroundColor: "#0F2A1A",
  },

  /* ── Exercise Cards ── */
  exerciseList: {
    gap: 0,
  },
  exerciseCard: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "flex-start",
  },
  thumbWrap: {
    width: 120,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
    flexShrink: 0,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
  },
  fieldThumb: {
    flex: 1,
    backgroundColor: "#4ade80",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  fieldCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  fieldCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    position: "absolute",
  },
  fieldLine: {
    width: 1.5,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)",
    position: "absolute",
  },
  fieldGoalLeft: {
    position: "absolute",
    left: 0,
    top: "30%",
    width: 8,
    height: "40%",
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
  },
  fieldGoalRight: {
    position: "absolute",
    right: 0,
    top: "30%",
    width: 8,
    height: "40%",
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
  },
  exerciseInfo: {
    flex: 1,
    paddingTop: 2,
  },
  exTitle: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
    fontFamily: "Urbanist_700Bold",
  },
  exTitleDark: {
    color: "#fff",
  },
  exDesc: {
    fontSize: 11.5,
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 6,
    fontFamily: "Urbanist_400Regular",
  },
  exDescDark: {
    color: "#9CA3AF",
  },
  exDuration: {
    fontSize: 11.5,
    color: "#374151",
    fontFamily: "Urbanist_700Bold",
  },
  exDurationDark: {
    color: "#D1D5DB",
  },
});
