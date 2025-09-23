import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmnhdt0: ISchemaWin = {
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
                bind: "MA_NH_DT",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_NH_DT"
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "text",
                label: "MA_NH_DT",
                bind: "MA_NH_DT",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                label: "TEN_NH_DT",
                bind: "TEN_NH_DT"
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
                        label: "MA_NH_DT",
                        bind: "MA_NH_DT",
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
                label: "TEN_NH_DT",
                bind: "TEN_NH_DT"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                label: "NH_ME",
                bind: "NH_DT_ME"
            }
        ]
    }
}

export const dmnhdt: ISchemaWinValue = {
    dataSource: {
        NH_DT_ME: 'DMNHDT'
    },
    fieldSearch: 'TEN_NH_DT',
    config: dmnhdt0,
    defaultNew: {},
    zod: {
        MA_NH_DT: { type: 'string', msgError: '...' },
        TEN_NH_DT: { type: 'string' },
    }
}