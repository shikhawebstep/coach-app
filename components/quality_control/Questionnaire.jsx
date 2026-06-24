import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Questionnaire({ onBack }) {
    const [selected, setSelected] = useState(5);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <Text style={styles.progressText}>Question 1/15</Text>
                <Text style={styles.questionText}>Punctuality of the coach</Text>

                <View style={styles.optionsContainer}>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <TouchableOpacity
                            key={val}
                            style={[styles.optionBtn, selected === val ? styles.optionBtnSelected : styles.optionBtnDefault]}
                            onPress={() => setSelected(val)}
                        >
                            <Text style={[styles.optionText, selected === val ? styles.optionTextSelected : styles.optionTextDefault]}>
                                {val}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next question</Text>
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
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B82F6', // Blue color for counter
        marginBottom: 8,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 32,
    },
    optionsContainer: {
        gap: 16, // Space between buttons
    },
    optionBtn: {
        paddingVertical: 18,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    optionBtnDefault: {
        borderColor: '#9CA3AF', // Gray border
        backgroundColor: '#fff',
    },
    optionBtnSelected: {
        borderColor: '#3B82F6', // Blue border
        backgroundColor: '#fff',
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionTextDefault: {
        color: '#1a1a1a', // Black text
    },
    optionTextSelected: {
        color: '#3B82F6', // Blue text
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: '#fff', // Solid area
    },
    nextButton: {
        backgroundColor: '#3B82F6', // Blue
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
