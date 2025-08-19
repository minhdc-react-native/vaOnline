import { useEffect, useState } from 'react';
import set from 'lodash.set';
import isEqual from 'lodash.isequal';

export interface FormState<T = any> {
    state: T;
    update: (path: string, value: any) => void;
    updateMany: (updates: Record<string, any>) => void;
}

export function useFormState<T>(initial: T): FormState<T> {
    const [state, setState] = useState<T>(initial);

    const update = (path: string, value: any) => {
        const newState: any = { ...state };
        set(newState, path, value);
        setState(newState);
    };

    const updateMany = (updates: Record<string, any>) => {
        setState((prev: T) => {
            const updated: any = { ...prev };
            for (const path in updates) {
                set(updated, path, updates[path]);
            }
            return updated;
        });
    }

    useEffect(() => {
        setState(prev => {
            if (!isEqual(prev, initial)) {
                return initial;
            }
            return prev;
        });
    }, [initial]);

    return { state, update, updateMany };
}
