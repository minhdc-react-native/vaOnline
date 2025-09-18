import { IRowsColsField } from "@/components/UIEngine/types";
import { theme } from "@/theme/theme";
const colors = theme.colors;
export const getListItemView = (id: string, value: string): IRowsColsField => {
    return {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: [id, value],
                label: "{{`${" + id + "} - ${" + value + "}`}}"
            }
        ]
    };
};
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
    ID: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ['id'],
                label: "{{id}}"
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


export const ItemViewIdKey: Record<string, string> = {};

export const ItemViewValueKey: Record<string, string> = {
    '65a4c6d2-481b-451b-bb6f-ff193512c547': 'TEN_V', // đơn vị
    '0a93c38b-5f1f-422a-8039-a6cee1967af2': 'TEN_TK', // tài khoản
    '33291373-09c3-4c08-bec8-c3a724b42f15': 'TEN_LF', // Loại phí
    'bc6431f9-ed8b-4d67-a734-e8e5aa8efacd': 'TEN_LF', // Loại phí
    '826995ba-7dca-4f36-9569-6c2ba101bffe': 'TEN_NH_TS', // nhóm tài sản
    '1975aaa2-6e6e-4c76-b81d-66987e327fb7': 'TEN_NH_TS', // nhóm công cụ
    '01e14b5c-6e30-4b31-ae1d-4abbf7ed49d2': 'TEN_NH_TS', // chứng từ
    '86de5f41-4277-4a91-bf68-16acc89295c4': 'TEN_DT', // đối tượng
    '98665935-a3db-487e-8bc5-2a63515972b5': 'TEN_NT', // ngoại tệ
    '08790464-f168-49e6-97ea-2cb670e2139d': 'TEN_BP', // bộ phận
    '4fcca1d7-9011-4b4f-b9e8-721a546aa637': 'TEN_VV', // vụ việc
    'dbbd3c73-280c-4d5f-8e93-06b0cbbfee2d': 'TEN_VV', // vụ việc
    '49e80ac4-2b07-47ef-8297-6efb2074fbdd': 'TEN_KM', // khoản mục
};

export const getListItemViewByRefId = (id: string) => {
    return getListItemView(ItemViewIdKey[id] ?? 'id', ItemViewValueKey[id] ?? 'value');
}
