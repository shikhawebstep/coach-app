import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import OnboardingHeader from "../../components/layout/OnboardingHeader";
import { DASHBOARD_TASKS } from "./OnboardingConstants";

// ─────────────────────────────────────────────
// DASHBOARD STEP
// ─────────────────────────────────────────────

const TaskDashboardStep = ({ coachName = "Ethan", completedTasks = {}, onSelectTask, onStart, styles, COLORS }) => {
  const circumference = 2 * Math.PI * 23;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <ImageBackground source={require('@/assets/images/Login.png')} resizeMode="cover" style={{ flex: 1 }}>
      <OnboardingHeader />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 18, paddingBottom: 17 }}>
            <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Urbanist_700Bold' }}>
              Morning, {coachName} 👋
            </Text>
          </View>

          <View style={styles.dashProgressCard}>
            <View style={styles.dashCircleWrap}>
              <Svg width={110} height={110} viewBox="0 0 58 58">
                <Circle cx="29" cy="29" r="23" fill="none" stroke={COLORS.border} strokeWidth="5" />
                <Circle
                  cx="29" cy="29" r="23" fill="none"
                  stroke={COLORS.primary} strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * progressPercent) / 100}
                  strokeLinecap="round" transform="rotate(-90 29 29)"
                />
              </Svg>
              <View style={styles.dashCircleLabel}>
                <Text style={styles.dashCirclePercent}>{progressPercent}%</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashProgressTitle}>
                {progressPercent === 100 ? "Awesome! You've\ncompleted all tasks." : "Wow! You're nearly\nready to get going."}
              </Text>
              <Text style={styles.dashProgressSub}>{completedCount} of 4 completed!</Text>
            </View>
          </View>

          <Text style={styles.dashSectionLabel}>Onboarding Tasks (4)</Text>

          <View style={styles.dashTaskList}>
            {DASHBOARD_TASKS.map((task, index) => {
              const isDone = !!completedTasks[task.id];
              return (
                <TouchableOpacity key={task.id} style={styles.dashTaskRow} onPress={() => onSelectTask(index)} activeOpacity={0.8}>
                  <View style={[styles.dashTaskIcon, { backgroundColor: isDone ? COLORS.success : task.color }]}>
                    {isDone ? (
                      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>✓</Text>
                    ) : (
                      <Image source={task.icon} style={styles.taskIcon} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dashTaskTitle}>{task.title}</Text>
                    <Text style={styles.dashTaskDur}>{task.duration}</Text>
                  </View>
                  <View style={[styles.dashBadge, isDone ? styles.dashBadgeDone : null]}>
                    <Text style={[styles.dashBadgeText, isDone ? styles.dashBadgeTextDone : null]}>
                      {isDone ? "Completed" : "Pending"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.stepFooter}>
          <TouchableOpacity style={styles.yellowBtn} onPress={onStart} activeOpacity={0.85}>
            <Text style={styles.yellowBtnText}>
              {progressPercent === 100 ? "Finish Onboarding" : "Get started"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default TaskDashboardStep;
