import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, useColorScheme,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = 15;
const COACHES = ['Daniel Marcus', 'James Smith', 'Sarah Connor'];
const VENUES = ['Chelsea', 'Hammersmith', 'King Cross', 'Acton'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3'];

const QUESTIONS_DATA = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
    id: i + 1,
    text: [
        'Punctuality of the coach',
        'Status of the campus',
        'Coach engagement with students',
        'Quality of coaching drills',
        'Safety standards observed',
        'Equipment condition',
        'Student participation',
        'Communication clarity',
        'Warm-up quality',
        'Cool-down quality',
        'Session planning',
        'Feedback given to students',
        'Parent interaction',
        'Time management',
        'Overall session rating',
    ][i],
}));

const REPORTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
];

// ─── Theme ────────────────────────────────────────────────────────────────────
const getColors = (isDark) => ({
    bg: isDark ? '#121212' : '#fff',
    card: isDark ? '#1E1E1E' : '#FAFAFA',
    cardAlt: isDark ? '#1A1A1A' : '#FAFAFA',
    text: isDark ? '#F5F5F5' : '#1a1a1a',
    textSecondary: isDark ? '#A1A1AA' : '#6B7280',
    textMuted: isDark ? '#9E9FAA' : '#6B7280',
    border: isDark ? '#3A3A3C' : '#E5E7EB',
    borderStrong: isDark ? '#52525B' : '#6B7280',
    placeholder: isDark ? '#71717A' : '#a0a0a0',
    icon: isDark ? '#F5F5F5' : '#1a1a1a',
    primary: '#2F5FE5',
    primaryDisabled: isDark ? '#1E3A8A' : '#93C5FD',
    success: '#1BAC4B',
    accentBlue: '#3B82F6',
    modalOverlay: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    modalSheet: isDark ? '#1E1E1E' : '#FAFAFA',
    optionBorder: isDark ? '#27272A' : '#f3f4f6',
    radioOuter: isDark ? '#52525B' : '#D1D5DB',
    summaryText: isDark ? '#D4D4D8' : '#374151',
    radioLabel: isDark ? '#A1A1AA' : '#4B5563',
});

// ─── Dropdown Modal ───────────────────────────────────────────────────────────
function DropdownModal({ visible, options, onSelect, onClose, title, c }) {
    const dd = getDdStyles(c);
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={dd.overlay} onPress={onClose} activeOpacity={1}>
                <View style={dd.sheet}>
                    <Text style={dd.sheetTitle}>{title}</Text>
                    {options.map(opt => (
                        <TouchableOpacity key={opt} style={dd.option} onPress={() => { onSelect(opt); onClose(); }}>
                            <Text style={dd.optionText}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
const getDdStyles = (c) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.modalOverlay, justifyContent: 'flex-end' },
    sheet: { backgroundColor: c.modalSheet, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
    sheetTitle: { fontSize: 16, fontWeight: 'bold', color: c.text, marginBottom: 16 },
    option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: c.optionBorder },
    optionText: { fontSize: 16, color: c.text },
});

// ─── Screen: My Reports ───────────────────────────────────────────────────────
function MyReportsScreen({ onCreateNew, onBack, c }) {
    const s = getStyles(c);
    const [search, setSearch] = useState('');
    return (
        <View style={s.container}>
            <View style={s.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={s.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={c.icon} />
                    </TouchableOpacity>
                )}
                <Text style={s.headerTitle}>My reports</Text>
            </View>
            <View style={s.searchContainer}>
                <Ionicons name="search-outline" size={20} color={c.placeholder} style={{ marginRight: 10 }} />
                <TextInput
                    style={s.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor={c.placeholder}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                {REPORTS_DATA.map(item => (
                    <TouchableOpacity key={item.id} style={s.reportCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.reportName}>{item.name}</Text>
                        </View>
                        <View style={{ flex: 1.5 }}>
                            <Text style={s.reportMeta}>{item.date}</Text>
                            <Text style={s.reportMeta}>{item.time}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.reportVenue}>{item.venue}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[s.scoreBadge, { backgroundColor: item.color }]}>
                                <Text style={s.scoreText}>{item.score}%</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={c.text} style={{ marginLeft: 6 }} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onCreateNew}>
                    <Text style={s.primaryBtnText}>Create new report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Create QC Report ─────────────────────────────────────────────────
function CreateQcReport({ onBack, onStart, c }) {
    const s = getStyles(c);
    const [coach, setCoach] = useState('');
    const [venue, setVenue] = useState('');
    const [classVal, setClassVal] = useState('');
    const [modal, setModal] = useState(null);

    const isReady = coach && venue && classVal;

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.headerTitle}>Create a QC Report</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}>
                {[
                    { label: 'Select a coach', value: coach, key: 'coach' },
                    { label: 'Select a venue', value: venue, key: 'venue' },
                    { label: 'Select a class', value: classVal, key: 'class' },
                ].map(({ label, value, key }) => (
                    <TouchableOpacity key={key} style={s.dropdown} onPress={() => setModal(key)}>
                        <Text style={[s.dropdownText, !value && s.placeholderText]}>{value || label}</Text>
                        <View style={s.iconCircle}>
                            <Ionicons name="chevron-down" size={16} color={c.icon} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity
                    style={[s.primaryBtn, !isReady && s.primaryBtnDisabled]}
                    disabled={!isReady}
                    onPress={onStart}
                >
                    <Text style={s.primaryBtnText}>Start report</Text>
                </TouchableOpacity>
            </View>

            <DropdownModal c={c} visible={modal === 'coach'} options={COACHES} title="Select a coach"
                onSelect={setCoach} onClose={() => setModal(null)} />
            <DropdownModal c={c} visible={modal === 'venue'} options={VENUES} title="Select a venue"
                onSelect={setVenue} onClose={() => setModal(null)} />
            <DropdownModal c={c} visible={modal === 'class'} options={CLASSES} title="Select a class"
                onSelect={setClassVal} onClose={() => setModal(null)} />
        </View>
    );
}

// ─── Screen: Questionnaire ────────────────────────────────────────────────────
function QuestionnaireScreen({ onBack, questionIndex, answers, onAnswer, onNext, c }) {
    const s = getStyles(c);
    const q = QUESTIONS_DATA[questionIndex];
    const selected = answers[questionIndex] ?? null;

    return (
        <View style={s.container}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
                <Text style={s.progressText}>Question {questionIndex + 1}/{TOTAL_QUESTIONS}</Text>
                <Text style={s.questionText}>{q.text}</Text>
                <View style={{ gap: 14 }}>
                    {[1, 2, 3, 4, 5].map(val => (
                        <TouchableOpacity
                            key={val}
                            style={[s.optionBtn, selected === val && s.optionBtnSelected]}
                            onPress={() => onAnswer(questionIndex, val)}
                        >
                            <Text style={[s.optionText, selected === val && s.optionTextSelected]}>{val}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity
                    style={[s.primaryBtn, selected === null && s.primaryBtnDisabled]}
                    disabled={selected === null}
                    onPress={onNext}
                >
                    <Text style={s.primaryBtnText}>
                        {questionIndex < TOTAL_QUESTIONS - 1 ? 'Next question' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Other Areas ──────────────────────────────────────────────────────
function OtherAreasScreen({ onBack, onNext, c }) {
    const s = getStyles(c);
    const [strengths, setStrengths] = useState('');
    const [improvements, setImprovements] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.headerTitle}>Other areas</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                {[
                    { label: 'Enter top 3 strengths', value: strengths, setter: setStrengths },
                    { label: 'Top 3 areas for improvement', value: improvements, setter: setImprovements },
                    { label: 'Additional Notes', value: notes, setter: setNotes },
                ].map(({ label, value, setter }) => (
                    <View key={label} style={{ marginBottom: 24 }}>
                        <Text style={s.areaLabel}>{label}</Text>
                        <TextInput
                            style={s.textArea}
                            multiline
                            textAlignVertical="top"
                            placeholderTextColor={c.placeholder}
                            value={value}
                            onChangeText={setter}
                        />
                    </View>
                ))}
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onNext}>
                    <Text style={s.primaryBtnText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Summary ──────────────────────────────────────────────────────────
function SummaryScreen({ onBack, answers, onNext, c }) {
    const s = getStyles(c);
    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.headerTitle}>Summary</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                {QUESTIONS_DATA.map((q, idx) => (
                    <View key={q.id} style={{ marginBottom: 22 }}>
                        <Text style={s.summaryQuestion}>{q.text}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {[1, 2, 3, 4, 5].map(val => (
                                <View key={val} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                                    <View style={[s.radioOuter, answers[idx] === val && s.radioOuterSelected]}>
                                        {answers[idx] === val && <View style={s.radioInner} />}
                                    </View>
                                    <Text style={s.radioLabel}>{val}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onNext}>
                    <Text style={s.primaryBtnText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Record Comments ──────────────────────────────────────────────────
function RecordCommentsScreen({ onBack, onComplete, c }) {
    const s = getStyles(c);
    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const toggle = () => {
        setRecording(r => !r);
        if (!recording) {
            const t = setInterval(() => setSeconds(s => s + 1), 1000);
        }
    };

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    return (
        <View style={s.container}>
            <Text style={s.recordTitle}>Record final comments</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={s.timer}>{fmt(seconds)}</Text>
                <TouchableOpacity onPress={toggle} activeOpacity={0.85}>
                    <View style={s.micOuter}>
                        <View style={s.micMid}>
                            <View style={s.micInner}>
                                <Ionicons name={recording ? 'stop' : 'mic-outline'} size={54} color="#fff" />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onComplete}>
                    <Text style={s.primaryBtnText}>Complete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Congratulations ──────────────────────────────────────────────────
function CongratsScreen({ onGoHome, c }) {
    const s = getStyles(c);
    return (
        <View style={[s.container, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
            <View style={s.congratsCard}>
                <View>
                    <Image source={require('@/assets/images/congrats.png')} style={s.avatar} resizeMode="cover" />
                </View>
                <Text style={s.congratsTitle}>Congratulations</Text>
                <Text style={s.congratsSub}>Report submitted</Text>
                <TouchableOpacity style={[s.sBtn, { marginTop: 24, width: '100%' }]} onPress={onGoHome}>
                    <Text style={s.primaryBtnText}>Go back to homepage</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Root Orchestrator ────────────────────────────────────────────────────────
export default function QcReportFlow({ onBack }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const c = getColors(isDark);

    const [screen, setScreen] = useState('create');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (idx, val) => setAnswers(a => ({ ...a, [idx]: val }));

    const handleNextQuestion = () => {
        if (questionIndex < TOTAL_QUESTIONS - 1) {
            setQuestionIndex(i => i + 1);
        } else {
            setScreen('otherAreas');
        }
    };

    const handleBackFromQuestion = () => {
        if (questionIndex > 0) {
            setQuestionIndex(i => i - 1);
        } else {
            setScreen('create');
        }
    };

    switch (screen) {

        case 'myReports':
            return (
                <MyReportsScreen
                    c={c}
                    onCreateNew={() => setScreen('create')}
                    onBack={onBack}
                />
            );

        case 'create':
            return (
                <CreateQcReport
                    c={c}
                    onBack={() => setScreen('myReports')}
                    onStart={() => { setQuestionIndex(0); setAnswers({}); setScreen('question'); }}
                />
            );

        case 'question':
            return (
                <QuestionnaireScreen
                    c={c}
                    onBack={handleBackFromQuestion}
                    questionIndex={questionIndex}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onNext={handleNextQuestion}
                />
            );

        case 'otherAreas':
            return (
                <OtherAreasScreen
                    c={c}
                    onBack={() => { setQuestionIndex(TOTAL_QUESTIONS - 1); setScreen('question'); }}
                    onNext={() => setScreen('summary')}
                />
            );

        case 'summary':
            return (
                <SummaryScreen
                    c={c}
                    onBack={() => setScreen('otherAreas')}
                    answers={answers}
                    onNext={() => setScreen('record')}
                />
            );

        case 'record':
            return (
                <RecordCommentsScreen
                    c={c}
                    onBack={() => setScreen('summary')}
                    onComplete={() => setScreen('congrats')}
                />
            );

        case 'congrats':
            return <CongratsScreen c={c} onGoHome={() => setScreen('myReports')} />;

        default:
            return null;
    }
}

// ─── Shared Styles (theme-aware) ───────────────────────────────────────────────
const getStyles = (c) => StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, gap: 10 },
    backBtn: { marginRight: 2 },
    headerTitle: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.text },
    bottomContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, backgroundColor: c.bg },

    primaryBtn: { backgroundColor: c.primary, paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
    sBtn: { backgroundColor: c.success, paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
    primaryBtnDisabled: { backgroundColor: c.primaryDisabled },
    primaryBtnText: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: '#fff' },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 16,
        borderWidth: 1, borderColor: c.border, borderRadius: 12, backgroundColor: c.card,
        paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24,
    },
    searchInput: { flex: 1, fontSize: 16, fontFamily: 'Urbanist_400Regular', color: c.text },

    reportCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: c.card,
        borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 8, elevation: 2,
    },
    reportName: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: c.text },
    reportMeta: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: c.textSecondary, lineHeight: 18 },
    reportVenue: { fontSize: 13, fontFamily: 'Urbanist_700Bold', color: c.text },
    scoreBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
    scoreText: { fontFamily: 'Urbanist_700Bold', color: '#fff', fontSize: 12 },

    dropdown: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: c.borderStrong, borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 18, marginBottom: 20,
    },
    dropdownText: { fontSize: 16, fontFamily: 'Urbanist_500Medium', color: c.text },
    placeholderText: { color: c.textSecondary, fontFamily: 'Urbanist_400Regular' },
    iconCircle: {
        width: 28, height: 28, borderRadius: 14, borderWidth: 1.5,
        borderColor: c.text, alignItems: 'center', justifyContent: 'center',
    },

    progressText: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: c.accentBlue, marginVertical: 8 },
    questionText: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.text, marginBottom: 32 },
    optionBtn: {
        paddingVertical: 18, borderRadius: 12, borderWidth: 1.5,
        alignItems: 'center', borderColor: c.radioOuter, backgroundColor: c.card,
    },
    optionBtnSelected: { borderColor: c.accentBlue },
    optionText: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.text },
    optionTextSelected: { color: c.accentBlue },

    areaLabel: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.accentBlue, marginBottom: 8 },
    textArea: {
        borderWidth: 1, borderColor: c.border, borderRadius: 12, backgroundColor: c.card,
        height: 120, padding: 20, fontSize: 15, fontFamily: 'Urbanist_400Regular', color: c.text,
    },

    summaryQuestion: { fontSize: 16, fontFamily: 'Urbanist_500Medium', color: c.summaryText, marginBottom: 10 },
    radioOuter: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 2,
        borderColor: c.radioOuter, justifyContent: 'center', alignItems: 'center', marginRight: 6,
    },
    radioOuterSelected: { borderColor: c.accentBlue },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.accentBlue },
    radioLabel: { fontSize: 14, fontFamily: 'Urbanist_400Regular', color: c.radioLabel },

    recordTitle: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.text, textAlign: 'center', marginTop: 18 },
    timer: { fontSize: 56, fontFamily: 'Urbanist_700Bold', color: c.textMuted, marginBottom: 60 },
    micOuter: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#93C5FD', justifyContent: 'center', alignItems: 'center' },
    micMid: { width: 156, height: 156, borderRadius: 78, backgroundColor: '#60A5FA', justifyContent: 'center', alignItems: 'center' },
    micInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },

    congratsCard: {
        backgroundColor: c.card, borderRadius: 24, padding: 28, width: '100%',
        alignItems: 'center', shadowColor: '#000',
    },
    congratsTitle: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.success, marginTop: 8 },
    congratsSub: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.text, marginTop: 14 },
    avatar: { width: 160, height: 160 },
});