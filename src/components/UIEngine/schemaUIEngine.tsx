import { useDataApp } from '@/hooks/zustand/useDataApp';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createContext } from 'use-context-selector';
import { FieldRenderer } from './fieldRenderer';
import { useComputedFields } from './hooks/useComputedFields';
import { useEvalExpr } from './hooks/useEvalExpr';
import { FormState, useFormState } from './hooks/useFormState';
import { IConfigExpression, ISchemaUIProps } from './types';

export const collectRequiredKeys = (fields: any[]): string[] => {
    let keys: string[] = [];
    fields.forEach((f) => {
        if (f.requiredKeys) {
            keys.push(...f.requiredKeys);
        }
        if (f.fields) {
            keys.push(...collectRequiredKeys(f.fields));
        }
    });
    return keys;
};

const EMPTY_OBJECT = {};

interface IFormContext {
    formState: FormState<Record<string, any>>;
    paramSystem: IParamSystem | null;
    dataSourceMap: Map<string, Map<string, any>>;
    evalExpr: (expr: string, requiredKeys?: string[]) => any;
    handleAction: (name: string, param?: any) => void;
    errors: Record<string, string>;
    dataSource: Record<string, any[]>;
    onChangeItemData?: (change: Record<string, any>) => void;
    configExpression?: IConfigExpression;
}

// context dùng use-context-selector
export const FormContext = createContext<IFormContext | null>(null);

export function SchemaUIEngine({
    schema,
    data = EMPTY_OBJECT,
    style,
    actionMap,
    onChangeItemData,
    errors = EMPTY_OBJECT,
    dataSource = EMPTY_OBJECT,
    dataActionMap,
    configExpression
}: ISchemaUIProps) {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const formState = useFormState(data);
    // map nhanh id → object
    const dataSourceMap = useMemo(() => {
        const map0 = new Map<string, Map<string, any>>();
        Object.keys(dataSource).forEach((key) => {
            const _dataSource = dataSource[key];
            const map = new Map<string, any>();
            _dataSource.forEach((g: any) => map.set(g['id'], g));
            map0.set(key, map);
        });
        return map0;
    }, [dataSource]);


    // computed fields (ẩn/hiện, default values, …)
    useComputedFields(schema.fields || [], formState, data, paramSystem, onChangeItemData);

    const handleAction = useCallback(
        (name: string, param?: any) => {
            if (typeof actionMap?.[name] === 'function') {
                actionMap[name]({ param, data: dataActionMap });
            } else {
                console.warn(`Unknown action: ${name}`);
            }
        },
        [actionMap, dataActionMap]
    );

    const requiredKeys = useMemo(() => {
        return collectRequiredKeys(schema.fields ?? []);
    }, [schema.fields]);

    // Tạo object chỉ chứa các key cần theo dõi
    const watchRequiredValues = useMemo(() => {
        let obj: Record<string, any> = {};
        requiredKeys.forEach(k => {
            obj[k] = data[k];  // lấy giá trị hiện tại trong data
        });
        return obj;
    }, [JSON.stringify(requiredKeys.map(k => data[k]))]);

    // eval expression
    const evalExpr = useEvalExpr(watchRequiredValues);

    // lọc field theo visibleIf
    const schemaFields = useMemo(() => {
        return (schema.fields ?? []).filter((child) => {
            return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true
        });
    }, [schema.fields, evalExpr, watchRequiredValues]);

    // context value, chỉ thay đổi khi input deps đổi
    const ctxValue = useMemo<IFormContext>(
        () => ({
            formState,
            paramSystem,
            dataSource,
            dataSourceMap,
            evalExpr,
            handleAction,
            errors,
            onChangeItemData,
            configExpression
        }),
        [
            formState,      // đổi khi state thay đổi
            paramSystem,
            dataSource,
            dataSourceMap,
            evalExpr,
            handleAction,
            errors,
            onChangeItemData,
            configExpression
        ]
    );

    return (
        <FormContext.Provider value={ctxValue}>
            <View
                style={[
                    { flexDirection: schema.type === 'rows' ? 'row' : 'column', gap: 5 },
                    schema.style,
                    schema.props?.style,
                    style,
                ]}
            >
                {schemaFields.map((field, index) => {
                    return (
                        <FieldRenderer key={index} field={field} index={index} />
                    )
                })}
            </View>
        </FormContext.Provider>
    );
}