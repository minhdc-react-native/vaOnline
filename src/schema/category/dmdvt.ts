import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmdvt0: ISchemaWin = {
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
                bind: "DVT",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            }
        ]
    },
    itemShow: {
        type: "cols",
        fields: [
            {
                type: "text",
                label: "DVT",
                bind: "DVT",
                textStyle: { fontWeight: "bold", color: colors.secondary }
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
                        label: "DVT",
                        bind: "DVT",
                        style: { flex: 1 }
                    },
                    {
                        type: "empty",
                        style: { flex: 1 }
                    }
                ]
            }
        ]
    }
}

export const dmdvt: ISchemaWinValue = {
    fieldSearch: 'DVT',
    config: dmdvt0,
    defaultNew: {},
    zod: {
        DVT: { type: 'string', msgError: '...' }
    }
}