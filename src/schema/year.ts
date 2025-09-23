import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from ".";
const colors = theme.colors;
const year0: ISchemaWin = {
    itemAction: {
        type: "cols",
        fields: []
    },
    itemList: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ["NAM"],
                bind: "NAM",
            }
        ]
    },

    itemShow: {
        type: "cols",
        fields: []
    },
    itemEdit: {
        type: "cols",
        fields: []
    }
}
export const year: ISchemaWinValue = {
    config: year0,
    defaultNew: {},
    zod: {}
}