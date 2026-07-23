import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const getToastStyles = (colorScheme) => {
    const isDark = colorScheme === 'dark';
    return {
        success: {
            bg: isDark ? '#0F2C1A' : '#F0FDF4',
            border: isDark ? '#22C55E' : '#86EFAC',
            icon: 'checkmark-circle',
            iconColor: isDark ? '#22C55E' : '#16A34A',
            titleColor: isDark ? '#22C55E' : '#166534',
            msgColor: isDark ? '#A7F3D0' : '#14532D',
        },
        error: {
            bg: isDark ? '#2C0F0F' : '#FEF2F2',
            border: isDark ? '#EF4444' : '#FECACA',
            icon: 'close-circle',
            iconColor: isDark ? '#EF4444' : '#DC2626',
            titleColor: isDark ? '#EF4444' : '#991B1B',
            msgColor: isDark ? '#FCA5A5' : '#7F1D1D',
        },
        warning: {
            bg: isDark ? '#2C1F0F' : '#FFFBEB',
            border: isDark ? '#F59E0B' : '#FDE68A',
            icon: 'warning',
            iconColor: isDark ? '#F59E0B' : '#D97706',
            titleColor: isDark ? '#F59E0B' : '#92400E',
            msgColor: isDark ? '#FDE68A' : '#78350F',
        },
        info: {
            bg: isDark ? '#0F1E2C' : '#EFF6FF',
            border: isDark ? '#3B82F6' : '#BFDBFE',
            icon: 'information-circle',
            iconColor: isDark ? '#3B82F6' : '#2563EB',
            titleColor: isDark ? '#3B82F6' : '#1E40AF',
            msgColor: isDark ? '#BFDBFE' : '#1E3A8A',
        },
    };
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
    const colorScheme = useColorScheme();
    const TOAST_TYPES = getToastStyles(colorScheme);
    const style = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
    const translateY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Slide in
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto-dismiss
        const timer = setTimeout(() => dismiss(), toast.duration || 3500);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -120,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss(toast.id));
    };

    return (
        <Animated.View style={[styles.toast, { backgroundColor: style.bg, borderColor: style.border, transform: [{ translateY }], opacity }]}>
            <View style={[styles.iconWrap, { backgroundColor: style.border + '22' }]}>
                <Ionicons name={style.icon} size={24} color={style.iconColor} />
            </View>
            <View style={styles.textWrap}>
                {toast.title && (
                    <Text style={[styles.title, { color: style.titleColor }]} numberOfLines={1}>
                        {toast.title}
                    </Text>
                )}
                <Text style={[styles.message, { color: style.msgColor }]} numberOfLines={3}>
                    {toast.message}
                </Text>
            </View>
            <TouchableOpacity onPress={dismiss} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={18} color={style.msgColor} />
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const counterRef = useRef(0);

    const show = useCallback(({ type = 'info', title, message, duration }) => {
        const id = ++counterRef.current;
        setToasts(prev => [...prev.slice(-2), { id, type, title, message, duration }]);
    }, []);

    const success = useCallback((message, title = 'Success') => show({ type: 'success', title, message }), [show]);
    const error = useCallback((message, title = 'Error') => show({ type: 'error', title, message }), [show]);
    const warning = useCallback((message, title = 'Warning') => show({ type: 'warning', title, message }), [show]);
    const info = useCallback((message, title = 'Info') => show({ type: 'info', title, message }), [show]);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ show, success, error, warning, info }}>
            {children}
            {/* Toast container — rendered above everything */}
            <View style={styles.container} pointerEvents="box-none">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
                ))}
            </View>
        </ToastContext.Provider>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
    },
    toast: {
        width: '100%',
        maxWidth: 440,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        lineHeight: 18,
    },
    closeBtn: {
        padding: 2,
        flexShrink: 0,
    },
});
