import { ResizeMode, Video } from 'expo-av';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// ─────────────────────────────────────────────
// VIDEO PLAYER MODAL
// ─────────────────────────────────────────────

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];


function VideoPlayerModal({ visible, item, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) setIsLoading(true);
  }, [visible, item]);

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={playerSt.container}>
        <View style={playerSt.header}>
          <TouchableOpacity onPress={onClose} style={playerSt.closeBtn}>
            <Text style={playerSt.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={playerSt.title} numberOfLines={1}>{item.title}</Text>
        </View>

        <View style={playerSt.mediaWrap}>
          {item.isVideo ? (
            <>
              <Video
                source={{ uri: item.url }}
                style={playerSt.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setIsLoading(false);
                }}
              />
              {isLoading && (
                <View style={playerSt.loadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </>
          ) : (
            <Image source={item.thumbnail} style={playerSt.video} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  );
}

const playerSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, gap: 12,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16 },
  title: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  mediaWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

// ─────────────────────────────────────────────
// TRAINING STEP
// ─────────────────────────────────────────────
const TrainingStep = ({ onComplete, onBack, isCompleted, styles, COLORS, authToken }) => {
  const [view, setView] = useState('list');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: selectedOptionText }
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(643);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingItem, setPlayingItem] = useState(null);

  // ── Assessment submission (API) ──
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null); // API response data

  // ── Retake tracking ──
  const MAX_RETAKES = 2;
  const [retakeCount, setRetakeCount] = useState(0);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/courses/listing`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const rawText = await response.text();
      if (!response.ok) throw new Error(`Failed to load courses (${response.status}): ${rawText}`);

      const json = JSON.parse(rawText);
      if (!json.status) throw new Error(json.message || "Failed to load courses");

      setCourses(json.data || []);
    } catch (e) {
      console.error('fetchCourses error:', e);
      setError(e.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (view !== 'assessment' || showResult) return;
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [view, showResult]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Flatten every module's uploadFiles into one "videos" list for display
  const getMediaItems = (course) => {
    if (!course?.modules) return [];
    return course.modules.flatMap((mod) =>
      (mod.uploadFiles || []).map((file) => ({
        title: file.originalName,
        duration: file.durationText || '—',
        isVideo: file.mimeType?.startsWith('video'),
        thumbnail: { uri: file.url },
        url: file.url,
        moduleTitle: mod.title,
      }))
    );
  };

  const questions = selectedCourse?.questions || [];
  const passingValue = assessmentResult?.passingValue ?? selectedCourse?.passingConditionValue ?? 70;

  // Local fallback scoring (used only if API call fails)
  const localScore = questions.filter((q, i) => answers[i] === q.answer).length;
  const localScorePercent = questions.length ? Math.round((localScore / questions.length) * 100) : 0;

  // Prefer API response fields, fallback to local calc
  const score = assessmentResult?.score ?? localScore;
  const scorePercent = assessmentResult?.scorePercent ?? localScorePercent;
  const passed = assessmentResult?.passed ?? (scorePercent >= passingValue);
  const retakesLeft = assessmentResult?.retakesLeft ?? (MAX_RETAKES - retakeCount);
  const noMoreRetakes = !passed && retakesLeft <= 0;

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Naya course select hone par retake counter reset karo
  const startCourse = (course) => {
    setSelectedCourse(course);
    setRetakeCount(0);
    setAssessmentResult(null);
    setView('videos');
  };

  // ── Submit assessment to API ──
  const submitAssessment = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        courseId: selectedCourse.id,
        answers: questions.map((q, i) => ({
          questionIndex: i,
          selectedOption: answers[i],
        })),
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/course/assessments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const rawText = await response.text();
      if (!response.ok) throw new Error(`Failed to submit assessment (${response.status}): ${rawText}`);

      const json = JSON.parse(rawText);
      if (!json.status) throw new Error(json.message || "Failed to submit assessment");

      // NOTE: adjust these field names to match actual API response shape
      setAssessmentResult(json.data || json);
    } catch (e) {
      console.error('submitAssessment error:', e);
      setSubmitError(e.message || "Failed to submit assessment");
      setAssessmentResult(null); // falls back to local scoring
    } finally {
      setSubmitting(false);
      setShowResult(true);
    }
  };

  if (view === 'list') return (
    <View style={styles.stepContainer}>
      <View style={styles.contractHeader}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.contractHeaderTitle}>Training</Text>
        <View style={[styles.pendingBadge, isCompleted && { backgroundColor: COLORS.success }]}>
          <Text style={[styles.pendingBadgeText, isCompleted && { color: "#fff" }]}>
            {isCompleted ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.contractBtnRow}>
        <TouchableOpacity style={styles.contractBtn} onPress={onBack}>
          <Text style={styles.contractBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Image source={require('@/assets/images/search-01.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search course..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <Text style={{ color: COLORS.textSecondary, padding: 16 }}>Loading courses…</Text>
      ) : error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: COLORS.error, marginBottom: 8 }}>{error}</Text>
          <TouchableOpacity style={styles.contractBtn} onPress={fetchCourses}>
            <Text style={styles.contractBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredCourses.length === 0 ? (
        <Text style={{ color: COLORS.textSecondary, padding: 16 }}>No courses found.</Text>
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 12, paddingTop: 8 }}>
          {filteredCourses.map((course) => {
            const media = getMediaItems(course);
            const firstThumb = media.find((m) => !m.isVideo)?.thumbnail
              || require('@/assets/images/training1.png');

            const status = 'pending';

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseListCard}
                onPress={() => startCourse(course)}
                activeOpacity={0.85}
              >
                <ImageBackground source={firstThumb} style={styles.courseListImage} resizeMode="cover">
                  <View style={styles.courseListOverlay}>
                    <Text style={styles.courseListTitle}>{course.title}</Text>
                    <Text style={styles.courseListMeta}>
                      {media.length} item{media.length !== 1 ? 's' : ''} · {course.totalQuestions} question{course.totalQuestions !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.courseListBadgeWrap}>
                    <View style={[
                      styles.courseBadge,
                      status === 'passed' ? styles.courseBadgePassed :
                        status === 'retake' ? styles.courseBadgePassed :
                          styles.courseBadgePending,
                    ]}>
                      <Text style={styles.courseBadgeText}>
                        {status === 'passed' ? 'Passed' : status === 'retake' ? 'Retake' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </View>
  );

  if (view === 'videos') {
    const media = getMediaItems(selectedCourse);
    return (
      <View style={styles.stepContainer}>
        <View style={styles.contractHeader}>
          <TouchableOpacity onPress={() => setView('list')}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.contractHeaderTitle}>{selectedCourse?.title}</Text>
        </View>

        <View style={styles.contractBtnRow}>
          <TouchableOpacity style={styles.contractBtn} onPress={() => setView('list')}>
            <Text style={styles.contractBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {!!selectedCourse?.description && (
            <Text style={{ color: COLORS.textSecondary, padding: 14 }}>{selectedCourse.description}</Text>
          )}
          <View style={styles.videoGrid}>
            {media.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={styles.videoGridThumb}
                activeOpacity={0.85}
                onPress={() => setPlayingItem(m)}
              >
                <ImageBackground source={m.thumbnail} style={styles.videoGridImage} resizeMode="cover">
                  <View style={styles.darkOverlay} />
                  <View style={styles.videoGridOverlay}>
                    <View style={styles.playBtnSmall}>
                      <Text style={{ color: '#fff', fontSize: 40 }}>{m.isVideo ? '▶' : '🖼'}</Text>
                    </View>
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.videoGridLabel}>{m.title}</Text>
                    <Text style={styles.videoGridDur}>{m.duration}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={{ padding: 12, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              setView('assessment');
              setTimeLeft(643);
              setCurrentQ(0);
              setAnswers({});
              setShowResult(false);
              setAssessmentResult(null);
              setSubmitError(null);
            }}
          >
            <Text style={styles.primaryBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>

        <VideoPlayerModal
          visible={!!playingItem}
          item={playingItem}
          onClose={() => setPlayingItem(null)}
        />
      </View>
    );
  }

  if (view === 'assessment' && !showResult) {
    if (questions.length === 0) {
      return (
        <View style={styles.stepContainer}>
          <Text style={{ padding: 20, color: COLORS.textSecondary }}>No questions available for this course.</Text>
        </View>
      );
    }
    return (
      <View style={styles.stepContainer}>
        <View style={styles.contractHeader}>
          <TouchableOpacity onPress={() => setView('videos')}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.contractHeaderTitle}>Assessment</Text>
        </View>

        <View style={styles.contractBtnRow}>
          <TouchableOpacity style={styles.contractBtn} onPress={() => setView('videos')}>
            <Text style={styles.contractBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerBar}>
          <Text style={styles.timerText}>Time remaining {formatTime(timeLeft)}</Text>
        </View>

        <View style={{ flex: 1, padding: 14 }}>
          <Text style={styles.qLabel}>Question {currentQ + 1}/{questions.length}</Text>
          <Text style={styles.qText}>{questions[currentQ].question}</Text>

         {questions[currentQ].options.map((opt, i) => {
            const letter = OPTION_LETTERS[i];
            const isSelected = answers[currentQ] === letter;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.assessOption, isSelected && styles.assessOptionSelected]}
                onPress={() => setAnswers((prev) => ({ ...prev, [currentQ]: letter }))}
                activeOpacity={0.8}
              >
                <Text style={[styles.assessOptionText, isSelected && styles.assessOptionTextSelected]}>
                {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
          {!!submitError && (
            <Text style={{ color: COLORS.error, marginTop: 12 }}>{submitError}</Text>
          )}
        </View>

        <View style={{ padding: 14, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (answers[currentQ] === undefined || submitting) && styles.primaryBtnDisabled,
            ]}
            disabled={answers[currentQ] === undefined || submitting}
            onPress={() =>
              currentQ < questions.length - 1
                ? setCurrentQ(currentQ + 1)
                : submitAssessment()
            }
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {currentQ < questions.length - 1 ? 'Next' : 'Submit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'assessment' && showResult) return (
    <View style={[styles.resultContainer]}>
      <View style={[
        styles.resultCircle,
        passed ? styles.resultCirclePass : styles.resultCircleFail,
      ]}>
        <Image
          source={passed ? require('@/assets/images/congrats.png') : require('@/assets/images/failed.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      <Text style={[styles.resultTitle, !passed && styles.resultTitleFail]}>
        {passed ? 'Congratulations!' : noMoreRetakes ? 'Out of attempts' : 'Almost there!'}
      </Text>

      <Text style={styles.resultSub}>
        {passed
          ? "You've passed the assessment and completed all onboarding tasks."
          : noMoreRetakes
            ? `You scored ${score}/${questions.length} (${scorePercent}%). You've used all ${MAX_RETAKES} retakes. Please contact your admin for further assistance.`
            : `You scored ${score}/${questions.length} (${scorePercent}%). You need ${passingValue}% to pass. You have ${retakesLeft} retake${retakesLeft !== 1 ? 's' : ''} left.`}
      </Text>

      {passed ? (
        <TouchableOpacity style={[styles.greenBtn, { marginTop: 24 }]} onPress={onComplete}>
          <Text style={styles.primaryBtnText}>Go Back To Courses</Text>
        </TouchableOpacity>
      ) : noMoreRetakes ? (
        <TouchableOpacity
          style={[styles.redBtn, { marginTop: 24 }]}
          onPress={() => { setView('list'); setSelectedCourse(null); }}
        >
          <Text style={styles.primaryBtnText}>Back to Courses</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.redBtn, { marginTop: 24 }]}
          onPress={() => {
            setRetakeCount((c) => c + 1);
            setCurrentQ(0);
            setAnswers({});
            setShowResult(false);
            setAssessmentResult(null);
            setTimeLeft(643);
          }}
        >
          <Text style={styles.primaryBtnText}>
            Retake Assessment ({retakesLeft} left)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return null;
};

export default TrainingStep;