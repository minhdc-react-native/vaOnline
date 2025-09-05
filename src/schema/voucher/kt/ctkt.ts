import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
import { ListItemView } from "../itemView";
const colors = theme.colors;
const ctkt0: ISchemaWin = {
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
                style: { alignItems: "center", justifyContent: "space-between" },
                fields: [
                    {
                        type: "text",
                        requiredKeys: ['TK_NO', 'TK_CO'],
                        label: "{{`${TK_NO} / ${TK_CO}`}}",
                        textStyle: { fontWeight: "bold" },
                        style: { flex: 1 }
                    },
                    {
                        type: "cols",
                        fields: [
                            {
                                type: "text",
                                requiredKeys: ["TY_GIA"],
                                visibleIf: "{{TY_GIA!==1}}",
                                bind: 'TIEN_NT',
                                format: { type: "number", roundNumber: "rAmountNt" },
                                variant: "bodySmall",
                                textStyle: { color: colors.secondary, fontWeight: "bold", textAlign: "right" },
                            },
                            {
                                type: "text",
                                bind: 'TIEN',
                                format: { type: "number", roundNumber: "rAmount" },
                                textStyle: { fontWeight: "bold", textAlign: "right" }
                            },
                        ]
                    },
                ]
            },

            { type: "line" },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "TEN_DT",
                        bind: 'TEN_DT',
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "IS_CP0",
                        bind: "IS_CP0",
                        format: { type: "checkbox" }
                    }
                ]
            },
            {
                type: "text",
                bind: "GHI_CHU"
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
                type: "rows",
                fields: [
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        fDisplay: { fValue: "id" },
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_NO",
                        bind: "TK_NO",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        fDisplay: { fValue: "id" },
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_CO",
                        bind: "TK_CO",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "expand",
                title: "Thông tin bổ xung...",
                fields: [
                    {
                        type: "rows",
                        style: { alignItems: "center" },
                        fields: [
                            {
                                type: "search",
                                tableSearch: "DMKM",
                                fField: 'MA_KM',
                                label: "MA_KM",
                                bind: 'MA_KM',
                                style: { flex: 1 }
                            },
                            {
                                type: "search",
                                tableSearch: "DMCS",
                                fField: 'MA_CS',
                                label: "MA_CS",
                                bind: 'MA_CS',
                                checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn ct,sp chi tiết", requiredKeys: ["BOLD"] },
                                style: { flex: 1 }
                            },
                        ]
                    },
                    {
                        type: "rows",
                        style: { alignItems: "center" },
                        fields: [
                            {
                                type: "search",
                                tableSearch: "DMHDG",
                                fField: 'MA_HDG',
                                label: "MA_HDG",
                                bind: 'MA_HDG',
                                style: { flex: 1 }
                            },
                            {
                                type: "search",
                                tableSearch: "DMVV",
                                fField: 'MA_VV',
                                label: "MA_VV",
                                bind: 'MA_VV',
                                style: { flex: 1 }
                            },
                        ]
                    },
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "search",
                        tableSearch: "DMDT",
                        itemView: ListItemView.MA_DT,
                        expression: { TEN_DT: 'TEN_DT' },
                        fField: 'MA_DT',
                        label: "MA_DT",
                        bind: 'MA_DT',
                        style: { flex: 1 }
                    },
                    {
                        type: "checkbox",
                        label: "IS_CP0",
                        bind: "IS_CP0"
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_DT",
                typeInput: "multi",
                bind: "TEN_DT"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "number",
                        requiredKeys: ["TY_GIA"],
                        visibleIf: "{{TY_GIA!==1}}",
                        label: "TIEN_NT",
                        bind: 'TIEN_NT',
                        format: "rAmountNt",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "TIEN",
                        bind: 'TIEN',
                        format: "rAmount",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "input",
                label: "GHI_CHU",
                typeInput: "multi",
                bind: "GHI_CHU"
            }
        ]
    }
}

export const ctkt: ISchemaWinValue = {
    config: ctkt0,
    defaultNew: { DPKT_id: "{{id}}", NAM: '#NAM#', GHI_CHU: "{{DIEN_GIAI}}", MA_DT: "{{MA_DT0}}", TEN_DT: "{{TEN_DT0}}", IS_CP0: false }, require: true,
    zod: {
        TK_NO: { type: 'string', msgError: '...' },
        TK_CO: { type: 'string' },
        TIEN: { type: 'number' },
    }
}