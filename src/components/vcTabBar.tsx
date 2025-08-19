import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface IProgs {
    value: string | number | null,
    data: IData[],
    onPress: (value: IData) => void,
    style?: StyleProp<ViewStyle>;
}
export const VcTabBar = ({ value, data, onPress, style }: IProgs) => {
    const { colors } = useTheme();
    const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});
    const scrollRef = useRef<ScrollView>(null);
    const [widthView, setWidthView] = useState<number>(0);
    const setScroll = (item: IData) => {
        const layout = tabLayouts.current[item.id];
        const scrollView = scrollRef.current;
        if (layout && scrollView) {
            const { x, width } = layout;
            const targetScrollX = x + width / 2 - widthView / 2;
            scrollView.scrollTo({ x: Math.max(0, targetScrollX), animated: true });
        }
    }
    const onTabPress = (item: IData) => {
        onPress(item);
        setScroll(item);
    };
    useEffect(() => {
        if (value) {
            const item = data.find(i => i.id === value)
            if (item) setScroll(item);
        }
    }, [widthView, value]);

    return (
        <View style={[{ height: 50, backgroundColor: colors.background, borderRadius: 20, borderWidth: 0.5, borderColor: colors.backdrop }, style]} onLayout={(event: LayoutChangeEvent) => {
            const { x, width } = event.nativeEvent.layout;
            setWidthView(width);
        }}>
            <ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBarScroll}
            >
                {data.map((item, i) => {
                    const isFocused = item.id === value;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.tabItem}
                            onPress={() => onTabPress(item)}
                            onLayout={(event: LayoutChangeEvent) => {
                                const { x, width } = event.nativeEvent.layout;
                                tabLayouts.current[item.id] = { x, width };
                            }}
                        >
                            <Text style={[styles.tabText, isFocused && [styles.activeTabText, { color: colors.background, backgroundColor: colors.primary }]]}>
                                {item.value}
                            </Text>
                            {/* {isFocused && <View style={{ width: "100%", borderWidth: 1, borderColor: colors.primary }} />} */}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tabItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10
    },
    tabText: {
        fontSize: 14,
        color: '#999',
    },
    activeTabText: {
        // fontWeight: 'bold',
        textAlign: "center",
        padding: 5,
        borderRadius: 10
    }
});