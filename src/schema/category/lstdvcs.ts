import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const lstdvcs0: ISchemaWin = {
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
                bind: "DVCS_ID",
                textStyle: { fontWeight: "bold" }
            },
            {
                type: "text",
                requiredKeys: ['MS_THUE', 'TEN_V'],
                textStyle: { color: colors.secondary },
                label: "{{`${MS_THUE} - ${TEN_V}`}}"
            },
            {
                type: "text",
                variant: "bodyMedium",
                bind: "DIA_CHI"
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
                        label: "DVCS_ID",
                        bind: "DVCS_ID",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "text",
                label: "TEN_V",
                bind: "TEN_V"
            },
            {
                type: "text",
                label: "DIA_CHI",
                bind: "DIA_CHI"
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
                        label: "DVCS_ID",
                        bind: "DVCS_ID",
                        requiredKeys: ["_isNew"],
                        disabled: "{{!_isNew}}",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        expression: { MS_THUE: "id", TEN_V: "CompanyName", GIAM_DOC: "Owner", DIA_CHI: "Address", DIACHI_NOP: "Address", MO_TA: "Status", GHI_CHU: "Status" },
                        typeInput: "taxCode",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "input",
                label: "TEN_V",
                bind: "TEN_V",
                typeInput: "multi"
            },
            {
                type: "input",
                label: "TEN_E",
                bind: "TEN_E"
            },
            {
                type: "input",
                label: "DIA_CHI",
                bind: "DIA_CHI"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "GIAM_DOC",
                        bind: "GIAM_DOC",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "KT_TRUONG",
                        bind: "KT_TRUONG",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "TINH",
                        bind: "TINH",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "HUYEN",
                        bind: "HUYEN",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "input",
                label: "MO_TA",
                bind: "MO_TA",
                typeInput: "multi"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                label: "MA_NGANHNGHE",
                bind: "MA_NGANHNGHE"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "MA_CQTHUE",
                        bind: "MA_CQTHUE",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "TEN_CQTHUE",
                        bind: "TEN_CQTHUE",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "input",
                label: "DIACHI_NOP",
                bind: "DIACHI_NOP",
                typeInput: "multi"
            }
        ]
    }
}

export const lstdvcs: ISchemaWinValue = {
    dataSource: {
        MA_NGANHNGHE: 'MA_NGANHNGHE'
    },
    fieldSearch: 'TEN_V',
    config: lstdvcs0,
    defaultNew: {},
    zod: {
        DVCS_ID: { type: 'string', msgError: '...' },
        MS_THUE: { type: 'string' },
        TEN_V: { type: 'string' },
    }
}