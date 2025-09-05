import { useTranslation } from "@/context/TranslationContext";
import { VACOMTheme } from "@/theme/theme";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

interface IProps {
    value: any;
    label?: string;
    disabled: boolean,
    setValue: (value: any) => void;
    handleBlur: (prevValue: React.RefObject<any>) => void;
    texRight?: string;
    icon?: {
        name: string;
        size?: number;
        color?: string;
    };
    typeInput?: "text" | "multi" | "password" | "taxCode";
    style?: StyleProp<ViewStyle>;
    upperCase?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    height?: DimensionValue;
    msgError?: string;
}
const InputFieldComponent: React.FC<IProps> = ({
    value,
    label,
    disabled,
    setValue,
    texRight, icon,
    typeInput,
    handleBlur,
    style,
    upperCase,
    autoCapitalize,
    height,
    msgError
}) => {
    const prevValue = useRef(value);
    const { colors } = useTheme<VACOMTheme>();
    const { _ } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);

    const handleChangeText = useCallback(
        (val: string) => {
            setValue(upperCase && val ? val.toUpperCase() : val);
        },
        [setValue, upperCase]
    );

    const isMulti = typeInput === "multi";
    const isPassword = typeInput === "password";
    const onHandleBlur = () => {
        handleBlur(prevValue);
    }
    const togglePassword = useCallback(
        () => setShowPassword((prev) => !prev),
        []
    );

    const rightFix = useMemo(() => {
        if (isPassword) {
            return (
                <TextInput.Icon
                    icon={showPassword ? "eye" : "eye-off"}
                    onPress={togglePassword}
                    color={"rgb(119, 86, 81)"}
                />
            );
        }
        if (texRight) {
            return (
                <TextInput.Affix
                    text={`${texRight}`}
                    textStyle={{ color: colors.secondary }}
                />
            );
        }
        return undefined;
    }, [isPassword, showPassword, togglePassword, texRight, colors.secondary]);

    const leftIcon = useMemo(() => {
        return icon ? (
            <TextInput.Icon
                icon={icon.name}
                size={icon.size}
                color={icon.color ?? colors.secondary}
            />
        ) : undefined;
    }, [icon, colors.secondary]);

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
                secureTextEntry={isPassword && !showPassword}
                autoCapitalize={autoCapitalize}
                value={value}
                left={leftIcon}
                right={rightFix}
                multiline={isMulti}
                onChangeText={handleChangeText}
                outlineStyle={{
                    borderWidth: 0.5,
                    margin: 0,
                    backgroundColor: disabled
                        ? colors.elevation.level1
                        : colors.background,
                    borderColor: "rgba(119, 86, 81,0.3)",
                }}
                style={[
                    {
                        height: height || (isMulti ? 100 : 40),
                        top: -1,
                    },
                    upperCase && { textTransform: "uppercase" },
                ]}
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
        </View>
    );
}

export const InputField = React.memo(InputFieldComponent);

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
