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
import { WebView } from "react-native-webview";

// ─────────────────────────────────────────────
// VIDEO / PDF PLAYER MODAL
// ─────────────────────────────────────────────

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function isPdf(file) {
  return file.mimeType === 'application/pdf' || file.originalName?.toLowerCase().endsWith('.pdf');
}
function isVideo(file) {
  return file.mimeType?.startsWith('video');
}
// images (jpg/png/etc) are skipped entirely — not shown, not counted, not watchable

function PlayerModal({ visible, item, onClose, onFinished }) {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfDone, setPdfDone] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      setPdfDone(false);
    }
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
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) onFinished?.(item);
                }}
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
          ) : item.isPdf ? (
            <>
              <WebView
                source={{ uri: item.url }}
                style={playerSt.video}
                onLoadEnd={() => setIsLoading(false)}
              />
              {isLoading && (
                <View style={playerSt.loadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              <View style={{ padding: 14 }}>
                <TouchableOpacity
                  style={playerSt.doneBtn}
                  onPress={() => { setPdfDone(true); onFinished?.(item); }}
                >
                  <Text style={playerSt.doneBtnText}>
                    {pdfDone ? '✓ Marked as Read' : 'Mark as Read'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
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
  mediaWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  video: { width: '100%', height: '100%' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  doneBtn: {
    backgroundColor: '#22C55E', paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
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
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(643);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingItem, setPlayingItem] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const [retakeCount, setRetakeCount] = useState(0);

  // Track which media items (videos/pdfs) have been fully watched/read per course
  const [watchedMap, setWatchedMap] = useState({}); // { [courseId]: Set(itemKey) }

  // Track which courses have been passed — used to force completing ALL courses
  const [passedCourseIds, setPassedCourseIds] = useState(new Set());

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

  // Only videos + PDFs — images (jpg/png) are skipped entirely
  const getMediaItems = (course) => {
    if (!course?.modules) return [];
    return course.modules.flatMap((mod) =>
      (mod.uploadFiles || [])
        .filter((file) => isVideo(file) || isPdf(file))
        .map((file) => ({
          key: file.url,
          title: file.originalName,
          duration: file.durationText || '—',
          isVideo: isVideo(file),
          isPdf: isPdf(file),
          thumbnail: isVideo(file)
            ? require('@/assets/images/training1.png')
            : require('@/assets/images/Document.png'),
          url: file.url,
          moduleTitle: mod.title,
        }))
    );
  };

  const questions = selectedCourse?.questions || [];
  const isCourseAlreadyCompleted = selectedCourse?.statusCourse === 'completed';
  const passingValue = assessmentResult?.passingValue ?? selectedCourse?.passingConditionValue ?? 70;
  const maxRetakes = selectedCourse?.reTakeCourse ?? 0;

  // Fix: compare selected option TEXT (not letter) against q.answer
  // Fix: compare selected LETTER against the letter of the correct answer's index
  const localScore = questions.filter((q, i) => {
    const correctIndex = q.options.indexOf(q.answer);
    const correctLetter = OPTION_LETTERS[correctIndex];
    return answers[i] === correctLetter;
  }).length;
  const localScorePercent = questions.length ? Math.round((localScore / questions.length) * 100) : 0;

  const score = assessmentResult?.score ?? localScore;
  const scorePercent = assessmentResult?.scorePercent ?? localScorePercent;
  const passed = assessmentResult?.passed ?? (scorePercent >= passingValue);
  const retakesLeft = assessmentResult?.retakesLeft ?? (maxRetakes - retakeCount);
  const noMoreRetakes = !passed && retakesLeft <= 0;

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allCoursesPassed = courses.length > 0 && courses.every((c) => passedCourseIds.has(c.id));

  const startCourse = (course) => {
    setSelectedCourse(course);
    setRetakeCount(0);
    setAssessmentResult(null);
    setWatchedMap((p) => ({ ...p, [course.id]: p[course.id] || new Set() }));

    // Prefill previously submitted answers for completed courses
    if (course.statusCourse === 'completed' && Array.isArray(course.userAnswers)) {
      const prefilled = {};
      course.userAnswers.forEach(({ questionIndex, selectedOption }) => {
        const q = course.questions?.[questionIndex];
        if (!q) return;
        const optIndex = q.options.indexOf(selectedOption);
        if (optIndex >= 0) {
          prefilled[questionIndex] = OPTION_LETTERS[optIndex];
        }
      });
      setAnswers(prefilled);
    } else {
      setAnswers({});
    }

    // If backend already tells us the past result, use it instead of recomputing
    if (course.statusCourse === 'completed' && course.userScorePercent !== undefined) {
      setAssessmentResult({
        score: course.userScore,
        scorePercent: course.userScorePercent,
        passed: course.userPassed,
        passingValue: course.passingConditionValue,
        retakesLeft: course.reTakeCourse,
      });
    }

    setView('videos');
  };

  const markWatched = (courseId, item) => {
    setWatchedMap((prev) => {
      const set = new Set(prev[courseId] || []);
      set.add(item.key);
      return { ...prev, [courseId]: set };
    });
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        courseId: selectedCourse.id,
        answers: questions.map((q, i) => ({
          questionIndex: i,
          selectedOption: answers[i], // already a letter e.g. "A", "B" — send as-is
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

      setAssessmentResult(json.data || json);

      const apiPassed = (json.data || json)?.passed;
      fetchCourses();
      if (apiPassed ?? (scorePercent >= passingValue)) {
        setPassedCourseIds((prev) => new Set(prev).add(selectedCourse.id));
      }
    } catch (e) {
      console.error('submitAssessment error:', e);
      setSubmitError(e.message || "Failed to submit assessment");
      setAssessmentResult(null);
      if (localScorePercent >= passingValue) {
        setPassedCourseIds((prev) => new Set(prev).add(selectedCourse.id));
      }
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
            const status = course?.statusCourse;

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseListCard}
                onPress={() => startCourse(course)}
                activeOpacity={0.85}
              >
                <ImageBackground
                  source={require('@/assets/images/training1.png')}
                  style={styles.courseListImage}
                  resizeMode="cover"
                >
                  <View style={styles.courseListOverlay}>
                    <Text style={styles.courseListTitle}>{course.title}</Text>
                    <Text style={styles.courseListMeta}>
                      {media.length} item{media.length !== 1 ? 's' : ''} · {course.totalQuestions} question{course.totalQuestions !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.courseListBadgeWrap}>
                    <View style={[
                      styles.courseBadge,
                      status === 'completed' ? styles.courseBadgePassed : styles.courseBadgePending,
                    ]}>
                      <Text style={styles.courseBadgeText}>
                        {status}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}

          {!allCoursesPassed && (
            <Text style={{ color: COLORS.textSecondary, padding: 14, fontSize: 13 }}>
              You must watch all videos/PDFs and pass the assessment for every course to complete this step.
            </Text>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>
      )}

      {allCoursesPassed && (
        <View style={{ padding: 12, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
            <Text style={styles.primaryBtnText}>Finish Training</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (view === 'videos') {
    const media = getMediaItems(selectedCourse);
    const watchedSet = watchedMap[selectedCourse.id] || new Set();
    const allWatched = media.length > 0 && media.every((m) => watchedSet.has(m.key));
    // isCourseAlreadyCompleted now comes from component scope — remove the local const here

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

          {media.length === 0 ? (
            <Text style={{ color: COLORS.textSecondary, padding: 14 }}>
              No videos or documents available for this course.
            </Text>
          ) : (
            <View style={styles.videoGrid}>
              {media.map((m) => {
                const done = watchedSet.has(m.key);
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={styles.videoGridThumb}
                    activeOpacity={0.85}
                    onPress={() => setPlayingItem(m)}
                  >
                    <ImageBackground source={m.thumbnail} style={styles.videoGridImage} resizeMode="cover">
                      <View style={styles.darkOverlay} />
                      <View style={styles.videoGridOverlay}>
                        <View style={styles.playBtnSmall}>
                          <Text style={{ color: '#fff', fontSize: 40 }}>{m.isVideo ? '▶' : '📄'}</Text>
                        </View>
                      </View>
                      {done && (
                        <View style={styles.watchedBadge}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓ Done</Text>
                        </View>
                      )}
                      <View style={{ padding: 10 }}>
                        <Text style={styles.videoGridLabel}>{m.title}</Text>
                        <Text style={styles.videoGridDur}>{m.isVideo ? m.duration : 'PDF'}</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={{ padding: 12, backgroundColor: COLORS.contractBg }}>
          {!isCourseAlreadyCompleted && !allWatched && media.length > 0 && (
            <Text style={{ color: COLORS.error, textAlign: 'center', marginBottom: 8, fontSize: 13 }}>
              Watch all videos and read all documents to unlock the assessment.
            </Text>
          )}
          <TouchableOpacity
            style={[styles.primaryBtn, !isCourseAlreadyCompleted && !allWatched && styles.primaryBtnDisabled]}
            disabled={!isCourseAlreadyCompleted && !allWatched}
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
            <Text style={styles.primaryBtnText}>
              {isCourseAlreadyCompleted ? 'View Assessment' : 'Start Assessment'}
            </Text>
          </TouchableOpacity>
        </View>
        <PlayerModal
          visible={!!playingItem}
          item={playingItem}
          onClose={() => setPlayingItem(null)}
          onFinished={(item) => markWatched(selectedCourse.id, item)}
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
              (
                answers[currentQ] === undefined ||
                submitting ||
                (isCourseAlreadyCompleted && currentQ === questions.length - 1)
              ) && styles.primaryBtnDisabled,
            ]}
            disabled={
              answers[currentQ] === undefined ||
              submitting ||
              (isCourseAlreadyCompleted && currentQ === questions.length - 1)
            }
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
                {currentQ < questions.length - 1
                  ? 'Next'
                  : isCourseAlreadyCompleted
                    ? 'Preview Only'
                    : 'Submit'}
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
          ? `You've passed "${selectedCourse.title}". ${allCoursesPassed ? 'All courses complete!' : 'Please complete the remaining courses.'}`
          : noMoreRetakes
            ? `You scored ${score}/${questions.length} (${scorePercent}%). You've used all ${maxRetakes} retake${maxRetakes !== 1 ? 's' : ''}. Please contact your admin for further assistance.`
            : `You scored ${score}/${questions.length} (${scorePercent}%). You need ${passingValue}% to pass. You have ${retakesLeft} retake${retakesLeft !== 1 ? 's' : ''} left.`}
      </Text>

      {passed ? (
        <TouchableOpacity
          style={[styles.greenBtn, { marginTop: 24 }]}
          onPress={() => { setView('list'); setSelectedCourse(null); }}
        >
          <Text style={styles.primaryBtnText}>
            {allCoursesPassed ? 'Go Back To Courses' : 'Continue to Next Course'}
          </Text>
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