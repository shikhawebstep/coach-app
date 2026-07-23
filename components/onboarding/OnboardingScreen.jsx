import { useAuth } from '@/context/AuthContext';
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
// HELPERS
// ─────────────────────────────────────────────

// Correctly determines whether a qualification field actually has data.
// Handles primitives, arrays, and nested objects (previously an empty
// nested object like {} was incorrectly treated as "filled").
const isValueFilled = (val) => {
  if (val === null || val === undefined || val === '') return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return true;
};

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

export default function OnboardingScreen({ navigation, coachName = "Ethan" }) {
  const router = useRouter();
  const scheme = useColorScheme(); // triggers re-render on theme change
  const COLORS = scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const styles = createStyles(COLORS);
  const { token, userId, completeOnboarding, coachProfile } = useAuth();
  const name = coachProfile?.firstName || coachName || "Coach";

  const [currentStep, setCurrentStep] = useState(0);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    "1": false, "2": false, "3": false, "4": false,
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleComplete = useCallback(() => {
    completeOnboarding();
    if (navigation) navigation.navigate("Home");
    else router.replace('/');
  }, [completeOnboarding, navigation, router]);

  const fetchProfileData = useCallback(async (controller = null) => {
    try {
      const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/").replace(/\/$/, "");
      const url = `${baseUrl}/api/coachpro/account-profile/${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal: controller?.signal,
      });

      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("❌ [OnboardingScreen] Failed to parse JSON:", parseErr.message);
        setProfileError(true);
        return false;
      }

      if (!result.status || !result.data) {
        console.warn("⚠️ [OnboardingScreen] Invalid profile response — status:", result.status, "data:", result.data);
        return false;
      }

      const d = result.data;
      const contractDone = d.contract?.status === "signed" || !!d.contract?.signedAt;
      const qualValues = d.qualifications && typeof d.qualifications === 'object'
        ? Object.values(d.qualifications)
        : [];
      const qualificationsDone = qualValues.some(isValueFilled);
      const uniformDone = d.uniformPurchaseStatus === "completed";
      const trainingDone = d.onboardingCourseResult?.status === "pass" || d.onboardingCourseResult?.status === "completed";

      const updatedTasks = {
        "1": contractDone,
        "2": qualificationsDone,
        "3": uniformDone,
        "4": trainingDone,
      };

      setCompletedTasks((prev) => ({ ...prev, ...updatedTasks }));

      if (contractDone && qualificationsDone && uniformDone && trainingDone) {
        setRedirecting(true);
        handleComplete();
        return true;
      }
      return true;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("❌ [OnboardingScreen] Profile fetch error:", err.name, err.message);
        setProfileError(true);
      }
      return false;
    }
  }, [token, userId, handleComplete]);

  useEffect(() => {
    if (!token || !userId) {
      console.warn("⚠️ [OnboardingScreen] Missing token or userId — skipping profile fetch");
      setProfileLoading(false);
      return;
    }

    const controller = new AbortController();
    setProfileError(false);

    const initFetch = async () => {
      await fetchProfileData(controller);
      setProfileLoading(false);
    };
    initFetch();

    return () => controller.abort();
  }, [token, userId, fetchProfileData]);

  const sharedProps = { styles, COLORS };

  const handleSelectTask = (taskIndex) => setCurrentStep(taskIndex + 2);
  const handleBackToDashboard = () => setCurrentStep(1);
  
  const handleCompleteTask = async (taskId) => {
    setProfileLoading(true);
    await fetchProfileData();
    setProfileLoading(false);
    setCurrentStep(1);
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
        {currentStep === 0 && <WelcomeStep coachName={name} onStart={() => setCurrentStep(1)} {...sharedProps} />}

        {currentStep === 1 && (
          <TaskDashboardStep
            coachName={name}
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