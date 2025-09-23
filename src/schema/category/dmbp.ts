import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmbp0: ISchemaWin = {
    itemAction: {
        type: "cols",
        fields: [
            {
                type: "actionList",
                style: { backgroundColor: "red" },
                actionName: "deleteItem",
                typeButton: "btnOnlyOne",
                fields: [
                    {
                        type: "icon",
                        iconType: "I",
                        name: "trash",
                        color: "#fff"
                    }
                ]
            }
        ]
    },
    itemList: {
        type: "cols",
        fields: [
            {
                type: "text",
                bind: "MA_BP",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_BP"
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "text",
                label: "MA_BP",
                bind: "MA_BP",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                label: "TEN_BP",
                bind: "TEN_BP"
            }
        ]
    },
    itemEdit: {
        type: "cols",
        fields: [
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "MA_BP",
                        bind: "MA_BP",
                        style: { flex: 1 }
                    },
                    {
                        type: "empty",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_BP",
                bind: "TEN_BP"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                label: "NH_ME",
                bind: "BP_ME"
            }
        ]
    }
}

export const dmbp: ISchemaWinValue = {
    dataSource: {
        BP_ME: 'DMBP'
    },
    fieldSearch: 'TEN_BP',
    config: dmbp0,
    defaultNew: {},
    zod: {
        MA_BP: { type: 'string', msgError: '...' },
        TEN_BP: { type: 'string' },
    }
}