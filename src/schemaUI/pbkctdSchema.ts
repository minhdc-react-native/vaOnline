import { ISchemaForm } from "@/components/UIEngine/types";
import { ListItemView } from "@/schema/voucher/itemView";
import * as z from "zod";
import { zRequiredString } from "./zodHelpers";

export const pbKcTdSchema: ISchemaForm = {
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
            }
        ]
    },
    dataDefault: {
        task: false, TheoThang: 1, Ct_Sp: 'A', Ngay1: '', Ngay2: '',
        Qd_ad: null, LstOrd_grp: ''
    },
    zod: z.object({
        ngay1: zRequiredString('...'),
        ngay2: zRequiredString('...')
    })
}