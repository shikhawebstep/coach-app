import { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("process.env.EXPO_PUBLIC_API_BASE_URLapi/coachpro/courses/listing", {
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
        thumbnail: { uri: file.url }, // images render directly; videos show url as poster fallback
        url: file.url,
        moduleTitle: mod.title,
      }))
    );
  };

  const questions = selectedCourse?.questions || [];
  const passingValue = selectedCourse?.passingConditionValue ?? 70;

  // Score by comparing selected option TEXT to the answer TEXT (API gives strings, not indices)
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const scorePercent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = scorePercent >= passingValue;

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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

            // Note: API doesn't currently return per-user pass/retake status here.
            // Treat compulsory + not-yet-attempted as "Pending" until you have a
            // completion-status endpoint to merge in.
            const status = 'pending';

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseListCard}
                onPress={() => { setSelectedCourse(course); setView('videos'); }}
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
                        status === 'retake' ? styles.courseBadgeRetake :
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
              <TouchableOpacity key={i} style={styles.videoGridThumb} activeOpacity={0.85}>
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
            onPress={() => { setView('assessment'); setTimeLeft(643); setCurrentQ(0); setAnswers({}); setShowResult(false); }}
          >
            <Text style={styles.primaryBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
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

          {questions[currentQ].options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.assessOption, answers[currentQ] === opt && styles.assessOptionSelected]}
              onPress={() => setAnswers((prev) => ({ ...prev, [currentQ]: opt }))}
              activeOpacity={0.8}
            >
              <Text style={[styles.assessOptionText, answers[currentQ] === opt && styles.assessOptionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding: 14, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity
            style={[styles.primaryBtn, answers[currentQ] === undefined && styles.primaryBtnDisabled]}
            onPress={answers[currentQ] !== undefined
              ? () => currentQ < questions.length - 1
                ? setCurrentQ(currentQ + 1)
                : setShowResult(true)
              : null}
          >
            <Text style={styles.primaryBtnText}>
              {currentQ < questions.length - 1 ? 'Next' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'assessment' && showResult) return (
    <View style={[styles.resultContainer]}>
      <View style={[styles.resultCircle, passed ? styles.resultCirclePass : styles.resultCircleFail]}>
        <Image
          source={passed ? require('@/assets/images/congrats.png') : require('@/assets/images/failed.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      <Text style={[styles.resultTitle, !passed && styles.resultTitleFail]}>
        {passed ? 'Congratulations!' : 'Almost there!'}
      </Text>
      <Text style={styles.resultSub}>
        {passed
          ? "You've passed the assessment and completed all onboarding tasks."
          : `You scored ${score}/${questions.length} (${scorePercent}%). You need ${passingValue}% to pass.`}
      </Text>
      <TouchableOpacity
        style={[styles.greenBtn, { marginTop: 24 }, !passed && styles.redBtn]}
        onPress={passed
          ? onComplete
          : () => { setCurrentQ(0); setAnswers({}); setShowResult(false); }}
      >
        <Text style={styles.primaryBtnText}>
          {passed ? 'Go Back To Courses' : 'Retake Assessment'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return null;
};

export default TrainingStep;
