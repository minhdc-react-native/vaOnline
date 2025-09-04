import { StarRating } from "@/components/starRating";
import { ITextField } from "@/components/UIEngine/types";
import { VcTextLink } from "@/components/vcTextLink";
import { useTranslation } from "@/context/TranslationContext";
import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Chip, Icon, Text, useTheme } from "react-native-paper";
import { useContextSelector } from "use-context-selector";
import { useBoundField } from "../hooks/useBoundField";
import { FormContext } from "../schemaUIEngine";

interface IProps {
    field: ITextField;
    index: number;
}

const TextFieldComponent: React.FC<IProps> = ({
    field,
    index,
}) => {
    const formState = useContextSelector(FormContext, (ctx) => ctx!.formState);
    const evalExpr = useContextSelector(FormContext, (ctx) => ctx!.evalExpr);
    const dataSourceMap = useContextSelector(FormContext, (ctx) => ctx!.dataSourceMap);
    const paramSystem = useContextSelector(FormContext, (ctx) => ctx!.paramSystem);

    const key = `${field.bind || field.type}-${index}`;
    const { value } = useBoundField(formState, field.bind || "__none__");
    const { colors } = useTheme<VACOMTheme>();
    const { _ } = useTranslation();
    const isBold = formState.state?.BOLD === "C";
    // Tính toán label + value gốc
    let valueText = value;
    let labelText = field.label
        ? evalExpr(field.label, field.requiredKeys)
        : undefined;


    // ====== Helper render ======
    const renderMultiSelect = () => {
        const ids = value ? value.split(field.format?.separator ?? ",") : [];
        const dataMapMulti = dataSourceMap.get(field.keySource || field.bind!);

        return (
            <View
                style={[
                    { flexDirection: "row", flexWrap: "wrap", gap: 2 },
                    field.style,
                ]}
            >
                {ids.map((id: string) => (
                    <Chip
                        mode="outlined"
                        key={`chip${id}`}
                        style={{ borderColor: colors.elevation.level3 }}
                    >
                        <Text variant="bodySmall">
                            {dataMapMulti?.get(id)?.[field.format?.fValue ?? "value"] || "???"}
                        </Text>
                    </Chip>
                ))}
            </View>
        );
    };

    const renderStatus = () => {
        const itemStatus: any =
            dataSourceMap.get(field.keySource || field.bind!)?.get(value) || {
                id: "?",
                value: "???",
                color: colors.secondary,
            };

        return (
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        paddingVertical: 2,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                        backgroundColor: colors.elevation.level1,
                        borderWidth: 0.5,
                        borderColor: colors.elevation.level3,
                        maxWidth: 150,
                    },
                    field.style,
                ]}
            >
                <View
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 10,
                        backgroundColor: itemStatus.color,
                    }}
                />
                <Text numberOfLines={1} style={{ fontSize: 12, flexShrink: 1 }}>
                    {itemStatus.value}
                </Text>
            </View>
        );
    };

    const renderRating = () => {
        if (!field.bind) {
            valueText = labelText;
            labelText = undefined;
        }

        return (
            <View
                style={[
                    { flexDirection: "row", gap: 5, alignItems: "center" },
                    field.style,
                ]}
            >
                {labelText && (
                    <Text style={[styles.label, field.labelStyle]}>{_(labelText)}</Text>
                )}
                <StarRating
                    value={valueText}
                    max={field.format?.maxRating}
                    isShowAll={field.format?.isShowAll}
                />
            </View>
        );
    };

    const renderCheckbox = () => {
        const isCheck =
            typeof value === "boolean" ? value : value === "C";

        const icon =
            field.format?.typeCheckBox === "checkbox"
                ? isCheck
                    ? "checkbox-marked-outline"
                    : "checkbox-blank-outline"
                : isCheck
                    ? "toggle-switch"
                    : "toggle-switch-off";

        return (
            <View
                style={[
                    { flexDirection: "row", gap: 5, alignItems: "center" },
                    field.style,
                ]}
            >
                {labelText && (
                    <Text style={[styles.label, field.labelStyle]}>{_(labelText)}</Text>
                )}
                <Icon
                    source={icon}
                    size={20}
                    color={isCheck ? colors.primary : colors.secondary}
                />
            </View>
        );
    };

    const renderLink = () => {
        if (!field.bind) {
            valueText = labelText;
            labelText = undefined;
        }

        return (
            <View style={field.style}>
                {labelText && (
                    <Text style={[styles.label, field.labelStyle]}>{_(labelText)}</Text>
                )}
                <VcTextLink
                    text={valueText}
                    numberOfLines={field.numberOfLines}
                    style={field.textStyle}
                    variant={field.variant}
                    typeLink={field.format?.typeLink}
                />
            </View>
        );
    };

    const renderDefault = () => {
        let addStyle: StyleProp<ViewStyle> = null;
        let addTextStyle: StyleProp<TextStyle> = null;
        if (!field.bind) {
            valueText = labelText;
            labelText = undefined;
        }

        switch (field.format?.type) {
            case "number":
                if (valueText < 0) addTextStyle = { color: colors.primary };
                valueText = Helper.formatAmount(
                    valueText,
                    false,
                    paramSystem?.[field.format.roundNumber ?? "rAmount"]
                );
                break;
            case "date":
                valueText = Helper.getFormattedDate(
                    valueText,
                    field.format.formatDate,
                    field.format.removeTime ?? true
                );
                break;
            case "select":
                if (!Helper.isEmpty(value)) {
                    valueText =
                        dataSourceMap.get(field.keySource || field.bind!)
                            ?.get(value)?.[field.format.fValue ?? "value"] || "???";
                }
                break;
            case "tag":
                if (!Helper.isEmpty(value)) {
                    const itemTag = dataSourceMap.get(field.keySource || field.bind!)
                        ?.get(value);
                    valueText = itemTag?.[field.format.fValue ?? "value"] || "???";
                    addStyle = {
                        paddingVertical: 2,
                        paddingHorizontal: 5,
                        borderWidth: 0.5,
                        borderColor: colors.elevation.level5,
                        backgroundColor: colors.elevation.level1,
                        borderRadius: 10,
                    };
                }
                break;
        }
        return (
            <View style={field.style}>
                {labelText && (
                    <Text style={[styles.label, field.labelStyle]}>{_(labelText)}</Text>
                )}
                <Text
                    key={key}
                    variant={field.variant}
                    numberOfLines={field.numberOfLines}
                    style={[
                        addStyle as any,
                        field.textStyle,
                        addTextStyle,
                        isBold && { fontWeight: "bold" },
                    ]}
                >
                    {valueText}
                </Text>
            </View>
        );
    };

    // ====== SWITCH CASE ======
    switch (field.format?.type) {
        case "selectMulti":
            return renderMultiSelect();
        case "status":
            return renderStatus();
        case "rating":
            return renderRating();
        case "checkbox":
            return renderCheckbox();
        case "link":
            return renderLink();
        default:
            return renderDefault();
    }
};

export const TextField = React.memo(TextFieldComponent);

const styles = StyleSheet.create({
    label: { color: "#888", fontSize: 13 },
});
