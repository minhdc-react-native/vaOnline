import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const HEIGHT_WINDOW = Dimensions.get("window").height;
interface IProgs {
    children: React.ReactNode;
    hideCalendar: () => void;
    style?: StyleProp<ViewStyle>;
    position?: "bottom" | "center"; // thêm prop
}

export default function ShowBottom({ children, hideCalendar, style, position = "bottom" }: IProgs) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const slideAnim = useRef(new Animated.Value(HEIGHT_WINDOW)).current;
    const [containHeight, setContainHeight] = useState<number>(0);

    const setHeight = (height: number) => {
        if (containHeight !== height) setContainHeight(height);
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const closePanel = () => {
        Animated.timing(slideAnim, {
            toValue: HEIGHT_WINDOW,
            duration: 200,
            useNativeDriver: true,
        }).start(() => hideCalendar());
    };

    return (
        <View style={[
            styles.backdrop,
            { backgroundColor: colors.backdrop, marginBottom: insets.bottom }
        ]}>
            <Pressable onPress={closePanel} style={{ flex: 1 }} />

            <Animated.View
                style={[
                    styles.panel,
                    {
                        backgroundColor: colors.surface,
                        padding: 20,
                        alignSelf: position === "center" ? "center" : "stretch",
                        position: position === "center" ? "absolute" : "relative",
                        bottom: position === "center" ? undefined : 0,
                        top: position === "center" ? (HEIGHT_WINDOW - containHeight) / 2 : undefined,
                        transform: position === "center"
                            ? [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, HEIGHT_WINDOW],
                                    outputRange: [0, HEIGHT_WINDOW / 2]
                                })
                            }]
                            : [{ translateY: slideAnim }],
                    },
                    style
                ]}
                onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
            >
                {children}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
    },
    panel: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    }
});