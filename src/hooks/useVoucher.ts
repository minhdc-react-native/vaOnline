import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { useCallback } from "react";
import { useDataItemWin } from "./useDataItem";
import { useDataApp } from "./zustand/useDataApp";

const ZERO = 0.0;

const Field = {
    TIEN_TT_NT: 'TIEN_TT_NT',
    TIEN_TT: 'TIEN_TT',
    PT_THUE: 'PT_THUE',
    TIEN_NT: 'TIEN_NT',
    TIEN: 'TIEN'
}
const TableWin = {
    DPKT: 'DPKT',
    CTKT: 'CTKT',
    PSTHUE: 'PSTHUE',
    DPHV: 'DPHV',
    CTHV: 'CTHV',
    PSCF: 'PSCF',
    PBDT: 'PBDT'
}
export const useVoucher = (tableWin: ITableWin, voucherCode?: string, currentTab?: ITabWin, changeOtherDetail?: React.RefObject<boolean>) => {

    const onChangeValue = useDataItemWin((state) => state.onChangeValue);

    const dataMaster = useDataItemWin((state) => state.dataItems[tableWin]);
    const dataDetails = useDataItemWin((state) => state.dataItemDetail[tableWin]?.[currentTab?.TAB_TABLE ?? "Empty"]);

    const { isHt2, changeCtHv, changePsCf, changePbDt } = useVoucherHv(voucherCode, changeOtherDetail);

    const { tangSoCt, changeCtKt, changePsThue } = useVoucherKt(voucherCode, changeOtherDetail);

    const valueChange = useCallback((dataItem: IData | null, change: Record<string, string>) => {
        dataItem = dataItem || { id: '***' };
        let changeDetail: any = {};
        if (!voucherCode || !currentTab) return changeDetail;
        switch (currentTab.TAB_TABLE) {
            case TableWin.CTKT:
                changeDetail = changeCtKt(dataItem, change);
                break;
            case TableWin.PSTHUE:
                changeDetail = changePsThue(dataItem, change);
                break;
            case TableWin.CTHV:
                changeDetail = changeCtHv(dataItem, change);
                break;
            case TableWin.PSCF:
                changeDetail = changePsCf(dataItem, change);
                break;
            case TableWin.PBDT:
                changeDetail = changePbDt(dataItem, change);
                break;
        }
        return changeDetail;
    }, [changeCtHv, changeCtKt, changePbDt, changePsCf, changePsThue, currentTab, voucherCode]);

    const changeOther = useCallback(() => {
        if (!voucherCode || !currentTab) return;
        let changeMaster: Record<string, any> | null = null;
        switch (currentTab.TAB_TABLE) {
            case TableWin.CTKT:
                const totals = sumByFields(dataDetails ?? [], ["TIEN_NT", "TIEN"]);
                changeMaster = {
                    T_TIEN_TT_NT: totals.TIEN_NT,
                    T_TIEN_TT: totals.TIEN,
                    T_TIEN_NT: totals.TIEN_NT + dataMaster?.T_THUE_NT,
                    T_TIEN: totals.TIEN + dataMaster?.T_THUE,
                }
                break;
            case TableWin.CTHV:
                if (isHt2) {
                    // tính TIEN2 ???
                }
                console.log('change detail CTHV>> total?');
                break;
            case TableWin.PSTHUE:
                if (tableWin === TableWin.DPHV) {
                    // phân bổ thuế
                } else {
                    const totals = sumByFields(dataDetails ?? [], ["TIEN_TT_NT", "TIEN_TT", "TIEN_NT", "TIEN"]);
                    if (voucherCode === "VAT") {
                        changeMaster = {
                            T_TIEN_TT_NT: totals.TIEN_TT_NT,
                            T_TIEN_TT: totals.TIEN_TT,
                            T_THUE_NT: totals.TIEN_NT,
                            T_THUE: totals.TIEN,
                            T_TIEN_NT: totals.TIEN_TT_NT + totals.TIEN_NT,
                            T_TIEN: totals.TIEN_TT + totals.TIEN,
                        }
                    } else {
                        changeMaster = {
                            T_THUE_NT: totals.TIEN_NT,
                            T_THUE: totals.TIEN,
                            T_TIEN_NT: dataMaster?.T_TIEN_TT_NT + totals.TIEN_NT,
                            T_TIEN: dataMaster?.T_TIEN_TT + totals.TIEN,
                        }
                    }
                }
                break;
            case TableWin.PSCF:
                console.log('change detail PSCF>> total?');
                break;
        }
        if (changeMaster !== null) onChangeValue(tableWin, changeMaster);
    }, [voucherCode, currentTab, onChangeValue, tableWin, dataMaster, dataDetails, isHt2]);

    return {
        isHt2,
        tangSoCt,
        valueChange,
        changeOther
    }
};
const useVoucherHv = (voucherCode?: string, changeOtherDetail?: React.RefObject<boolean>) => {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const listVoucher2 = useDataApp((state) => state.listVoucher2);
    const isHt2 = listVoucher2.includes(voucherCode ?? '***');
    const changeCtHv = useCallback((dataItem: IData, change: Record<string, string>) => {
        return change;
    }, []);

    const changePsCf = useCallback((dataItem: IData, change: Record<string, string>) => {
        return change;
    }, []);

    const changePbDt = useCallback((dataItem: IData, change: Record<string, string>) => {
        return change;
    }, []);

    return {
        isHt2,
        changeCtHv,
        changePsCf,
        changePbDt
    }
}

const useVoucherKt = (voucherCode?: string, changeOtherDetail?: React.RefObject<boolean>) => {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const currencies = useDataApp((state) => state.currencies);
    const orgUnit = useDataApp((state) => state.orgUnit);
    const currentYear = useDataApp((state) => state.currentYear);
    const tangSoCt = useCallback(async (data: IData, NGAY_CT?: string) => {
        let change: any = {};
        if (data.MA_CT !== undefined) {
            const url = `dvcs=${orgUnit}&nam=${currentYear}&ma_ct=${data.MA_CT}&ma_ht=${data.MA_HT ?? ''}&ngay=${NGAY_CT || data.NGAY_CT}`;
            const res = await api.get({ link: `/api/System/TangSoCT?${url}` });
            change = { ...change, SO_CT: res.soct };
        }
        return change;
    }, [currentYear, orgUnit]);

    const changeCtKt = useCallback((dataItem: IData, change: Record<string, string>) => {
        const isMultiplication = !!currencies?.[dataItem.MA_NT].isMultiplication; //tỷ giá: phép nhân || phép chia
        let changeAdd: any = {};
        Object.keys(change).map(f => {
            switch (f) {
                case Field.TIEN_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN = changeNumberNt(
                        isMultiplication, Number(change.TIEN_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.TIEN:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_NT), Number(change.TIEN), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien) break;
                    changeAdd.TIEN = vTien;
                    break;
            }
        });
        return { ...change, ...changeAdd };
    }, [currencies, paramSystem]);

    const changePsThue = useCallback((dataItem: IData, change: Record<string, string>) => {
        const isMultiplication = !!currencies?.[dataItem.MA_NT].isMultiplication; //tỷ giá: phép nhân || phép chia
        let changeAdd: any = {};
        Object.keys(change).map(f => {
            switch (f) {
                case Field.TIEN_TT_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN_TT = changeNumberNt(
                        isMultiplication, Number(change.TIEN_TT_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.TIEN_TT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_tt = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_TT_NT), Number(change.TIEN_TT), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_tt) break;
                    changeAdd.TIEN_TT = vTien_tt;
                    break;
                case Field.PT_THUE:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd = changeNumberPT(
                        Number(dataItem.TIEN_TT_NT), Number(dataItem.TIEN_TT), Number(change.PT_THUE),
                        paramSystem!.rAmountNt, paramSystem!.rAmount
                    );
                    break;
                case Field.TIEN_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN = changeNumberNt(
                        isMultiplication, Number(change.TIEN_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.TIEN:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_NT), Number(change.TIEN), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien) break;
                    changeAdd.TIEN = vTien;
                    break;
            }
        });
        return { ...change, ...changeAdd };
    }, [changeOtherDetail, currencies, paramSystem]);

    return {
        tangSoCt,
        changeCtKt,
        changePsThue
    };
}

const changeNumberNt = (isMultiplication: boolean, vTien_nt: number, vTy_gia: number, vRound: number): number => {
    return Helper.round(isMultiplication ? vTien_nt * vTy_gia : vTien_nt / vTy_gia, vRound);
}

const changeNumber = (isMultiplication: boolean, vTien_nt: number, vTien: number, vTy_gia: number, vRound: number, minAmountChange: number): number | null => {
    vTien_nt = vTy_gia === 1 ? ZERO : vTien_nt || ZERO;
    if (vTien_nt === 0) return null;
    const vTIEN = Helper.round(isMultiplication ? vTien_nt * vTy_gia : vTien_nt / vTy_gia, vRound);
    if (Math.abs(vTIEN - vTien) > minAmountChange) {
        return vTIEN;
    }
    return null;
}

const changeNumberPT = (vTien_nt: number, vTien: number, vPt: number, vRoundNt: number, vRound: number, keyNt?: string, key?: string): { [key: string]: number } => {
    keyNt = keyNt || 'TIEN_NT';
    key = key || 'TIEN';
    vPt = vPt || ZERO;
    const Tien_nt = Helper.round(vTien_nt * vPt / 100, vRoundNt);
    const Tien = Helper.round(vTien * vPt / 100, vRound);
    return { [keyNt]: Tien_nt, [key]: Tien };
}

const sumByFields = (array: IData[], fields: string[]) => {
    const init = fields.reduce((acc, f) => {
        acc[f] = 0;
        return acc;
    }, {} as Record<string, number>);

    return array.reduce((acc, item) => {
        fields.forEach(f => {
            acc[f] += item[f] || 0;
        });
        return acc;
    }, init);
};
