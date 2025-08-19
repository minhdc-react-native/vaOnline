import { useState } from 'react';
import * as z from "zod";
export function useZodValidation(state: any, zodSchema?: z.ZodObject) {
    const [errors, setErrors] = useState<Record<string, string>>({});
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
                setErrors(fieldErrors);
            }
            return false;
        }
    };
    return { validate, errors, setErrors };
}
