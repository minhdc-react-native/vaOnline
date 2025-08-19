// ✅ Gọn gàng hơn: trả về object có field rõ ràng

import { useCallback } from 'react';
import get from 'lodash.get';
import { FormState } from './useFormState';

/**
 * Hook liên kết với một field trong form state
 */
export function useBoundField<T = any>(formState: FormState<T>, path: string, onChangeItemData?: (change: Record<string, any>) => void) {
    const value = get(formState.state, path);
    const setValue = useCallback((v: any) => {
        onChangeItemData?.({ [path]: v });
        formState.update(path, v);
    }, [formState, path]);

    const setValues = useCallback((updates: Record<string, any>) => {
        onChangeItemData?.(updates);
        formState.updateMany(updates);
    }, [formState]);

    return {
        value,
        setValue,
        setValues,
        getValue: (p: string) => get(formState.state, p)
    };
}
