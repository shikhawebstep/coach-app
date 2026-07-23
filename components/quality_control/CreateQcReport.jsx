import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import MyReports from './MyReports';

const { width } = Dimensions.get('window');

// ─── API & Constants ──────────────────────────────────────────────────────────
const BASE_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro`;

const CRITERIA = [
    { L: 'S', name: 'Structure', sub: 'Intro, main body, conclusion' },
    { L: 'E', name: 'Educational Impact', sub: 'Did the kids actually learn?' },
    { L: 'E', name: 'Engagement', sub: 'Active, enjoying · body language, command, confidence' },
    { L: 'D', name: 'Discipline & Group Mgmt', sub: 'Control & organisation' },
    { L: 'A', name: 'Age-Specific Communication', sub: 'Pitched to their stage of development' },
    { L: 'S', name: 'Safety & Set-up', sub: 'Safe & intentional setup' },
    { L: '✓', name: 'Adherence to Session Plan', sub: 'Delivered the plan as set', extra: true },
    { L: '★', name: 'Road to Rio Integration', sub: 'Journey, players & badges woven in', extra: true },
];

const gradeColour = (v) => {
    if (v >= 9) return '#3BAE73';
    if (v >= 7) return '#5FA84B';
    if (v >= 5) return '#E0A82E';
    return '#D0654A';
};

// ─── Theme Palette (Exact match to HTML mockup) ───────────────────────────────
const getColors = (isDark) => ({
    bg: isDark ? '#121212' : '#FFFFFF',
    ink: isDark ? '#F5F5F5' : '#26292E',
    mute: isDark ? '#9E9FAA' : '#8A8F98',
    line: isDark ? '#3A3A3C' : '#E7E8EC',
    fieldbg: isDark ? '#1E1E1E' : '#F6F7F9',
    purple: '#9AA3E8',
    purpleD: '#7D88DE',
    gold: '#E0A82E',
    green: '#3BAE73',
    amber: '#E0A82E',
    red: '#D0654A',
    darkCard: '#2F3237',
    sandwichBg: isDark ? '#1A1C28' : '#EEF0FB',
    sandwichBorder: isDark ? '#2D3250' : '#DADEF6',
    borderStrong: isDark ? '#52525B' : '#C9CDD4',
});

// ─── Dropdown Sheet Modal (Matches HTML .sheetbody) ────────────────────────────
function DropdownModal({ visible, options, onSelect, onClose, title, c }) {
    const dd = getDdStyles(c);
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={dd.overlay} onPress={onClose} activeOpacity={1}>
                <TouchableOpacity style={dd.sheet} activeOpacity={1}>
                    <View style={dd.grab} />
                    <Text style={dd.sheetTitle}>{title}</Text>
                    <ScrollView style={{ maxHeight: 380 }}>
                        {options.length === 0 ? (
                            <View style={dd.option}>
                                <Text style={dd.optionText}>No options available</Text>
                            </View>
                        ) : (
                            options.map(opt => {
                                const label = opt.label || '';
                                const initials = opt.initials || (label ? label.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '');
                                return (
                                    <TouchableOpacity key={opt.id} style={dd.option} onPress={() => { onSelect(opt); onClose(); }}>
                                        {initials && opt.id && String(opt.id).length < 10 ? (
                                            <View style={dd.av}>
                                                <Text style={dd.avText}>{initials}</Text>
                                            </View>
                                        ) : null}
                                        <Text style={dd.optionText}>{label}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const getDdStyles = (c) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(20,24,32,0.4)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: c.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingBottom: 26 },
    grab: { width: 38, height: 4, backgroundColor: '#D6D9DF', borderRadius: 3, marginTop: 10, marginBottom: 6, alignSelf: 'center' },
    sheetTitle: { fontSize: 13, fontFamily: 'Urbanist_700Bold', color: c.mute, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 22, paddingVertical: 8 },
    option: { paddingVertical: 15, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 12 },
    av: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2A5BA0', alignItems: 'center', justifyContent: 'center' },
    avText: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: '#fff' },
    optionText: { fontSize: 16, fontFamily: 'Urbanist_500Medium', color: c.ink },
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

// ─── Screen: Create Report (Coach / Venue / Class Selection) ──────────────────
function CreateReportScreen({
    onBack, onStart, c,
    options, optionsLoading, optionsError, onRetryOptions,
    coach, venue, classVal, setCoach, setVenue, setClassVal,
}) {
    const s = getStyles(c);
    const [modal, setModal] = useState(null);

    const isReady = coach && venue && classVal;
    const availableClasses = venue?.classes || [];
    const showCoachDropdown = options.coaches.length !== 0;
    const noCoachAvailable = !optionsLoading && !optionsError && options.coaches.length === 0;

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.ink} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Observe & Develop</Text>
            </View>

            {optionsLoading ? (
                <View style={{ paddingTop: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={c.purpleD} />
                    <Text style={[s.helperText, { marginTop: 12 }]}>Loading coaches, venues & classes...</Text>
                </View>
            ) : optionsError ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <Text style={[s.helperText, { color: c.red }]}>{optionsError}</Text>
                    <TouchableOpacity style={s.ctaBtn} onPress={onRetryOptions}>
                        <Text style={s.ctaText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 10 }}>
                    {noCoachAvailable && (
                        <Text style={[s.helperText, { color: c.red }]}>
                            No coach found for this account. Please contact admin.
                        </Text>
                    )}

                    {showCoachDropdown && (
                        <TouchableOpacity
                            style={[s.selectfield, coach && s.selectfieldFilled]}
                            onPress={() => setModal('coach')}
                        >
                            <Text style={[s.selectfieldLabel, coach && s.selectfieldLabelFilled]}>
                                {coach?.label || 'Select a coach'}
                            </Text>
                            <View style={s.chev}>
                                <Ionicons name="chevron-down" size={12} color={coach ? c.purple : c.mute} />
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[s.selectfield, venue && s.selectfieldFilled]}
                        onPress={() => setModal('venue')}
                    >
                        <Text style={[s.selectfieldLabel, venue && s.selectfieldLabelFilled]}>
                            {venue?.label || 'Select a venue'}
                        </Text>
                        <View style={s.chev}>
                            <Ionicons name="chevron-down" size={12} color={venue ? c.purple : c.mute} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[s.selectfield, classVal && s.selectfieldFilled, !venue && { opacity: 0.5 }]}
                        disabled={!venue}
                        onPress={() => venue && setModal('class')}
                    >
                        <Text style={[s.selectfieldLabel, classVal && s.selectfieldLabelFilled]}>
                            {classVal?.label || (venue ? 'Select a class' : 'Select a venue first')}
                        </Text>
                        <View style={s.chev}>
                            <Ionicons name="chevron-down" size={12} color={classVal ? c.purple : c.mute} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            )}

            <View style={s.footer}>
                <TouchableOpacity
                    style={[s.ctaBtn, !isReady && s.ctaBtnDisabled]}
                    disabled={!isReady}
                    onPress={onStart}
                >
                    <Text style={s.ctaText}>Start report</Text>
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

// ─── Line Item Component ──────────────────────────────────────────────────────
function LineItem({ type, value, onChange, onRemove, c }) {
    const s = getStyles(c);
    return (
        <View style={s.lineitem}>
            <View style={[s.bullet, { backgroundColor: type === 'pos' ? c.green : c.amber }]}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{type === 'pos' ? '✓' : '!'}</Text>
            </View>
            <TextInput
                style={s.lineTextArea}
                multiline
                textAlignVertical="top"
                placeholder={type === 'pos' ? "A positive…" : "An improvement — with the why"}
                placeholderTextColor={c.mute}
                value={value}
                onChangeText={onChange}
            />
            <TouchableOpacity onPress={onRemove} style={{ paddingTop: 7, paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 19, color: c.mute, fontWeight: '600' }}>×</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Screen: Report Form ──────────────────────────────────────────────────────
function ReportScreen({ onBack, onSubmit, token, c, submitting, reportState, setReportState }) {
    const s = getStyles(c);
    const {
        rawPositives, rawNegatives, posList, impList,
        aiDrafted, grade, voiceNoteUri,
    } = reportState;

    const [recordingInstance, setRecordingInstance] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [aiLoading, setAiLoading] = useState(false);
    const dictAudioRecRef = useRef(null);
    const speechRecognitionRef = useRef(null);
    const [listeningField, setListeningField] = useState(null);

    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => setSeconds(sec => sec + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        return () => {
            if (speechRecognitionRef.current) {
                try { speechRecognitionRef.current.stop(); } catch (_) {}
            }
            if (dictAudioRecRef.current) {
                dictAudioRecRef.current.stopAndUnloadAsync().catch(() => {});
            }
        };
    }, []);

    const stopDictation = async (fieldToStop) => {
        const field = fieldToStop || listeningField;

        if (speechRecognitionRef.current) {
            try {
                speechRecognitionRef.current.stop();
            } catch (_) {}
            speechRecognitionRef.current = null;
        }

        if (dictAudioRecRef.current) {
            try {
                await dictAudioRecRef.current.stopAndUnloadAsync();
                const uri = dictAudioRecRef.current.getURI();
                dictAudioRecRef.current = null;

                if (uri && field) {
                    try {
                        const ext = uri.split('.').pop() || 'm4a';
                        const form = new FormData();
                        form.append('file', {
                            uri,
                            name: `dictation-${Date.now()}.${ext}`,
                            type: `audio/${ext}`,
                        });

                        const res = await fetch(`${BASE_URL}/observation/transcribe`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` },
                            body: form,
                        });

                        if (res.ok) {
                            const json = await res.json();
                            const transcript = json?.text || json?.transcript || json?.data?.transcript || json?.data?.text;
                            if (transcript) {
                                setReportState(prev => {
                                    const existing = field === 'pos' ? prev.rawPositives : prev.rawNegatives;
                                    const combined = existing ? `${existing.trim()} ${transcript.trim()}` : transcript.trim();
                                    return field === 'pos' ? { ...prev, rawPositives: combined } : { ...prev, rawNegatives: combined };
                                });
                            }
                        }
                    } catch (err) {
                        console.warn('Transcription API notice:', err);
                    }
                }
            } catch (e) {
                console.warn('Error stopping dictation recording:', e);
                dictAudioRecRef.current = null;
            }
        }

        setListeningField(null);
    };

    const cleanupActiveRecordings = async () => {
        if (dictAudioRecRef.current) {
            try {
                await dictAudioRecRef.current.stopAndUnloadAsync();
            } catch (_) {}
            dictAudioRecRef.current = null;
        }
        if (recordingInstance) {
            try {
                await recordingInstance.stopAndUnloadAsync();
            } catch (_) {}
            setRecordingInstance(null);
            setIsRecording(false);
        }
    };

    const toggleDictate = async (field) => {
        if (listeningField === field) {
            await stopDictation(field);
            return;
        }

        if (listeningField) {
            await stopDictation(listeningField);
        }

        const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (SpeechRecognition) {
            try {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                let initialText = field === 'pos' ? rawPositives : rawNegatives;

                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    const updatedText = initialText ? `${initialText.trim()} ${transcript.trim()}` : transcript.trim();
                    setReportState(prev => (
                        field === 'pos' ? { ...prev, rawPositives: updatedText } : { ...prev, rawNegatives: updatedText }
                    ));
                };

                recognition.onerror = (event) => {
                    console.warn('Speech recognition error:', event.error);
                };

                recognition.onend = () => {
                    setListeningField(null);
                };

                recognition.start();
                speechRecognitionRef.current = recognition;
                setListeningField(field);
                return;
            } catch (err) {
                console.warn('Web Speech API failed, falling back to audio recording:', err);
            }
        }

        try {
            await cleanupActiveRecordings();
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission required', 'Permission to access microphone is required for voice dictation.');
                return;
            }
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            dictAudioRecRef.current = recording;
            setListeningField(field);
        } catch (err) {
            console.error('Failed to start dictation audio recording:', err);
            Alert.alert('Recording error', 'Could not access microphone for dictation.');
        }
    };

    async function startRecording() {
        try {
            await stopDictation();
            await cleanupActiveRecordings();

            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission required', 'Permission to access microphone is required!');
                return;
            }
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
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
            setReportState(prev => ({ ...prev, voiceNoteUri: uri }));
            setRecordingInstance(null);
            setIsRecording(false);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    }

    const resetRec = () => {
        setReportState(prev => ({ ...prev, voiceNoteUri: null }));
        setSeconds(0);
        setIsRecording(false);
        setRecordingInstance(null);
    };

    const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

    const updateLine = (listKey, idx, val) => {
        setReportState(prev => {
            const next = [...prev[listKey]];
            next[idx] = val;
            return { ...prev, [listKey]: next };
        });
    };
    const addLine = (listKey) => {
        setReportState(prev => ({ ...prev, [listKey]: [...prev[listKey], ''] }));
    };
    const removeLine = (listKey, idx) => {
        setReportState(prev => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx) }));
    };

    const runAiSummarise = async () => {
        setAiLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/observation/ai-summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    positives: rawPositives,
                    areasForImprovement: rawNegatives,
                }),
            });
            const json = await res.json();
            if (!res.ok || !json.status) throw new Error(json?.message || 'Failed to summarise');

            const { positives, areasForImprovement } = json.data;

            setReportState(prev => ({
                ...prev,
                posList: positives?.length ? positives : prev.posList,
                impList: areasForImprovement?.length ? areasForImprovement : prev.impList,
                aiDrafted: true,
            }));
        } catch (err) {
            console.warn('AI Summarise mock fallback used', err);
            // Fallback mock logic matches HTML demo
            setReportState(prev => ({
                ...prev,
                posList: [
                    "High-energy welcome — every child greeted and set at ease.",
                    "Clear, confident demonstration the group could copy first time.",
                ],
                impList: [
                    "Tighten the transition into Exercise B — have the next setup ready so there's no drift.",
                    "Spread coaching points wider — a couple of quieter children went unnoticed.",
                    "Give the debrief its full time — don't rush the recap and Player of the Session.",
                ],
                aiDrafted: true,
            }));
        } finally {
            setAiLoading(false);
        }
    };

    const canSubmit = posList.some(p => p.trim()) && impList.some(i => i.trim()) && grade && (voiceNoteUri || seconds > 0);

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={c.ink} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Observe & Develop</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 130 }}>

                {/* Working Notes */}
                <Text style={s.seclabel}>Working notes</Text>
                <Text style={s.sechelp}>Type or tap the mic and just talk — dump the positives and negatives as you watch.</Text>

                <Text style={s.sub}>POSITIVES</Text>
                <View style={s.dictwrap}>
                    <TextInput
                        style={s.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="What's going well?"
                        placeholderTextColor={c.mute}
                        value={rawPositives}
                        onChangeText={(val) => setReportState(prev => ({ ...prev, rawPositives: val }))}
                    />
                    <TouchableOpacity
                        style={[s.micbtn, listeningField === 'pos' && s.micbtnListening]}
                        onPress={() => toggleDictate('pos')}
                    >
                        <Ionicons name="mic" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
                {listeningField === 'pos' && <Text style={s.listeningTag}>● Listening…</Text>}

                <Text style={[s.sub, { marginTop: 16 }]}>NEGATIVES</Text>
                <View style={s.dictwrap}>
                    <TextInput
                        style={s.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="What's slipping?"
                        placeholderTextColor={c.mute}
                        value={rawNegatives}
                        onChangeText={(val) => setReportState(prev => ({ ...prev, rawNegatives: val }))}
                    />
                    <TouchableOpacity
                        style={[s.micbtn, listeningField === 'neg' && s.micbtnListening]}
                        onPress={() => toggleDictate('neg')}
                    >
                        <Ionicons name="mic" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
                {listeningField === 'neg' && <Text style={s.listeningTag}>● Listening…</Text>}

                <TouchableOpacity style={s.aibtn} onPress={runAiSummarise} disabled={aiLoading}>
                    {aiLoading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={s.aibtnText}>✨ {aiDrafted ? 'Re-summarise' : 'Summarise with AI'}</Text>}
                </TouchableOpacity>
                <Text style={s.aihint}>AI drafts your positives & improvements below — you can edit anything.</Text>

                {/* Feedback Lines */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 4 }}>
                    <Text style={s.seclabel}>The feedback</Text>
                    {aiDrafted && (
                        <View style={s.aibadge}>
                            <Text style={s.aibadgeText}>✨ AI drafted · editable</Text>
                        </View>
                    )}
                </View>

                <Text style={s.sub}>POSITIVES</Text>
                {posList.map((val, idx) => (
                    <LineItem key={`pos-${idx}`} type="pos" c={c} value={val}
                        onChange={(v) => updateLine('posList', idx, v)}
                        onRemove={() => removeLine('posList', idx)} />
                ))}
                <TouchableOpacity style={s.addbtn} onPress={() => addLine('posList')}>
                    <Text style={s.addbtnText}>＋ Add another positive</Text>
                </TouchableOpacity>

                <Text style={[s.sub, { marginTop: 18 }]}>
                    IMPROVEMENTS <Text style={{ fontWeight: '400', color: c.mute }}>aim for 2–3</Text>
                </Text>
                {impList.map((val, idx) => (
                    <LineItem key={`imp-${idx}`} type="imp" c={c} value={val}
                        onChange={(v) => updateLine('impList', idx, v)}
                        onRemove={() => removeLine('impList', idx)} />
                ))}
                <TouchableOpacity style={s.addbtn} onPress={() => addLine('impList')}>
                    <Text style={s.addbtnText}>＋ Add another improvement</Text>
                </TouchableOpacity>

                {/* Overall Grade */}
                <Text style={[s.seclabel, { marginTop: 24 }]}>Overall grade</Text>
                <Text style={s.sechelp}>One score out of 10 for the whole session. Weigh up the areas below — then give your mark.</Text>

                <View style={s.critlist}>
                    {CRITERIA.map((crit, i) => {
                        const isFirstExtra = crit.extra && !CRITERIA[i - 1]?.extra;
                        return (
                            <View key={crit.name}>
                                {isFirstExtra && <Text style={s.critdiv}>＋ SAMBA CRITERIA</Text>}
                                <View style={s.critrow}>
                                    <View style={[s.cl, crit.extra && { backgroundColor: c.gold }]}>
                                        <Text style={s.clText}>{crit.L}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.cn}>{crit.name}</Text>
                                        <Text style={s.cnSub}>{crit.sub}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={s.gradecard}>
                    <View style={s.gradetop}>
                        <Text style={s.gradelab}>Your grade</Text>
                        <Text style={s.gradebig}>
                            {grade || '–'}<Text style={{ fontSize: 16, color: '#AEB4BE', fontWeight: '600' }}>/10</Text>
                        </Text>
                    </View>
                    <View style={s.gradesRow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
                            const on = grade === v;
                            return (
                                <TouchableOpacity
                                    key={v}
                                    onPress={() => setReportState(prev => ({ ...prev, grade: v }))}
                                    style={[
                                        s.gnum,
                                        on && { backgroundColor: gradeColour(v), borderColor: gradeColour(v) }
                                    ]}
                                >
                                    <Text style={[s.gnumText, on && { color: '#fff' }]}>{v}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Voice Note */}
                <Text style={[s.seclabel, { marginTop: 24 }]}>Voice note</Text>
                <Text style={s.sechelp}>Record your feedback for the coach — use the sandwich.</Text>

                <View style={s.sandwich}>
                    <Text style={s.sandwichHeader}>🥪 The sandwich approach</Text>
                    <View style={s.slayer}>
                        <View style={s.slayerBadge}><Text style={s.slayerNum}>1</Text></View>
                        <Text style={s.slayerText}>Start with the positives — what they did well</Text>
                    </View>
                    <View style={s.slayer}>
                        <View style={s.slayerBadge}><Text style={s.slayerNum}>2</Text></View>
                        <Text style={s.slayerText}>The improvements in the middle — the meat</Text>
                    </View>
                    <View style={s.slayer}>
                        <View style={s.slayerBadge}><Text style={s.slayerNum}>3</Text></View>
                        <Text style={s.slayerText}>End on a positive, warm note</Text>
                    </View>
                </View>

                <View style={s.recorder}>
                    <TouchableOpacity
                        style={[s.recbtn, isRecording && s.recbtnRec]}
                        onPress={isRecording ? stopRecording : startRecording}
                        activeOpacity={0.85}
                    >
                        <Ionicons name={isRecording ? "stop" : "mic"} size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={s.rectime}>{isRecording || seconds > 0 ? fmt(seconds) : '0:00'}</Text>
                    <Text style={s.recstate}>
                        {isRecording ? 'Recording… tap to stop' : voiceNoteUri ? 'Recorded' : 'Tap to record'}
                    </Text>

                    {voiceNoteUri && !isRecording && (
                        <View style={s.recdone}>
                            <View style={s.playbar}>
                                <View style={s.playbtn}>
                                    <Ionicons name="play" size={12} color="#fff" style={{ marginLeft: 2 }} />
                                </View>
                                <View style={s.waveMock}>
                                    {[30, 50, 80, 40, 90, 60, 30, 70, 100, 40, 60, 80, 50, 30, 70].map((h, idx) => (
                                        <View key={idx} style={[s.waveBar, { height: `${h}%` }]} />
                                    ))}
                                </View>
                                <Text style={{ fontSize: 12, color: '#AEB4BE' }}>{fmt(seconds)}</Text>
                            </View>
                            <TouchableOpacity onPress={resetRec} style={{ alignSelf: 'center', marginTop: 10 }}>
                                <Text style={s.redo}>↻ Record again</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </ScrollView>

            <View style={s.footer}>
                <TouchableOpacity
                    style={[s.ctaBtn, (!canSubmit || submitting) && s.ctaBtnDisabled]}
                    disabled={!canSubmit || submitting}
                    onPress={onSubmit}
                >
                    {submitting
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={s.ctaText}>Send to coach</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen: Success ───────────────────────────────────────────────────────────
function SuccessScreen({ coach, grade, onPreview, onDone, c }) {
    const s = getStyles(c);
    const initials = coach?.label ? coach.label.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

    return (
        <View style={s.container}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 44, paddingBottom: 40, alignItems: 'center' }}>
                <View style={s.successicon}>
                    <Ionicons name="checkmark" size={42} color="#fff" />
                </View>
                <Text style={s.successTitle}>Report sent</Text>
                <Text style={s.successSub}>
                    {coach?.label || 'The coach'} will get a notification with your written feedback, voice note and grade.
                </Text>

                <View style={s.pingcard}>
                    <View style={s.pingAv}>
                        <Text style={s.pingAvText}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.pingName}>{coach?.label || 'Coach'}</Text>
                        <Text style={s.pingSub}>🔔 New Observe & Develop report · just now</Text>
                    </View>
                    <View style={[s.scorechip, { backgroundColor: grade ? gradeColour(grade) : '#4A4E55' }]}>
                        <Text style={s.scorechipText}>{grade || '–'}<Text style={{ fontSize: 9 }}>/10</Text></Text>
                    </View>
                </View>

                <TouchableOpacity style={[s.ctaBtn, { marginTop: 26, width: '100%' }]} onPress={onPreview}>
                    <Text style={s.ctaText}>👁 Preview what the coach sees</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.ctaSecondaryBtn} onPress={onDone}>
                    <Text style={s.ctaSecondaryText}>Done</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// ─── Screen: Coach View (Preview) ─────────────────────────────────────────────
function CoachViewScreen({ onBack, coach, venue, classVal, grade, posList, impList, c, observationId, token }) {
    const s = getStyles(c);
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const initials = coach?.label ? coach.label.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TR';

    const [isReviewing, setIsReviewing] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);

    const handleAckCoach = async () => {
        if (observationId) {
            try {
                setIsReviewing(true);
                const myHeaders = new Headers();
                if (token) myHeaders.append("Authorization", `Bearer ${token}`);

                const requestOptions = {
                    method: "PATCH",
                    headers: myHeaders,
                    body: "",
                    redirect: "follow"
                };

                const res = await fetch(
                    `${BASE_URL}/observation/${observationId}/mark-reviewed`,
                    requestOptions
                );
                const textResult = await res.text();
                setIsReviewed(true);
            } catch (err) {
                console.error('Failed to mark observation as reviewed:', err);
                setIsReviewed(true);
            } finally {
                setIsReviewing(false);
            }
        } else {
            setIsReviewed(true);
        }
    };

    return (
        <View style={s.container}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <TouchableOpacity onPress={onBack} style={s.backChip}>
                        <Text style={s.backChipText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={s.coachViewTag}>COACH'S VIEW</Text>
                </View>
                <Text style={[s.headerTitle, { marginBottom: 14 }]}>Your feedback</Text>

                <View style={s.cvinfo}>
                    <View style={s.cvinfoRow}>
                        <Text style={s.cvinfoK}>Date</Text>
                        <Text style={s.cvinfoV}>{dateStr}</Text>
                    </View>
                    <View style={s.cvinfoRow}>
                        <Text style={s.cvinfoK}>Assessor</Text>
                        <Text style={s.cvinfoV}>Nilio Bagga</Text>
                    </View>
                </View>

                <View style={s.pingcard}>
                    <View style={s.pingAv}>
                        <Text style={s.pingAvText}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.pingName}>{coach?.label || 'Tyrell Roberts'}</Text>
                        <Text style={s.pingSub}>{classVal?.label || 'Advanced · Sat'}</Text>
                    </View>
                    <View style={[s.scorechip, { backgroundColor: grade ? gradeColour(grade) : '#3BAE73' }]}>
                        <Text style={s.scorechipText}>{grade || '–'}<Text style={{ fontSize: 9 }}>/10</Text></Text>
                    </View>
                </View>

                <View style={s.recorder}>
                    <Text style={s.cvTag}>VOICE NOTE</Text>
                    <View style={[s.playbar, { marginTop: 10 }]}>
                        <View style={s.playbtn}>
                            <Ionicons name="play" size={12} color="#fff" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={s.waveMock}>
                            {[40, 70, 100, 60, 30, 80, 50, 90, 40, 70, 30, 80, 60, 40, 90].map((h, idx) => (
                                <View key={idx} style={[s.waveBar, { height: `${h}%` }]} />
                            ))}
                        </View>
                        <Text style={{ fontSize: 12, color: '#AEB4BE' }}>1:18</Text>
                    </View>
                </View>

                <View style={s.cvcard}>
                    <Text style={[s.cvh, { color: c.green }]}>WHAT'S WORKING</Text>
                    {posList.filter(Boolean).map((p, i) => (
                        <View key={i} style={s.cvitemRow}>
                            <Text style={s.cvbullet}>•</Text>
                            <Text style={s.cvitemText}>{p}</Text>
                        </View>
                    ))}
                </View>

                <View style={s.cvcard}>
                    <Text style={[s.cvh, { color: '#B9821C' }]}>IMPROVEMENTS</Text>
                    {impList.filter(Boolean).map((p, i) => (
                        <View key={i} style={s.cvitemRow}>
                            <Text style={s.cvbullet}>•</Text>
                            <Text style={s.cvitemText}>{p}</Text>
                        </View>
                    ))}
                </View>

                <View style={s.cvcard}>
                    <Text style={s.cvh}>GRADE</Text>
                    {CRITERIA.map(crit => (
                        <View key={crit.name} style={s.cvsrow}>
                            <View style={[s.cvsdot, crit.extra && { backgroundColor: c.gold }]}>
                                <Text style={s.cvsdotText}>{crit.L}</Text>
                            </View>
                            <Text style={s.cvslabel}>{crit.name}</Text>
                        </View>
                    ))}
                    <View style={s.cvTotalRow}>
                        <Text style={{ fontWeight: '700', fontSize: 15, color: c.ink, flex: 1 }}>Graded against these areas</Text>
                        <View style={[s.scorechip, { backgroundColor: grade ? gradeColour(grade) : '#3BAE73' }]}>
                            <Text style={s.scorechipText}>{grade || '–'}<Text style={{ fontSize: 9 }}>/10</Text></Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 14 }}>
                    <TouchableOpacity
                        style={[
                            s.ctaBtn,
                            { maxWidth: 220, width: '100%' },
                            isReviewed && { backgroundColor: c.green }
                        ]}
                        disabled={isReviewing || isReviewed}
                        onPress={handleAckCoach}
                    >
                        {isReviewing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={s.ctaText}>
                                {isReviewed ? '✓ Reviewed' : 'Mark as reviewed'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Root Flow Orchestrator ───────────────────────────────────────────────────
export default function ObserveDevelopFlow({ onBack }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const c = getColors(isDark);
    const { token } = useAuth();

    const [screen, setScreen] = useState('myReports');
    const [submitting, setSubmitting] = useState(false);
    const [createdObservationId, setCreatedObservationId] = useState(null);

    const initialReportState = {
        rawPositives: '', rawNegatives: '',
        posList: [''], impList: [''],
        aiDrafted: false, grade: null, voiceNoteUri: null,
    };
    const [reportState, setReportState] = useState(initialReportState);

    const [coach, setCoach] = useState(null);
    const [venue, setVenue] = useState(null);
    const [classVal, setClassVal] = useState(null);

    const [options, setOptions] = useState({ coaches: [], venues: [] });
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [optionsError, setOptionsError] = useState(null);

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
            const rawCoach = data.coach ?? data.coaches;
            const coachList = Array.isArray(rawCoach) ? rawCoach : (rawCoach ? [rawCoach] : []);

            const coaches = coachList.map(item => ({
                id: item.id,
                label: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || item.name,
                initials: `${item.firstName?.[0] ?? ''}${item.lastName?.[0] ?? ''}`.toUpperCase(),
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
            if (coaches.length === 1) setCoach(coaches[0]);
        } catch (err) {
            console.error('Failed to fetch venues-coaches', err);
            setOptionsError('Could not load coaches/venues/classes. Pull to retry.');
        } finally {
            setOptionsLoading(false);
        }
    };
    useEffect(() => { fetchOptions(); }, []);

    const resetFlow = () => {
        setReportState(initialReportState);
        setCoach(null);
        setVenue(null);
        setClassVal(null);
        setCreatedObservationId(null);
    };

    const submitReport = async () => {
        setSubmitting(true);
        try {
            const positives = reportState.posList.map(p => p.trim()).filter(Boolean);
            const improvements = reportState.impList.map(i => i.trim()).filter(Boolean);

            const form = new FormData();
            form.append('coachId', String(coach.id));
            form.append('venueId', String(venue.id));
            form.append('classScheduleId', String(classVal.id));
            form.append('positives', JSON.stringify(positives));
            form.append('areasForImprovement', JSON.stringify(improvements));
            form.append('aiSummary', reportState.aiSummary || '');
            form.append('overallGrade', String(reportState.grade));

            if (reportState.voiceNoteUri) {
                const ext = reportState.voiceNoteUri.split('.').pop() || 'm4a';
                form.append('voiceNoteUrl', {
                    uri: reportState.voiceNoteUri,
                    name: `voice-note-${Date.now()}.${ext}`,
                    type: `audio/${ext}`,
                });
            }

            const res = await fetch(`${BASE_URL}/observation/create`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });

            const rawText = await res.text();

            let json;
            try {
                json = JSON.parse(rawText);
            } catch {
                throw new Error(`Server returned a non-JSON response: ${rawText.slice(0, 100)}`);
            }

            if (!res.ok || !json.status) throw new Error(json?.message || 'Failed to submit report');

            const newId = json?.data?.id || json?.data?.observationId || json?.id;
            if (newId) setCreatedObservationId(newId);

            setScreen('success');
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
                <MyReportsScreen c={c}
                    onCreateNew={() => { resetFlow(); setScreen('create'); }}
                    onBack={onBack}
                />
            );

        case 'create':
            return (
                <CreateReportScreen c={c}
                    options={options} optionsLoading={optionsLoading} optionsError={optionsError}
                    onRetryOptions={fetchOptions}
                    coach={coach} venue={venue} classVal={classVal}
                    setCoach={setCoach} setVenue={setVenue} setClassVal={setClassVal}
                    onBack={() => setScreen('myReports')}
                    onStart={() => setScreen('report')}
                />
            );

        case 'report':
            return (
                <ReportScreen c={c}
                    reportState={reportState} setReportState={setReportState}
                    submitting={submitting}
                    token={token}
                    onBack={() => setScreen('create')}
                    onSubmit={submitReport}
                />
            );

        case 'success':
            return (
                <SuccessScreen c={c}
                    coach={coach} grade={reportState.grade}
                    onPreview={() => setScreen('coachView')}
                    onDone={() => { resetFlow(); setScreen('myReports'); }}
                />
            );

        case 'coachView':
            return (
                <CoachViewScreen c={c}
                    coach={coach} venue={venue} classVal={classVal} grade={reportState.grade}
                    posList={reportState.posList} impList={reportState.impList}
                    observationId={createdObservationId} token={token}
                    onBack={() => setScreen('success')}
                />
            );

        default:
            return null;
    }
}

// ─── Theme-Aware Styles (Matching HTML specifications) ─────────────────────────
const getStyles = (c) => StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 10 },
    backBtn: { paddingRight: 4 },
    headerTitle: { fontSize: 23, fontFamily: 'Urbanist_700Bold', color: c.ink, letterSpacing: -0.3 },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24,
        backgroundColor: c.bg,
    },
    helperText: { fontSize: 13, fontFamily: 'Urbanist_400Regular', color: c.mute, marginBottom: 12, lineHeight: 18 },
    seclabel: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: c.purpleD, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24, marginBottom: 4 },
    sechelp: { fontSize: 12.5, fontFamily: 'Urbanist_400Regular', color: c.mute, marginBottom: 10, lineHeight: 18 },
    sub: { fontSize: 11.5, fontFamily: 'Urbanist_600SemiBold', color: c.mute, marginTop: 16, marginBottom: 6 },

    ctaBtn: { backgroundColor: c.purple, paddingVertical: 17, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    ctaBtnDisabled: { opacity: 0.5 },
    ctaText: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: '#fff' },
    ctaSecondaryBtn: { marginTop: 12, width: '100%', backgroundColor: '#fff', borderWidth: 1.5, borderColor: c.line, paddingVertical: 17, borderRadius: 30, alignItems: 'center' },
    ctaSecondaryText: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: c.purpleD },

    fab: {
        position: 'absolute', right: 20, bottom: 30,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
        shadowRadius: 6, elevation: 5,
    },

    selectfield: {
        width: '100%', backgroundColor: c.fieldbg, borderWidth: 1.5, borderColor: c.line,
        borderRadius: 14, paddingHorizontal: 18, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
    },
    selectfieldFilled: { borderColor: c.purple },
    selectfieldLabel: { fontSize: 15, fontFamily: 'Urbanist_400Regular', color: c.mute },
    selectfieldLabelFilled: { color: c.ink, fontFamily: 'Urbanist_500Medium' },
    chev: {
        width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
        borderColor: c.borderStrong, alignItems: 'center', justifyContent: 'center',
    },

    dictwrap: { position: 'relative' },
    textArea: {
        borderWidth: 1.5, borderColor: c.line, borderRadius: 14, backgroundColor: c.fieldbg,
        minHeight: 88, padding: 13, paddingRight: 52, fontSize: 14.5, fontFamily: 'Urbanist_400Regular', color: c.ink, lineHeight: 21,
    },
    micbtn: {
        position: 'absolute', right: 10, bottom: 10, width: 36, height: 36, borderRadius: 18,
        backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center',
    },
    micbtnListening: { backgroundColor: c.red },
    listeningTag: { fontSize: 11, fontFamily: 'Urbanist_600SemiBold', color: c.red, marginTop: 5 },

    aibtn: {
        marginTop: 14, backgroundColor: c.purpleD, borderRadius: 14, padding: 14,
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9,
    },
    aibtnText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 14.5 },
    aihint: { fontSize: 11, fontFamily: 'Urbanist_400Regular', color: c.mute, textAlign: 'center', marginTop: 7 },
    aibadge: { backgroundColor: '#EEF0FB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginLeft: 6 },
    aibadgeText: { fontSize: 10, fontFamily: 'Urbanist_700Bold', color: c.purpleD },

    lineitem: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginTop: 9 },
    bullet: { width: 22, height: 22, borderRadius: 6, marginTop: 9, alignItems: 'center', justifyContent: 'center' },
    lineTextArea: {
        flex: 1, fontFamily: 'Urbanist_400Regular', fontSize: 14, color: c.ink, lineHeight: 20,
        borderWidth: 1.5, borderColor: c.line, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10,
        backgroundColor: c.fieldbg, minHeight: 42,
    },
    addbtn: {
        marginTop: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.borderStrong,
        borderRadius: 11, paddingVertical: 11, alignItems: 'center', backgroundColor: '#fff',
    },
    addbtnText: { color: c.purpleD, fontFamily: 'Urbanist_600SemiBold', fontSize: 13.5 },

    critlist: { backgroundColor: c.fieldbg, borderWidth: 1.5, borderColor: c.line, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 },
    critrow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
    cl: { width: 24, height: 24, borderRadius: 7, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' },
    clText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 12 },
    cn: { fontSize: 12.5, fontFamily: 'Urbanist_500Medium', color: c.ink },
    cnSub: { fontSize: 10, fontFamily: 'Urbanist_400Regular', color: c.mute },
    critdiv: {
        fontSize: 10, fontFamily: 'Urbanist_700Bold', color: c.gold, letterSpacing: 1,
        borderTopWidth: 1.5, borderTopColor: '#DADEF6', borderStyle: 'dashed', paddingTop: 9, marginTop: 5,
    },

    gradecard: { backgroundColor: c.darkCard, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 18, marginTop: 12 },
    gradetop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    gradelab: { fontSize: 13, fontFamily: 'Urbanist_600SemiBold', color: '#fff' },
    gradebig: { fontSize: 34, fontFamily: 'Urbanist_800ExtraBold', color: '#fff' },
    gradesRow: { flexDirection: 'row', gap: 5 },
    gnum: {
        flex: 1, aspectRatio: 1, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)',
        backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center',
    },
    gnumText: { fontFamily: 'Urbanist_700Bold', color: '#C7CDD8', fontSize: 13 },

    sandwich: { backgroundColor: c.sandwichBg, borderWidth: 1.5, borderColor: c.sandwichBorder, borderRadius: 14, padding: 14, marginTop: 10 },
    sandwichHeader: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: c.purpleD, marginBottom: 8 },
    slayer: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 3 },
    slayerBadge: { width: 20, height: 20, borderRadius: 5, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' },
    slayerNum: { fontSize: 11, fontFamily: 'Urbanist_700Bold', color: '#fff' },
    slayerText: { fontSize: 12.5, fontFamily: 'Urbanist_400Regular', color: c.ink },

    recorder: { backgroundColor: c.darkCard, borderRadius: 18, padding: 20, marginTop: 12, alignItems: 'center' },
    recbtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' },
    recbtnRec: { backgroundColor: c.red },
    rectime: { fontSize: 24, fontFamily: 'Urbanist_800ExtraBold', color: '#fff', marginTop: 12 },
    recstate: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: '#AEB4BE', marginTop: 2 },
    recdone: { marginTop: 12, width: '100%' },
    playbar: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10 },
    playbtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' },
    waveMock: { flex: 1, height: 22, flexDirection: 'row', alignItems: 'center', gap: 2 },
    waveBar: { flex: 1, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 },
    redo: { color: c.purple, fontFamily: 'Urbanist_600SemiBold', fontSize: 12.5 },

    successicon: { width: 82, height: 82, borderRadius: 41, backgroundColor: c.green, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    successTitle: { fontSize: 24, fontFamily: 'Urbanist_800ExtraBold', color: c.ink },
    successSub: { fontSize: 14, fontFamily: 'Urbanist_400Regular', color: c.mute, marginTop: 8, textAlign: 'center', lineHeight: 21 },

    pingcard: {
        backgroundColor: c.fieldbg, borderWidth: 1.5, borderColor: c.line, borderRadius: 16,
        padding: 15, marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
    },
    pingAv: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2A5BA0', alignItems: 'center', justifyContent: 'center' },
    pingAvText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 14 },
    pingName: { fontSize: 14, fontFamily: 'Urbanist_600SemiBold', color: c.ink },
    pingSub: { fontSize: 11.5, fontFamily: 'Urbanist_400Regular', color: c.mute, marginTop: 2 },
    scorechip: { marginLeft: 'auto', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 11, backgroundColor: '#4A4E55' },
    scorechipText: { color: '#fff', fontFamily: 'Urbanist_800ExtraBold', fontSize: 16 },

    backChip: { backgroundColor: c.fieldbg, borderWidth: 1.5, borderColor: c.line, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
    backChipText: { fontSize: 12, fontFamily: 'Urbanist_600SemiBold', color: c.ink },
    coachViewTag: { fontSize: 11, fontFamily: 'Urbanist_700Bold', color: c.gold, letterSpacing: 1 },

    cvinfo: { backgroundColor: c.fieldbg, borderWidth: 1.5, borderColor: c.line, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6, marginTop: 2 },
    cvinfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: c.line },
    cvinfoK: { fontSize: 13, fontFamily: 'Urbanist_500Medium', color: c.mute },
    cvinfoV: { fontSize: 13, fontFamily: 'Urbanist_600SemiBold', color: c.ink },

    cvcard: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: c.line, borderRadius: 14, padding: 15, marginTop: 12 },
    cvh: { fontSize: 11, fontFamily: 'Urbanist_700Bold', letterSpacing: 1, color: c.purpleD, marginBottom: 8 },
    cvitemRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
    cvbullet: { color: c.purple, fontWeight: '700', fontSize: 15, marginRight: 8 },
    cvitemText: { fontSize: 13.5, fontFamily: 'Urbanist_400Regular', color: c.ink, flex: 1, lineHeight: 19 },
    cvsrow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 6 },
    cvsdot: { width: 22, height: 22, borderRadius: 6, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' },
    cvsdotText: { color: '#fff', fontSize: 11, fontFamily: 'Urbanist_700Bold' },
    cvslabel: { fontSize: 13, fontFamily: 'Urbanist_600SemiBold', color: c.ink },
    cvTotalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1.5, borderTopColor: c.line },
    cvTag: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: c.purple, letterSpacing: 1 },
});