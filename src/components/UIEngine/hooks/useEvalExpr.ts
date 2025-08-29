import { useTranslation } from '@/context/TranslationContext';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { useCallback, useRef } from 'react';

export function useEvalExpr(data: Record<string, any>) {
    const fnCache = useRef(new Map<string, Function>());
    const lang = useDataApp((state) => state.lang);
    const { _ } = useTranslation();
    const dataRef = useRef(data);
    return useCallback(
        (expr: string, requiredKeys?: string[]): any => {
            if (typeof expr !== 'string') return expr;
            if (!expr.includes('{{')) return expr;

            try {
                const raw = expr.replace(/^{{\s*|\s*}}$/g, '');
                let fn = fnCache.current.get(raw);

                const keys = requiredKeys ?? Object.keys(dataRef.current);
                const argNames = [...keys, "lang", "_"];
                const argValues = [...keys.map((key) => dataRef.current[key]), lang, _];

                if (!fn) {
                    fn = new Function(...argNames, `return (${raw})`);
                    fnCache.current.set(raw, fn);
                }

                return fn(...argValues);
            } catch (e: any) {
                console.warn('EvalExpr error:', e);
                return `⚠️ ${e.message}`;
            }
        },
        [lang, _]
    );
}
