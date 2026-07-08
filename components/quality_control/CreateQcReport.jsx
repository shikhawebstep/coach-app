import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext'; // ⚠️ ADJUST: use your actual useAuth import path
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, useColorScheme,
    View
} from 'react-native';
import MyReports from './MyReports';

const { width } = Dimensions.get('window');

// ─── API ──────────────────────────────────────────────────────────────────────
const BASE_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro`;

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
// Options are now objects: { id, label }. onSelect receives the whole object.
function DropdownModal({ visible, options, onSelect, onClose, title, c }) {
    const dd = getDdStyles(c);
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={dd.overlay} onPress={onClose} activeOpacity={1}>
                <View style={dd.sheet}>
                    <Text style={dd.sheetTitle}>{title}</Text>
                    {options.length === 0 && (
                        <Text style={dd.optionText}>No options available</Text>
                    )}
                    {options.map(opt => (
                        <TouchableOpacity key={opt.id} style={dd.option} onPress={() => { onSelect(opt); onClose(); }}>
                            <Text style={dd.optionText}>{opt.label}</Text>
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
    return (
        <View style={s.container}>
            <MyReports />
            <TouchableOpacity style={s.fab} onPress={onCreateNew} activeOpacity={0.85}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Screen: Create Report ─────────────────────────────────────────────────
// Selections are now controlled from the parent (QcReportFlow) so the ids
// survive into the final submit call.
function CreateReportScreen({
    onBack, onStart, c,
    options, optionsLoading, optionsError, onRetryOptions,
    coach, venue, classVal, setCoach, setVenue, setClassVal,
}) {
    const s = getStyles(c);
    const [modal, setModal] = useState(null);

    const isReady = coach && venue && classVal;
    const availableClasses = venue?.classes || [];
    const showCoachDropdown = options.coaches.length !==0;
    const noCoachAvailable = !optionsLoading && !optionsError && options.coaches.length === 0;


    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.icon} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>New Observation</Text>
            </View>

            {optionsLoading ? (
                <View style={{ paddingTop: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={c.primary} />
                    <Text style={[s.helperText, { marginTop: 12 }]}>Loading coaches, venues & classes...</Text>
                </View>
            ) : optionsError ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <Text style={[s.helperText, { color: '#EF4444' }]}>{optionsError}</Text>
                    <TouchableOpacity style={s.primaryBtn} onPress={onRetryOptions}>
                        <Text style={s.primaryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}>

                    {noCoachAvailable && (
                        <Text style={[s.helperText, { color: '#EF4444' }]}>
                            No coach found for this account. Please contact admin.
                        </Text>
                    )}

                    {showCoachDropdown && (
                        <TouchableOpacity style={s.dropdown} onPress={() => setModal('coach')}>
                            <Text style={[s.dropdownText, !coach && s.placeholderText]}>
                                {coach?.label || 'Select a coach'}
                            </Text>
                            <View style={s.iconCircle}>
                                <Ionicons name="chevron-down" size={16} color={c.icon} />
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Venue dropdown */}
                    <TouchableOpacity style={s.dropdown} onPress={() => setModal('venue')}>
                        <Text style={[s.dropdownText, !venue && s.placeholderText]}>
                            {venue?.label || 'Select a venue'}
                        </Text>
                        <View style={s.iconCircle}>
                            <Ionicons name="chevron-down" size={16} color={c.icon} />
                        </View>
                    </TouchableOpacity>

                    {/* Class dropdown — venue select hone ke baad hi enable */}
                    <TouchableOpacity
                        style={[s.dropdown, !venue && { opacity: 0.5 }]}
                        disabled={!venue}
                        onPress={() => venue && setModal('class')}
                    >
                        <Text style={[s.dropdownText, !classVal && s.placeholderText]}>
                            {classVal?.label || (venue ? 'Select a class' : 'Select a venue first')}
                        </Text>
                        <View style={s.iconCircle}>
                            <Ionicons name="chevron-down" size={16} color={c.icon} />
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            )}

            <View style={s.bottomContainer}>
                <TouchableOpacity
                    style={[s.primaryBtn, !isReady && s.primaryBtnDisabled]}
                    disabled={!isReady}
                    onPress={onStart}
                >
                    <Text style={s.primaryBtnText}>Start observation</Text>
                </TouchableOpacity>
            </View>

            <DropdownModal c={c} visible={modal === 'coach'} options={options.coaches} title="Select a coach"
                onSelect={setCoach} onClose={() => setModal(null)} />
            <DropdownModal c={c} visible={modal === 'venue'} options={options.venues} title="Select a venue"
                onSelect={(v) => { setVenue(v); setClassVal(null); }} onClose={() => setModal(null)} />
            <DropdownModal c={c} visible={modal === 'class'} options={availableClasses} title="Select a class"
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
                        onChangeText={(val) => setFormState({ ...formState, positives: val })}
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
                        onChangeText={(val) => setFormState({ ...formState, improvements: val })}
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

    // NOTE: still mock — plug your real AI summary endpoint response into
    // formState.aiSummary / formState.aiImprovements once that API exists.
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
                <TouchableOpacity style={s.primaryBtn} onPress={() => onNext(mockSummary)}>
                    <Text style={s.primaryBtnText}>Proceed to Scoring</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Scoring ──────────────────────────────────────────────────────────
function ScoringScreen({ onBack, onComplete, scores, setScores, c, submitting }) {
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
                    style={[s.primaryBtn, (!allScored || submitting) && s.primaryBtnDisabled]}
                    disabled={!allScored || submitting}
                    onPress={onComplete}
                >
                    {submitting
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={s.primaryBtnText}>Submit Report</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Congratulations ──────────────────────────────────────────────────
function CongratsScreen({ scores, onGoHome, c }) {
    const s = getStyles(c);

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

                {/* <View style={{ backgroundColor: c.bg, padding: 16, borderRadius: 12, marginVertical: 20, alignItems: 'center', width: '100%' }}>
                    <Text style={s.congratsSub}>Final Score</Text>
                    <Text style={[s.headerTitle, { fontSize: 36, color: c.accentBlue, marginTop: 8 }]}>{percentage}%</Text>
                </View> */}

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
    const { token } = useAuth(); // ⚠️ ADJUST: match your useAuth() shape (token / userToken / accessToken etc.)

    const [screen, setScreen] = useState('myReports');
    // Shared State
    const [formState, setFormState] = useState({ positives: '', improvements: '', voiceNoteUri: null, aiSummary: '' });
    const [scores, setScores] = useState(Array(SCORING_CRITERIA.length).fill(null));
    const [submitting, setSubmitting] = useState(false);

    // Dropdown selections (lifted up so ids survive to the final submit call)
    const [coach, setCoach] = useState(null);
    const [venue, setVenue] = useState(null);
    const [classVal, setClassVal] = useState(null);

    // Options fetched from the API
    const [options, setOptions] = useState({ coaches: [], venues: [] });
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [optionsError, setOptionsError] = useState(null);

    // ─── fetchOptions (corrected) ──────────────────────────────────────────────
    // ─── fetchOptions (future-proof for coach as object OR array) ─────────────
    const fetchOptions = async () => {
        setOptionsLoading(true);
        setOptionsError(null);
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/observation/venues-coaches`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Failed to load options');

            const data = json.data || json;

            // Normalize: coach could be a single object today, or an array tomorrow
            const rawCoach = data.coach ?? data.coaches;
            const coachList = Array.isArray(rawCoach) ? rawCoach : (rawCoach ? [rawCoach] : []);

            const coaches = coachList.map(item => ({
                id: item.id,
                label: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || item.name,
            }));

            const venues = (data.venues || []).map(v => ({
                id: v.id,
                label: v.name,
                area: v.area,
                classes: (v.classSchedules || []).map(cs => ({
                    id: cs.id,
                    label: `${cs.className} (${cs.startTime} - ${cs.endTime})`,
                })),
            }));

            setOptions({ coaches, venues });

            // Agar sirf ek hi coach hai, use auto-select kar do (dropdown skip ho jayega UX me)
            // Agar future me multiple ho gaye, auto-select nahi hoga aur dropdown khulega
            if (coaches.length === 1) {
                setCoach(coaches[0]);
            }
        } catch (err) {
            console.error('Failed to fetch venues-coaches', err);
            setOptionsError('Could not load coaches/venues/classes. Pull to retry.');
        } finally {
            setOptionsLoading(false);
        }
    };
    useEffect(() => {
        fetchOptions();
    }, []);

    const resetFlow = () => {
        setFormState({ positives: '', improvements: '', voiceNoteUri: null, aiSummary: '' });
        setScores(Array(SCORING_CRITERIA.length).fill(null));
        setCoach(null);
        setVenue(null);
        setClassVal(null);
    };

    const submitReport = async () => {
    setSubmitting(true);
    try {
        const improvementsArray = (formState.improvements || '')
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(Boolean);

        const form = new FormData();
        form.append('coachId', String(coach.id));
        form.append('venueId', String(venue.id));
        form.append('classScheduleId', String(classVal.id));
        form.append('positives', formState.positives);
        form.append('areasForImprovement', JSON.stringify(improvementsArray));
        form.append('aiSummary', formState.aiSummary || formState.positives);

        const fieldNames = [
            'personalQualitiesScore',
            'deliveryQualitiesScore',
            'coachingStandardsScore',
            'educationalQualityScore',
            'sessionStructureScore',
        ];
        SCORING_CRITERIA.forEach((_, idx) => {
            form.append(fieldNames[idx], String(scores[idx]));
        });

        if (formState.voiceNoteUri) {
            const ext = formState.voiceNoteUri.split('.').pop() || 'm4a';
            form.append('voiceNote', {
                uri: formState.voiceNoteUri,
                name: `voice-note-${Date.now()}.${ext}`,
                type: `audio/${ext}`,
            });
        }

        // ─── DEBUG: log the exact payload before sending ──────────────────
        // FormData can't be JSON.stringify'd directly — iterate entries()
        const debugPayload = {};
        for (const [key, value] of form.entries()) {
            debugPayload[key] = value;
        }
        console.log('📤 Submitting observation report with payload:', debugPayload);
        // ────────────────────────────────────────────────────────────────

        // ⚠️ TEST MODE: set to true to skip the real network call and just
        // verify the payload/flow works end-to-end. Set back to false before shipping.
        const TEST_MODE = false;

        if (TEST_MODE) {
            console.log('🧪 TEST_MODE active — skipping real API call, simulating success');
            await new Promise(resolve => setTimeout(resolve, 1000)); // fake latency
            setScreen('congrats');
            return;
        }

        const res = await fetch(`${BASE_URL}/observation/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                // NOTE: do NOT set Content-Type manually for FormData — RN sets
                // the correct multipart boundary itself; adding it breaks upload.
            },
            body: form,
        });

        const json = await res.json();
        console.log('📥 Server response:', json);

        if (!res.ok) throw new Error(json?.message || 'Failed to submit report');

        setScreen('congrats');
    } catch (err) {
        console.error('❌ Failed to submit observation report', err);
        Alert.alert('Submission failed', err.message || 'Something went wrong. Please try again.');
    } finally {
        setSubmitting(false);
    }
};

    switch (screen) {

        case 'myReports':
            return (
                <MyReportsScreen
                    c={c}
                    onCreateNew={() => {
                        resetFlow();
                        setScreen('create');
                    }}
                    onBack={onBack}
                />
            );

        case 'create':
            return (
                <CreateReportScreen
                    c={c}
                    options={options}
                    optionsLoading={optionsLoading}
                    optionsError={optionsError}
                    onRetryOptions={fetchOptions}
                    coach={coach} venue={venue} classVal={classVal}
                    setCoach={setCoach} setVenue={setVenue} setClassVal={setClassVal}
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
                    onNext={(aiSummary) => {
                        setFormState(prev => ({ ...prev, aiSummary }));
                        setScreen('scoring');
                    }}
                />
            );

        case 'scoring':
            return (
                <ScoringScreen
                    c={c}
                    scores={scores}
                    setScores={setScores}
                    submitting={submitting}
                    onBack={() => setScreen('aiSummary')}
                    onComplete={submitReport}
                />
            );

        case 'congrats':
            return <CongratsScreen scores={scores} c={c} onGoHome={() => { resetFlow(); setScreen('myReports'); }} />;

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

    createReportBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: c.primary, paddingVertical: 16, borderRadius: 14,
    },
    fab: {
        position: 'absolute', right: 20, bottom: 30,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
        shadowRadius: 6, elevation: 5,
    },

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
    congratsTitle: { fontSize: 24, fontFamily: 'Urbanist_700Bold', color: c.success, marginVertical: 8 },
    congratsSub: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.textSecondary, marginTop: 14 },
    avatar: { width: 160, height: 160 },
});