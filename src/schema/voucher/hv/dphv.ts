import { VcReferences } from "@/constants/vcData";
import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
import { ListItemView } from "../itemView";
const colors = theme.colors;
const dphv0: ISchemaWin = {
    filterConfig: {
        title: 'Lọc chứng từ',
        dataSource: {
            p_MA_NT: VcReferences.p_MA_NT
        },
        values: { p_DVCS_ID: "#DVCS_ID#", p_USER: "#USER_LOGIN#", p_MA_NT: "*", p_NGAY_CT1: '', p_NGAY_CT2: '', p_MA_DT: '', timeItem: null },
        valueIgnoreFilter: ['timeItem'],
        hideFilter: ['p_DVCS_ID', 'p_USER'],
        view: {
            type: "cols",
            fields: [
                {
                    type: "rows",
                    fields: [
                        {
                            type: "date",
                            label: "TU_NGAY",
                            bind: 'p_NGAY_CT1',
                            style: { flex: 1 }
                        },
                        {
                            type: "date",
                            label: "DEN_NGAY",
                            bind: 'p_NGAY_CT1',
                            style: { flex: 1 }
                        }
                    ]
                },
                {
                    type: "rows",
                    fields: [
                        {
                            type: "selectList",
                            itemView: ListItemView.VALUE,
                            clean: false,
                            tableWin: "Empty",
                            label: "MA_NT",
                            bind: 'p_MA_NT',
                            style: { flex: 1 }
                        },
                        {
                            type: "search",
                            tableSearch: "DMDT",
                            itemView: ListItemView.MA_DT,
                            fField: 'MA_DT',
                            label: "MA_DT",
                            bind: 'p_MA_DT',
                            style: { flex: 1 }
                        }
                    ]
                }
            ]
        },
        valuesType: {
            p_NGAY_CT1: { columnType: "date" },
            p_NGAY_CT2: { columnType: "date" }
        },
        isSelectTime: { from: 'p_NGAY_CT1', to: 'p_NGAY_CT2' },
        zod: {
            p_NGAY_CT1: { type: "string" },
            p_NGAY_CT2: { type: "string" }
        }
    },
    itemAction: {
        type: "rows",
        fields: [
            {
                type: "cols",
                style: { gap: 0, flex: 1 },
                fields: [
                    {
                        type: "actionList",
                        style: { backgroundColor: "red" },
                        actionName: "deleteItem",
                        typeButton: "btnOnlyOneTop",
                        fields: [
                            {
                                type: "icon",
                                iconType: "I",
                                name: "trash",
                                color: "#fff"
                            }
                        ]
                    },
                    {
                        type: "actionList",
                        style: { backgroundColor: "blue" },
                        actionName: "printItem",
                        typeButton: "btnOnlyOneBottom",
                        fields: [
                            {
                                type: "icon",
                                iconType: "I",
                                name: "print",
                                color: "#fff"
                            }
                        ]
                    }
                ]
            },
        ]
    },
    itemList: {
        type: "cols",
        fields: [
            {
                type: "rows",
                style: { justifyContent: "space-between" },
                fields: [
                    {
                        type: "text",
                        bind: "STATUS",
                        format: { type: 'status' }
                    },
                    { type: "empty", style: { flex: 1 } },
                    {
                        type: "text",
                        bind: "T_TIEN_NT",
                        requiredKeys: ['TY_GIA'],
                        visibleIf: "{{TY_GIA!==1}}",
                        format: { type: "number", roundNumber: "rAmountNt" },
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "text",
                        bind: "T_TIEN",
                        requiredKeys: ['TY_GIA'],
                        visibleIf: "{{TY_GIA===1}}",
                        format: { type: "number", roundNumber: "rAmount" },
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "text",
                        bind: "MA_NT"
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "SO_CT",
                        textStyle: { fontWeight: "bold" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "NGAY_CT",
                        format: { type: 'date' }
                    }
                ]
            },
            // {
            //     type: "rows",
            //     fields: [
            //         {
            //             type: "text",
            //             bind: "MA_NT",
            //             style: { flex: 1 }
            //         },
            //         {
            //             type: "text",
            //             bind: "TY_GIA",
            //             format: { type: "number", roundNumber: "rExchangeRate" },
            //             style: { flex: 1 }
            //         }
            //     ]
            // },
            {
                type: "text",
                requiredKeys: ['MA_DT', 'TEN_DT'],
                visibleIf: "{{isNotEmpty(MA_DT)}}",
                label: "{{`${MA_DT} - ${TEN_DT}`}}",
                textStyle: { color: colors.secondary }
            },
            {
                type: "text",
                bind: "DIEN_GIAI",
                variant: "bodyMedium"
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "STATUS",
                        format: { type: 'status' }
                    },
                    { type: "empty", style: { flex: 1 } }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "MA_NT",
                        bind: "MA_NT",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "TY_GIA",
                        bind: "TY_GIA",
                        format: { type: "number", roundNumber: "rExchangeRate" },
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "SO_CT",
                        bind: "SO_CT",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "NGAY_CT",
                        bind: "NGAY_CT",
                        format: { type: 'date' },
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "MA_DT0",
                        bind: "MA_DT0",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "T_TIEN_NT",
                        bind: "T_TIEN_NT",
                        requiredKeys: ['TY_GIA'],
                        visibleIf: "{{TY_GIA!==1}}",
                        format: { type: "number", roundNumber: "rAmountNt" },
                        textStyle: { fontWeight: "bold" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "T_TIEN",
                        bind: "T_TIEN",
                        requiredKeys: ['TY_GIA'],
                        visibleIf: "{{TY_GIA===1}}",
                        format: { type: "number", roundNumber: "rAmount" },
                        textStyle: { fontWeight: "bold" },
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "text",
                requiredKeys: ['TEN_DT'],
                visibleIf: "{{isNotEmpty(TEN_DT)}}",
                label: "TEN_DT",
                bind: "TEN_DT"
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
                        type: "selectList",
                        tableWin: "Empty",
                        clean: false,
                        label: "MA_NT",
                        bind: "MA_NT",
                        expression: { TY_GIA: 'TY_GIA' },
                        itemView: ListItemView.MA_NT,
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "TY_GIA",
                        bind: "TY_GIA",
                        format: "rExchangeRate",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "date",
                        label: "NGAY_CT",
                        bind: "NGAY_CT",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "SO_CT",
                        bind: "SO_CT",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "search",
                        tableSearch: "DMDT",
                        fField: 'MA_DT',
                        expression: { TEN_DT0: 'TEN_DT', DIA_CHI: 'DIA_CHI', ONG_BA: 'DAI_DIEN' },
                        itemView: ListItemView.MA_DT,
                        label: "MA_DT0",
                        bind: "MA_DT0",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        clean: false,
                        label: "STATUS",
                        bind: "STATUS",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_DT0",
                typeInput: "multi",
                bind: "TEN_DT0"
            },
            {
                type: "input",
                label: "DIEN_GIAI",
                typeInput: "multi",
                bind: "DIEN_GIAI"
            },
            {
                type: "expand",
                title: "Thông tin bổ xung...",
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
                                label: "TK_NO_DB",
                                bind: "TK_NO_DB",
                                keySource: "TK",
                                style: { flex: 1 }
                            },
                            {
                                type: "selectList",
                                clean: false,
                                tableWin: "Empty",
                                fDisplay: { fValue: "id" },
                                checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                                label: "TK_CO_DB",
                                bind: "TK_CO_DB",
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
                                label: "TK_NO_CK",
                                bind: "TK_NO_CK",
                                keySource: "TK",
                                style: { flex: 1 }
                            },
                            {
                                type: "selectList",
                                clean: false,
                                tableWin: "Empty",
                                fDisplay: { fValue: "id" },
                                checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                                label: "TK_CO_CK",
                                bind: "TK_CO_CK",
                                keySource: "TK",
                                style: { flex: 1 }
                            },
                        ]
                    },
                ]
            }
        ]
    }
}

export const dphv: ISchemaWinValue = {
    dataSource: {
        TK: 'DMTK',
        MA_NT: 'DMNT',
        STATUS: 'STATUS',
        DMNHOMHD: 'DMNHOMHD',
        DVT_CB: 'DVT_CB'
    },
    config: dphv0,
    fieldSearch: 'INFO_FILTER COLLATE SQL_Latin1_General_CP1_CI_AI', isRmTone: true,
    defaultNew: { NAM: '#NAM#', NGAY_CT: '#TODAY#', MA_NT: '#MA_NT#', TY_GIA: '#TY_GIA#', STATUS: 1 },
    dataMaster: ['id', 'NGAY_CT', 'TY_GIA', 'T_TIEN_TT_NT', 'T_TIEN_TT', 'DIEN_GIAI', 'MA_DT0', 'TK_HT'],
    addDetails: ['TY_GIA', 'MA_CT', 'NHOM_CT', 'MA_NT', 'TK_HT'],
    zod: {
        NGAY_CT: { type: 'string', msgError: '...' },
        SO_CT: { type: 'string' },
        MA_NT: { type: 'string' },
        TY_GIA: { type: 'number' }
    }
}