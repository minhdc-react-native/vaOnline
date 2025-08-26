import { useTranslation } from '@/context/TranslationContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TextInput, useTheme } from 'react-native-paper';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface PopupContentProps {
    title?: string;
    message?: string;
    backgroundColor?: string;
    textColor?: string;
    iconType?: 'success' | 'warning' | 'error' | 'info' | 'question' | 'none';
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputDefaultValue?: string;
    showInput?: boolean;
    onConfirm?: (inputText: string) => void;
    onCanCel?: () => void;
    onClose?: () => void;
    showView?: React.ReactNode | (() => React.ReactNode);
    timeExit?: number;
    color?: string;
}

export const PopupContent = ({
    title,
    message,
    backgroundColor = '#fff',
    textColor = '#000',
    iconType = 'none',
    confirmText,
    cancelText,
    showCancel = false,
    inputLabel = '',
    inputPlaceholder = '',
    inputDefaultValue = '',
    showInput = false,
    onConfirm,
    onCanCel,
    onClose,
    showView,
    timeExit,
    color
}: PopupContentProps) => {
    const { _ } = useTranslation();
    const { colors } = useTheme();
    const getIconColor = {
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3",
        question: "#9C27B0",
        none: colors.primary
    }

    // Reanimated values
    const translateY = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    const iconScale = useSharedValue(0);

    const [inputText, setInputText] = useState(inputDefaultValue);

    useEffect(() => {
        // animate in
        scale.value = withSpring(1);
        opacity.value = withTiming(1, { duration: 200 });
        iconScale.value = withTiming(1, { duration: 500 });

        if (timeExit) {
            const timer = setTimeout(() => {
                closeWithAnimation();
            }, (timeExit + 2) * 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        setInputText(inputDefaultValue);
    }, [inputDefaultValue]);

    const closeWithAnimation = () => {
        opacity.value = withTiming(0, { duration: 200 }, () => {
            onClose && runOnJS(onClose)();
        });
    };

    // Gesture Pan
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (event.translationY > 100) {
                translateY.value = withTiming(height, { duration: 200 }, () => {
                    onClose && runOnJS(onClose)();
                });
            } else {
                translateY.value = withSpring(0);
            }
        });

    // Animated styles
    const popupStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
        marginBottom: 10,
    }));

    const getIcon = () => {
        let iconName: "checkmark-circle" | "warning" | "close-circle" | "information-circle" | "help-circle" | null = null;
        const iconColor = color || getIconColor[iconType];
        switch (iconType) {
            case 'success':
                iconName = 'checkmark-circle';
                break;
            case 'warning':
                iconName = 'warning';
                break;
            case 'error':
                iconName = 'close-circle';
                break;
            case 'info':
                iconName = 'information-circle';
                break;
            case 'question':
                iconName = 'help-circle';
                break;
            default:
                return null;
        }

        return (
            <Animated.View style={iconStyle}>
                {iconName && <Ionicons name={iconName} size={100} color={iconColor} />}
            </Animated.View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={closeWithAnimation}>
            <View style={styles.overlay}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.popupContainer, { backgroundColor }, popupStyle]}>
                        <View style={styles.dragIndicator} />
                        {typeof showView === 'function' ? showView() : showView ?? (
                            <>
                                <View style={{ alignItems: "center" }}>
                                    {getIcon()}
                                </View>

                                {/* Tiêu đề */}
                                {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}

                                {/* Nội dung */}
                                {message && <Text style={[styles.message, { color: textColor }]}>{message}</Text>}

                                {/* Input */}
                                {showInput && (
                                    <TextInput
                                        mode="outlined"
                                        label={inputLabel}
                                        placeholder={inputPlaceholder}
                                        value={inputText}
                                        onChangeText={setInputText}
                                    />
                                )}
                                {/* Nút xác nhận */}
                                <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                                    {showCancel && <Pressable
                                        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                        onPress={() => {
                                            closeWithAnimation();
                                            onCanCel?.();
                                        }}
                                    >
                                        <Text style={{ padding: 5, borderRadius: 6, borderWidth: 1, borderColor: getIconColor[iconType] }}>
                                            {cancelText || _('KHONG')}
                                        </Text>
                                    </Pressable>}
                                    <Pressable
                                        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                        onPress={() => {
                                            closeWithAnimation();
                                            onConfirm?.(inputText);
                                        }}>
                                        <Text style={{ padding: 5, borderRadius: 6, backgroundColor: getIconColor[iconType], borderWidth: 0, color: colors.background }}>
                                            {confirmText || _('CO')}
                                        </Text>
                                    </Pressable>

                                </View>
                            </>
                        )}
                    </Animated.View>
                </GestureDetector>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width,
        height: height + 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        elevation: 3,
    },
    popupContainer: {
        width: width * 0.8,
        paddingTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    dragIndicator: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 10,
    },
});
