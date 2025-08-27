import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
const colors = theme.colors;
const dmdt_ngh0: ISchemaWin = {
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
                        bind: "MA_NGH",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "SO_TK",
                        textStyle: {
                            paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5,
                            backgroundColor: colors.elevation.level1,
                            borderWidth: 0.5, borderColor: colors.elevation.level5
                        },
                    }
                ]
            },
            {
                type: "text",
                bind: "TAI_NGH"
            },
            {
                type: "text",
                requiredKeys: ["DC_NGH"],
                visibleIf: "{{isNotEmpty(DC_NGH)}}",
                bind: "DC_NGH"
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
                tableSearch: "DMMNGH",
                fField: "TEN_NGH",
                expression: { MA_NGH: 'MA_NGH', MA_CITAD: 'MA_CITAD' },
                label: "TAI_NGH",
                bind: "TAI_NGH"
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
                        type: "input",
                        label: "MA_NGH",
                        bind: "MA_NGH",
                        disabled: true,
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "SO_TK",
                        bind: "SO_TK",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "DIEN_THOAI",
                        bind: "DIEN_THOAI",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "DC_NGH",
                bind: "DC_NGH"
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

export const dmdt_ngh: ISchemaWinValue = {
    config: dmdt_ngh0,
    defaultNew: { DMDT_id: "{{id}}" }, require: false,
    zod: {
        TAI_NGH: { type: 'string', msgError: '...' },
        SO_TK: { type: 'string' },
    }
}