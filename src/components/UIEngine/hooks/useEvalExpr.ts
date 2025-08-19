import { useCallback, useRef } from 'react';

export function useEvalExpr(
    data: Record<string, any>
) {
    const fnCache = useRef(new Map<string, Function>());

    return useCallback((expr: string, requiredKeys?: string[]): any => {
        if (typeof expr !== 'string') return expr;
        if (!expr.includes('{{')) return expr;
        try {
            const raw = expr.replace(/^{{\s*|\s*}}$/g, '');
            let fn = fnCache.current.get(raw);
            const keys = requiredKeys ?? Object.keys(data);
            const values = keys.map(key => data[key]);
            if (!fn) {
                fn = new Function(...keys, `return (${raw})`);
                fnCache.current.set(raw, fn);
            }
            return fn(...values);
        } catch (e: any) {
            console.warn('EvalExpr error:', e);
            return `⚠️ ${e.message}`;
        }
    }, [data]); // depend on keys
}
