import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SelectAVenueList({ venueId, onBack, onSessionSelect }) {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeClassTab, setActiveClassTab] = useState(null);
    const [activeTermTab, setActiveTermTab] = useState(null);
    const [classes, setClasses] = useState([]);
    const [termsByClass, setTermsByClass] = useState({}); // { classScheduleId: [term, ...] }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (venueId) fetchClasses();
        else setLoading(false);
    }, [venueId]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/${venueId}/detail`,
                { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
            );
            const result = await response.json();
            if (response.ok) {
                const classSchedules = result?.data?.classSchedules || [];
                setClasses(classSchedules);

                // Build: { classScheduleId -> [{ termId, termName, sessions[] }] }
                const map = {};
                const termGroups = result?.data?.termGroups || [];
                termGroups.forEach(tg => {
                    tg.terms?.forEach(term => {
                        const termSessions = term.sessionsMap || [];
                        termSessions.forEach(session => {
                            const csId = session.sessionPlan?.classScheduleId;
                            if (!csId) return;
                            if (!map[csId]) map[csId] = [];
                            // find or create term bucket
                            let bucket = map[csId].find(b => b.termId === term.id);
                            if (!bucket) {
                                bucket = { termId: term.id, termName: term.termName, sessions: [] };
                                map[csId].push(bucket);
                            }
                            bucket.sessions.push(session);
                        });
                    });
                });
                setTermsByClass(map);

                if (classSchedules.length > 0) {
                    const firstClassId = classSchedules[0].id;
                    setActiveClassTab(firstClassId);
                    const firstTerms = map[firstClassId] || [];
                    if (firstTerms.length > 0) setActiveTermTab(firstTerms[0].termId);
                }
            }
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassTabPress = (classId) => {
        setActiveClassTab(classId);
        setSearchQuery('');
        const terms = termsByClass[classId] || [];
        setActiveTermTab(terms.length > 0 ? terms[0].termId : null);
    };

   const renderList = () => {
    if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;

    const terms = termsByClass[activeClassTab] || [];
    const activeTerm = terms.find(t => t.termId === activeTermTab);
    const sessions = activeTerm?.sessions || [];

    const activeClass = classes.find(c => c.id === activeClassTab); // ← add this
    const timeLabel = activeClass
        ? `${activeClass.startTime} - ${activeClass.endTime}`
        : '';

    const displaySessions = sessions.filter(s =>
        !searchQuery || s.sessionPlan?.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (displaySessions.length === 0) {
        return <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No sessions found.</Text>;
    }
    const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st'
        : day % 10 === 2 && day !== 12 ? 'nd'
        : day % 10 === 3 && day !== 13 ? 'rd'
        : 'th';
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
};

    return (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {displaySessions.map((item, index) => {
                const isCompleted = item.sessionPlan?.status === 'completed';
                const sessionName = item.sessionPlan?.groupName || `Session ${index + 1}`;
                return (
                    <TouchableOpacity
                        key={item.sessionPlan?.mapId ?? index}
                        style={styles.card}
                        onPress={() => onSessionSelect(item.sessionPlan?.mapId)}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle} numberOfLines={1}>Session {index + 1}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardText}>{formatDate(item.sessionDate)}</Text>
                            <Text style={styles.cardText}>{timeLabel}</Text>  {/* ← add this */}
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{sessionName}</Text>
                        </View>
                        <View style={styles.cardStatusContainer}>
                            <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
                                <Text style={[styles.statusText, isCompleted ? styles.statusTextWhite : styles.statusTextBlack]}>
                                    {isCompleted ? 'Completed' : 'Pending'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

    const currentTerms = termsByClass[activeClassTab] || [];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select a Session</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, searchQuery ? styles.searchFocused : null]}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search sessions..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={20} color="#a0a0a0" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Class Tabs */}
            {!loading && classes.length > 0 && (
                <View style={styles.tabsWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                        {classes.map((cls,i) => (
                            <TouchableOpacity
                                key={cls.id}
                                style={[styles.tab, activeClassTab === cls.id ? styles.activeTab : styles.inactiveTab]}
                                onPress={() => handleClassTabPress(cls.id)}
                            >
                                <Text style={[styles.tabText, activeClassTab === cls.id ? styles.activeTabText : styles.inactiveTabText]}>
                                   Class {i+1}: {cls.className}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Term Tabs */}
            {!loading && currentTerms.length > 1 && (
                <View style={[styles.tabsWrapper, { marginBottom: 12 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                        {currentTerms.map(term => (
                            <TouchableOpacity
                                key={term.termId}
                                style={[styles.termTab, activeTermTab === term.termId ? styles.activeTermTab : styles.inactiveTermTab]}
                                onPress={() => setActiveTermTab(term.termId)}
                            >
                                <Text style={[styles.termTabText, activeTermTab === term.termId ? styles.activeTermTabText : styles.inactiveTermTabText]}>
                                    {term.termName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {renderList()}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#F8F9FB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    searchFocused: {
        borderColor: '#3B82F6',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    clearIcon: {
        padding: 4,
    },
    tabsWrapper: {
        marginBottom: 20,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1.5,
    },
    activeTab: {
        backgroundColor: '#fff',
        borderColor: '#1D4ED8', // Darker blue
    },
    inactiveTab: {
        backgroundColor: '#3B82F6', // Lighter blue back
        borderColor: '#3B82F6',
    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#1D4ED8',
    },
    inactiveTabText: {
        color: '#fff',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardInfo: {
        width: 70,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    cardDetails: {
        flex: 1,
        marginRight: 8,
    },
    cardText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    cardBlock: {
        width: 50,
        alignItems: 'center',
        marginRight: 8,
    },
    blockText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    cardStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    statusCompleted: {
        backgroundColor: '#1CAB4B', // Green
    },
    statusPending: {
        backgroundColor: '#FFD700', // Yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextWhite: {
        color: '#fff',
    },
    statusTextBlack: {
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 4,
    }, 
    termTab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    activeTermTab: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    inactiveTermTab: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    termTabText: {
        fontSize: 13,
        fontWeight: '500',
    },
    activeTermTabText: {
        color: '#3B82F6',
    },
    inactiveTermTabText: {
        color: '#6B7280',
    },
});
