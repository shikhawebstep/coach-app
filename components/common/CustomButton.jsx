import { Colors } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CustomButton({
    title,
    onPress,
    variant = 'primary', // primary, outline, ghost
    loading = false,
    fullWidth = true,
    style = {}
}) {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const backgroundColor = isPrimary ? Colors.light.primary : 'transparent';
    const textColor = isPrimary ? '#000' : (isOutline ? '#fff' : Colors.light.primary);
    const borderColor = isOutline ? '#fff' : 'transparent';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth: isOutline ? 1 : 0,
                    width: fullWidth ? '100%' : 'auto',
                    alignSelf: fullWidth ? 'stretch' : 'center'
                },
                style
            ]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30, // Pill shape
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        minHeight: 56,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
