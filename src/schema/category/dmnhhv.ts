import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmnhhv0: ISchemaWin = {
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
                bind: "MA_NH_HV",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_NH_HV"
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "text",
                label: "MA_NH_HV",
                bind: "MA_NH_HV",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                label: "TEN_NH_HV",
                bind: "TEN_NH_HV"
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
                        label: "MA_NH_HV",
                        bind: "MA_NH_HV",
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
                label: "TEN_NH_HV",
                bind: "TEN_NH_HV"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                label: "NH_ME",
                bind: "NH_HV_ME"
            }
        ]
    }
}

export const dmnhhv: ISchemaWinValue = {
    dataSource: {
        NH_HV_ME: 'DMNHHV'
    },
    fieldSearch: 'TEN_NH_HV',
    config: dmnhhv0,
    defaultNew: {},
    zod: {
        MA_NH_HV: { type: 'string', msgError: '...' },
        TEN_NH_HV: { type: 'string' },
    }
}