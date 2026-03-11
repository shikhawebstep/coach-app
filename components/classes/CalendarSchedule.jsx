import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAYS = [
    { day: 'Mon', date: '07' },
    { day: 'Tue', date: '08' },
    { day: 'Wed', date: '09' },
    { day: 'Thu', date: '10', active: true },
    { day: 'Fri', date: '11' },
    { day: 'Sat', date: '12' },
    { day: 'Sun', date: '13' },
];

const EVENTS_DATA = [
    {
        id: '1',
        title: 'Birthday Party',
        time: '09:00 - 11:00 AM',
        color: '#FF6B6B',
        type: 'Events',
        date: '10',
    },
    {
        id: '2',
        title: 'Weekly Classes',
        time: '11:00 - 12:00 AM',
        color: '#8B5CF6',
        type: 'Weekly Classes',
        date: '10',
    },
    {
        id: '3',
        title: 'Staff Tournament',
        time: '13:00 - 14:00 PM',
        color: '#3B82F6',
        type: 'Events',
        date: '10',
    },
    {
        id: '4',
        title: 'Coaches Annual Training',
        time: '14:00 - 15:00 PM',
        color: '#1CAB4B',
        type: 'Camps',
        date: '10',
    },
    {
        id: '5',
        title: 'Holiday Camp',
        time: '09:30 - 15:30 PM',
        color: '#F59E0B',
        type: 'Camps',
        date: '11',
    },
];

export default function CalendarSchedule() {
    const [activeTab, setActiveTab] = useState('Day');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('10');
    const [activeFilters, setActiveFilters] = useState(['Weekly Classes', 'Camps', 'Events']);

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const filteredEvents = EVENTS_DATA.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilters.includes(event.type);
        const matchesDate = activeTab === 'Day' ? event.date === selectedDate : true;
        return matchesSearch && matchesFilter && matchesDate;
    });

    const renderDayView = () => (
        <>
            {/* Days Scroll */}
            <View style={styles.daysWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                    {DAYS.map((d, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dayItem, selectedDate === d.date && styles.dayItemActive]}
                            onPress={() => setSelectedDate(d.date)}
                        >
                            <Text style={[styles.dayName, selectedDate === d.date && styles.dayTextActive]}>{d.day}</Text>
                            <Text style={[styles.dayNumber, selectedDate === d.date && styles.dayTextActive]}>{d.date}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Schedule Timeline */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, idx) => (
                        <View key={event.id} style={styles.timelineRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeText}>{event.time.split(' - ')[0]}</Text>
                            </View>
                            <View style={styles.eventColumn}>
                                <TouchableOpacity style={[styles.eventCard, { backgroundColor: event.color }]}>
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                    <View style={styles.eventInfoRow}>
                                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                                        <Text style={styles.eventTime}>{event.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={60} color="#E5E7EB" />
                        <Text style={styles.emptyText}>No sessions scheduled for this day</Text>
                    </View>
                )}
            </ScrollView>
        </>
    );

    const renderWeekView = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
            {DAYS.map((day) => (
                <View key={day.date} style={styles.weekDaySection}>
                    <Text style={styles.weekDayTitle}>{day.day} {day.date}</Text>
                    {EVENTS_DATA.filter(e => e.date === day.date).map(event => (
                        <TouchableOpacity key={event.id} style={[styles.weekEventCard, { borderLeftColor: event.color }]}>
                            <View style={styles.weekEventInfo}>
                                <Text style={styles.weekEventTitle}>{event.title}</Text>
                                <Text style={styles.weekEventTime}>{event.time}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                    {EVENTS_DATA.filter(e => e.date === day.date).length === 0 && (
                        <Text style={styles.noEventsText}>No events</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );

    const renderMonthView = () => (
        <View style={styles.monthGrid}>
            <View style={styles.monthGridHeader}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                    <Text key={d} style={styles.monthGridHeaderText}>{d}</Text>
                ))}
            </View>
            <View style={styles.monthGridBody}>
                {Array.from({ length: 31 }, (_, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.monthGridCell,
                            (i + 1).toString() === selectedDate && styles.monthCellSelected
                        ]}
                        onPress={() => {
                            setSelectedDate((i + 1).toString().padStart(2, '0'));
                            setActiveTab('Day');
                        }}
                    >
                        <Text style={[
                            styles.monthCellText,
                            (i + 1).toString() === selectedDate && styles.monthCellTextSelected
                        ]}>{i + 1}</Text>
                        {EVENTS_DATA.some(e => parseInt(e.date) === i + 1) && (
                            <View style={styles.monthEventDot} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Tabs */}
            <View style={styles.topTabsContainer}>
                {['Day', 'Week', 'Month'].map((tab, idx) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.topTab,
                            activeTab === tab ? styles.topTabActive : styles.topTabInactive,
                            idx === 0 && { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                            idx === 2 && { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
                            idx !== 2 && { borderRightWidth: 0 }, // prevent double border
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.topTabText, activeTab === tab ? styles.topTabTextActive : styles.topTabTextInactive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Search + Filter Pill */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity>
                    <Ionicons name="close" size={20} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            {/* Filter Pills horizontally scrollable */}
            <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    <TouchableOpacity
                        style={[styles.filterPill, activeFilters.includes('Weekly Classes') ? styles.filterPillActive : styles.filterPillInactive]}
                        onPress={() => toggleFilter('Weekly Classes')}
                    >
                        <Ionicons name="options-outline" size={16} color={activeFilters.includes('Weekly Classes') ? "#3B82F6" : "#9CA3AF"} style={styles.filterIcon} />
                        <Text style={activeFilters.includes('Weekly Classes') ? styles.filterTextActive : styles.filterTextInactive}>Weekly Classes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterPill, activeFilters.includes('Camps') ? styles.filterPillActive : styles.filterPillInactive]}
                        onPress={() => toggleFilter('Camps')}
                    >
                        <Ionicons name="swap-vertical-outline" size={16} color={activeFilters.includes('Camps') ? "#3B82F6" : "#9CA3AF"} style={styles.filterIcon} />
                        <Text style={activeFilters.includes('Camps') ? styles.filterTextActive : styles.filterTextInactive}>Camps</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterPill, activeFilters.includes('Events') ? styles.filterPillActive : styles.filterPillInactive]}
                        onPress={() => toggleFilter('Events')}
                    >
                        <Text style={activeFilters.includes('Events') ? styles.filterTextActive : styles.filterTextInactive}>Events</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Month Header */}
            <View style={styles.monthHeader}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.monthText}>December 2023</Text>
                <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            {activeTab === 'Day' && renderDayView()}
            {activeTab === 'Week' && renderWeekView()}
            {activeTab === 'Month' && renderMonthView()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topTabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 20,
    },
    topTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#3B82F6',
    },
    topTabActive: {
        backgroundColor: '#3B82F6',
    },
    topTabInactive: {
        backgroundColor: '#fff',
    },
    topTabText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    topTabTextActive: {
        color: '#fff',
    },
    topTabTextInactive: {
        color: '#3B82F6',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    filtersWrapper: {
        marginBottom: 20,
    },
    filtersScroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    filterPillActive: {
        borderColor: '#3B82F6',
        backgroundColor: '#fff',
    },
    filterPillInactive: {
        borderColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
    },
    filterIcon: {
        marginRight: 6,
    },
    filterTextActive: {
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    filterTextInactive: {
        color: '#9CA3AF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    monthText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    daysWrapper: {
        marginBottom: 24,
    },
    daysScroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    dayItem: {
        width: 50,
        height: 70,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayItemActive: {
        backgroundColor: '#3B82F6', // Blue
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    dayName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    dayTextActive: {
        color: '#fff',
    },
    timelineContent: {
        paddingHorizontal: 16,
    },
    timelineRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeColumn: {
        width: 65,
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    timeText: {
        fontSize: 12,
        color: '#4B5563',
    },
    eventColumn: {
        flex: 1,
        paddingLeft: 10,
    },
    eventCard: {
        borderRadius: 8,
        padding: 12,
    },
    eventTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    eventTime: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    eventInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        color: '#9CA3AF',
        marginTop: 10,
        fontSize: 16,
    },
    weekDaySection: {
        marginBottom: 24,
    },
    weekDayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        padding: 8,
        borderRadius: 8,
    },
    weekEventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    weekEventInfo: {
        flex: 1,
    },
    weekEventTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    weekEventTime: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    noEventsText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginLeft: 8,
    },
    monthGrid: {
        paddingHorizontal: 16,
    },
    monthGridHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    monthGridHeaderText: {
        width: 40,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    monthGridBody: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    monthGridCell: {
        width: 45,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 8,
    },
    monthCellSelected: {
        backgroundColor: '#3B82F6',
    },
    monthCellText: {
        fontSize: 16,
        color: '#1a1a1a',
    },
    monthCellTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    monthEventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
        marginTop: 4,
    },
});
