import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
import { ListItemView } from "./itemView";
const colors = theme.colors;
const psthue0: ISchemaWin = {
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
                        type: "cols",
                        fields: [
                            {
                                type: "text",
                                requiredKeys: ['SO_SERIAL', 'SO_HD'],
                                label: "{{`${SO_SERIAL} / ${SO_HD}`}}",
                                textStyle: { fontWeight: "bold" },
                                style: { flex: 1 }
                            },
                            {
                                type: "text",
                                bind: 'NGAY_HD',
                                format: { type: "date" }
                            }
                        ]
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
                type: "text",
                bind: 'TEN_DT_KT',
                style: { flex: 1 }
            },
            {
                type: "text",
                bind: "DIA_CHI"
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
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "search",
                        tableSearch: "DMTHUE",
                        fField: 'MA_THUE',
                        label: "MA_THUE",
                        clean: false,
                        itemView: ListItemView.MA_THUE,
                        numCharSearch: 1,
                        expression: { TK_NO: 'TK_NO', TK_CO: 'TK_CO', PT_THUE: 'PT_THUE', GHI_CHU: 'TEN_THUE' },
                        bind: 'MA_THUE',
                        style: { flex: 1 }
                    },
                    {
                        type: "search",
                        tableSearch: "DMQS",
                        fField: 'MA_QS',
                        label: "MA_QS",
                        expression: { SO_SERIAL: 'SO_SERIAL' },
                        bind: 'MA_QS',
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "date",
                        label: "NGAY_HD",
                        bind: 'NGAY_HD',
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        requiredKeys: ['_nhomHd'],
                        visibleIf: "{{_nhomHd}}",
                        fDisplay: { fValue: "id" },
                        itemView: ListItemView.NHOM_HD,
                        label: "KT",
                        bind: "NHOM_HD",
                        keySource: "DMNHOMHD",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "search",
                        tableSearch: "CUSTOM",
                        clean: false,
                        fField: 'id',
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_NO",
                        bind: "TK_NO",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "search",
                        tableSearch: "CUSTOM",
                        clean: false,
                        fField: 'id',
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
                        type: "input",
                        expression: { TEN_DT_KT: 'CompanyName', DIA_CHI: 'Address' },
                        requiredKeys: ['TK_NO'],
                        // expression: `{{
                        //     { 
                        //         TEN_DT_KT: 'CompanyName', 
                        //         ...(TK_NO === "1111" && { DIA_CHI: "Address" })
                        //     }
                        // }}`,
                        label: "MS_THUE",
                        bind: 'MS_THUE',
                        typeInput: "taxCode",
                        style: { flex: 1 }
                    },
                    {
                        type: "search",
                        tableSearch: "DMDT",
                        itemView: ListItemView.MA_DT,
                        expression: { TEN_DT_KT: 'TEN_DT', DIA_CHI: 'DIA_CHI', MS_THUE: 'MS_THUE' },
                        fField: 'MA_DT',
                        label: "MA_DT",
                        bind: 'MA_DT',
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "input",
                label: "TEN_DT_KT",
                bind: "TEN_DT_KT"
            },
            {
                type: "input",
                label: "DIA_CHI",
                typeInput: "multi",
                bind: "DIA_CHI"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "number",
                        requiredKeys: ["TY_GIA"],
                        visibleIf: "{{TY_GIA!==1}}",
                        label: "TIEN_TT_NT",
                        bind: 'TIEN_TT_NT',
                        format: "rAmountNt",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "TIEN_TT",
                        bind: 'TIEN_TT',
                        format: "rAmount",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "rows",
                style: { backgroundColor: colors.background, padding: 20, borderRadius: 10 },
                fields: [
                    {
                        type: "text",
                        label: "PT_THUE",
                        bind: 'PT_THUE',
                        format: { type: "number", roundNumber: "rPercentage" },
                    },
                    {
                        type: "text",
                        requiredKeys: ["TY_GIA"],
                        visibleIf: "{{TY_GIA!==1}}",
                        label: "TIEN_NT",
                        bind: 'TIEN_NT',
                        format: { type: "number", roundNumber: "rAmountNt" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "TIEN",
                        bind: 'TIEN',
                        format: { type: "number", roundNumber: "rAmount" },
                        style: { flex: 1 }
                    }
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

export const psthue: ISchemaWinValue = {
    config: psthue0,
    defaultNew: { NAM: '#NAM#', NGAY_HD: "{{NGAY_CT}}", SO_SERIAL: '', SO_HD: '', NHOM_HD: '1', TIEN_TT_NT: "{{T_TIEN_TT_NT}}", TIEN_TT: "{{T_TIEN_TT}}" },
    zod: {
        MA_THUE: { type: 'string' },
        TK_NO: { type: 'string', msgError: '...' },
        TK_CO: { type: 'string' },
        TIEN_TT: { type: 'number' },
    }
}