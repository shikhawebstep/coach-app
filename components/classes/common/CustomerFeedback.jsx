import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function CustomerFeedback({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('Chelsea');

    // Generating some realistic mock cubic bezier curves for the chart
    // ViewBox is roughly 0 0 320 200
    // Y runs from 0 (top/90) to 200 (bottom/30)
    // pink (top), red (middle), blue (bottom)

    // Y values: 90 -> 0, 80 -> 33, 70 -> 66, 60 -> 100, 50 -> 133, 40 -> 166, 30 -> 200
    const pinkLine = "M 0,10 C 20,40 30,120 50,110 C 70,100 80,30 100,30 C 120,30 140,80 160,80 C 180,80 190,20 210,25 C 230,30 240,90 260,80 C 280,70 290,10 310,15";
    const redLine = "M 0,33 C 20,70 30,150 50,140 C 70,130 80,70 100,70 C 120,70 140,110 160,110 C 180,110 190,40 210,45 C 230,50 240,110 260,100 C 280,90 290,30 310,35";
    const blueLine = "M 0,66 C 20,100 30,190 50,180 C 70,170 80,110 100,105 C 120,100 140,150 160,150 C 180,150 190,80 210,85 C 230,90 240,140 260,130 C 280,120 290,60 310,65";

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer feedback</Text>
            </View>

            {/* View container */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Search / Select Container */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Chart Title & Icon */}
                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Customer Satisfaction Results</Text>
                    <TouchableOpacity style={styles.chartIconBtn}>
                        <Ionicons name="bar-chart-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EC4899' }]} />
                        <Text style={styles.legendText}>Chelsea</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendText}>Acton</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                        <Text style={styles.legendText}>London Bridge</Text>
                    </View>
                </View>

                {/* Chart Area */}
                <View style={styles.chartArea}>
                    {/* Y Axis Labels */}
                    <View style={styles.yAxis}>
                        <Text style={styles.axisText}>90</Text>
                        <Text style={styles.axisText}>80</Text>
                        <Text style={styles.axisText}>70</Text>
                        <Text style={styles.axisText}>60</Text>
                        <Text style={styles.axisText}>50</Text>
                        <Text style={styles.axisText}>40</Text>
                        <Text style={styles.axisText}>30</Text>
                    </View>

                    {/* SVG Line Chart */}
                    <View style={styles.chartPlot}>
                        <Svg width="100%" height={220} viewBox="0 -10 310 220" preserveAspectRatio="none">
                            <Path d={pinkLine} stroke="#EC4899" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d={redLine} stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d={blueLine} stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>

                        {/* X Axis Labels */}
                        <View style={styles.xAxis}>
                            <Text style={styles.axisTextX}>Jan</Text>
                            <Text style={styles.axisTextX}>Feb</Text>
                            <Text style={styles.axisTextX}>Mar</Text>
                            <Text style={styles.axisTextX}>Apr</Text>
                            <Text style={styles.axisTextX}>May</Text>
                            <Text style={styles.axisTextX}>Jun</Text>
                            <Text style={styles.axisTextX}>Jul</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB', // Gray border
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    chartTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b', // slightly dark blue-gray
    },
    chartIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        marginBottom: 30,
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
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#4B5563',
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
        paddingBottom: 25, // offset for xaxis
    },
    axisText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: 'bold',
    },
    chartPlot: {
        flex: 1,
        position: 'relative',
        height: 240, // height including x-axis line
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
        color: '#4B5563',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
});
