import { produce } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface FormState<T = any> {
    state: T;
    update: (path: string, value: any) => void;
    updateMany: (updates: Record<string, any>) => void;
    reset: (next?: T) => void;
}

export function useFormState<T>(initial: T): FormState<T> {
    const [state, setState] = useState<T>(initial);

    const update = useCallback((path: string, value: any) => {
        setState(prev =>
            produce(prev, draft => {
                const keys = path.split(".");
                let obj: any = draft;
                for (let i = 0; i < keys.length - 1; i++) {
                    obj = obj[keys[i]];
                }
                obj[keys[keys.length - 1]] = value;
            })
        );
    }, []);

    const updateMany = useCallback((updates: Record<string, any>) => {
        setState(prev =>
            produce(prev, draft => {
                for (const path in updates) {
                    const keys = path.split(".");
                    let obj: any = draft;
                    for (let i = 0; i < keys.length - 1; i++) {
                        obj = obj[keys[i]];
                    }
                    obj[keys[keys.length - 1]] = updates[path];
                }
            })
        );
    }, []);

    const reset = useCallback((next?: T) => {
        setState(next ?? initial);
    }, [initial]);

    // reset khi initial thay đổi
    useEffect(() => {
        setState(initial);
    }, [initial]);

    // đảm bảo chỉ tạo object mới khi state thay đổi
    return useMemo(() => ({
        state,
        update,
        updateMany,
        reset
    }), [state, update, updateMany, reset]);
}
