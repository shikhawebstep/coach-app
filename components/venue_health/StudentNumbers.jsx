import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLORS = {
    light: {
        background: '#fff',
        icon: '#1a1a1a',
        headerTitle: '#1a1a1a',
        yearText: '#1a1a1a',
        borderBtn: '#1a1a1a',
        rowBorder: '#F3F4F6',
        tableHeaderBg: '#fff',
        headerColText: '#4B5563',
        cellText: '#1a1a1a',
        textGreen: '#1CAB4B',
        textRed: '#EF4444',
        textYellow: '#F59E0B',
        bgLightGreen: '#ECFDF5',
        bgLightRed: '#FEF2F2',
        bgLightYellow: '#FFFBEB',
        totalRowBorder: '#E5E7EB',
        totalRowBg: '#fff',
        legendText: '#4B5563',
        axisText: '#4B5563',
        modalContainerBg: '#fff',
        modalHeaderBorder: '#E5E7EB',
        modalTitle: '#1a1a1a',
        filterText: '#1a1a1a',
        checkboxBorder: '#D1D5DB',
        checkboxSelectedBg: '#3B82F6',
        checkboxCheck: '#fff',
        divider: '#F3F4F6',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        yearText: '#F5F5F5',
        borderBtn: '#F5F5F5',
        rowBorder: '#2A2A2A',
        tableHeaderBg: '#121212',
        headerColText: '#9CA3AF',
        cellText: '#F5F5F5',
        textGreen: '#34D399',
        textRed: '#F87171',
        textYellow: '#FBBF24',
        bgLightGreen: '#0F2A1E',
        bgLightRed: '#2A1414',
        bgLightYellow: '#2A2412',
        totalRowBorder: '#2A2A2A',
        totalRowBg: '#121212',
        legendText: '#D1D5DB',
        axisText: '#D1D5DB',
        modalContainerBg: '#121212',
        modalHeaderBorder: '#2A2A2A',
        modalTitle: '#F5F5F5',
        filterText: '#F5F5F5',
        checkboxBorder: '#5A5A5A',
        checkboxSelectedBg: '#3B82F6',
        checkboxCheck: '#fff',
        divider: '#2A2A2A',
    },
};

export default function StudentNumbers({ onBack }) {
    const { token } = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(2026);
    const [startMonthIndex, setStartMonthIndex] = useState(2);
    const [viewMode, setViewMode] = useState('table');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedVenues, setSelectedVenues] = useState(new Set());

    useEffect(() => {
        fetchVenues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const response = await fetch(`process.env.EXPO_PUBLIC_API_BASE_URLapi/coachpro/health-check-venues?year=${year}`, requestOptions);
            const result = await response.json();

            if (result.status && result.data) {
                const fetchedVenues = result.data.venues || [];
                setVenues(fetchedVenues);
                if (fetchedVenues.length > 0) {
                    setSelectedVenues(new Set(fetchedVenues.map(v => v.venueName)));
                }
            }
        } catch (error) {
            console.error("Failed to fetch venue health:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevYear = () => setYear(y => y - 1);
    const handleNextYear = () => setYear(y => y + 1);

    const handlePrevMonths = () => {
        if (startMonthIndex > 0) setStartMonthIndex(startMonthIndex - 1);
    };
    const handleNextMonths = () => {
        if (startMonthIndex < 8) setStartMonthIndex(startMonthIndex + 1);
    };

    const getCellStyles = (students, capacity) => {
        if (!capacity || capacity === 0) {
            return { text: styles.textYellow, bg: styles.bgLightYellow };
        }
        const ratio = students / capacity;
        if (ratio >= 0.8) return { text: styles.textGreen, bg: styles.bgLightGreen };
        if (ratio <= 0.3) return { text: styles.textRed, bg: styles.bgLightRed };
        return { text: styles.textYellow, bg: styles.bgLightYellow };
    };

    const visibleMonths = [0, 1, 2, 3].map(offset => startMonthIndex + offset);

    const allUniqueVenueNames = venues.length > 0
        ? Array.from(new Set(venues.map(v => v.venueName)))
        : [];

    const filteredVenues = venues.filter(v => selectedVenues.has(v.venueName));

    const calculatedTotal = {
        monthlyData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, students: 0 }))
    };
    filteredVenues.forEach(v => {
        v.monthlyData.forEach(m => {
            const tMonth = calculatedTotal.monthlyData.find(tm => tm.month === m.month);
            if (tMonth) tMonth.students += m.students;
        });
    });

    const colors = ['#EC4899', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#14B8A6'];
    let maxStudents = 0;
    filteredVenues.forEach(v => {
        v.monthlyData.forEach(m => {
            if (m.students > maxStudents) maxStudents = m.students;
        });
    });
    const yMax = Math.max(10, Math.ceil(maxStudents / 10) * 10);
    const yLabels = [];
    const step = Math.max(1, Math.round(yMax / 5));
    for (let i = yMax; i >= 0; i -= step) {
        yLabels.push(i);
    }

    const polylines = filteredVenues.map((v, i) => {
        const points = [];
        for (let m = 1; m <= 12; m++) {
            const mData = v.monthlyData.find(md => md.month === m) || { students: 0 };
            const x = (m - 1) * (310 / 11);
            const y = 220 - (mData.students / yMax) * 220;
            points.push(`${x},${y}`);
        }
        return {
            key: v.venueId || v.venueName,
            points: points.join(' '),
            color: colors[i % colors.length],
            venueName: v.venueName
        };
    });

    const toggleVenueFilter = (venueName) => {
        const newSet = new Set(selectedVenues);
        if (newSet.has(venueName)) {
            newSet.delete(venueName);
        } else {
            newSet.add(venueName);
        }
        setSelectedVenues(newSet);
    };

    const toggleAllVenues = () => {
        if (selectedVenues.size === allUniqueVenueNames.length) {
            setSelectedVenues(new Set());
        } else {
            setSelectedVenues(new Set(allUniqueVenueNames));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
                            <Ionicons name="arrow-back" size={24} color={theme.icon} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>Student numbers</Text>
                </View>

                <View style={styles.controlsGrid}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handlePrevYear}>
                        <Image
                            source={require('@/assets/images/Arrow - Left Circle.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <Text style={styles.yearText}>{year}</Text>

                    <TouchableOpacity style={styles.iconBtn} onPress={handleNextYear}>
                        <Image
                            source={require('@/assets/images/Arrow - Right Circle.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setIsFilterVisible(true)}
                    >
                        <Image
                            source={require('@/assets/images/filter.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setViewMode(viewMode === 'table' ? 'graph' : 'table')}
                    >
                        <Image
                            source={require('@/assets/images/Chart.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                    <CustomLoader size={80} color="#3B82F6" />
                </View>
            ) : viewMode === 'table' ? (
                <View style={{ flex: 1 }}>
                    <View style={[styles.row, styles.tableHeader]}>
                        <View style={[styles.colVenueH, { flexDirection: 'row', alignItems: 'center' }]}>
                            <Text style={styles.headerColText}>Venue</Text>
                        </View>
                        <View style={styles.colCapH}>
                            <Text style={styles.headerColText}>Capacity</Text>
                        </View>
                        {visibleMonths.map((mIndex, i) => (
                            <View key={mIndex} style={[styles.colMonthH, i === 0 || i === 3 ? { flexDirection: 'row', alignItems: 'center' } : null]}>
                                {i === 0 && (
                                    <TouchableOpacity onPress={handlePrevMonths} disabled={startMonthIndex === 0}>
                                        <Image
                                            source={require('@/assets/images/Arrow - Left 2.png')}
                                            style={styles.smallIcon}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                )}
                                <Text style={styles.headerColText}>{MONTH_NAMES[mIndex]}</Text>
                                {i === 3 && (
                                    <TouchableOpacity onPress={handleNextMonths} disabled={startMonthIndex === 8}>
                                        <Image
                                            source={require('@/assets/images/Arrow - Right 2.png')}
                                            style={styles.smallIcon}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {filteredVenues.map((venue, index) => (
                            <View key={venue.venueId || index} style={styles.row}>
                                <View style={styles.colVenue}>
                                    <Text style={styles.cellText}>{venue.venueName}</Text>
                                </View>
                                <View style={styles.colCap}>
                                    <Text style={styles.textGreen}>{venue.capacity || 0}</Text>
                                </View>
                                {visibleMonths.map((mIndex) => {
                                    const mData = venue.monthlyData.find(m => m.month === mIndex + 1) || { students: 0 };
                                    const style = getCellStyles(mData.students, venue.capacity);
                                    return (
                                        <View key={mIndex} style={[styles.colMonth, style.bg]}>
                                            <Text style={[styles.cellValue, style.text]}>{mData.students}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}

                        <View style={[styles.row, styles.totalRow]}>
                            <View style={styles.colVenue}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Total</Text></View>
                            <View style={styles.colCap}><Text style={styles.textGreen}>-</Text></View>
                            {visibleMonths.map((mIndex) => {
                                const mData = calculatedTotal.monthlyData.find(m => m.month === mIndex + 1) || { students: 0 };
                                return (
                                    <View key={mIndex} style={[styles.colMonth, styles.bgLightYellow]}>
                                        <Text style={styles.textYellow}>{mData.students}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <View style={[styles.legendContainer, { flexWrap: 'wrap' }]}>
                        {polylines.map((pl) => (
                            <View key={pl.key} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: pl.color }]} />
                                <Text style={styles.legendText}>{pl.venueName}</Text>
                            </View>
                        ))}
                        {polylines.length === 0 && (
                            <Text style={styles.legendText}>No venues selected</Text>
                        )}
                    </View>

                    <View style={styles.chartArea}>
                        <View style={styles.yAxis}>
                            {yLabels.map((yl, idx) => (
                                <Text key={idx} style={styles.axisText}>{yl}</Text>
                            ))}
                        </View>

                        <View style={styles.chartPlot}>
                            <Svg width="100%" height={220} viewBox="0 -10 310 220" preserveAspectRatio="none">
                                {polylines.map((pl) => (
                                    <Polyline
                                        key={pl.key}
                                        points={pl.points}
                                        stroke={pl.color}
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                ))}
                            </Svg>

                            <View style={styles.xAxis}>
                                {MONTH_NAMES.map((m, idx) => (
                                    <Text key={idx} style={styles.axisTextX}>{m}</Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <Modal visible={isFilterVisible} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsFilterVisible(false)} style={styles.modalBackBtn}>
                            <Ionicons name="arrow-back" size={24} color={theme.icon} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Venues</Text>
                    </View>
                    <ScrollView style={styles.modalContent}>
                        <TouchableOpacity style={styles.filterRow} onPress={toggleAllVenues}>
                            <Text style={styles.filterText}>Select all</Text>
                            <View style={[styles.checkbox, selectedVenues.size === allUniqueVenueNames.length && styles.checkboxSelected]}>
                                {selectedVenues.size === allUniqueVenueNames.length && <Ionicons name="checkmark" size={16} color={theme.checkboxCheck} />}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.divider} />

                        {allUniqueVenueNames.map((vName, idx) => {
                            const isSelected = selectedVenues.has(vName);
                            return (
                                <View key={idx}>
                                    <TouchableOpacity style={styles.filterRow} onPress={() => toggleVenueFilter(vName)}>
                                        <Text style={styles.filterText}>{vName}</Text>
                                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                            {isSelected && <Ionicons name="checkmark" size={16} color={theme.checkboxCheck} />}
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.divider} />
                                </View>
                            );
                        })}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    controlsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 4,
    },
    yearText: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: theme.yearText,
        marginHorizontal: 8,
    },
    actionBtn: {
        marginLeft: 12,
        padding: 4,
    },
    borderBtn: {
        borderWidth: 1.5,
        borderColor: theme.borderBtn,
        borderRadius: 6,
        padding: 4,
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: theme.rowBorder,
    },
    tableHeader: {
        paddingVertical: 12,
        backgroundColor: theme.tableHeaderBg,
    },
    headerColText: {
        fontSize: 12,
        paddingHorizontal: 4,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerColText,
    },
    colVenueH: {
        flex: 2.2,
        justifyContent: 'flex-start',
        paddingLeft: 15,
    },
    colCapH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    colMonthH: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colVenue: {
        flex: 2.2,
        paddingLeft: 16,
        paddingVertical: 16,
        justifyContent: 'center',
    },
    colCap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colMonth: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: theme.cellText,
    },
    cellValue: {
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
    },
    textGreen: {
        color: theme.textGreen,
        fontFamily: 'Urbanist_700Bold',
        fontSize: 13,
    },
    textRed: {
        color: theme.textRed,
        fontFamily: 'Urbanist_700Bold',
        fontSize: 13,
    },
    textYellow: {
        color: theme.textYellow,
        fontFamily: 'Urbanist_700Bold',
        fontSize: 13,
    },
    bgLightGreen: {
        backgroundColor: theme.bgLightGreen,
    },
    bgLightRed: {
        backgroundColor: theme.bgLightRed,
    },
    bgLightYellow: {
        backgroundColor: theme.bgLightYellow,
    },
    totalRow: {
        borderTopWidth: 2,
        borderColor: theme.totalRowBorder,
        borderBottomWidth: 0,
        backgroundColor: theme.totalRowBg,
    },
    legendContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 30,
        justifyContent: 'flex-start',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: theme.legendText,
    },
    chartArea: {
        flexDirection: 'row',
        marginTop: 10,
    },
    yAxis: {
        width: 30,
        height: 220,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10,
        paddingBottom: 25,
    },
    axisText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: theme.axisText,
    },
    chartPlot: {
        flex: 1,
        position: 'relative',
        height: 240,
    },
    xAxis: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    axisTextX: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: theme.axisText,
        flex: 1,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: theme.modalContainerBg,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: theme.modalHeaderBorder,
    },
    modalBackBtn: {
        marginRight: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        color: theme.modalTitle,
    },
    modalContent: {
        flex: 1,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    filterText: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.filterText,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1.5,
        borderColor: theme.checkboxBorder,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: theme.checkboxSelectedBg,
        borderColor: theme.checkboxSelectedBg,
    },
    divider: {
        height: 1,
        backgroundColor: theme.divider,
        marginHorizontal: 20,
    },
    iconImage: {
        width: 25,
        height: 25,
    },
    smallIcon: {
        width: 8,
        height: 8,
    },
});