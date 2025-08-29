import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
const colors = theme.colors;
const dmhv_dvt0: ISchemaWin = {
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
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "DVT",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "IS_CB",
                        format: { type: "checkbox" },
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "GIA_N",
                        format: { type: "number", roundNumber: "rPrice" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "GIA_B",
                        format: { type: "number", roundNumber: "rPrice" },
                        style: { flex: 1 }
                    }
                ]
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: []
    },
    itemEdit: {
        type: "cols",
        fields: [
            {
                type: "search",
                tableSearch: "DMDVT",
                clean: false,
                numCharSearch: 1,
                fField: 'id',
                label: "DVT",
                bind: "DVT"
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "checkbox",
                        align: "right",
                        label: "IS_CB",
                        bind: "IS_CB",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "TL_QD",
                        bind: "TL_QD",
                        format: "rRate",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "number",
                        label: "GIA_N",
                        bind: "GIA_N",
                        format: "rPrice",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "GIA_B",
                        bind: "GIA_B",
                        format: "rPrice",
                        style: { flex: 1 }
                    }
                ]
            }
        ]
    }
}

export const dmhv_dvt: ISchemaWinValue = {
    config: dmhv_dvt0,
    defaultNew: { DMHV_id: "{{id}}" }, require: true,
    zod: {
        DVT: { type: 'string', msgError: '...' },
        TL_QD: { type: 'number' },
    }
}