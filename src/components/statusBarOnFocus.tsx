import React from 'react';
import { setStatusBarBackgroundColor, setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

type Props = {
    backgroundColor?: string;
    style?: "light" | "dark" | "auto";
};

export const StatusBarOnFocus = ({ backgroundColor, style = "auto" }: Props) => {
    const { colors } = useTheme();
    useFocusEffect(
        React.useCallback(() => {
            // Cập nhật màu khi tab được focus
            setStatusBarBackgroundColor(backgroundColor ?? colors.background, true); // animated = true
            setStatusBarStyle(style, true);

            return () => {
                // (Tuỳ chọn) Reset trạng thái nếu cần khi blur
                // setStatusBarBackgroundColor('defaultColor');
                // setStatusBarStyle('light');
            };
        }, [backgroundColor, style])
    );

    return null; // Không cần render <StatusBar />
};
