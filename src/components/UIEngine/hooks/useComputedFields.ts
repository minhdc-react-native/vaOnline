import { Helper } from '@/utils/Helper';
import get from 'lodash.get';
import { useEffect, useMemo } from 'react';
import { IField } from '../types';
import { useEvalExpr } from './useEvalExpr';
import { FormState } from './useFormState';

const flatten = (items: any) => {
    return items.flatMap((item: any) => {
        if (item.fields && item.fields.length > 0) {
            // các phần tử con
            return [...flatten(item.fields)];
        }
        // không có fields => trả về chính nó
        return item.type === 'number' && item.compute && item.bind ? [item] : [];
    });
};

export function useComputedFields<T>(
    fields0: IField[],
    formState: FormState<T>,
    data: Record<string, any> = {},
    paramSystem: IParamSystem | null,
    onChangeItemData?: (change: Record<string, any>) => void
) {
    const evalExpr = useEvalExpr(data);

    const fields: IField[] = useMemo(() => {
        return flatten(fields0);
    }, [fields0]);

    const flatDependencies = fields
        .flatMap((f) => f.requiredKeys ?? [])
        .filter(Boolean);

    const dependencyValues: string[] = useMemo(() => {
        return flatDependencies.map(dep => get(formState.state, dep!));
    }, [formState.state, JSON.stringify(flatDependencies)]);

    useEffect(() => {
        fields.forEach((field) => {
            if (field.type === "number" && field.compute && field.bind) {
                try {
                    const current = get(formState.state, field.bind);
                    const computed = evalExpr(field.compute, flatDependencies.filter((dep): dep is string => typeof dep === 'string'));
                    const rounded = Helper.round(
                        computed,
                        paramSystem?.[field.format ?? "rAmount"] ?? 0
                    );
                    const shouldUpdate =
                        !field.notOverride || current === null || current === undefined || current === 0;

                    const minChange = paramSystem?.["minAmountChange"] ?? 0;
                    if (shouldUpdate && rounded !== current && ((current ?? 0) === 0 || Math.abs((current ?? 0) - rounded) > minChange)) {
                        formState.update(field.bind, rounded);
                        onChangeItemData?.({ [field.bind]: rounded });
                    }
                } catch (err) {
                    console.warn(`Lỗi tính toán "${field.bind}" từ: ${field.compute}`, err);
                }
            }
        });
    }, [JSON.stringify(dependencyValues)]);
}
