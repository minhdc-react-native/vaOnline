import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withRepeat,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SquareLoader = () => {
    const progress = useSharedValue(0);
    const { colors } = useTheme();
    // Animate progress 0 -> 1 and repeat
    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration: 2000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const size = 50;
    const perimeter = 4 * size;
    const segmentLength = 20;

    const animatedProps = useAnimatedProps(() => {
        const offset = progress.value * perimeter;
        return {
            strokeDashoffset: -offset,
        };
    });
    const radius = 10;
    const roundedPath = `
        M25,0
        H${size - radius}
        A${radius},${radius} 0 0 1 ${size},${radius}
        V${size - radius}
        A${radius},${radius} 0 0 1 ${size - radius},${size}
        H${radius}
        A${radius},${radius} 0 0 1 0,${size - radius}
        V${radius}
        A${radius},${radius} 0 0 1 ${radius},0
        Z
    `;
    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={require('@/assets/images/icon.png')} // 🔁 Replace with your PNG
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <Svg width={size} height={size} style={styles.svg}>
                <AnimatedPath
                    d={roundedPath}
                    // d="M0 0 H50 V50 H0 Z"
                    stroke={colors.primary}
                    strokeWidth={2}
                    strokeDasharray={`${segmentLength}, ${perimeter}`}
                    animatedProps={animatedProps}
                    fill="none"
                    strokeLinecap="butt"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    imageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 10,       // 👈 Đặt độ bo góc tại đây
        overflow: 'hidden',     // 👈 Rất quan trọng để bo thật
        position: 'absolute',
    },
    container: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        position: 'absolute',
        // opacity: 0.7
    },
    svg: {
        position: 'absolute',
    },
});

export default SquareLoader;
