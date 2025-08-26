import { VcReferences } from "@/constants/vcData";
import { zRequiredString } from "@/schemaUI/zodHelpers";
import { theme } from "@/theme/theme";
import z from "zod";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmtk0: ISchemaWin = {
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
                        bind: "TK",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "KIEU_TK",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "text",
                bind: "TEN_TK"
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
                        label: "TK",
                        bind: "TK",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "KIEU_TK",
                        bind: "KIEU_TK",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "text",
                label: "TEN_TK",
                bind: "TEN_TK"
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
                        type: "input",
                        label: "TK",
                        bind: "TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        label: "KIEU_TK",
                        bind: "KIEU_TK",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_TK",
                bind: "TEN_TK"
            },
            {
                type: "input",
                label: "TEN_TKE",
                bind: "TEN_TKE"
            },
            {
                type: "input",
                label: "SO_TK",
                bind: "SO_TK"
            },
            {
                type: "search",
                tableSearch: "DMMNGH",
                fField: "TEN_NGH",
                expression: { MA_CITAD: 'MA_CITAD' },
                label: "TEN_NGH",
                bind: "TEN_NGH"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "MA_CITAD",
                        bind: "MA_CITAD",
                        disabled: true,
                        style: { flex: 1 }
                    },
                    {
                        type: "search",
                        tableSearch: "DMMCN",
                        fField: "MA_CN",
                        label: "MA_CN",
                        bind: "MA_CN",
                        style: { flex: 1 }
                    },
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "TINH_TH",
                        bind: "TINH_TH",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        fValue: 'id',
                        label: "MA_KM",
                        bind: "MA_KM",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "expand",
                title: "THONGTIN_KHAC",
                disabled: true,
                expanded: true,
                containerStyle: { gap: 10 },
                styleHeader: { justifyContent: "center" },
                fields: [
                    {
                        type: "rows",
                        fields: [
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_DT",
                                bind: "TK_DT",
                                style: { flex: 1 }
                            },
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_HDG",
                                bind: "TK_HDG",
                                style: { flex: 1 }
                            },
                        ]
                    },
                    {
                        type: "rows",
                        fields: [
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_KM",
                                bind: "TK_KM",
                                style: { flex: 1 }
                            },
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_NT",
                                bind: "TK_NT",
                                style: { flex: 1 }
                            },
                        ]
                    },
                    {
                        type: "rows",
                        fields: [
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_PX",
                                bind: "TK_PX",
                                style: { flex: 1 }
                            },
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_Z",
                                bind: "TK_Z",
                                style: { flex: 1 }
                            },
                        ]
                    },
                    {
                        type: "rows",
                        fields: [
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_NB",
                                bind: "TK_NB",
                                style: { flex: 1 }
                            },
                            {
                                type: "checkbox",
                                align: "right",
                                label: "TK_CT",
                                bind: "TK_CT",
                                style: { flex: 1 }
                            },
                        ]
                    },
                ]
            },
        ]
    }
}

export const dmtk: ISchemaWinValue = {
    dataSource: {
        KIEU_TK: VcReferences.KIEU_TK,
        MA_KM: VcReferences.DMKM,
    },
    fieldSearch: 'TEN_TK',
    config: dmtk0,
    defaultNew: {
        NAM: '#NAM#', KIEU_TK: 1,
        TK_CT: '', TK_DT: '', TK_HDG: '', TK_KM: '', TK_NB: '', TK_NT: '', TK_PX: '', TK_Z: ''
    },
    zod: z.object({
        TK: zRequiredString('???'),
        TEN_TK: zRequiredString('???')
    })
}