import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OtherAreas({ onBack }) {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Other areas</Text>

                <View style={styles.inputBlock}>
                    <Text style={styles.label}>Enter top 3 strengths</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="Type here..."
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputBlock}>
                    <Text style={styles.label}>Top 3 areas for improvement</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="Type here..."
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputBlock}>
                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="Type here..."
                        placeholderTextColor="#9ca3af"
                    />
                </View>
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
    inputBlock: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#3B82F6', // Blue color matched
        fontWeight: 'bold',
        marginBottom: 8,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // Gray border
        borderRadius: 12,
        height: 120, // Height for multiline
        padding: 16,
        fontSize: 15,
        color: '#1a1a1a',
        backgroundColor: '#fff',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: '#fff',
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
