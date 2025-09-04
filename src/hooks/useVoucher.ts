import { api } from "@/utils/apiMethods";
import { useCallback } from "react";
import { useDataApp } from "./zustand/useDataApp";

export const useVoucherHv = (voucherCode?: string) => {
    const listVoucher2 = useDataApp((state) => state.listVoucher2);
    const orgUnit = useDataApp((state) => state.orgUnit);
    const currentYear = useDataApp((state) => state.currentYear);
    const isHt2 = listVoucher2.includes(voucherCode ?? '***');
    const tangSoCt = useCallback(async (data: IData, NGAY_CT?: string) => {
        let change: any = {};
        if (data.MA_CT !== undefined) {
            const url = `dvcs=${orgUnit}&nam=${currentYear}&ma_ct=${data.MA_CT}&ma_ht=${data.MA_HT ?? ''}&ngay=${NGAY_CT || data.NGAY_CT}`;
            const res = await api.get({ link: `/api/System/TangSoCT?${url}` });
            change = { ...change, SO_CT: res.soct };
        }
        return change;
    }, [currentYear, orgUnit]);
    return {
        isHt2,
        tangSoCt
    }
}

export const useVoucherKt = (voucherCode: string) => {

}