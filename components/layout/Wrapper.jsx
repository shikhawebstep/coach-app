import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

export default function Wrapper({ children, backgroundColor = '#fff' }) {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});
