import { useToast } from '@/components/dialog/useToast';
import { useTranslation } from '@/context/TranslationContext';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { useState } from 'react';
import * as z from "zod";
export function useZodValidation(state: any, zodSchema?: z.ZodObject) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { showToast } = useToast();
    const { _ } = useTranslation();
    const lang = useDataApp(state => state.lang);
    const validate = (): boolean => {
        if (!zodSchema) return true;
        try {
            zodSchema.parse(state);
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((e) => {
                    const path = e.path.join('.') || 'root';
                    fieldErrors[path] = e.message;
                });
                const keysString = Object.keys(fieldErrors).map(e => _(e)).join(",");
                showToast(lang === 'vi' ? `Bạn cần nhập [${keysString}]` : `You need to enter [${keysString}]`, { type: "warning" });
                setErrors(fieldErrors);
            }
            return false;
        }
    };
    return { validate, errors, setErrors };
}
