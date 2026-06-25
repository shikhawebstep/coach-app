import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadVideo({ onBack, onNext }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity> */}
                <Text style={styles.headerTitle}>Upload video</Text>
            </View>

            <View style={styles.centerContent}>
                {/* Ripple Effect Circles */}
                <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                        <TouchableOpacity style={styles.innerCircle}>
                            <View style={styles.iconBox}>
                                <Ionicons name="add" size={32} color="#3B82F6" strokeWidth={4} style={styles.plusIcon} />
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
        justifyContent:'center',
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        color: '#1a1a1a',
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
        backgroundColor: '#93C5FD', // Lightest blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: '#60A5FA', // Mid blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#3B82F6', // Dark blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
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
