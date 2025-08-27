import { zRequiredNumber, zRequiredString } from "@/schemaUI/zodHelpers";
import { z } from "zod";

type FieldConfig = {
    type: "string" | "number";
    msgError?: string;
};

type Config = Record<string, FieldConfig>;

export const buildZodSchema = (config?: Config) => {
    if (!config || Object.keys(config).length === 0) {
        // nếu không có config thì trả object rỗng
        return z.object({});
    }

    const shape: Record<string, z.ZodTypeAny> = {};

    for (const key in config) {
        const field = config[key];
        if (!field) continue;

        switch (field.type) {
            case "string":
                shape[key] = zRequiredString(field.msgError ?? '???');
                break;
            case "number":
                shape[key] = zRequiredNumber(field.msgError ?? '???');
                break;
            default:
                break;
        }
    }

    return z.object(shape);
}
