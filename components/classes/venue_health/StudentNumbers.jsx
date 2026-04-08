import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABLE_DATA = [
    { venue: 'London Bridge (1)', cap: 22, cols: [{ val: 22, type: 'green', bg: 'lightgreen' }, { val: 26, type: 'green' }, { val: 27, type: 'green' }, { val: 24, type: 'green' }] },
    { venue: 'London Bridge (2)', cap: 22, cols: [{ val: 22, type: 'green', bg: 'lightgreen' }, { val: 24, type: 'green' }, { val: 23, type: 'green' }, { val: 22, type: 'green' }] },
    { venue: 'London Bridge (3)', cap: 22, cols: [{ val: 4, type: 'red', bg: 'lightred' }, { val: 12, type: 'yellow', bg: 'lightyellow' }, { val: 13, type: 'yellow', bg: 'lightyellow' }, { val: 26, type: 'green' }] },
    { venue: 'Tottenham (1)', cap: 22, cols: [{ val: 2, type: 'red', bg: 'lightred' }, { val: 4, type: 'red', bg: 'lightred' }, { val: 15, type: 'yellow', bg: 'lightyellow' }, { val: 22, type: 'green' }] },
    { venue: 'Tottenham (2)', cap: 24, cols: [{ val: 24, type: 'green', bg: 'lightgreen' }, { val: 25, type: 'green' }, { val: 23, type: 'green' }, { val: 24, type: 'green' }] },
    { venue: 'Tottenham (3)', cap: 26, cols: [{ val: 3, type: 'red', bg: 'lightred' }, { val: 4, type: 'red', bg: 'lightred' }, { val: 5, type: 'red', bg: 'lightred' }, { val: 16, type: 'yellow', bg: 'lightyellow' }] },
    { venue: 'Stonebridge (1)', cap: 24, cols: [{ val: 5, type: 'red', bg: 'lightred' }, { val: 25, type: 'green', bg: 'lightgreen' }, { val: 23, type: 'green' }, { val: 24, type: 'green' }] },
    { venue: 'Stonebridge (2)', cap: 21, cols: [{ val: 24, type: 'green', bg: 'lightgreen' }, { val: 25, type: 'green' }, { val: 23, type: 'green' }, { val: 24, type: 'green' }] },
    { venue: 'Stonebridge (3)', cap: 23, cols: [{ val: 24, type: 'green', bg: 'lightgreen' }, { val: 25, type: 'green' }, { val: 23, type: 'green' }, { val: 24, type: 'green' }] },
    { venue: 'Stonebridge (4)', cap: 25, cols: [{ val: 15, type: 'yellow', bg: 'lightyellow' }, { val: 18, type: 'yellow' }, { val: 16, type: 'yellow' }, { val: 24, type: 'green' }] },
];

export default function StudentNumbers({ onBack }) {

    // Helper to get color style based on type
    const getTextStyle = (type) => {
        if (type === 'green') return styles.textGreen;
        if (type === 'red') return styles.textRed;
        if (type === 'yellow') return styles.textYellow;
        return null;
    };

    const getBgStyle = (bgType) => {
        if (bgType === 'lightgreen') return styles.bgLightGreen;
        if (bgType === 'lightred') return styles.bgLightRed;
        if (bgType === 'lightyellow') return styles.bgLightYellow;
        return null;
    };

    return (
        <View style={styles.container}>
            {/* Header / Controls */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Student numbers</Text>

                <View style={styles.controlsGrid}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                    <Text style={styles.yearText}>2023</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="options-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.borderBtn]}>
                        <Ionicons name="bar-chart-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Table Header */}
            <View style={[styles.row, styles.tableHeader]}>
                <View style={[styles.colVenueH]}>
                    <Text style={styles.headerColText}>Venue</Text>
                </View>
                <View style={styles.colCapH}>
                    <Text style={styles.headerColText}>Capacity</Text>
                    <Ionicons name="caret-back" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.colMonthH}><Text style={styles.headerColText}>Mar</Text></View>
                <View style={styles.colMonthH}><Text style={styles.headerColText}>Apr</Text></View>
                <View style={styles.colMonthH}><Text style={styles.headerColText}>May</Text></View>
                <View style={[styles.colMonthH, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.headerColText}>Jun</Text>
                    <Ionicons name="caret-forward" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
                </View>
            </View>

            {/* Table Body */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {TABLE_DATA.map((row, index) => (
                    <View key={index} style={styles.row}>
                        <View style={styles.colVenue}>
                            <Text style={styles.cellText}>{row.venue}</Text>
                        </View>
                        <View style={styles.colCap}>
                            <Text style={styles.textGreen}>{row.cap}</Text>
                        </View>
                        {row.cols.map((col, cIdx) => (
                            <View key={cIdx} style={[styles.colMonth, getBgStyle(col.bg)]}>
                                <Text style={[styles.cellValue, getTextStyle(col.type)]}>{col.val}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Total Row */}
                <View style={[styles.row, styles.totalRow]}>
                    <View style={styles.colVenue}><Text style={styles.cellText}>Total</Text></View>
                    <View style={styles.colCap}><Text style={styles.textGreen}>231</Text></View>
                    <View style={[styles.colMonth, styles.bgLightYellow]}><Text style={styles.textYellow}>151</Text></View>
                    <View style={[styles.colMonth, styles.bgLightYellow]}><Text style={styles.textYellow}>206</Text></View>
                    <View style={[styles.colMonth, styles.bgLightYellow]}><Text style={styles.textYellow}>189</Text></View>
                    <View style={[styles.colMonth, styles.bgLightGreen]}><Text style={styles.textGreen}>215</Text></View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    controlsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 4,
    },
    yearText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginHorizontal: 8,
    },
    actionBtn: {
        marginLeft: 12,
        padding: 4,
    },
    borderBtn: {
        borderWidth: 1.5,
        borderColor: '#1a1a1a',
        borderRadius: 6,
        padding: 4,
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    tableHeader: {
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    headerColText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    colVenueH: {
        flex: 2.2,
        paddingLeft: 16,
        justifyContent: 'center',
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
        color: '#1a1a1a',
    },
    cellValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    textGreen: {
        color: '#1CAB4B',
        fontWeight: '600',
        fontSize: 13,
    },
    textRed: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 13,
    },
    textYellow: {
        color: '#F59E0B',
        fontWeight: '600',
        fontSize: 13,
    },
    bgLightGreen: {
        backgroundColor: '#ECFDF5',
    },
    bgLightRed: {
        backgroundColor: '#FEF2F2',
    },
    bgLightYellow: {
        backgroundColor: '#FFFBEB',
    },
    totalRow: {
        borderTopWidth: 2,
        borderColor: '#E5E7EB',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
    },
});
