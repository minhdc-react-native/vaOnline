import { produce } from "immer";
import { useEffect, useState } from 'react';

export interface FormState<T = any> {
    state: T;
    update: (path: string, value: any) => void;
    updateMany: (updates: Record<string, any>) => void;
    reset: (next?: T) => void;
}

export function useFormState<T>(initial: T): FormState<T> {
    const [state, setState] = useState<T>(initial);

    const update = (path: string, value: any) => {
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
    };

    const updateMany = (updates: Record<string, any>) => {
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
    };

    const reset = (next?: T) => setState(next ?? initial);

    useEffect(() => {
        reset(initial);
    }, [initial]);

    return { state, update, updateMany, reset };
}
