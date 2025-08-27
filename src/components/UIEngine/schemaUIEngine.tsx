import { useDataApp } from '@/hooks/zustand/useDataApp';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { FieldRenderer } from './fieldRenderer';
import { useComputedFields } from './hooks/useComputedFields';
import { useEvalExpr } from './hooks/useEvalExpr';
import { useFormState } from './hooks/useFormState';
import { ISchemaUIProps } from './types';

export function SchemaUIEngine({ schema, data = {}, style, actionMap, onChangeItemData, errors, dataSource = {}, dataActionMap }: ISchemaUIProps) {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const formState = useFormState(data);

    const dataSourceMap: Map<string, Map<string, any>> = useMemo(() => {
        const map0 = new Map<string, Map<string, any>>();
        Object.keys(dataSource).map(key => {
            const _dataSource = dataSource[key];
            const map = new Map<string, any>();
            _dataSource.forEach((g: any) => map.set(g["id"], g));
            map0.set(key, map);
        });
        return map0;
    }, [dataSource]);

    useComputedFields(schema.fields || [], formState, data, paramSystem, onChangeItemData);

    const evalExpr = useEvalExpr();
    const handleAction = (name: string, param?: any) => {
        if (typeof actionMap?.[name] === 'function') {
            actionMap[name]({ param, data: dataActionMap });
        } else {
            console.warn(`Unknown action: ${name}`);
        }
    };
    const schemaFields = schema.fields.filter((child) => {
        return child.visibleIf ? evalExpr(child.visibleIf, data, child.requiredKeys) : true;
    }) ?? [];
    return (
        <View style={[{ flexDirection: schema.type === "rows" ? "row" : "column", gap: 10 }, schema.style, schema.props?.style, style]}>
            {schemaFields.map((field, index) => (
                <FieldRenderer
                    key={index}
                    field={field}
                    index={index}
                    formState={formState}
                    data={data}
                    evalExpr={evalExpr}
                    handleAction={handleAction}
                    onChangeItemData={onChangeItemData}
                    errors={errors ?? {}}
                    dataSource={dataSource}
                    dataSourceMap={dataSourceMap}
                    paramSystem={paramSystem}
                />
            ))}
        </View>
    );
}