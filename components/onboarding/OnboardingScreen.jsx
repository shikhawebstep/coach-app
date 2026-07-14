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

  const [currentStep, setCurrentStep] = useState(1);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    "1": false, "2": false, "3": false, "4": false,
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // ── Fetch profile once and derive which onboarding steps are already done ──
  useEffect(() => {
    if (!token || !userId) { setProfileLoading(false); return; }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/account-profile/${userId}`, {
      method: 'GET', headers,
    })
      .then(r => r.json())
      .then(result => {
        if (result.status && result.data) {
          const d = result.data;

          // 1 = Contract
          const contractDone = d.contract?.status === 'signed' || !!d.contract?.signedAt;

          // 2 = Qualifications — considered done if at least one qualification doc is uploaded
          // ⚠️ ADJUST: if there's a fixed required list of qualification keys, check against that
          // instead of "any key present" (e.g. all of ['fa_level_1', 'safeguarding', ...] must exist).
          const qualificationsDone = !!d.qualifications && Object.keys(d.qualifications).length > 0;

          // 3 = Uniform
          const uniformDone = d.uniformPurchaseStatus === 'completed';

          // 4 = Training — ⚠️ no field returned by this API yet.
          // Keeping whatever local state already has (e.g. set by handleCompleteTask)
          // until backend exposes a training completion field.
          setCompletedTasks(prev => ({
            "1": contractDone,
            "2": qualificationsDone,
            "3": uniformDone,
            "4": prev["4"],
          }));
        }
      })
      .catch(err => console.error('Onboarding profile fetch:', err))
      .finally(() => setProfileLoading(false));
  }, [token, userId]);

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
    else router.replace('/(tabs)');
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
        <StatusBar
          barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={COLORS.headerBg}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator color={COLORS.blueBtn} size="large" />
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

      {currentStep > 1 && <Header isOnboarding={true} />}

      {/* TASK PANEL OVERLAY */}
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