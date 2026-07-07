import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_LABELS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// ---- event-shape helpers -------------------------------------------------
// Matches the real API: { success, date, events: [{ id, type, title, date,
// start_time?, end_time?, time?, venue?, address?, ... }] }

const TYPE_META = {
    weekly_class: {
        label: 'Weekly Classes',
        color: '#3B82F6',
        gradient: ['#246BFD', '#6F9EFF'],
        icon: 'options-outline',
    },
    birthday_party: {
        label: 'Birthday Parties',
        color: '#EC4899',
        gradient: ['#FF575C', '#FF8285'],
        icon: 'gift-outline',
    },
    one_to_one: {
        label: 'One to One',
        color: '#10B981',
        gradient: ['#1AB65C', '#39E180'],
        icon: 'person-outline',
    },
};
const DEFAULT_TYPE_META = { label: 'Other', color: '#6B7280', gradient: ['#6B7280', '#9CA3AF'], icon: 'ellipse-outline' };
const FILTER_OPTIONS = Object.entries(TYPE_META).map(([key, meta]) => ({ key, ...meta }));

// "2026-07-07" -> "2026-07-07"; "2026-07-07T00:00:00.000Z" -> "2026-07-07"
const normalizeDate = (dateStr) => (dateStr || '').split('T')[0];

// "17:00:00" / "18:15" -> "5:00 PM" / "6:15 PM"; already-formatted strings
// like "7:45 AM" are passed through untouched.
const to12Hour = (raw) => {
    if (!raw) return null;
    if (/am|pm/i.test(raw)) return raw.trim();
    const [hStr, mStr = '0'] = raw.split(':');
    let h = parseInt(hStr, 10);
    if (Number.isNaN(h)) return raw;
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${mStr.padStart(2, '0')} ${suffix}`;
};

// Builds the "7:45 AM - 8:30 AM" style label from whatever time fields
// the event actually has (start_time/end_time OR a single time field).
const getEventTimeLabel = (item) => {
    if (item.start_time && item.end_time) {
        return `${to12Hour(item.start_time)} - ${to12Hour(item.end_time)}`;
    }
    if (item.start_time) return to12Hour(item.start_time);
    if (item.time) return to12Hour(item.time);
    return 'Time TBD';
};

// Used for sorting the Day timeline chronologically regardless of which
// time field / format a given event type uses.
const getEventSortMinutes = (item) => {
    const raw = item.start_time || item.time || '';
    const match = raw.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
};

// Converts one raw API event into the shape the UI actually renders
// (time/color/sortMinutes/etc). This MUST run on every event coming back
// from the API — rendering raw API objects directly breaks event.time,
// event.color, and the timeline sort order, since the API doesn't send
// those fields under those names.
const mapApiEvent = (item, index) => {
    const meta = TYPE_META[item.type] || DEFAULT_TYPE_META;
    return {
        id: item.id?.toString() || index.toString(),
        title: item.serviceType || meta.label,
        time: getEventTimeLabel(item),
        color: item.color || meta.color,
        gradient: meta.gradient,
        type: item.type || 'other',
        date: normalizeDate(item.date),
        venue: item.venue || item.address || null,
        sortMinutes: getEventSortMinutes(item),
    };
};
// ---- date helpers -------------------------------------------------------

// Converts JS getDay() (0=Sun..6=Sat) into a Monday-first index (0=Mon..6=Sun)
const toMondayIndex = (jsDay) => (jsDay + 6) % 7;

const formatISO = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const startOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - toMondayIndex(d.getDay()));
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, amount) => {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return d;
};

const addMonths = (date, amount) => {
    const d = new Date(date);
    d.setDate(1); // avoid month-length overflow (e.g. Jan 31 + 1mo)
    d.setMonth(d.getMonth() + amount);
    return d;
};

const getWeekDays = (anchorDate) => {
    const start = startOfWeek(anchorDate);
    return Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i);
        return {
            day: DAY_LABELS[i],
            date: d.getDate().toString().padStart(2, '0'),
            iso: formatISO(d),
            full: d,
        };
    });
};

const getMonthMatrix = (anchorDate) => {
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = toMondayIndex(firstOfMonth.getDay());

    const cells = [];
    for (let i = 0; i < leadingBlanks; i++) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        cells.push({ day, iso: formatISO(d) });
    }
    return cells;
};

// -------------------------------------------------------------------------

const COLORS = {
    light: {
        background: '#fff',
        icon: '#1a1a1a',
        tabBorder: '#3B82F6',
        tabActiveBg: '#3B82F6',
        tabInactiveBg: '#fff',
        tabTextActive: '#fff',
        tabTextInactive: '#3B82F6',
        searchBg: '#FAFAFA',
        searchBorder: '#E5E7EB',
        searchText: '#1a1a1a',
        searchIcon: '#a0a0a0',
        filterPillActiveBorder: '#3B82F6',
        filterPillActiveBg: '#fff',
        filterPillInactiveBorder: '#E5E7EB',
        filterPillInactiveBg: '#FAFAFA',
        filterTextActive: '#3B82F6',
        filterTextInactive: '#9CA3AF',
        filterIconActive: '#3B82F6',
        filterIconInactive: '#9CA3AF',
        monthText: '#1a1a1a',
        dayItemBg: '#F3F4F6',
        dayItemActiveBg: '#3B82F6',
        dayName: '#6B7280',
        dayNumber: '#1a1a1a',
        dayTextActive: '#fff',
        timeText: '#4B5563',
        emptyIcon: '#E5E7EB',
        emptyText: '#9CA3AF',
        weekDayTitleBg: '#F9FAFB',
        weekDayTitleText: '#1a1a1a',
        weekEventCardBg: '#fff',
        weekEventCardBorder: '#F3F4F6',
        weekEventTitle: '#1a1a1a',
        weekEventTime: '#6B7280',
        weekChevron: '#9CA3AF',
        noEventsText: '#9CA3AF',
        monthGridHeaderText: '#9CA3AF',
        monthCellSelectedBg: '#3B82F6',
        monthCellText: '#1a1a1a',
        monthCellTextSelected: '#fff',
        monthCellTextToday: '#3B82F6',
        monthEventDot: '#3B82F6',
        monthCellEmpty: 'transparent',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        tabBorder: '#3B82F6',
        tabActiveBg: '#3B82F6',
        tabInactiveBg: '#1E1E1E',
        tabTextActive: '#fff',
        tabTextInactive: '#60A5FA',
        searchBg: '#1E1E1E',
        searchBorder: '#2A2A2A',
        searchText: '#F5F5F5',
        searchIcon: '#8A8A8A',
        filterPillActiveBorder: '#3B82F6',
        filterPillActiveBg: '#1E1E1E',
        filterPillInactiveBorder: '#2A2A2A',
        filterPillInactiveBg: '#1E1E1E',
        filterTextActive: '#60A5FA',
        filterTextInactive: '#9CA3AF',
        filterIconActive: '#60A5FA',
        filterIconInactive: '#9CA3AF',
        monthText: '#F5F5F5',
        dayItemBg: '#1E1E1E',
        dayItemActiveBg: '#3B82F6',
        dayName: '#9CA3AF',
        dayNumber: '#F5F5F5',
        dayTextActive: '#fff',
        timeText: '#9CA3AF',
        emptyIcon: '#2A2A2A',
        emptyText: '#9CA3AF',
        weekDayTitleBg: '#1E1E1E',
        weekDayTitleText: '#F5F5F5',
        weekEventCardBg: '#1E1E1E',
        weekEventCardBorder: '#2A2A2A',
        weekEventTitle: '#F5F5F5',
        weekEventTime: '#9CA3AF',
        weekChevron: '#9CA3AF',
        noEventsText: '#9CA3AF',
        monthGridHeaderText: '#9CA3AF',
        monthCellSelectedBg: '#3B82F6',
        monthCellText: '#F5F5F5',
        monthCellTextSelected: '#fff',
        monthCellTextToday: '#60A5FA',
        monthEventDot: '#60A5FA',
        monthCellEmpty: 'transparent',
    },
};

export default function CalendarSchedule() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);
    const { token } = useAuth();

    const today = useMemo(() => new Date(), []);
    const todayISO = useMemo(() => formatISO(today), [today]);

    const [activeTab, setActiveTab] = useState('Day');
    const [searchQuery, setSearchQuery] = useState('');

    // anchorDate drives whichever view is active (which day/week/month is on screen)
    const [anchorDate, setAnchorDate] = useState(today);
    // selectedDate is the full ISO date the user has tapped (used for Day view + Month picking)
    const [selectedDate, setSelectedDate] = useState(todayISO);

    const [activeFilters, setActiveFilters] = useState(FILTER_OPTIONS.map(f => f.key));
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);
    const monthCells = useMemo(() => getMonthMatrix(anchorDate), [anchorDate]);
    const headerLabel = `${MONTH_LABELS[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`;

    // Keep the latest token in a ref so fetchSchedule's identity never changes.
    // (If token isn't referentially stable from useAuth(), a useCallback that
    // depends on it directly gets recreated on unrelated renders, which
    // re-triggers the effect below and fires duplicate network requests.)
    const tokenRef = useRef(token);
    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    const fetchSchedule = useCallback(async (dateISO, signal) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${tokenRef.current}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            signal,
        };

        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/my-calender?date=${dateISO}`, requestOptions);
            const textResult = await response.text();

            try {
                const jsonResult = JSON.parse(textResult);
                const eventsArray = Array.isArray(jsonResult) ? jsonResult :
                    (jsonResult.events || jsonResult.data || []);

                if (Array.isArray(eventsArray)) {
                    // IMPORTANT: always run raw API events through mapApiEvent.
                    // Rendering eventsArray directly (raw API shape) breaks
                    // event.time / event.color / event.sortMinutes, since the
                    // API sends start_time/end_time/time, not those names.
                    const mappedEvents = eventsArray
                        .map(mapApiEvent)
                        .sort((a, b) => a.sortMinutes - b.sortMinutes);

                    // Defensive de-dupe by id — if the same event id shows up
                    // more than once in a single response, keep only the first.
                    const seen = new Set();
                    const deduped = mappedEvents.filter(e => {
                        if (seen.has(e.id)) return false;
                        seen.add(e.id);
                        return true;
                    });

                    if (__DEV__) {
                        console.log(
                            `[schedule] date=${dateISO} rawCount=${eventsArray.length} dedupedCount=${deduped.length}`
                        );
                    }

                    setEventsData(deduped);
                }
            } catch (e) {
                // Response wasn't JSON — nothing to map
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, []); // stable — never recreated, so the effect below only reruns on real date/tab changes

    // Refetch whenever the relevant date changes. Cancels any in-flight
    // request for the previous date/tab so a slow stale response can't land
    // after a newer one and cause the list to flicker or double-populate.
    useEffect(() => {
        const controller = new AbortController();
        const dateToFetch = activeTab === 'Day' ? selectedDate : formatISO(anchorDate);
        fetchSchedule(dateToFetch, controller.signal);
        return () => controller.abort();
    }, [activeTab, selectedDate, anchorDate, fetchSchedule]);

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    // Memoized so it only recomputes when one of its actual inputs changes,
    // instead of on every render (which was also making any nearby
    // console.log look like it fired repeatedly with "growing" data).
    const filteredEvents = useMemo(() => eventsData.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilters.includes(event.type);
        const matchesDate = activeTab === 'Day' ? event.date === selectedDate : true;
        return matchesSearch && matchesFilter && matchesDate;
    }), [eventsData, searchQuery, activeFilters, activeTab, selectedDate]);

    // Debug logs — each only fires once per *actual* change to its value,
    // not once per render.
    useEffect(() => {
        if (__DEV__) console.log('eventsData changed:', eventsData.length, 'events');
    }, [eventsData]);
    useEffect(() => {
        if (__DEV__) console.log('filteredEvents changed:', filteredEvents.length, 'events');
    }, [filteredEvents]);

    // ---- navigation ----

    const goPrev = () => {
        if (activeTab === 'Day') {
            const next = addDays(new Date(selectedDate), -1);
            setSelectedDate(formatISO(next));
            setAnchorDate(next);
        } else if (activeTab === 'Week') {
            const next = addDays(anchorDate, -7);
            setAnchorDate(next);
        } else {
            setAnchorDate(prev => addMonths(prev, -1));
        }
    };

    const goNext = () => {
        if (activeTab === 'Day') {
            const next = addDays(new Date(selectedDate), 1);
            setSelectedDate(formatISO(next));
            setAnchorDate(next);
        } else if (activeTab === 'Week') {
            const next = addDays(anchorDate, 7);
            setAnchorDate(next);
        } else {
            setAnchorDate(prev => addMonths(prev, 1));
        }
    };

    const selectDay = (iso, fullDate) => {
        setSelectedDate(iso);
        setAnchorDate(fullDate);
    };

    const renderDayView = () => (
        <>
            {/* Days Scroll */}
            <View style={styles.daysWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                    {weekDays.map((d) => (
                        <TouchableOpacity
                            key={d.iso}
                            style={[styles.dayItem, selectedDate === d.iso && styles.dayItemActive]}
                            onPress={() => selectDay(d.iso, d.full)}
                        >
                            <Text style={[styles.dayName, selectedDate === d.iso && styles.dayTextActive]}>{d.day}</Text>
                            <Text style={[styles.dayNumber, selectedDate === d.iso && styles.dayTextActive]}>{d.date}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Schedule Timeline */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
                {loading ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Loading…</Text>
                    </View>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <View key={event.id} style={styles.timelineRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeText}>{event.time.split(' - ')[0]}</Text>
                            </View>
                            <View style={styles.eventColumn}>
                                <TouchableOpacity activeOpacity={0.8}>
                                    <LinearGradient
                                        colors={event.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.eventCard}
                                    >
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <View style={styles.eventInfoRow}>
                                            <Text style={styles.eventTime}>{event.time}</Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={60} color={theme.emptyIcon} />
                        <Text style={styles.emptyText}>No sessions scheduled for this day</Text>
                    </View>
                )}
            </ScrollView>
        </>
    );

    const renderWeekView = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
            {weekDays.map((day) => {
                const dayEvents = eventsData.filter(e => e.date === day.iso);
                return (
                    <View key={day.iso} style={styles.weekDaySection}>
                        <Text style={styles.weekDayTitle}>{day.day} {day.date}</Text>
                        {dayEvents.map(event => (
                            <TouchableOpacity key={event.id} style={[styles.weekEventCard, { borderLeftColor: event.color }]}>
                                <View style={styles.weekEventInfo}>
                                    <Text style={styles.weekEventTitle}>{event.title}</Text>
                                    <Text style={styles.weekEventTime}>{event.time}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.weekChevron} />
                            </TouchableOpacity>
                        ))}
                        {dayEvents.length === 0 && (
                            <Text style={styles.noEventsText}>No events</Text>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );

    const renderMonthView = () => (
        <View style={styles.monthGrid}>
            <View style={styles.monthGridHeader}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <Text key={`${d}-${i}`} style={styles.monthGridHeaderText}>{d}</Text>
                ))}
            </View>
            <View style={styles.monthGridBody}>
                {monthCells.map((cell, i) => {
                    if (!cell) {
                        return <View key={`blank-${i}`} style={styles.monthGridCell} />;
                    }
                    const isSelected = cell.iso === selectedDate;
                    const isToday = cell.iso === todayISO;
                    const hasEvents = eventsData.some(e => e.date === cell.iso);
                    return (
                        <TouchableOpacity
                            key={cell.iso}
                            style={[styles.monthGridCell, isSelected && styles.monthCellSelected]}
                            onPress={() => {
                                selectDay(cell.iso, new Date(cell.iso));
                                setActiveTab('Day');
                            }}
                        >
                            <Text style={[
                                styles.monthCellText,
                                isToday && !isSelected && styles.monthCellTextToday,
                                isSelected && styles.monthCellTextSelected,
                            ]}>{cell.day}</Text>
                            {hasEvents && <View style={styles.monthEventDot} />}
                        </TouchableOpacity>
                    );
                })}
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
                            idx !== 2 && { borderRightWidth: 0 },
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
                <Ionicons name="search-outline" size={20} color={theme.searchIcon} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search events"
                    placeholderTextColor={theme.searchIcon}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close" size={20} color={theme.icon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Pills horizontally scrollable */}
            <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {FILTER_OPTIONS.map((option) => {
                        const isActive = activeFilters.includes(option.key);
                        return (
                            <TouchableOpacity
                                key={option.key}
                                style={[styles.filterPill, isActive ? styles.filterPillActive : styles.filterPillInactive]}
                                onPress={() => toggleFilter(option.key)}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={16}
                                    color={isActive ? theme.filterIconActive : theme.filterIconInactive}
                                    style={styles.filterIcon}
                                />
                                <Text style={isActive ? styles.filterTextActive : styles.filterTextInactive}>{option.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Month Header — arrows move day/week/month depending on active tab */}
            <View style={styles.monthHeader}>
                <TouchableOpacity onPress={goPrev} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.monthText}>{headerLabel}</Text>
                <TouchableOpacity onPress={goNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="chevron-forward" size={24} color={theme.icon} />
                </TouchableOpacity>
            </View>

            {activeTab === 'Day' && renderDayView()}
            {activeTab === 'Week' && renderWeekView()}
            {activeTab === 'Month' && renderMonthView()}
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
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
        borderColor: theme.tabBorder,
    },
    topTabActive: {
        backgroundColor: theme.tabActiveBg,
    },
    topTabInactive: {
        backgroundColor: theme.tabInactiveBg,
    },
    topTabText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    topTabTextActive: {
        color: theme.tabTextActive,
    },
    topTabTextInactive: {
        color: theme.tabTextInactive,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: theme.searchBg,
        borderRadius: 16,
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
        color: theme.searchText,
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
        borderColor: theme.filterPillActiveBorder,
        backgroundColor: theme.filterPillActiveBg,
    },
    filterPillInactive: {
        borderColor: theme.filterPillInactiveBorder,
        backgroundColor: theme.filterPillInactiveBg,
    },
    filterIcon: {
        marginRight: 6,
    },
    filterTextActive: {
        color: theme.filterTextActive,
        fontWeight: 'bold',
        fontSize: 14,
    },
    filterTextInactive: {
        color: theme.filterTextInactive,
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
        color: theme.monthText,
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
        backgroundColor: theme.dayItemBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayItemActive: {
        backgroundColor: theme.dayItemActiveBg,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    dayName: {
        fontSize: 12,
        color: theme.dayName,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.dayNumber,
    },
    dayTextActive: {
        color: theme.dayTextActive,
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
        color: theme.timeText,
        textTransform: 'capitalize',
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
        fontSize: 18,
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    eventTime: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
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
        color: theme.emptyText,
        marginTop: 10,
        fontSize: 16,
    },
    weekDaySection: {
        marginBottom: 24,
    },
    weekDayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.weekDayTitleText,
        marginBottom: 12,
        backgroundColor: theme.weekDayTitleBg,
        padding: 8,
        borderRadius: 8,
    },
    weekEventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: theme.weekEventCardBg,
        borderRadius: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: theme.weekEventCardBorder,
    },
    weekEventInfo: {
        flex: 1,
    },
    weekEventTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.weekEventTitle,
    },
    weekEventTime: {
        fontSize: 12,
        color: theme.weekEventTime,
        marginTop: 4,
    },
    noEventsText: {
        fontSize: 14,
        color: theme.noEventsText,
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
        color: theme.monthGridHeaderText,
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
        backgroundColor: theme.monthCellSelectedBg,
    },
    monthCellText: {
        fontSize: 16,
        color: theme.monthCellText,
    },
    monthCellTextToday: {
        color: theme.monthCellTextToday,
        fontWeight: 'bold',
    },
    monthCellTextSelected: {
        color: theme.monthCellTextSelected,
        fontWeight: 'bold',
    },
    monthEventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.monthEventDot,
        marginTop: 4,
    },
});