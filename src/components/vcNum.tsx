import { useDataApp } from '@/hooks/zustand/useDataApp';
import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DimensionValue, Keyboard, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { IconButton, TextInput, useTheme } from 'react-native-paper';
import { usePopup } from './dialog/popupProvider';
import { useToast } from './dialog/useToast';


const keys = [
    ['7', '8', '9', '-'],
    ['4', '5', '6', 'CE'],
    ['1', '2', '3', '⌫'],
    ['0', '000', ',', 'OK'],
];

interface NumericInputProps {
    label?: string,
    value: number | null | undefined;
    onChange: (val: number | null) => void;
    typeFormat?: IRoundNumber;
    locale?: 'vi-VN' | 'en-US';
    mode?: 'default' | 'line',
    left?: React.ReactNode;
    right?: React.ReactNode,
    showMinusPlus?: boolean,
    style?: StyleProp<ViewStyle>,
    outlineStyle?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
    width?: DimensionValue | undefined,
    height?: DimensionValue | undefined,
    iconColors?: { minus: string | undefined, plus: string | undefined }
    disabled?: boolean;
    minValue?: number;
    maxValue?: number;
    isError?: boolean
}

const ViewComponent: React.FC<NumericInputProps> = ({
    label,
    value,
    onChange,
    typeFormat = 'rAmount',
    locale = "vi-VN",
    mode = 'default',
    left,
    right,
    showMinusPlus,
    style,
    outlineStyle,
    textStyle,
    width,
    height,
    disabled,
    minValue,
    maxValue,
    iconColors,
    isError
}) => {
    const defaultIconColors = useMemo(() => ({ minus: "red", plus: "blue" }), []);
    iconColors = iconColors || defaultIconColors;
    const paramSystem = useDataApp((state) => state.paramSystem);
    const { showPopup } = usePopup();
    const decimalLimit = paramSystem?.[typeFormat] ?? 0;
    const inputRef = useRef<any>(null);
    const { colors } = useTheme<VACOMTheme>();
    const { showToast } = useToast();
    const messMinMaxValue = useMemo(() => {
        return `Giới hạn: ${minValue !== undefined ? ` nhỏ nhất ${minValue}` : ''} ${maxValue !== undefined ? `, lớn nhất ${maxValue}` : ''}`;
    }, [minValue, maxValue])
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
    }), [locale]);

    const handleMinusPlus = useCallback((add: 1 | -1) => {
        let newValue = (value ?? 0) + add;
        if ((minValue !== undefined && newValue < minValue) || (maxValue !== undefined && newValue > maxValue)) {
            showToast(messMinMaxValue, { type: "warning" });
            return;
        }
        onChange(newValue);
    }, [value, minValue, maxValue, onChange, showToast, messMinMaxValue]);
    return (
        <>
            <View style={[{
                flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                borderWidth: showMinusPlus ? 0.5 : 0, borderColor: colors.vacom.borderColor, borderRadius: 6, height: height ?? (showMinusPlus || mode === "line" ? 35 : 48)
            }, showMinusPlus && { backgroundColor: disabled ? colors.elevation.level1 : colors.background }, width ? { width: width } : {}, style]}>
                {showMinusPlus && <IconButton icon="minus" iconColor={iconColors.minus} size={20} onPress={() => handleMinusPlus(-1)} style={{ margin: 0, padding: 0 }} />}
                <Pressable
                    onPress={() => {
                        if (disabled) return;
                        Keyboard.dismiss();
                        showPopup({ showView: () => (<KeyBoardNumber value={value} onChange={onChange} locale={locale} decimalLimit={decimalLimit} minValue={minValue} maxValue={maxValue} />) });
                    }}
                    style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}
                >
                    <TextInput
                        mode='outlined'
                        ref={inputRef}
                        // label={label}
                        label={label && <Text style={{ color: Helper.isEmpty(value) ? colors.backdrop : colors.onSurface }}>{label}</Text>}
                        value={value || value === 0 ? numberFormatter.format(value) : ''}
                        // textColor={value && value < 0 ? "red" : "black"}
                        // onFocus={() => setVisible(true)}
                        showSoftInputOnFocus={false}
                        // disabled={disabled}
                        disabled={true}
                        left={left}
                        right={right}
                        pointerEvents="none" // Chặn sự kiện touch trực tiếp lên input
                        outlineStyle={[
                            { borderWidth: 0.5, backgroundColor: disabled ? colors.elevation.level1 : colors.background, borderColor: isError ? colors.error : colors.vacom.borderColor },
                            (mode === "line" || showMinusPlus) && { backgroundColor: "transparent", borderWidth: 0, borderBottomWidth: mode === "line" ? 0.5 : 0 },
                            outlineStyle
                        ]}
                        contentStyle={[
                            { textAlign: showMinusPlus ? 'center' : 'right' },
                            { color: value && value < 0 ? colors.primary : (typeof textStyle === 'object' && textStyle !== null && 'color' in textStyle ? (textStyle as TextStyle).color : undefined) },
                            showMinusPlus && { marginLeft: -15, marginRight: -15 }
                        ]}
                        style={[
                            { height: 35, flex: 1 }, textStyle
                        ]}
                    />
                </Pressable>
                {showMinusPlus && <IconButton icon="plus" iconColor={iconColors.plus} size={20} onPress={() => handleMinusPlus(1)} style={{ margin: 0, padding: 0 }} />}
            </View>
        </>
    );
};
export const VcNum = React.memo(ViewComponent);

interface IProgs {
    value: number | null | undefined;
    onChange: (val: number | null) => void;
    locale: 'vi-VN' | 'en-US';
    decimalLimit: number;
    minValue?: number;
    maxValue?: number;
}
const KeyBoardNumber = ({ value, onChange, locale, decimalLimit, minValue, maxValue }: IProgs) => {
    const convertValue = useCallback((value: number | null | undefined) => {
        const sValue = value?.toString();
        if (!sValue) return '';
        if (locale === 'vi-VN') {
            return sValue.replace(/\./g, ',');
        } else {
            // en-US
            return sValue;
        }
    }, []);
    const [tempValue, setTempValue] = useState(convertValue(value));
    const { colors } = useTheme();
    const { showToast } = useToast();
    const { hidePopup } = usePopup();
    const messMinMaxValue = useMemo(() => {
        return `Giới hạn: ${minValue !== undefined ? ` nhỏ nhất ${minValue}` : ''} ${maxValue !== undefined ? `, lớn nhất ${maxValue}` : ''}`;
    }, [minValue, maxValue])
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
    }), [locale]);

    const parseFormattedNumber = (formatted: string) => {
        if (locale === 'vi-VN') {
            return (formatted ?? "").replace(/\./g, '').replace(',', '.');
        } else {
            // en-US
            return (formatted ?? "").replace(/,/g, '');
        }
    };
    const valueTemp = useMemo(() => {
        const parsed = parseFloat(parseFormattedNumber(tempValue));
        if (isNaN(parsed)) {
            return null;
        } else {
            return parsed;
        }
    }, [tempValue]);
    const formatDisplay = useCallback((value: string) => {
        if (!value) return '';
        const hasTrailingComma = value.endsWith(',');
        const isNegative = value.startsWith('-');
        const parsed = parseFloat(parseFormattedNumber(value));
        if (isNaN(parsed)) return isNegative ? '-' : hasTrailingComma ? '0,' : '';

        let formatted = numberFormatter.format(Math.abs(parsed)); // Định dạng số dương

        if (isNegative) {
            formatted = '-' + formatted; // Thêm dấu trừ ở đầu
        }
        return hasTrailingComma ? `${formatted},` : formatted;
    }, []);
    const handleKeyPress = (key: string) => {
        if (key === "," && decimalLimit === 0) return;
        if (key === "-" && minValue !== undefined && minValue >= 0) return;
        if (key === 'OK') {
            const parsed = parseFloat(parseFormattedNumber(tempValue));
            if (isNaN(parsed)) {
                onChange(minValue ?? null);
            } else {
                // Kiểm tra min/max
                if ((minValue !== undefined && parsed < minValue) || (maxValue !== undefined && parsed > maxValue)) {
                    showToast(messMinMaxValue, { type: "warning" });
                    return;
                }
                onChange(parsed);
            }
            closeModal();
        } else if (key === 'CE') {
            setTempValue('');
        } else if (key === '⌫') {
            setTempValue(prev => prev.slice(0, -1));
        } else {
            let newValue = (key === '-' ? key : '') + tempValue + (key !== '-' ? key : '');
            // Replace multiple commas
            const parts = newValue.split(',');

            if (parts.length > 2) return;
            // Check decimal digit limit
            if (parts.length === 2 && parts[1].length > decimalLimit) return;
            // Kiểm tra min/max khi nhập
            const parsed = parseFloat(parseFormattedNumber(newValue));
            if (!isNaN(parsed)) {
                if ((minValue !== undefined && parsed < minValue) || (maxValue !== undefined && parsed > maxValue)) {
                    showToast(messMinMaxValue, { type: "warning" });
                    return;
                }
            }
            setTempValue(newValue);
        }
    };
    const closeModal = () => {
        hidePopup();
    };
    return (
        <View style={styles.popup}>
            <Text style={[styles.display, { color: (valueTemp ?? 0) < 0 ? "red" : "black" }]}>{formatDisplay(tempValue)}</Text>
            {keys.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((key, i) => (
                        <Pressable
                            key={i}
                            style={({ pressed }) => [
                                styles.key, key === 'OK' && { backgroundColor: colors.primary },
                                { opacity: pressed ? 0.6 : 1 } // 👈 hiệu ứng “nhấn chìm” // Màu khi nhấn và không nhấn
                            ]}
                            // style={[styles.key, key === 'OK' && styles.okButton]}
                            onPress={() => key && handleKeyPress(key)}
                        >
                            <Text style={[styles.keyText, key === 'OK' && { color: "#fff" }]}>{key}</Text>
                        </Pressable>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        textAlign: "right"
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
    },
    display: {
        textAlign: 'right',
        fontSize: 28,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderColor: 'gray',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 4,
        justifyContent: 'space-between',
    },
    key: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
    },
    keyText: {
        fontSize: 20,
    }
});
