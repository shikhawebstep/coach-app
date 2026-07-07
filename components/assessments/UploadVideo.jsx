import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        outerCircle: '#93C5FD',
        middleCircle: '#60A5FA',
        innerCircle: '#3B82F6',
        iconBox: '#fff',
        icon: '#3B82F6',
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        outerCircle: '#1E3A5F',
        middleCircle: '#2C5282',
        innerCircle: '#3B82F6',
        iconBox: '#1E1E1E',
        icon: '#60A5FA',
    },
};

export default function UploadVideo({ onBack, onNext }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.headerTitle} />
                </TouchableOpacity> */}
                <Text style={styles.headerTitle}>Upload video</Text>
            </View>

            <View style={styles.centerContent}>
                {/* Ripple Effect Circles */}
                <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                        <TouchableOpacity style={styles.innerCircle}>
                            <View style={styles.iconBox}>
                                <Ionicons name="add" size={32} color={theme.icon} strokeWidth={4} style={styles.plusIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.nextButton} onPress={onNext}>
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
        justifyContent: 'center',
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 26,
        color: theme.headerTitle,
        marginVertical: 24,
        fontFamily: 'Urbanist_700Bold',
        textAlign: 'center'
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: theme.outerCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: theme.middleCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.innerCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: theme.iconBox,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontWeight: '900',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
    },
});