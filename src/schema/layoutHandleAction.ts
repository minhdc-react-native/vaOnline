import { IHandleAction } from ".";
import { getListItemView } from "./voucher/itemView";

export const layoutHandleAction: IHandleAction = {
    printItem: (dataMap: Record<string, any[]>) => {
        return {
            title: "In mẫu",
            dataSource: {
                id: {
                    data: dataMap.printTemplateId ?? []
                }
            },
            values: { id: '', NAME: '', REPORT_FILE: '' },
            view: {
                type: "cols",
                fields: [
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        bind: "id",
                        expression: { NAME: 'value', REPORT_FILE: 'REPORT_FILE' },
                        label: "Chọn mẫu in"
                    }
                ]
            },
            zod: {
                id: { type: "string" }
            }
        }
    },
    exportInvoice: {
        title: "Mẫu hoá đơn",
        dataSource: {
            khhdon: { url: `/api/HoaDon/GetMauHD_TT78?dvcs_id=#DVCS_ID#` }
        },
        values: { khhdon: '' },
        view: {
            type: "cols",
            fields: [
                {
                    type: "selectList",
                    tableWin: "Empty",
                    bind: "khhdon",
                    itemView: getListItemView('khhdon', 'invoiceTypeName'),
                    fId: 'khhdon', fValue: 'invoiceTypeName',
                    label: "Chọn mẫu hoá đơn"
                }
            ]
        },
        zod: {
            khhdon: { type: "string" }
        }
    },
}