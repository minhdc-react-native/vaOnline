import ExpandableView from "@/components/expandableView";
import { IExpand, IField } from "@/components/UIEngine/types";
import { VACOMTheme } from "@/theme/theme";
import React, { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { useContextSelector } from "use-context-selector";
import { FieldRenderer } from "../fieldRenderer";
import { FormContext } from "../schemaUIEngine";

interface IProps {
    field: IExpand;
    index: number;
    _: (key?: string | undefined) => string
}

const InputFieldComponent: React.FC<IProps> = ({
    field,
    index,
    _
}) => {
    const evalExpr = useContextSelector(FormContext, (ctx) => ctx!.evalExpr);
    const { colors } = useTheme<VACOMTheme>();

    const fieldsExpand = useMemo(() => {
        return field.fields?.filter((child) =>
            child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true
        ) ?? [];
    }, [field.fields, evalExpr]);

    const disabled = useMemo(() => {
        return field.disabled
            ? typeof field.disabled === "boolean"
                ? field.disabled
                : evalExpr(field.disabled, field.requiredKeys)
            : false;
    }, [field.disabled, evalExpr, field.requiredKeys]);

    const _title = useMemo(() => {
        if (typeof field.title !== "string") {
            return (
                <FieldRenderer
                    field={field.title as IField}
                    index={index}
                />
            );
        }
        return _(field.title);
    }, [field.title, _, index]);

    const _icon = useMemo(() => {
        if (field.icon) {
            return (
                <FieldRenderer
                    field={field.icon as IField}
                    index={index}
                />
            );
        }
    }, [field.icon, index]);
    return (
        <ExpandableView
            title={_title}
            icon={_icon}
            defaultExpanded={field.defaultExpanded}
            disabled={disabled}
            expanded={field.expanded}
            style={[{ borderColor: colors.vacom.borderColor }, field.style]}
            containerStyle={[{ padding: 10 }, field.containerStyle]}
            styleHeader={[{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#f5f5f5' }, field.styleHeader]}
            type={field.typeExpand}
            titleStyle={{ fontWeight: "normal" }}
        >
            {fieldsExpand.map((child, i) => (
                <FieldRenderer
                    key={i}
                    field={child}
                    index={i}
                />
            ))}
        </ExpandableView>
    );
};

export const ExpandField = React.memo(InputFieldComponent);

