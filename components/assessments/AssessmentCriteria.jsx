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

export default function AssessmentCriteria({ onBack, onNext }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create report</Text>
            </View> */}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Assessment Criteria</Text>

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
                <TouchableOpacity style={styles.nextButton} onPress={onNext}>
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
        color: '#1a1a1a',
        fontFamily: 'Urbanist_700Bold',  // bold ke liye
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#1a1a1a',
        marginVertical: 24,
        fontFamily: 'Urbanist_700Bold',
    },
    questionBlock: {
        marginBottom: 24,
    },
    questionText: {
        fontSize: 18,
        color: '#494949',
        marginBottom: 12,
        fontFamily: 'Urbanist_700Bold',  // bold ke liye
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
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    outerCircleSelected: {
        borderColor: '#3B82F6',
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    radioLabel: {
        fontSize: 14,
        color: '#4E5D78',
        fontFamily: 'Urbanist_500Medium',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 18,
        borderRadius: 57,
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
    },
});