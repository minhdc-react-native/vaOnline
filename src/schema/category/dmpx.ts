import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmpx0: ISchemaWin = {
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
                bind: "MA_PX",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_PX"
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "text",
                label: "MA_PX",
                bind: "MA_PX",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                label: "TEN_PX",
                bind: "TEN_PX"
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
                        label: "MA_PX",
                        bind: "MA_PX",
                        style: { flex: 1 }
                    },
                    {
                        type: "empty",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_PX",
                bind: "TEN_PX"
            }
        ]
    }
}

export const dmpx: ISchemaWinValue = {
    fieldSearch: 'TEN_PX',
    config: dmpx0,
    defaultNew: {},
    zod: {
        MA_PX: { type: 'string', msgError: '...' },
        TEN_PX: { type: 'string' },
    }
}