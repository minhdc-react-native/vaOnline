import { theme } from "@/theme/theme";
import { ISchemaWin, ISchemaWinValue } from "..";
const colors = theme.colors;
const dmkho0: ISchemaWin = {
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
                        bind: "MA_KHO",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: "TK_KHO"
                    }
                ]
            },
            {
                type: "text",
                bind: "TEN_KHO"
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
                        label: "MA_KHO",
                        bind: "MA_KHO",
                        textStyle: { fontWeight: "bold", color: colors.secondary },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        label: "TK_KHO",
                        bind: "TK_KHO",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "text",
                label: "TEN_KHO",
                bind: "TEN_KHO"
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
                        label: "MA_KHO",
                        bind: "MA_KHO",
                        style: { flex: 1 }
                    },
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        fDisplay: { fValue: 'id' },
                        checkSelected: { isError: "{{BOLD==='C'}}", message: "Bạn phải chọn tài khoản chi tiết", requiredKeys: ["BOLD"] },
                        label: "TK_KHO",
                        bind: "TK_KHO",
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: "input",
                label: "TEN_KHO",
                bind: "TEN_KHO"
            },
            // {
            //     type: "selectList",
            //     tableWin: "Empty",
            //     label: "KHO_ME",
            //     bind: "KHO_ME"
            // }
        ]
    }
}

export const dmkho: ISchemaWinValue = {
    dataSource: {
        TK_KHO: 'DMTK'
    },
    fieldSearch: 'TEN_KHO',
    config: dmkho0,
    defaultNew: {},
    zod: {
        MA_KHO: { type: 'string', msgError: '...' },
        TEN_KHO: { type: 'string' },
    }
}