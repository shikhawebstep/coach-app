import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 120;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PercentageBar = ({ percentage = 75 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [CIRCUMFERENCE, 0],
    });

    return (
        <View style={styles.container}>
            <Svg width={SIZE} height={SIZE}>
                {/* Background ring */}
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#2A2F36"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />

                {/* Progress ring */}
                <AnimatedCircle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#F7D02A"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
            </Svg>

            {/* Center text */}
            <View style={styles.center}>
                <Text style={styles.percent}>{percentage}%</Text>
            </View>
        </View>
    );
};

export default PercentageBar;
const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },

    center: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },

    percent: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
