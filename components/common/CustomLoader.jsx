import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function CustomLoader({ size = 80, color = '#F7D02A' }) {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const radius = size / 2;
    // 8 dots with varying diameters, scaled to match the proportion of the image
    const dotSizes = [18, 14, 11, 8.5, 6.5, 4.8, 3.5, 2.2];
    
    const scaleFactor = size / 80;
    const scaledDotSizes = dotSizes.map(d => d * scaleFactor);

    // Positions on a circle of radius R (e.g., R = size * 0.35)
    const R = size * 0.32;
    const dots = Array.from({ length: 8 }).map((_, index) => {
        // Offset by -Math.PI / 2 to start the largest dot at the top
        const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
        const dotSize = scaledDotSizes[index];
        const x = radius + R * Math.cos(angle) - dotSize / 2;
        const y = radius + R * Math.sin(angle) - dotSize / 2;

        return {
            x,
            y,
            size: dotSize,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[styles.spinner, { width: size, height: size, transform: [{ rotate }] }]}>
                {dots.map((dot, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                left: dot.x,
                                top: dot.y,
                                width: dot.size,
                                height: dot.size,
                                borderRadius: dot.size / 2,
                                backgroundColor: color,
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        position: 'relative',
    },
    dot: {
        position: 'absolute',
    },
});
