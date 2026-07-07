import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, useColorScheme,
    View
} from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const COACHES = ['Daniel Marcus', 'James Smith', 'Sarah Connor'];
const VENUES = ['Chelsea', 'Hammersmith', 'King Cross', 'Acton'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3'];

const REPORTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 85, color: '#1CAB4B' },
    { id: 2, name: 'Clifford', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 65, color: '#FACC15' },
    { id: 3, name: 'Curtis', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 92, color: '#1CAB4B' },
    { id: 4, name: 'Joshua', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 45, color: '#EF4444' },
];

const SCORING_CRITERIA = [
    'Personal qualities',
    'Delivery qualities',
    'Coaching standards',
    'Educational quality',
    'Session structure'
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
                <Text style={s.headerTitle}>Observe & Develop</Text>
            </View>
            <View style={s.searchContainer}>
                <Ionicons name="search-outline" size={20} color={c.placeholder} style={{ marginRight: 10 }} />
                <TextInput
                    style={s.searchInput}
                    placeholder="Search past reports..."
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

// ─── Screen: Create Report ─────────────────────────────────────────────────
function CreateReportScreen({ onBack, onStart, c }) {
    const s = getStyles(c);
    const [coach, setCoach] = useState('');
    const [venue, setVenue] = useState('');
    const [classVal, setClassVal] = useState('');
    const [modal, setModal] = useState(null);

    const isReady = coach && venue && classVal;

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.icon} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>New Observation</Text>
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
                    <Text style={s.primaryBtnText}>Start observation</Text>
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

// ─── Screen: Observation Form ────────────────────────────────────────────────────
function ObservationFormScreen({ onBack, onNext, formState, setFormState, c }) {
    const s = getStyles(c);
    
    const [recordingInstance, setRecordingInstance] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);

    // Audio Timer
    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => {
                setSeconds(sec => sec + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                alert('Permission to access microphone is required!');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            
            setRecordingInstance(recording);
            setSeconds(0);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recordingInstance) return;
        try {
            await recordingInstance.stopAndUnloadAsync();
            const uri = recordingInstance.getURI();
            setFormState(prev => ({ ...prev, voiceNoteUri: uri }));
            setRecordingInstance(null);
            setIsRecording(false);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    }

    const fmt = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.icon} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Observation Notes</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
                
                <Text style={s.helperText}>You can type your notes or record voice for AI transcription and summarization.</Text>

                <View style={{ marginBottom: 24 }}>
                    <Text style={s.areaLabel}>Positives (What's working well)</Text>
                    <TextInput
                        style={s.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="Great energy, engaged well with the kids..."
                        placeholderTextColor={c.placeholder}
                        value={formState.positives}
                        onChangeText={(val) => setFormState({...formState, positives: val})}
                    />
                </View>

                <View style={{ marginBottom: 32 }}>
                    <Text style={s.areaLabel}>Areas for Improvement (Max 2)</Text>
                    <TextInput
                        style={s.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="1. Needs to project voice more clearly...&#10;2. Better time management during drills..."
                        placeholderTextColor={c.placeholder}
                        value={formState.improvements}
                        onChangeText={(val) => setFormState({...formState, improvements: val})}
                    />
                </View>

                <View style={s.recordingSection}>
                    <Text style={s.areaLabel}>Voice Notes</Text>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={s.timerText}>{isRecording || seconds > 0 ? fmt(seconds) : 'Press mic to record'}</Text>
                        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} activeOpacity={0.85} style={{ marginTop: 16 }}>
                            <View style={[s.micOuter, isRecording && { backgroundColor: 'rgba(239, 68, 68, 0.3)' }]}>
                                <View style={[s.micMid, isRecording && { backgroundColor: 'rgba(239, 68, 68, 0.6)' }]}>
                                    <View style={[s.micInner, isRecording && { backgroundColor: '#EF4444' }]}>
                                        <Ionicons name={isRecording ? 'stop' : 'mic-outline'} size={40} color="#fff" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {!isRecording && formState.voiceNoteUri && (
                            <Text style={[s.helperText, { marginTop: 12, color: c.success }]}>✓ Voice note recorded successfully</Text>
                        )}
                    </View>
                </View>

            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onNext}>
                    <Text style={s.primaryBtnText}>Analyze & Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: AI Generation Loader ──────────────────────────────────────────────
function AIGenerationScreen({ onComplete, c }) {
    const s = getStyles(c);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[s.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
            <CustomLoader size={80} color={c.accentBlue} />
            <Text style={[s.headerTitle, { marginTop: 24, textAlign: 'center' }]}>AI is analyzing your notes...</Text>
            <Text style={[s.helperText, { textAlign: 'center', marginTop: 12 }]}>
                Generating summary, extracting improvement points, and preparing scoring rubrics.
            </Text>
        </View>
    );
}

// ─── Screen: AI Summary ───────────────────────────────────────────────────────
function AISummaryScreen({ onBack, onNext, formState, c }) {
    const s = getStyles(c);

    // Mock generated data based on whatever the user typed/recorded
    const mockSummary = formState.positives || "The coach showed excellent enthusiasm and kept the students engaged throughout the session. The warm-up was well structured.";
    const mockImprovements = formState.improvements || "1. Ensure instructions are given clearly before breaking out into drills.\n2. Keep a closer eye on time management to avoid rushing the cool-down.";

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.icon} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>AI Summary</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                
                <View style={s.summaryBox}>
                    <View style={s.summaryHeader}>
                        <Ionicons name="sparkles" size={18} color={c.accentBlue} style={{ marginRight: 6 }} />
                        <Text style={s.areaLabel}>Generated Summary</Text>
                    </View>
                    <Text style={s.summaryContentText}>{mockSummary}</Text>
                </View>

                <View style={s.summaryBox}>
                    <View style={s.summaryHeader}>
                        <Ionicons name="alert-circle-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                        <Text style={[s.areaLabel, { color: '#EF4444' }]}>Top 2 Improvement Points</Text>
                    </View>
                    <Text style={s.summaryContentText}>{mockImprovements}</Text>
                </View>

            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity style={s.primaryBtn} onPress={onNext}>
                    <Text style={s.primaryBtnText}>Proceed to Scoring</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Scoring ──────────────────────────────────────────────────────────
function ScoringScreen({ onBack, onComplete, scores, setScores, c }) {
    const s = getStyles(c);

    const handleScore = (idx, val) => {
        const newScores = [...scores];
        newScores[idx] = val;
        setScores(newScores);
    };

    const allScored = scores.every(s => s !== null);

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.icon} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Score Coach</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                <Text style={s.helperText}>Score the coach on a scale of 1 to 5 for each criteria.</Text>
                
                {SCORING_CRITERIA.map((criteria, idx) => (
                    <View key={criteria} style={{ marginBottom: 24 }}>
                        <Text style={s.summaryQuestion}>{criteria}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40 }}>
                            {[1, 2, 3, 4, 5].map(val => (
                                <TouchableOpacity 
                                    key={val} 
                                    onPress={() => handleScore(idx, val)}
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                                >
                                    <View style={[s.radioOuter, scores[idx] === val && s.radioOuterSelected]}>
                                        {scores[idx] === val && <View style={s.radioInner} />}
                                    </View>
                                    <Text style={s.radioLabel}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={s.bottomContainer}>
                <TouchableOpacity 
                    style={[s.primaryBtn, !allScored && s.primaryBtnDisabled]} 
                    disabled={!allScored}
                    onPress={onComplete}
                >
                    <Text style={s.primaryBtnText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Congratulations ──────────────────────────────────────────────────
function CongratsScreen({ scores, onGoHome, c }) {
    const s = getStyles(c);
    
    // Calculate final grade
    const total = scores.reduce((a, b) => a + (b || 0), 0);
    const max = SCORING_CRITERIA.length * 5;
    const percentage = Math.round((total / max) * 100);

    return (
        <View style={[s.container, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
            <View style={s.congratsCard}>
                <View>
                    <Image source={require('@/assets/images/congrats.png')} style={s.avatar} resizeMode="cover" />
                </View>
                <Text style={s.congratsTitle}>Report Submitted!</Text>
                
                <View style={{ backgroundColor: c.bg, padding: 16, borderRadius: 12, marginVertical: 20, alignItems: 'center', width: '100%' }}>
                    <Text style={s.congratsSub}>Final Score</Text>
                    <Text style={[s.headerTitle, { fontSize: 36, color: c.accentBlue, marginTop: 8 }]}>{percentage}%</Text>
                </View>

                <Text style={[s.helperText, { textAlign: 'center', marginBottom: 24 }]}>
                    The coach has been notified and the report is safely stored with the voice transcriptions.
                </Text>

                <TouchableOpacity style={[s.sBtn, { width: '100%' }]} onPress={onGoHome}>
                    <Text style={s.primaryBtnText}>Back to Homepage</Text>
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

    const [screen, setScreen] = useState('myReports');
    
    // Shared State
    const [formState, setFormState] = useState({ positives: '', improvements: '' });
    const [scores, setScores] = useState(Array(SCORING_CRITERIA.length).fill(null));

    switch (screen) {

        case 'myReports':
            return (
                <MyReportsScreen
                    c={c}
                    onCreateNew={() => {
                        setFormState({ positives: '', improvements: '' });
                        setScores(Array(SCORING_CRITERIA.length).fill(null));
                        setScreen('create');
                    }}
                    onBack={onBack}
                />
            );

        case 'create':
            return (
                <CreateReportScreen
                    c={c}
                    onBack={() => setScreen('myReports')}
                    onStart={() => setScreen('observation')}
                />
            );

        case 'observation':
            return (
                <ObservationFormScreen
                    c={c}
                    formState={formState}
                    setFormState={setFormState}
                    onBack={() => setScreen('create')}
                    onNext={() => setScreen('aiGeneration')}
                />
            );

        case 'aiGeneration':
            return (
                <AIGenerationScreen
                    c={c}
                    onComplete={() => setScreen('aiSummary')}
                />
            );

        case 'aiSummary':
            return (
                <AISummaryScreen
                    c={c}
                    formState={formState}
                    onBack={() => setScreen('observation')}
                    onNext={() => setScreen('scoring')}
                />
            );

        case 'scoring':
            return (
                <ScoringScreen
                    c={c}
                    scores={scores}
                    setScores={setScores}
                    onBack={() => setScreen('aiSummary')}
                    onComplete={() => setScreen('congrats')}
                />
            );

        case 'congrats':
            return <CongratsScreen scores={scores} c={c} onGoHome={() => setScreen('myReports')} />;

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
    helperText: { fontSize: 14, fontFamily: 'Urbanist_400Regular', color: c.textSecondary, marginBottom: 20, lineHeight: 20 },

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
    placeholderText: { color: c.textSecondary, fontFamily: 'Urbanist_600SemiBold' },
    iconCircle: {
        width: 28, height: 28, borderRadius: 14, borderWidth: 1.5,
        borderColor: c.text, alignItems: 'center', justifyContent: 'center',
    },

    areaLabel: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.text, marginBottom: 8 },
    textArea: {
        borderWidth: 1, borderColor: c.border, borderRadius: 12, backgroundColor: c.card,
        height: 100, padding: 16, fontSize: 15, fontFamily: 'Urbanist_400Regular', color: c.text,
    },

    recordingSection: {
        marginTop: 10,
        backgroundColor: c.card,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: c.border,
    },
    timerText: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.textSecondary },
    micOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: c.primaryDisabled, justifyContent: 'center', alignItems: 'center' },
    micMid: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#60A5FA', justifyContent: 'center', alignItems: 'center' },
    micInner: { width: 70, height: 70, borderRadius: 35, backgroundColor: c.primary, justifyContent: 'center', alignItems: 'center' },

    summaryBox: {
        backgroundColor: c.card,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border,
        marginBottom: 20,
    },
    summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    summaryContentText: { fontSize: 15, fontFamily: 'Urbanist_400Regular', color: c.textSecondary, lineHeight: 22 },

    summaryQuestion: { fontSize: 16, fontFamily: 'Urbanist_600SemiBold', color: c.text, marginBottom: 14 },
    radioOuter: {
        width: 22, height: 22, borderRadius: 11, borderWidth: 2,
        borderColor: c.radioOuter, justifyContent: 'center', alignItems: 'center', marginRight: 8,
    },
    radioOuterSelected: { borderColor: c.accentBlue },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.accentBlue },
    radioLabel: { fontSize: 16, fontFamily: 'Urbanist_500Medium', color: c.radioLabel },

    congratsCard: {
        backgroundColor: c.card, borderRadius: 24, padding: 28, width: '100%',
        alignItems: 'center', shadowColor: '#000',
        elevation: 4,
    },
    congratsTitle: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.success, marginTop: 8 },
    congratsSub: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.textSecondary, marginTop: 14 },
    avatar: { width: 160, height: 160 },
});