import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from ".";
const colors = theme.colors;
const empty0: ISchemaWin = {
    itemAction: {
        type: "cols",
        fields: []
    },
    itemList: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ["code", "name", "label"],
                visibleIf: "{{code!==undefined && name!==undefined}}",
                label: "{{`${code} - ${name}`}}",
            },
            {
                type: "text",
                requiredKeys: ["code", "name", "label", "id", "value"],
                visibleIf: "{{(code===undefined || name===undefined) && label===undefined}}",
                label: "{{`${id} - ${value}`}}",
            },
            {
                type: "text",
                requiredKeys: ["label"],
                visibleIf: "{{label!==undefined}}",
                bind: "label",
            }
        ]
    },

    itemShow: {
        type: "cols",
        fields: []
    },
    itemEdit: {
        type: "cols",
        fields: []
    }
}
export const empty: ISchemaWinValue = {
    config: empty0,
    defaultNew: {},
    zod: {
        code: { type: "string", msgError: "Nhập mã" },
        name: { type: "string", msgError: "Nhập tên" },
    }
}