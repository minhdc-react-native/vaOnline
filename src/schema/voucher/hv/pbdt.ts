import { ISchemaWin, ISchemaWinValue } from "@/schema";
import { theme } from "@/theme/theme";
const colors = theme.colors;
const pbdt0: ISchemaWin = {
    itemAction: {
        type: "cols",
        fields: []
    },
    itemList: {
        type: "cols",
        fields: [
            {
                type: "rows",
                style: { alignItems: "center", justifyContent: "space-between" },
                fields: [
                    {
                        type: "text",
                        bind: "TK_DT",
                        textStyle: { fontWeight: "bold" },
                        style: { flex: 1 }
                    },
                    {
                        type: "text",
                        bind: 'DOANH_THU_PB',
                        format: { type: "number", roundNumber: "rAmount" },
                    }
                ]
            },
            { type: "line" },
            {
                type: "text",
                requiredKeys: ['MA_HV', 'TEN_HV'],
                label: "{{`${MA_HV} - ${TEN_HV}`}}"
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
        ]
    }
}

export const pbdt: ISchemaWinValue = {
    config: pbdt0,
    defaultNew: { DPHV_id: "{{id}}", NAM: '#NAM#', MA_DT: "{{MA_DT0}}" }, require: true,
    action: { new: false, edit: false },
    zod: {
        TK_NO: { type: 'string', msgError: '...' },
        TK_CO: { type: 'string' },
        TIEN: { type: 'number' },
    }
}