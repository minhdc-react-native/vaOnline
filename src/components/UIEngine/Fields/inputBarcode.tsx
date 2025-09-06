import ScannerCode from "@/components/ScannerCode";
import { useTranslation } from "@/context/TranslationContext";
import { VACOMTheme } from "@/theme/theme";
import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

interface IProps {
    value: any;
    label?: string;
    disabled?: boolean,
    setValue: (value: any) => void;
    handleBlur?: (prevValue: React.RefObject<any>) => void;
    style?: StyleProp<ViewStyle>;
    msgError?: string;
}
const InputBarcodeComponent: React.FC<IProps> = ({
    value,
    label,
    disabled,
    setValue,
    handleBlur,
    style,
    msgError
}) => {
    const prevValue = useRef(value);
    const { colors } = useTheme<VACOMTheme>();
    const { _ } = useTranslation();
    const [scannerVisible, setScannerVisible] = useState(false);
    const onHandleBlur = () => {
        handleBlur?.(prevValue);
    }
    return (
        <View style={style}>
            <TextInput
                label={
                    value ? (
                        _(label ?? "")
                    ) : (
                        <Text style={{ color: "rgba(59, 45, 43, 0.4)" }}>
                            {_(label ?? "")}
                        </Text>
                    )
                }
                mode="outlined"
                disabled={disabled}
                readOnly={disabled}
                onBlur={onHandleBlur}
                value={value}
                right={<TextInput.Icon icon="barcode-scan" onPress={() => !disabled && setScannerVisible(!scannerVisible)} color={colors.secondary} />}
                onChangeText={setValue}
                outlineStyle={{
                    borderWidth: 0.5,
                    margin: 0,
                    backgroundColor: disabled
                        ? colors.elevation.level1
                        : colors.background,
                    borderColor: "rgba(119, 86, 81,0.3)",
                }}
                style={{ height: 40, top: -1 }}
            />
            {msgError !== undefined && (
                <View
                    style={[
                        styles.tooltip,
                        {
                            borderColor: colors.vacom.borderColor,
                            backgroundColor: "rgb(255, 218, 214)",
                        },
                    ]}
                >
                    <Text style={styles.tooltipText}>{msgError}</Text>
                </View>
            )}
            {scannerVisible && <ScannerCode scannerVisible={scannerVisible} setScannerVisible={setScannerVisible} continuous={false} onScanned={setValue} />}
        </View>
    );
}

export const InputBarcode = React.memo(InputBarcodeComponent);

const styles = StyleSheet.create({
    tooltip: {
        position: "absolute",
        bottom: -4,
        right: 0,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 0.2,
    },
    tooltipText: {
        fontSize: 10,
    },
});
