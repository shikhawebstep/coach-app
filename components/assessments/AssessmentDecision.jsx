import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

const CONGRATS_IMG = require('@/assets/images/congrats.png');
const FAILED_IMG = require('@/assets/images/failed.png');

export default function AssessmentDecision({ onBack, onComplete }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [decision, setDecision] = useState(null);

    const isPass = decision === 'pass';
    const isFail = decision === 'fail';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0E0E14' : '#F4F6FB' }]}>

            {/* ── Title ── */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#F3F4F6' : '#111827' }]}>
                    Final Decision
                </Text>
                <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Select the candidate's result to complete the assessment.
                </Text>
            </View>

            {/* ── Cards Row ── */}
            <View style={styles.cardsRow}>

                {/* Pass Card */}
                <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => setDecision('pass')}
                    style={[
                        styles.card,
                        styles.passCard,
                        { backgroundColor: isDark ? '#1A2B1E' : '#FFFFFF' },
                        isPass && styles.passCardActive,
                    ]}
                >
                    <Image source={CONGRATS_IMG} style={styles.cardImage} resizeMode="contain" />
                    <Text style={styles.passCardTitle}>Congratulations</Text>
                    <Text style={[styles.cardDesc, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        Candidate has met{'\n'}all the standards
                    </Text>
                    <TouchableOpacity
                        style={[styles.cardBtn, styles.passBtn, isPass && styles.passBtnActive]}
                        onPress={() => setDecision('pass')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.cardBtnText}>
                            {isPass ? '✓ Selected' : 'Mark as Pass'}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Fail Card */}
                <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => setDecision('fail')}
                    style={[
                        styles.card,
                        styles.failCard,
                        { backgroundColor: isDark ? '#2B1A1A' : '#FFFFFF' },
                        isFail && styles.failCardActive,
                    ]}
                >
                    <Image source={FAILED_IMG} style={styles.cardImage} resizeMode="contain" />
                    <Text style={styles.failCardTitle}>Failed</Text>
                    <Text style={[styles.cardDesc, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        Candidate did not{'\n'}meet expectations
                    </Text>
                    <TouchableOpacity
                        style={[styles.cardBtn, styles.failBtn, isFail && styles.failBtnActive]}
                        onPress={() => setDecision('fail')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.cardBtnText}>
                            {isFail ? '✓ Selected' : 'Mark as Fail'}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

            </View>

            {/* ── Spacer ── */}
            <View style={{ flex: 1 }} />

            {/* ── Bottom CTA ── */}
            <View style={styles.bottomContainer}>
                {!decision && (
                    <Text style={[styles.hintText, { color: isDark ? '#4B5563' : '#9CA3AF' }]}>
                        Tap a card above to select a result
                    </Text>
                )}
                <TouchableOpacity
                    style={[
                        styles.ctaButton,
                        isPass && styles.ctaPass,
                        isFail && styles.ctaFail,
                        !decision && { backgroundColor: isDark ? '#2A2A38' : '#D1D5DB' },
                    ]}
                    onPress={onComplete}
                    disabled={!decision}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaText}>
                        {isPass
                            ? 'Invite to CoachPro'
                            : isFail
                            ? 'Complete Assessment'
                            : 'Select a Decision'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 28,
    },

    /* Header */
    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Urbanist_700Bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        textAlign: 'center',
        lineHeight: 21,
    },

    /* Cards */
    cardsRow: {
        flexDirection: 'row',
        gap: 14,
    },
    card: {
        flex: 1,
        borderRadius: 24,
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: 14,
        alignItems: 'center',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    passCard: {
        borderColor: '#D1FAE5',
    },
    passCardActive: {
        borderColor: '#10B981',
        shadowColor: '#10B981',
        shadowOpacity: 0.25,
    },
    failCard: {
        borderColor: '#FEE2E2',
    },
    failCardActive: {
        borderColor: '#EF4444',
        shadowColor: '#EF4444',
        shadowOpacity: 0.25,
    },
    cardImage: {
        width: 110,
        height: 110,
        marginBottom: 14,
    },
    passCardTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 6,
    },
    failCardTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 18,
    },

    /* Card Buttons */
    cardBtn: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',
    },
    passBtn: {
        backgroundColor: '#D1FAE5',
    },
    passBtnActive: {
        backgroundColor: '#10B981',
    },
    failBtn: {
        backgroundColor: '#FEE2E2',
    },
    failBtnActive: {
        backgroundColor: '#EF4444',
    },
    cardBtnText: {
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
    },

    /* Bottom CTA */
    bottomContainer: {
        paddingBottom: 36,
        paddingTop: 16,
        alignItems: 'center',
    },
    hintText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        marginBottom: 10,
    },
    ctaButton: {
        width: '100%',
        paddingVertical: 17,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaPass: {
        backgroundColor: '#10B981',
    },
    ctaFail: {
        backgroundColor: '#EF4444',
    },
    ctaText: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
        letterSpacing: 0.2,
    },
});
