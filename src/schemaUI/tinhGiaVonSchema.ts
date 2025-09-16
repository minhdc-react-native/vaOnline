import { ISchemaForm } from "@/components/UIEngine/types";
import { ListItemView } from "@/schema/voucher/itemView";
import * as z from "zod";
import { zRequiredString } from "./zodHelpers";

export const tinhGiaVonSchema: ISchemaForm = {
    view: {
        type: "cols",
        fields: [
            {
                type: "rows",
                style: { justifyContent: "space-between", alignItems: "center" },
                fields: [
                    {
                        type: "button",
                        label: "THUC_HIEN",
                        actionName: "onConfirm",
                        style: { flex: 1 }
                    },
                    {
                        type: "checkbox",
                        label: 'Chạy nền',
                        bind: 'task'
                    }
                ]
            },
            {
                type: "selectList",
                tableWin: "Empty",
                label: "LIST_TIME",
                itemView: ListItemView.VALUE,
                bind: "list_time"
            },
            {
                type: "rows",
                fields: [
                    {
                        type: "date",
                        label: 'NGAY_CT1',
                        bind: 'ngay1',
                        style: { flex: 1 }
                    },
                    {
                        type: "date",
                        label: 'NGAY_CT2',
                        bind: 'ngay2',
                        style: { flex: 1 }
                    }
                ]
            },
            {
                type: 'option',
                label: 'PP tính',
                bind: 'type'
            },
            {
                type: "rows",
                style: { justifyContent: "space-between" },
                requiredKeys: ['type'],
                visibleIf: "{{type===1}}",
                fields: [
                    {
                        type: "checkbox",
                        requiredKeys: ['type'],
                        visibleIf: "{{type===1}}",
                        label: 'THEO_THANG',
                        bind: 'Lh_thang'
                    },
                    {
                        type: "empty"
                    }
                ]
            },
            {
                type: 'option',
                requiredKeys: ['type'],
                visibleIf: "{{type===3}}",
                label: 'Loại Fifo',
                bind: 'fifo'
            },
        ]
    },
    dataDefault: {
        task: false, Lh_thang: 1, type: 1, ngay1: '', ngay2: '',
        loai_hv: '*', ma_kho: '', ma_nh_hv: '', ma_hv: '', ma_lh: '', ma_ng: '', ma_sx: ''
    },
    zod: z.object({
        ngay1: zRequiredString('...'),
        ngay2: zRequiredString('...')
    })
}