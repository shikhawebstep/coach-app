import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useState } from 'react';
import { PRACTICAL_ASSESSMENT_CRITERIA } from './Assessmentcriteria.constants';

const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        sectionTitle: '#1a1a1a',
        questionText: '#494949',
        outerCircleBorder: '#D1D5DB',
        radioLabel: '#4E5D78',
        icon: '#000',
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        sectionTitle: '#F5F5F5',
        questionText: '#D1D5DB',
        outerCircleBorder: '#4B5563',
        radioLabel: '#9CA3AF',
        icon: '#F5F5F5',
    },
};

// onNext receives the ratings as { [criterionKey]: 1-5 }, e.g.
// { punctuality: 4, communicationSkills: 5, structureOfExercises: 3, controlOfGroup: 4 }
export default function AssessmentCriteria({ onBack, onNext }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [answers, setAnswers] = useState(
        Object.fromEntries(PRACTICAL_ASSESSMENT_CRITERIA.map((c) => [c.key, null]))
    );

    const handleSelect = (key, val) => {
        setAnswers((prev) => ({ ...prev, [key]: val }));
    };

    const isAllAnswered = PRACTICAL_ASSESSMENT_CRITERIA.every((c) => answers[c.key] !== null);

    const handleNext = () => {
        if (!isAllAnswered) return;
        onNext?.(answers);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Assessment Criteria</Text>

                {PRACTICAL_ASSESSMENT_CRITERIA.map((criterion) => (
                    <View key={criterion.key} style={styles.questionBlock}>
                        <Text style={styles.questionText}>{criterion.text}</Text>
                        <View style={styles.radioGroup}>
                            {[1, 2, 3, 4, 5].map(val => (
                                <TouchableOpacity
                                    key={val}
                                    style={styles.radioOption}
                                    onPress={() => handleSelect(criterion.key, val)}
                                >
                                    <View style={[styles.outerCircle, answers[criterion.key] === val && styles.outerCircleSelected]}>
                                        {answers[criterion.key] === val && <View style={styles.innerCircle} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

            </ScrollView>
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.nextButton, !isAllAnswered && { opacity: 0.5 }]}
                    onPress={handleNext}
                    disabled={!isAllAnswered}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
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
        fontSize: 26,
        color: theme.headerTitle,
        fontFamily: 'Urbanist_700Bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 26,
        color: theme.sectionTitle,
        marginVertical: 24,
        fontFamily: 'Urbanist_700Bold',
    },
    questionBlock: {
        marginBottom: 24,
    },
    questionText: {
        fontSize: 18,
        color: theme.questionText,
        marginBottom: 12,
        fontFamily: 'Urbanist_700Bold',
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
        borderColor: theme.outerCircleBorder,
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
        color: theme.radioLabel,
        fontFamily: 'Urbanist_500Medium',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: theme.background,
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