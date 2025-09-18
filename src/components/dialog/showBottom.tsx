import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { customText, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Text = customText<'customVariant'>();
const HEIGHT_WINDOW = Dimensions.get("window").height;
interface IProgs {
    children: React.ReactNode;
    hideCalendar: () => void;
    style?: StyleProp<ViewStyle>
}
// thêm vào cho hết warning
export default function ShowBottom({ children, hideCalendar, style }: IProgs) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const slideAnim = useRef(new Animated.Value(HEIGHT_WINDOW)).current;
    const [containHeight, setContainHeight] = useState<number>(0);
    const setHeight = (height: number) => {
        if (containHeight !== height) setContainHeight(height);
    }
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
        <Portal>
            <View style={[styles.backdrop, { backgroundColor: colors.backdrop, marginBottom: insets.bottom }, style]}>
                <Pressable onPress={closePanel}>
                    <View style={{ height: HEIGHT_WINDOW - containHeight }} />
                </Pressable>
                <Animated.View style={[styles.panel, {
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: colors.surface, padding: 20
                }]} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
                    {children}
                </Animated.View>
            </View>
        </Portal>
    );
};

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