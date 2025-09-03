import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
const colors = theme.colors;
const dmhv0: ISchemaWin = {
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
                        bind: "MA_NH_HV",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "LOAI_HV",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "MA_HV",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "BARCODE",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "text",
                bind: "TEN_HV"
            },
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
                        label: "MA_NH_HV",
                        bind: "MA_NH_HV",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "LOAI_HV",
                        bind: "LOAI_HV",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "MA_HV",
                        bind: "MA_HV",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "BARCODE",
                        bind: "BARCODE",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "text",
                label: "TEN_HV",
                bind: "TEN_HV"
            },
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
                        clean: false,
                        tableWin: "Empty",
                        label: "MA_NH_HV",
                        bind: "MA_NH_HV",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "MA_HV",
                        bind: "MA_HV",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_HV",
                typeInput: "multi",
                bind: "TEN_HV"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "QUY_CACH",
                        bind: "QUY_CACH",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        label: "LOAI_HV",
                        bind: "LOAI_HV",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "checkbox",
                        align: "right",
                        label: "THEO_LO",
                        bind: "THEO_LO",
                        style: { flex: 1 }
                    },
                    {
                        type: "checkbox",
                        align: "right",
                        label: "THEO_NG",
                        bind: "THEO_NG",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "number",
                        label: "PT_THUE",
                        bind: "PT_THUE",
                        format: "rPercentage",
                        style: { flex: 1 }
                    },
                    {
                        type: "inputBarcode",
                        label: "BARCODE",
                        bind: "BARCODE",
                        style: { flex: 1 }
                    }
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
                        label: "TK_HV",
                        bind: "TK_HV",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        fDisplay: { fValue: "id" },
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_GV",
                        bind: "TK_GV",
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
                        label: "TK_DTHU",
                        bind: "TK_DTHU",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        fDisplay: { fValue: "id" },
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_HBBTL",
                        bind: "TK_HBBTL",
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
                        label: "TK_CK",
                        bind: "TK_CK",
                        keySource: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        label: "MA_SX",
                        bind: "MA_SX",
                        itemView: {
                            type: "cols",
                            fields: [
                                {
                                    type: 'text',
                                    requiredKeys: ['MA_SX', 'TEN_SX'],
                                    label: "{{`${MA_SX} - ${TEN_SX}`}}"
                                }
                            ]
                        },
                        style: { flex: 1 }
                    },
                ]
            },
        ]
    }
}

export const dmhv: ISchemaWinValue = {
    dataSource: {
        MA_NH_HV: 'DMNHHV',
        LOAI_HV: 'LOAI_HV',
        MA_TTDB: 'DMTTDB',
        MA_SX: 'DMSX',
        TK: 'DMTK'
    },
    config: dmhv0,
    fieldSearch: 'TEN_HV',
    defaultNew: { LOAI_HV: 'H', THEO_NG: 'K', THEO_LO: 'K' }, dataMaster: ['id'],
    zod: {
        MA_NH_HV: { type: 'string', msgError: '...' },
        MA_HV: { type: 'string' },
        TEN_HV: { type: 'string' },
        TK_HV: { type: 'string' }, TK_GV: { type: 'string' }, TK_DTHU: { type: 'string' }, TK_HBBTL: { type: 'string' }, TK_CK: { type: 'string' }
    }
}