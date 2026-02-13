import { StyleSheet, Text, View } from 'react-native';

export default function Calendar() {
    return (

        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Overview</Text>
                <Text style={styles.cardContent}>Welcome to your dashboard!</Text>
            </View>

            <View style={styles.grid}>
                <View style={[styles.card, styles.gridItem]}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={[styles.card, styles.gridItem]}>
                    <Text style={styles.statNumber}>48</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardContent: {
        color: '#666',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
    },
    gridItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});
