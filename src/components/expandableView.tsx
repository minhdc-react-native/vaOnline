import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ViewStyle,
    StyleProp,
    TextStyle,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableViewProps {
    title: string | React.ReactNode;
    children: React.ReactNode;
    icon?: React.ReactNode;
    defaultExpanded?: boolean;
    expanded?: boolean; // controlled
    onToggle?: (value: boolean) => void;
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>;
    styleHeader?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>,
    type?: 'top' | 'bottom',
    disable?: boolean
}

const ExpandableView: React.FC<ExpandableViewProps> = ({
    title,
    children,
    icon,
    defaultExpanded = false,
    expanded,
    onToggle,
    style,
    containerStyle,
    styleHeader,
    titleStyle,
    type = "top",
    disable = false
}) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isControlled = expanded !== undefined;
    const isExpanded = isControlled ? expanded : internalExpanded;
    const { colors } = useTheme();
    const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (!isControlled) {
            setInternalExpanded(!isExpanded);
        }
        onToggle?.(!isExpanded);
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={[styles.container, style]}>
            {isExpanded && type === "bottom" && <View style={styles.content}>{children}</View>}
            <TouchableOpacity onPress={toggleExpand} style={[styles.header, styleHeader]} disabled={disable}>
                {typeof title === "string" ? <Text style={[styles.title, titleStyle]}>{title}</Text> : title}
                {!disable && <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    {icon || <MaterialCommunityIcons name="chevron-down" size={24} color="#333" />}
                </Animated.View>}
            </TouchableOpacity>
            {isExpanded && type === "top" && <View style={[styles.content, containerStyle]}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%', // chiếm toàn bộ chiều rộng màn hình
        marginVertical: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    title: {
        // fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        // padding: 12,
        backgroundColor: '#fff',
    },
});

export default ExpandableView;
