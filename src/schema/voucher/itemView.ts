import { IRowsColsField } from "@/components/UIEngine/types";
import { theme } from "@/theme/theme";
const colors = theme.colors;
export const ListItemView: Record<string, IRowsColsField> = {
    MA_NT: {
        type: "rows",
        style: { justifyContent: "space-between" },
        fields: [
            {
                type: "text",
                requiredKeys: ['MA_NT', 'TEN_NT'],
                label: '{{`${MA_NT} - ${TEN_NT}`}}'
            },
            {
                type: "text",
                bind: 'TY_GIA',
                format: { type: "number", roundNumber: "rExchangeRate" }
            }
        ]
    },
    MA_DT: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['MA_DT', 'TEN_DT'],
                label: "{{`${MA_DT} - ${TEN_DT}`}}"
            }
        ]
    },
    NHOM_HD: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['MA_NHOM', 'TEN_NHOM'],
                label: "{{`${MA_NHOM} - ${TEN_NHOM}`}}"
            }
        ]
    },
    MA_THUE: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['MA_THUE', 'TEN_THUE'],
                label: "{{`${MA_THUE} - ${TEN_THUE}`}}"
            }
        ]
    },
    VALUE: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['value'],
                label: "{{value}}"
            }
        ]
    },
    MA_HV: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['MA_HV', 'TEN_HV', 'DVT'],
                label: "{{`${MA_HV} - ${TEN_HV} (${DVT})`}}"
            }
        ]
    },
}