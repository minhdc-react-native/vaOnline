import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
import { getListItemView, ListItemView } from "../itemView";
const colors = theme.colors;

const requiredKeysMa_hv = ['_isHt2', 'NHOM_CT', 'MA_CT', 'TK_HT'];
const expressionMa_hv = `{{
    { 
        TEN_HV: 'TEN_HV',TEN_HV0:'TEN_HV',DVT_CB:'DVT',
        ...(_isHt2 && NHOM_CT==='2' && { TK_NO2: TK_HT }),
        ...(_isHt2 && NHOM_CT==='2' && { TK_CO2: 'TK_DTHU' }),
        ...(_isHt2 && NHOM_CT==='2' && { TK_NO: 'TK_GV' }),
        ...(_isHt2 && NHOM_CT==='2' && { TK_CO: 'TK_HV' })
    }
}}`;

const expressionIfEmptyMa_hv = `{{
    [
        ...(_isHt2 && NHOM_CT==='2'?['TK_NO2']:[])
    ]
}}`;

const cthv0: ISchemaWin = {
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
                requiredKeys: ['MA_HV', 'DVT_CB', 'TEN_HV'],
                label: "{{`${MA_HV} / ${DVT_CB} - ${TEN_HV}`}}",
                textStyle: { fontWeight: "bold", color: colors.secondary },
                style: { flex: 1 }
            },
            { type: "line" },
            {
                type: "rows",
                style: { justifyContent: "space-between" },
                fields: [
                    {
                        type: "text",
                        label: 'SO_LUONG',
                        bind: 'SO_LUONG',
                        format: { type: "number", roundNumber: "rQuantity" },
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "text",
                        label: 'GIA2',
                        bind: 'GIA2',
                        format: { type: "number", roundNumber: "rPrice" },
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "text",
                        label: 'TIEN2',
                        bind: 'TIEN2',
                        format: { type: "number", roundNumber: "rAmount" },
                        textStyle: { fontWeight: "bold" }
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
                type: "rows",
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "search",
                        tableSearch: "DMKHO",
                        fField: 'MA_KHO',
                        label: "MA_KHO",
                        bind: 'MA_KHO',
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn kho chi tiết", requiredKeys: ["BOLD"] },
                        style: { flex: 1 }
                    },
                    {
                        type: "search",
                        tableSearch: "DMHV",
                        itemView: ListItemView.MA_HV,
                        requiredKeys: requiredKeysMa_hv,
                        expression: expressionMa_hv,
                        expressionIfEmpty: expressionIfEmptyMa_hv,
                        fField: 'MA_HV',
                        label: "MA_HV",
                        bind: 'MA_HV',
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: 'TEN_HV0',
                bind: 'TEN_HV0'
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                fields: [
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        itemView: ListItemView.VALUE,
                        label: "DVT_CB",
                        bind: 'DVT_CB',
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "SO_LUONG",
                        bind: 'SO_LUONG',
                        format: "rQuantity",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA!==1}}",
                fields: [
                    {
                        type: "number",
                        label: "GIA_NT2",
                        bind: 'GIA_NT2',
                        format: "rPriceNt",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "DOANH_THU_NT",
                        bind: 'TIEN_NT2',
                        format: "rAmountNt",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA===1}}",
                fields: [
                    {
                        type: "number",
                        label: "GIA2",
                        bind: 'GIA2',
                        format: "rPrice",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "DOANH_THU",
                        bind: 'TIEN2',
                        format: "rAmount",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA!==1}}",
                fields: [
                    {
                        type: "number",
                        label: "PT_CK",
                        bind: 'PT_CK',
                        format: "rPercentage",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "T_CK_NT",
                        bind: 'T_CK_NT',
                        format: "rAmountNt",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA===1}}",
                fields: [
                    {
                        type: "number",
                        label: "PT_CK",
                        bind: 'PT_CK',
                        format: "rPercentage",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "T_CK",
                        bind: 'T_CK',
                        format: "rAmount",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA!==1}}",
                fields: [
                    {
                        type: "number",
                        label: "PT_DB",
                        bind: 'PT_DB',
                        format: "rPercentage",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "T_DB_NT",
                        bind: 'T_DB_NT',
                        format: "rAmountNt",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                style: { alignItems: "center" },
                requiredKeys: ['TY_GIA', '_isHt2'],
                visibleIf: "{{_isHt2 && TY_GIA===1}}",
                fields: [
                    {
                        type: "number",
                        label: "PT_DB",
                        bind: 'PT_DB',
                        format: "rPercentage",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "T_DB",
                        bind: 'T_DB',
                        format: "rAmount",
                        style: { flex: 1 }
                    }
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
                                tableSearch: "DMLH",
                                fField: 'MA_LH',
                                label: "MA_LH",
                                itemView: getListItemView('MA_LH', 'TEN_LH'),
                                bind: 'MA_LH',
                                style: { flex: 1 }
                            },
                            {
                                type: "search",
                                tableSearch: "DMNG",
                                fField: 'MA_NG',
                                label: "MA_NG",
                                itemView: getListItemView('MA_NG', 'TEN_NG'),
                                bind: 'MA_NG',
                                style: { flex: 1 }
                            },
                        ]
                    },
                    {
                        type: "rows",
                        requiredKeys: ['_isHt2'],
                        visibleIf: "{{_isHt2}}",
                        fields: [
                            {
                                type: "selectList",
                                clean: false,
                                tableWin: "Empty",
                                fDisplay: { fValue: "id" },
                                checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                                requiredKeys: ['NHOM_CT'],
                                label: "{{NHOM_CT==='2'?'TK_HT':'TK_DTHU'}}",
                                bind: "TK_NO2",
                                keySource: "TK",
                                style: { flex: 1 }
                            },
                            {
                                type: "selectList",
                                clean: false,
                                tableWin: "Empty",
                                fDisplay: { fValue: "id" },
                                checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                                requiredKeys: ['NHOM_CT'],
                                label: "{{NHOM_CT==='2'?'TK_DTHU':'TK_HT'}}",
                                bind: "TK_CO2",
                                keySource: "TK",
                                style: { flex: 1 }
                            },
                        ]
                    },
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
            }
        ]
    }
}

export const cthv: ISchemaWinValue = {
    config: cthv0,
    defaultNew: { DPHV_id: "{{id}}", NAM: '#NAM#' }, require: true,
    zod: {
        MA_HV: { type: 'string', msgError: '...' },
        SO_LUONG: { type: 'number' },
    }
}