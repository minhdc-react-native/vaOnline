import { VACOMTheme } from '@/theme/theme';
import React from 'react';
import {
    ColorValue,
    Platform,
    RefreshControlProps,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Giúp form không bị che bởi bàn phím
import { useTheme } from 'react-native-paper';
interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
    refreshControl?: React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>> | undefined;
    backgroundColor?: ColorValue | undefined;
    stickyHeaderIndices?: number[]
}

export default function FormWrapper({ children, style, refreshControl, backgroundColor, stickyHeaderIndices }: Props) {
    const { colors } = useTheme<VACOMTheme>();
    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: backgroundColor || colors.vacom.backLayout }}
            contentContainerStyle={[styles.scrollContainer, { backgroundColor: backgroundColor || colors.vacom.backLayout }, style]}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'android' ? 80 : 80}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            stickyHeaderIndices={stickyHeaderIndices}
        >
            {children}
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        marginBottom: Platform.OS === 'android' ? 50 : 20,
    }
});
