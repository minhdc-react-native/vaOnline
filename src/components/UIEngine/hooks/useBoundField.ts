// ✅ Gọn gàng hơn: trả về object có field rõ ràng

import { api } from '@/utils/apiMethods';
import get from 'lodash.get';
import { useCallback } from 'react';
import { FormState } from './useFormState';

/**
 * Hook liên kết với một field trong form state
 */
export function useBoundField<T = any>(formState: FormState<T>, path: string, onChangeItemData?: (change: Record<string, any>) => void) {
    const value = get(formState.state, path);
    const setValue = useCallback((v: any) => {
        onChangeItemData?.({ [path]: v });
        formState.update(path, v);
    }, [formState, path, onChangeItemData]);

    const setValues = useCallback((updates: Record<string, any>) => {
        onChangeItemData?.(updates);
        formState.updateMany(updates);
    }, [formState, onChangeItemData]);

    const onBlurTaxCode = useCallback((value: string, expression?: Record<string, string>) => {
        api.get({
            link: `/api/System/GetDataByReferencesId?id=608bf6bb-360d-44eb-b43f-76937684bd41&filtervalue=${value}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    const item = res[0];
                    if (expression && item) {
                        let valueChange: any = {};
                        Object.keys(expression).map(key => {
                            valueChange[key] = item[expression ? expression[key] : key];
                        });
                        setValues(valueChange);
                    }
                }
            }
        })
    }, [setValues]);

    const getValue = useCallback((p: string) => get(formState.state, p), [formState]);

    return {
        value,
        setValue,
        setValues,
        getValue,
        onBlurTaxCode
    };
}
