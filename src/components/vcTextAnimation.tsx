import { useEffect, useMemo, useRef } from 'react';
import { Animated as AnimatedReact, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
interface IProgs {
    text: string,
    heightDrop?: number,
    textStyle?: StyleProp<TextStyle>,
    style?: StyleProp<ViewStyle>
}
export const TextDrop = ({ text, heightDrop = 200, textStyle, style }: IProgs) => {
    const { colors } = useTheme();
    const letters = useMemo(() => {
        return text.split("").map(char => ({
            char,
            color: randomColor()
        }));
    }, [text]);

    return (
        <View
            style={[{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
                // paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: colors.elevation.level5
            }, style]}
        >
            {letters.map((item, index) => (
                <AnimatedChar
                    key={index}
                    char={item.char}
                    color={item.color}
                    delay={index * 150}
                    heightDrop={heightDrop}
                    textStyle={textStyle}
                />
            ))}
        </View>
    );
};

const AnimatedChar = ({ char, color, delay, heightDrop, textStyle }: {
    char: string;
    color: string;
    delay: number;
    heightDrop: number;
    textStyle?: StyleProp<TextStyle>
}) => {
    const translateY = useSharedValue(-1 * heightDrop);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withSpring(0, {
                damping: 6,
                stiffness: 120,
            })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Text
                variant="displayMedium"
                style={[{
                    fontWeight: 'bold',
                    color,
                    fontSize: 30,
                }, textStyle]}
            >
                {char}
            </Text>
        </Animated.View>
    );
};


function randomColor() {
    // Hue từ 0 - 360 (vòng màu)
    const hue = Math.floor(Math.random() * 360);
    // Saturation ~ 90% để màu tươi
    const saturation = 90;
    // Lightness ~ 50% để màu đậm, không bị tối
    const lightness = 50;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

interface Props {
    text: string;
    delayPerChar?: number; // ms
    style?: StyleProp<TextStyle>
}

export const TextZoomIn: React.FC<Props> = ({ text, style, delayPerChar = 50 }) => {
    const { colors } = useTheme();
    const chars = text.split('');
    const animations = useRef(
        chars.map(() => ({
            scale: new AnimatedReact.Value(2),
            opacity: new AnimatedReact.Value(0),
        }))
    ).current;

    useEffect(() => {
        const anims = animations.map((anim, i) =>
            AnimatedReact.sequence([
                AnimatedReact.delay(i * delayPerChar),
                AnimatedReact.parallel([
                    AnimatedReact.timing(anim.scale, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    AnimatedReact.timing(anim.opacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        AnimatedReact.stagger(delayPerChar / 2, anims).start();
    }, [animations, delayPerChar]);

    return (
        <View style={styles.row}>
            {chars.map((char, i) => (
                <AnimatedReact.Text
                    key={i}
                    style={[
                        styles.char,
                        {
                            transform: [{ scale: animations[i].scale }],
                            opacity: animations[i].opacity,
                            color: colors.secondary
                        },
                        style
                    ]}
                >
                    {char}
                </AnimatedReact.Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "center",
        paddingHorizontal: 20
    },
    char: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000'
    },
});
