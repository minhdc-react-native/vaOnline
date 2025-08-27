import ExpandableView from "@/components/expandableView";
import { IExpand, IField } from "@/components/UIEngine/types";
import React, { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { FieldRenderer } from "../fieldRenderer";
import { FormState } from "../hooks/useFormState";

interface IProps {
    field: IExpand;
    index: number;
    formState: FormState;
    evalExpr: (expr: string, requiredKeys?: string[]) => any;
    handleAction: (expr: string, param?: any) => void;
    errors: Record<string, string>;
    dataSource: Record<string, any[]>;
    dataSourceMap: Map<string, Map<string, any>>;
    onChangeItemData?: (change: Record<string, any>) => void;
    paramSystem: IParamSystem | null;
    _: (key?: string | undefined) => string
}

const InputFieldComponent: React.FC<IProps> = ({
    field,
    index,
    formState,
    evalExpr,
    handleAction,
    errors,
    onChangeItemData,
    dataSource,
    dataSourceMap,
    paramSystem,
    _
}) => {
    const { colors } = useTheme();

    const fieldsExpand = useMemo(() => {
        return field.fields?.filter((child) =>
            child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true
        ) ?? [];
    }, [field.fields]);

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
                    formState={formState}
                    evalExpr={evalExpr}
                    handleAction={handleAction}
                    onChangeItemData={onChangeItemData}
                    errors={errors}
                    dataSource={dataSource}
                    dataSourceMap={dataSourceMap}
                    paramSystem={paramSystem}
                />
            );
        }
        return _(field.title);
    }, [field.title]);

    const _icon = useMemo(() => {
        if (field.icon) {
            return (
                <FieldRenderer
                    field={field.icon as IField}
                    index={index}
                    formState={formState}
                    evalExpr={evalExpr}
                    handleAction={handleAction}
                    onChangeItemData={onChangeItemData}
                    errors={errors}
                    dataSource={dataSource}
                    dataSourceMap={dataSourceMap}
                    paramSystem={paramSystem}
                />
            );
        }
    }, [field.icon]);
    return (
        <ExpandableView
            title={_title}
            icon={_icon}
            defaultExpanded={field.defaultExpanded}
            disabled={disabled}
            expanded={field.expanded}
            style={[{ borderColor: colors.elevation.level5 }, field.style]}
            containerStyle={[{ padding: 10 }, field.containerStyle]}
            styleHeader={[{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: colors.elevation.level1 }, field.styleHeader]}
            type={field.typeExpand}
            titleStyle={{ fontWeight: "normal" }}
        >
            {fieldsExpand.map((child, i) => (
                <FieldRenderer
                    key={i}
                    field={child}
                    index={i}
                    formState={formState}
                    evalExpr={evalExpr}
                    handleAction={handleAction}
                    onChangeItemData={onChangeItemData}
                    errors={errors}
                    dataSource={dataSource}
                    dataSourceMap={dataSourceMap}
                    paramSystem={paramSystem}
                />
            ))}
        </ExpandableView>
    );
};

export const ExpandField = React.memo(InputFieldComponent);

