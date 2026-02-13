import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthInput({
    label,
    icon,
    error,
    isPassword = false,
    style,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const borderColor = error
        ? '#FF453A'
        : isFocused
            ? Colors.light.primary
            : '#E5E5EA';

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, { borderColor }]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? Colors.light.primary : '#8E8E93'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#8E8E93"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#8E8E93"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#fff',
        opacity: 0.9,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#000',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    errorText: {
        color: '#FF453A',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
