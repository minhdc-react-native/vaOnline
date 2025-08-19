import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const PADDING = 16;

interface IItem {
    id: string | number;
    value: string;
}

interface IProgs {
    data: IItem[];
    value?: string | number | null | undefined;
    fId?: string; fValue?: string;
    onChange?: (value: IItem) => void;
    containerStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    disabled?: boolean
}

const VcSelector = ({ data, value, fId = 'id', fValue = 'value', onChange, containerStyle, itemStyle, disabled }: IProgs) => {
    const { colors } = useTheme();

    const [wrapperWidth, setWrapperWidth] = useState(0);

    const itemWidth = useMemo(() => {
        if (!data?.length || !wrapperWidth) return 0;
        return wrapperWidth / data.length;
    }, [data?.length, wrapperWidth]);

    // index ban đầu theo value (fallback về 0 nếu không tìm thấy)
    const initialIndex = Math.max(0, data.findIndex((item: any) => item[fId] === value));
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    const translateX = useSharedValue(initialIndex * itemWidth);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const onSelect = (index: number) => {
        if (disabled) return;
        setSelectedIndex(index);
        onChange?.(data[index]);
    };

    // Khi value từ cha đổi -> cập nhật selectedIndex
    useEffect(() => {
        const newIndex = Math.max(0, data.findIndex((item: any) => item[fId] === value));
        setSelectedIndex(newIndex);
    }, [value, data]);

    // Khi selectedIndex hoặc itemWidth đổi -> animate slider
    useEffect(() => {
        translateX.value = withTiming(selectedIndex * itemWidth, { duration: 250 });
    }, [selectedIndex, itemWidth, translateX]);

    const onWrapperLayout = (e: LayoutChangeEvent) => {
        setWrapperWidth(e.nativeEvent.layout.width);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[styles.wrapper, { backgroundColor: colors.background }]}
                onLayout={onWrapperLayout}
            >
                {/* slider */}
                <Animated.View
                    style={[
                        styles.slider,
                        animatedStyle,
                        {
                            width: itemWidth,
                            borderColor: colors.primary,
                            backgroundColor: colors.elevation.level2,
                        },
                    ]}
                />
                {data.map((item: any, index) => (
                    <Pressable
                        key={String(item[fId]) || String(index)}
                        style={[styles.item, { width: itemWidth }, itemStyle]}
                        onPress={() => onSelect(index)}
                        disabled={itemWidth === 0}
                    >
                        <Text
                            style={[
                                styles.text,
                                index === selectedIndex && styles.textActive,
                                index === selectedIndex && { color: colors.primary },
                            ]}
                            numberOfLines={1}
                        >
                            {item[fValue]}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        marginTop: 12,
    },
    wrapper: {
        flexDirection: 'row',
        borderRadius: 5,
        position: 'relative',
        overflow: 'hidden',
        // Không set width ở đây để nó tự lấy theo cha
    },
    item: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    text: {
        color: '#333',
        fontWeight: '500',
    },
    textActive: {
        fontWeight: 'bold',
    },
    slider: {
        position: 'absolute',
        height: '100%',
        borderRadius: 5,
        zIndex: 0,
        borderWidth: StyleSheet.hairlineWidth,
    },
});

export default VcSelector;
