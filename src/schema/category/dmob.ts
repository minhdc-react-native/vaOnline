import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmob0: ISchemaWin = {
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
                bind: "ONG_BA",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "rows",
                requiredKeys: ['DIEN_THOAI', 'MS_THUE'],
                visibleIf: "{{isNotEmpty(DIEN_THOAI) || isNotEmpty(MS_THUE)}}",
                fields: [
                    {
                        type: "text",
                        bind: "DIEN_THOAI",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "MS_THUE",
                        style: { flex: 1 }
                    }
                ]
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
                type: "text",
                label: "ONG_BA",
                bind: "ONG_BA",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        label: "DIEN_THOAI",
                        bind: "DIEN_THOAI",
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        style: { flex: 1 }
                    }
                ]
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
                type: "input",
                label: "ONG_BA",
                bind: "ONG_BA"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "input",
                        label: "DIEN_THOAI",
                        bind: "DIEN_THOAI",
                        style: { flex: 1 }
                    },
                    {
                        type: "input",
                        label: "MS_THUE",
                        bind: "MS_THUE",
                        style: { flex: 1 }
                    }
                ]
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

export const dmob: ISchemaWinValue = {
    fieldSearch: 'TEN_PX',
    config: dmob0,
    defaultNew: {},
    zod: {
        ONG_BA: { type: 'string', msgError: '...' }
    }
}