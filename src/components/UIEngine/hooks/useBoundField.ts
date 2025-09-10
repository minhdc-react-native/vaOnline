import { useLoading } from '@/components/dialog/loadingProvider';
import { api } from '@/utils/apiMethods';
import get from 'lodash.get';
import { useCallback, useRef } from 'react';
import { FormState } from './useFormState';

export function useBoundField<T = any>(
    formState: FormState<T>,
    path: string,
    onChangeItemData?: (change: Record<string, any>) => void
) {
    const { show, hide } = useLoading();
    const updateRef = useRef(formState.update);
    const updateManyRef = useRef(formState.updateMany);
    const onChangeRef = useRef(onChangeItemData);

    updateRef.current = formState.update;
    updateManyRef.current = formState.updateMany;
    onChangeRef.current = onChangeItemData;

    const setValue = useCallback((v: any) => {
        onChangeRef.current?.({ [path]: v });
        updateRef.current(path, v);
    }, [path]);

    const setValues = useCallback((updates: Record<string, any>) => {
        onChangeRef.current?.(updates);
        updateManyRef.current(updates);
    }, []);

    const getValue = (p: string) => get(formState.state, p);

    const data = useRef(formState.state);
    data.current = formState.state;

    const onBlurTaxCode = useCallback((value: string, expressionIfEmpty: string[], expression?: Record<string, string>) => {
        api.get({
            link: `/api/System/GetDataByReferencesId?id=608bf6bb-360d-44eb-b43f-76937684bd41&filtervalue=${value}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    const item = res[0];
                    if (expression && item) {
                        let valueChange: any = {};
                        Object.keys(expression).map(key => {
                            if (!expressionIfEmpty.includes(key) || !isNotEmpty((data.current as any)[key])) {
                                valueChange[key] = item[expression ? expression[key] : key];
                            }
                        });
                        setValues(valueChange);
                    }
                }
            },
            setLoading: (loading) => loading ? show() : hide()
        })
    }, [hide, setValues, show]);

    return {
        value: get(formState.state, path),
        setValue,
        setValues,
        getValue,
        onBlurTaxCode
    };
}
