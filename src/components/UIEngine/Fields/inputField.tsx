import { IInputField } from "@/components/UIEngine/types";
import { useTranslation } from "@/context/TranslationContext";
import { VACOMTheme } from "@/theme/theme";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useBoundField } from "../hooks/useBoundField";
import { FormState } from "../hooks/useFormState";

interface IProps {
    field: IInputField;
    index: number;
    formState: FormState;
    evalExpr: (expr: string, requiredKeys?: string[]) => any;
    handleAction: (expr: string, param?: any) => void;
    errors: Record<string, string>;
    onChangeItemData?: (change: Record<string, any>) => void;
}

const InputFieldComponent: React.FC<IProps> = ({
    field,
    formState,
    evalExpr,
    handleAction,
    errors,
    onChangeItemData,
}) => {
    const { value, setValue, onBlurTaxCode } = useBoundField(
        formState,
        field.bind || "__none__",
        onChangeItemData
    );
    const { colors } = useTheme<VACOMTheme>();
    const { _ } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const disabled = useMemo(() => {
        return field.disabled
            ? typeof field.disabled === "boolean"
                ? field.disabled
                : evalExpr(field.disabled, field.requiredKeys)
            : false;
    }, [field.disabled, evalExpr, field.requiredKeys]);

    const labelInput = useMemo(
        () =>
            field.label
                ? evalExpr(field.label, field.requiredKeys)
                : undefined,
        [field.label, evalExpr, field.requiredKeys]
    );

    const isMulti = field.typeInput === "multi";
    const isPassword = field.typeInput === "password";

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
        if (field.texRight) {
            return (
                <TextInput.Affix
                    text={`${field.texRight}`}
                    textStyle={{ color: colors.secondary }}
                />
            );
        }
        return undefined;
    }, [isPassword, showPassword, togglePassword, field.texRight, colors.secondary]);

    const leftIcon = useMemo(() => {
        return field.leftIcon ? (
            <TextInput.Icon
                icon={field.leftIcon.name}
                size={field.leftIcon.size}
                color={field.leftIcon.color ?? colors.secondary}
            />
        ) : undefined;
    }, [field.leftIcon, colors.secondary]);

    const handleBlur = useCallback(() => {
        handleAction("onBlur", field.bind);
        if (field.typeInput === "taxCode" && value && value.length >= 10) {
            onBlurTaxCode(value, field.expression);
        }
    }, [handleAction, field.bind, field.typeInput, value, field.expression, onBlurTaxCode]);

    const handleChangeText = useCallback(
        (val: string) => {
            setValue(field.upperCase && val ? val.toUpperCase() : val);
        },
        [setValue, field.upperCase]
    );

    return (
        <View style={field.style}>
            <TextInput
                label={
                    value ? (
                        _(labelInput ?? "")
                    ) : (
                        <Text style={{ color: "rgba(59, 45, 43, 0.4)" }}>
                            {_(labelInput ?? "")}
                        </Text>
                    )
                }
                mode="outlined"
                disabled={disabled}
                readOnly={disabled}
                onBlur={handleBlur}
                secureTextEntry={isPassword && !showPassword}
                autoCapitalize={field.autoCapitalize}
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
                        height: field.height || (isMulti ? 100 : 40),
                        top: -1,
                    },
                    field.upperCase && { textTransform: "uppercase" },
                ]}
            />
            {field.bind && errors?.[field.bind] !== undefined && (
                <View
                    style={[
                        styles.tooltip,
                        {
                            borderColor: colors.vacom.borderColor,
                            backgroundColor: "rgb(255, 218, 214)",
                        },
                    ]}
                >
                    <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                </View>
            )}
        </View>
    );
};

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
