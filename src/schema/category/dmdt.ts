import { VcReferences } from "@/constants/vcData";
import { zRequiredString } from "@/schemaUI/zodHelpers";
import { theme } from "@/theme/theme";
import z from "zod";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmdt0: ISchemaWin = {
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
                        bind: "MA_NH_DT",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "LOAI_DT",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "MS_THUE",
                        textStyle: { fontWeight: "bold" },
                        requiredKeys: ['MS_THUE'],
                        visibleIf: "{{isNotEmpty(MS_THUE)}}",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "MA_DT",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "text",
                textStyle: { color: colors.secondary },
                bind: "TEN_DT"
            },
            {
                type: "text",
                requiredKeys: ['DIA_CHI'],
                visibleIf: "{{isNotEmpty(DIA_CHI)}}",
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
                        label: "MA_NH_DT",
                        bind: "MA_NH_DT",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "LOAI_DT",
                        bind: "LOAI_DT",
                        format: { type: "status" }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "MA_DT",
                        bind: "MA_DT",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "text",
                label: "TEN_DT",
                bind: "TEN_DT"
            },
            // {
            //     type: "text",
            //     label: "DIA_CHI",
            //     bind: "DIA_CHI"
            // }
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
                        label: "MA_NH_DT",
                        bind: "MA_NH_DT",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        clean: false,
                        tableWin: "Empty",
                        label: "LOAI_DT",
                        bind: "LOAI_DT",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        typeInput: "taxCode",
                        expression: { MA_DT: "id", TEN_DT: "CompanyName", DIA_CHI: "Address", GHI_CHU: "Status" },
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "MA_DT",
                        bind: "MA_DT",
                        style: { flex: 1 }
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
                type: "input",
                label: "DIA_CHI",
                typeInput: "multi",
                bind: "DIA_CHI"
            }
        ]
    }
}

export const dmdt: ISchemaWinValue = {
    dataSource: {
        MA_NH_DT: VcReferences.DMNHDT,
        LOAI_DT: VcReferences.LOAI_DT,
    },
    config: dmdt0,
    fieldSearch: 'INFO_FILTER COLLATE SQL_Latin1_General_CP1_CI_AI', isRmTone: true,
    defaultNew: { LOAI_DT: 2 }, dataMaster: ['id'],
    zod: z.object({
        MA_NH_DT: zRequiredString('???'),
        MA_DT: zRequiredString('???'),
        TEN_DT: zRequiredString('???')
    })
}