import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
const colors = theme.colors;
const dmhv_gia0: ISchemaWin = {
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
                bind: "GHI_CHU",
                textStyle: { color: colors.secondary },
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "text",
                        bind: "GIA_N",
                        format: { type: "number", roundNumber: "rPrice" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "GIA_B",
                        format: { type: "number", roundNumber: "rPrice" },
                        style: { flex: 1 }
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
                type: "input",
                label: "GHI_CHU",
                bind: "GHI_CHU"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "number",
                        label: "GIA_N",
                        bind: "GIA_N",
                        format: "rPrice",
                        style: { flex: 1 }
                    },
                    {
                        type: "number",
                        label: "GIA_B",
                        bind: "GIA_B",
                        format: "rPrice",
                        style: { flex: 1 }
                    }
                ]
            }
        ]
    }
}

export const dmhv_gia: ISchemaWinValue = {
    config: dmhv_gia0,
    defaultNew: { DMHV_id: "{{id}}" }
}