import { useDataApp } from "./zustand/useDataApp";

export const useVoucherHv = (voucherCode?: string) => {
    const listVoucher2 = useDataApp((state) => state.listVoucher2);
    const isHt2 = listVoucher2.includes(voucherCode ?? '***');
    return {
        isHt2
    }
}

export const useVoucherKt = (voucherCode: string) => {

}