import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';

const { width } = Dimensions.get('window');

const C = {
    yellow:      "#F5C31D",
    bgDark:      "#1C1C1E",
    bgCard:      "#2C2C2E",
    bgCardInner: "#3A3A3C",
    white:       "#FFFFFF",
    textWhite:   "#FFFFFF",
    textGrey:    "#AAABAD",
    textDark:    "#1C1C1E",
    green:       "#4CAF50",
    red:         "#FF453A",
    border:      "#3A3A3C",
};

export default function TrainingFlow() {
    const router = useRouter();
    const { token } = useAuth();

    const [view, setView] = useState('list'); // 'list' | 'videos' | 'assessment' | 'result'
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Quiz states
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({}); // { qIndex: selectedOptionText }
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [score, setScore] = useState(0);
    const [scorePercent, setScorePercent] = useState(0);
    const [passed, setPassed] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://api.grabbite.com/api/coachpro/courses/listing", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const rawText = await response.text();
            if (!response.ok) throw new Error(`Failed to load courses: ${response.status}`);

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
        if (token) {
            fetchCourses();
        }
    }, [token]);

    useEffect(() => {
        if (view !== 'assessment' || showResult) return;
        const timer = setInterval(() => {
            setTimeLeft((s) => {
                if (s > 0) return s - 1;
                // Time's up: trigger auto submit
                clearInterval(timer);
                handleSubmitQuiz();
                return 0;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [view, showResult]);

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

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleStartAssessment = () => {
        if (!selectedCourse?.questions || selectedCourse.questions.length === 0) {
            alert('No assessment questions available for this course.');
            return;
        }
        setCurrentQ(0);
        setAnswers({});
        setTimeLeft(600);
        setShowResult(false);
        setView('assessment');
    };

    const handleSubmitQuiz = () => {
        const questions = selectedCourse?.questions || [];
        const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
        const percent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
        const passingValue = selectedCourse?.passingConditionValue ?? 70;
        
        setScore(correctCount);
        setScorePercent(percent);
        setPassed(percent >= passingValue);
        setView('result');
    };

    const filteredCourses = courses.filter((c) =>
        (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render Course List
    if (view === 'list') {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Training Courses</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={C.textGrey} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search courses..."
                        placeholderTextColor={C.textGrey}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <CustomLoader size={80} color={C.yellow} />
                        <Text style={styles.infoText}>Loading courses…</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchCourses}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredCourses.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.infoText}>No courses found.</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                        {filteredCourses.map((course) => {
                            const media = getMediaItems(course);
                            const firstThumb = media.find((m) => !m.isVideo)?.thumbnail
                                || require('@/assets/images/Sidebar.png'); // fallback
                            return (
                                <TouchableOpacity
                                    key={course.id}
                                    style={styles.courseCard}
                                    onPress={() => { setSelectedCourse(course); setView('videos'); }}
                                    activeOpacity={0.85}
                                >
                                    <ImageBackground source={firstThumb} style={styles.cardImage} resizeMode="cover">
                                        <View style={styles.cardOverlay}>
                                            <Text style={styles.cardTitle}>{course.title}</Text>
                                            <Text style={styles.cardMeta}>
                                                {media.length} item{media.length !== 1 ? 's' : ''} · {course.questions?.length || 0} question{course.questions?.length !== 1 ? 's' : ''}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                )}
            </View>
        );
    }

    // Render Videos/Media Listing
    if (view === 'videos') {
        const media = getMediaItems(selectedCourse);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setView('list')} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{selectedCourse?.title}</Text>
                </View>

                <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                    {!!selectedCourse?.description && (
                        <Text style={styles.description}>{selectedCourse.description}</Text>
                    )}
                    
                    <Text style={styles.sectionTitle}>Course Material</Text>

                    {media.length === 0 ? (
                        <Text style={styles.infoText}>No media items in this course.</Text>
                    ) : (
                        <View style={styles.mediaGrid}>
                            {media.map((m, i) => (
                                <TouchableOpacity key={i} style={styles.mediaCard} activeOpacity={0.85}>
                                    <ImageBackground source={m.thumbnail.uri ? m.thumbnail : require('@/assets/images/Sidebar.png')} style={styles.mediaImage} resizeMode="cover">
                                        <View style={styles.mediaOverlay}>
                                            <View style={styles.playIconContainer}>
                                                <Ionicons name={m.isVideo ? "play-circle" : "document-text"} size={44} color="#fff" />
                                            </View>
                                            <View style={styles.mediaMetaContainer}>
                                                <Text style={styles.mediaTitle} numberOfLines={1}>{m.title}</Text>
                                                <Text style={styles.mediaDur}>{m.duration}</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>

                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleStartAssessment}>
                        <Text style={styles.primaryBtnText}>Start Assessment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Render Assessment Quiz
    if (view === 'assessment') {
        const questions = selectedCourse?.questions || [];
        const currentQuestion = questions[currentQ];

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setView('videos')} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assessment</Text>
                </View>

                <View style={styles.timerBar}>
                    <Ionicons name="time-outline" size={18} color="#FF9F0A" />
                    <Text style={styles.timerText}>Time Remaining: {formatTime(timeLeft)}</Text>
                </View>

                <ScrollView style={styles.quizScroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.qIndex}>Question {currentQ + 1} of {questions.length}</Text>
                    <Text style={styles.qText}>{currentQuestion.question}</Text>

                    {currentQuestion.options.map((opt, i) => {
                        const isSelected = answers[currentQ] === opt;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                                onPress={() => setAnswers(prev => ({ ...prev, [currentQ]: opt }))}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    <View style={{ height: 40 }} />
                </ScrollView>

                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.primaryBtn, answers[currentQ] === undefined && styles.disabledBtn]}
                        onPress={answers[currentQ] !== undefined ? () => {
                            if (currentQ < questions.length - 1) {
                                setCurrentQ(currentQ + 1);
                            } else {
                                handleSubmitQuiz();
                            }
                        } : null}
                    >
                        <Text style={styles.primaryBtnText}>
                            {currentQ < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Render Results Screen
    if (view === 'result') {
        const questions = selectedCourse?.questions || [];
        const passingValue = selectedCourse?.passingConditionValue ?? 70;

        return (
            <View style={[styles.container, styles.resultContainer]}>
                <View style={styles.resultCard}>
                    <Ionicons
                        name={passed ? "checkmark-circle" : "alert-circle"}
                        size={80}
                        color={passed ? C.green : C.red}
                        style={{ marginBottom: 15 }}
                    />
                    <Text style={[styles.resultTitle, { color: passed ? C.green : C.red }]}>
                        {passed ? 'Congratulations!' : 'Almost There!'}
                    </Text>
                    <Text style={styles.resultSub}>
                        {passed
                            ? `You successfully passed the course assessment with a score of ${scorePercent}%.`
                            : `You scored ${score}/${questions.length} (${scorePercent}%). You need ${passingValue}% to pass.`
                        }
                    </Text>

                    <TouchableOpacity
                        style={[styles.resultBtn, passed ? styles.greenBtn : styles.redBtn]}
                        onPress={passed ? () => setView('list') : () => handleStartAssessment()}
                    >
                        <Text style={styles.resultBtnText}>
                            {passed ? 'Go Back to Courses' : 'Retake Assessment'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: C.bgDark,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: C.bgCard,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.bgCard,
        borderRadius: 10,
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: C.border,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
    },
    scrollList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    courseCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 16,
        height: 160,
        borderWidth: 1,
        borderColor: C.border,
    },
    cardImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cardOverlay: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 20,
        justifyContent: 'flex-end',
        height: '100%',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 4,
    },
    cardMeta: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',
    },
    description: {
        color: C.textGrey,
        fontSize: 15,
        lineHeight: 22,
        marginVertical: 16,
        fontFamily: 'Urbanist_400Regular',
    },
    sectionTitle: {
        color: C.yellow,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        fontFamily: 'Urbanist_700Bold',
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    mediaCard: {
        width: '47%',
        borderRadius: 12,
        overflow: 'hidden',
        height: 150,
        borderWidth: 1,
        borderColor: C.border,
    },
    mediaImage: {
        flex: 1,
    },
    mediaOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between',
        padding: 10,
    },
    playIconContainer: {
        alignSelf: 'center',
        marginTop: 20,
    },
    mediaMetaContainer: {
        justifyContent: 'flex-end',
    },
    mediaTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
    },
    mediaDur: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontFamily: 'Urbanist_500Medium',
        marginTop: 2,
    },
    bottomBar: {
        padding: 16,
        backgroundColor: C.bgCard,
        borderTopWidth: 1,
        borderTopColor: C.border,
    },
    primaryBtn: {
        backgroundColor: C.yellow,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#1C1C1E',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
    },
    disabledBtn: {
        opacity: 0.5,
    },
    timerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    timerText: {
        color: '#FF9F0A',
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
    },
    quizScroll: {
        flex: 1,
        padding: 16,
    },
    qIndex: {
        color: C.yellow,
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
    },
    qText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
        lineHeight: 28,
        marginVertical: 20,
    },
    optionCard: {
        backgroundColor: C.bgCard,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: C.border,
    },
    optionCardSelected: {
        borderColor: C.yellow,
        backgroundColor: '#3A3A3C',
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_600SemiBold',
    },
    optionTextSelected: {
        color: C.yellow,
    },
    resultContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    resultCard: {
        backgroundColor: C.bgCard,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: C.border,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 10,
    },
    resultSub: {
        color: C.textGrey,
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 24,
    },
    resultBtn: {
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    greenBtn: {
        backgroundColor: C.green,
    },
    redBtn: {
        backgroundColor: C.red,
    },
    resultBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Urbanist_700Bold',
    },
    infoText: {
        color: C.textGrey,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
    },
    errorText: {
        color: C.red,
        fontSize: 16,
        fontFamily: 'Urbanist_500Medium',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: C.yellow,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    retryText: {
        color: '#1C1C1E',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
