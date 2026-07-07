import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const COLORS = {
    light: {
        background: '#fff',
        title: '#1a1a1a',
        subtitle: '#6B7280',
        cardBg: '#F9FAFB',
        cardBorder: '#E5E7EB',
        icon: '#1a1a1a',
    },
    dark: {
        background: '#121212',
        title: '#F5F5F5',
        subtitle: '#9CA3AF',
        cardBg: '#1E1E1E',
        cardBorder: '#2A2A2A',
        icon: '#F5F5F5',
    },
};

export default function AssessmentDecision({ onBack, onComplete }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [decision, setDecision] = useState(null);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Assessment Result</Text>
                <Text style={styles.subtitle}>Review the candidate's performance and make a final decision.</Text>
                
                <View style={styles.decisionContainer}>
                    <TouchableOpacity 
                        style={[styles.passButton, decision === 'pass' && styles.passSelected]}
                        onPress={() => setDecision('pass')}
                    >
                        <Ionicons name="checkmark-circle" size={32} color={decision === 'pass' ? '#fff' : '#1CAB4B'} />
                        <Text style={[styles.passText, decision === 'pass' && { color: '#fff' }]}>Pass</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.failButton, decision === 'fail' && styles.failSelected]}
                        onPress={() => setDecision('fail')}
                    >
                        <Ionicons name="close-circle" size={32} color={decision === 'fail' ? '#fff' : '#EF4444'} />
                        <Text style={[styles.failText, decision === 'fail' && { color: '#fff' }]}>Fail</Text>
                    </TouchableOpacity>
                </View>
                
                {decision === 'pass' && (
                    <View style={styles.inviteContainer}>
                        <Text style={styles.inviteTitle}>Candidate Passed!</Text>
                        <Text style={styles.inviteDesc}>Would you like to send an invite to CoachPro to begin their onboarding?</Text>
                    </View>
                )}

                {decision === 'fail' && (
                    <View style={styles.inviteContainer}>
                        <Text style={styles.inviteTitle}>Candidate Failed</Text>
                        <Text style={styles.inviteDesc}>The candidate will be notified and removed from the active recruitment pipeline.</Text>
                    </View>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                    style={[styles.completeButton, !decision && { opacity: 0.5 }]} 
                    onPress={onComplete}
                    disabled={!decision}
                >
                    <Text style={styles.completeButtonText}>
                        {decision === 'pass' ? 'Invite to CoachPro' : decision === 'fail' ? 'Complete Assessment' : 'Select a Decision'}
                    </Text>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Urbanist_700Bold',
        color: theme.title,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.subtitle,
        textAlign: 'center',
        marginBottom: 40,
    },
    decisionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 40,
    },
    passButton: {
        flex: 1,
        backgroundColor: theme.cardBg,
        borderWidth: 2,
        borderColor: '#1CAB4B',
        paddingVertical: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    passSelected: {
        backgroundColor: '#1CAB4B',
    },
    passText: {
        color: '#1CAB4B',
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        marginTop: 8,
    },
    failButton: {
        flex: 1,
        backgroundColor: theme.cardBg,
        borderWidth: 2,
        borderColor: '#EF4444',
        paddingVertical: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    failSelected: {
        backgroundColor: '#EF4444',
    },
    failText: {
        color: '#EF4444',
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        marginTop: 8,
    },
    inviteContainer: {
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    inviteTitle: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        color: theme.title,
        marginBottom: 8,
    },
    inviteDesc: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.subtitle,
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    completeButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
    },
});
