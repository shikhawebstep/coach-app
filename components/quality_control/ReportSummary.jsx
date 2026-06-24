import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUESTIONS = [
    { id: 1, text: 'Punctuality of the coach', answer: 4 },
    { id: 2, text: 'Status of the campus', answer: 3 },
    { id: 3, text: 'Punctuality of the coach', answer: 5 },
    { id: 4, text: 'Punctuality of the coach', answer: 5 },
    { id: 5, text: 'Punctuality of the coach', answer: 5 },
    { id: 6, text: 'Punctuality of the coach', answer: 5 },
    { id: 7, text: 'Punctuality of the coach', answer: 3 },
];

export default function ReportSummary({ onBack }) {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Summary</Text>

                {QUESTIONS.map((q, idx) => (
                    <View key={idx} style={styles.questionBlock}>
                        <Text style={styles.questionText}>{q.text}</Text>
                        <View style={styles.radioGroup}>
                            {[1, 2, 3, 4, 5].map(val => (
                                <View key={val} style={styles.radioOption}>
                                    <View style={[styles.outerCircle, q.answer === val && styles.outerCircleSelected]}>
                                        {q.answer === val && <View style={styles.innerCircle} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{val}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

            </ScrollView>
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 24,
    },
    questionBlock: {
        marginBottom: 24,
    },
    questionText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
        marginBottom: 12,
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    outerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB', // Gray border
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    outerCircleSelected: {
        borderColor: '#3B82F6', // Blue border
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6', // Blue fill
    },
    radioLabel: {
        fontSize: 15,
        color: '#4B5563',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: '#fff', // Solid area
    },
    nextButton: {
        backgroundColor: '#3B82F6', // Blue button
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
