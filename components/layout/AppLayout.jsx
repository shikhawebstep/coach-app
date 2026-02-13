import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Footer from './Footer';

export default function AppLayout({ children, title, showBack = false, showFooter = true }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header title={title} showBack={showBack} />
                <View style={styles.content}>
                    {children}
                </View>
                {showFooter && <Footer />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
