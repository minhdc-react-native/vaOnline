import { Helper } from '@/utils/Helper';
import get from 'lodash.get';
import { useEffect, useMemo } from 'react';
import { IField } from '../types';
import { useEvalExpr } from './useEvalExpr';
import { FormState } from './useFormState';

const flatten = (items: any) => {
    return items.flatMap((item: any) => {
        if (item.fields && item.fields.length > 0) {
            return [...flatten(item.fields)];
        }
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

    // Lấy danh sách field cần compute
    const fields = useMemo(() => flatten(fields0), [fields0]);

    // Gom toàn bộ dependency paths
    const flatDependencies = useMemo(
        () => fields.flatMap((f: IField) => f.requiredKeys ?? []).filter(Boolean) as string[],
        [fields]
    );

    // Giá trị hiện tại của dependencies
    const dependencyValues = useMemo(
        () => flatDependencies.map(dep => get(formState.state, dep)),
        [formState.state, flatDependencies]
    );

    useEffect(() => {
        fields.forEach((field: IField) => {
            if (field.type === "number" && field.compute && field.bind) {
                try {
                    const current = get(formState.state, field.bind);
                    const computed = evalExpr(field.compute, field.requiredKeys ?? []);
                    const rounded = Helper.round(
                        computed,
                        paramSystem?.[field.format ?? "rAmount"] ?? 0
                    );

                    const shouldUpdate =
                        !field.notOverride ||
                        current === null ||
                        current === undefined ||
                        current === 0;

                    const minChange = paramSystem?.["minAmountChange"] ?? 0;
                    const diff = Math.abs((current ?? 0) - rounded);

                    if (shouldUpdate && diff > minChange) {
                        formState.update(field.bind, rounded);
                        onChangeItemData?.({ [field.bind]: rounded });
                    }
                } catch (err) {
                    console.warn(`Lỗi tính toán "${field.bind}" từ: ${field.compute}`, err);
                }
            }
        });
    }, [data, dependencyValues, fields, formState, paramSystem, onChangeItemData, evalExpr]);
}