import { useAuth } from '@/context/AuthContext';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Header from '../../components/layout/Header';

import { DARK_COLORS, LIGHT_COLORS } from "./OnboardingColors";
import { ONBOARDING_TASKS } from "./OnboardingConstants";
import createStyles from "./OnboardingStyles";

import ContractStep from "./OnboardingContractStep";
import TaskDashboardStep from "./OnboardingDashboardStep";
import QualificationsStep from "./OnboardingQualificationsStep";
import TaskList from "./OnboardingTaskList";
import TrainingStep from "./OnboardingTrainingStep";
import UniformStep from "./OnboardingUniformStep";
import WelcomeStep from "./OnboardingWelcomeStep";

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

export default function OnboardingScreen({ navigation, coachName = "Ethan" }) {
  const router = useRouter();
  const scheme = useColorScheme(); // triggers re-render on theme change
  const COLORS = scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const styles = createStyles(COLORS);
  const { token, userId, completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    "1": false, "2": false, "3": false, "4": false,
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

useEffect(() => {
  console.log("🔍 [OnboardingScreen] useEffect triggered");
  console.log("🔍 token:", token ? `${token.substring(0, 20)}...` : "NULL / UNDEFINED");
  console.log("🔍 userId:", userId);

  if (!token || !userId) {
    console.warn("⚠️ [OnboardingScreen] Missing token or userId — skipping profile fetch");
    setProfileLoading(false);
    return;
  }

  const controller = new AbortController();
  const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/").replace(/\/$/, "");
  const url = `${baseUrl}/api/coachpro/account-profile/${userId}`;

  console.log("🌐 [OnboardingScreen] Fetching profile URL:", url);
  console.log("🔑 [OnboardingScreen] Auth header:", `Bearer ${token.substring(0, 20)}...`);

  setProfileError(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      console.log("📡 [OnboardingScreen] Response status:", response.status, response.statusText);

      const rawText = await response.text();
      console.log("📦 [OnboardingScreen] Raw response text:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("❌ [OnboardingScreen] Failed to parse JSON:", parseErr.message);
        setProfileError(true);
        return;
      }

      console.log("✅ [OnboardingScreen] Parsed result:", JSON.stringify(result, null, 2));

      if (!result.status || !result.data) {
        console.warn("⚠️ [OnboardingScreen] Invalid profile response — status:", result.status, "data:", result.data);
        return;
      }

      const d = result.data;
      console.log("📋 [OnboardingScreen] Profile data keys:", Object.keys(d));
      console.log("📋 contract:", d.contract);
      console.log("📋 qualifications:", d.qualifications);
      console.log("📋 uniformPurchaseStatus:", d.uniformPurchaseStatus);
      console.log("📋 onboardingCourseResult:", d.onboardingCourseResult);

      const contractDone = d.contract?.status === "signed" || !!d.contract?.signedAt;
      const qualificationsDone = !!d.qualifications && Object.keys(d.qualifications).length > 0;
      const uniformDone = d.uniformPurchaseStatus === "completed";
      const trainingDone = d.onboardingCourseResult?.status === "pass";

      console.log("🏁 Task states — contract:", contractDone, "| qualifications:", qualificationsDone, "| uniform:", uniformDone, "| training:", trainingDone);

      if (contractDone && qualificationsDone && uniformDone && trainingDone) {
        console.log("🎉 [OnboardingScreen] All tasks complete — redirecting");
        setRedirecting(true);
        handleComplete();
        return;
      }

      setCompletedTasks((prev) => ({
        "1": contractDone || prev["1"],
        "2": qualificationsDone || prev["2"],
        "3": uniformDone || prev["3"],
        "4": trainingDone || prev["4"],
      }));
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("❌ [OnboardingScreen] Profile fetch error:", err.name, err.message);
        setProfileError(true);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  fetchProfile();

  return () => controller.abort();
}, [token, userId]);

console.log('profileError',profileError)

  const sharedProps = { styles, COLORS };

  const handleSelectTask = (taskIndex) => setCurrentStep(taskIndex + 2);
  const handleBackToDashboard = () => setCurrentStep(1);
  const handleCompleteTask = (taskId) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: true }));
    setCurrentStep(1);
  };
  const handleComplete = () => {
    completeOnboarding();
    if (navigation) navigation.navigate("Home");
    else router.replace('/');
  };

  if (profileLoading || redirecting) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
        <StatusBar
          barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={COLORS.headerBg}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator color={COLORS.accent || '#2F5FE5'} size="large" />
          <Text style={{ color: COLORS.textSecondary, fontFamily: 'Urbanist_500Medium' }}>
            Loading your onboarding status…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      { flex: 1 },
      currentStep !== 1 && { backgroundColor: COLORS.screenBg }
    ]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.headerBg}
      />

      {/* FIX: Header now gets a handler to actually open the task panel.
          Previously showTaskPanel was only ever set to false, so this
          overlay could never be opened. */}
      {currentStep > 1 && (
        <Header
          isOnboarding={true}
          onMenuPress={() => setShowTaskPanel(true)}
        />
      )}

      {showTaskPanel && currentStep > 0 && (
        <View style={styles.taskPanelOverlay}>
          <View style={styles.taskPanel}>
            <View style={styles.taskPanelHeader}>
              <Text style={styles.taskPanelTitle}>Onboarding Tasks (4)</Text>
              <TouchableOpacity onPress={() => setShowTaskPanel(false)}>
                <Text style={styles.taskPanelClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TaskList
              tasks={ONBOARDING_TASKS}
              completedTasks={completedTasks}
              currentTaskIndex={currentStep - 2}
              onSelect={(i) => { setCurrentStep(i + 2); setShowTaskPanel(false); }}
              {...sharedProps}
            />
          </View>
        </View>
      )}

      {profileError && currentStep === 1 && (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: '#D11A2A', fontFamily: 'Urbanist_500Medium', fontSize: 13 }}>
            Couldn't load your saved onboarding progress. You can still continue below.
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {currentStep === 0 && <WelcomeStep coachName={coachName} onStart={() => setCurrentStep(1)} {...sharedProps} />}

        {currentStep === 1 && (
          <TaskDashboardStep
            coachName={coachName}
            completedTasks={completedTasks}
            onSelectTask={handleSelectTask}
            onStart={() => {
              const firstIncomplete = ONBOARDING_TASKS.findIndex((t) => !completedTasks[t.id]);
              if (firstIncomplete !== -1) handleSelectTask(firstIncomplete);
              else handleComplete();
            }}
            {...sharedProps}
          />
        )}

        {currentStep === 2 && (
          <ContractStep
            isCompleted={!!completedTasks["1"]}
            onComplete={() => handleCompleteTask("1")}
            onNext={() => setCurrentStep(3)}
            onBack={handleBackToDashboard}
            {...sharedProps}
            token={token}
            userId={userId}
          />
        )}

        {currentStep === 3 && (
          <QualificationsStep
            isCompleted={!!completedTasks["2"]}
            onComplete={() => handleCompleteTask("2")}
            onBack={handleBackToDashboard}
            {...sharedProps}
            token={token}
            userId={userId}
          />
        )}

        {currentStep === 4 && (
          <UniformStep
            isCompleted={!!completedTasks["3"]}
            onComplete={() => handleCompleteTask("3")}
            onBack={handleBackToDashboard}
            {...sharedProps}
            token={token}
          />
        )}

        {currentStep === 5 && (
          <TrainingStep
            isCompleted={!!completedTasks["4"]}
            onComplete={() => handleCompleteTask("4")}
            onBack={handleBackToDashboard}
            {...sharedProps}
            authToken={token}
          />
        )}
      </View>
    </SafeAreaView>
  );
}