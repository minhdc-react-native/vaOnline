import { useToast } from "@/components/dialog/useToast";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { useCallback } from "react";
import { useDataItemWin } from "./useDataItem";
import { useDataApp } from "./zustand/useDataApp";

const ZERO = 0.0;

const Field = {
    SO_LUONG: 'SO_LUONG',
    GIA_NT2: 'GIA_NT2',
    GIA2: 'GIA2',
    TIEN_NT2: 'TIEN_NT2',
    TIEN2: 'TIEN2',
    GIA_NT: 'GIA_NT',
    GIA: 'GIA',
    TIEN_NT: 'TIEN_NT',
    TIEN: 'TIEN',
    PT_GG: 'PT_GG',
    GIA_GG_NT: 'GIA_GG_NT',
    GIA_GG: 'GIA_GG',
    TIEN_GG_NT: 'TIEN_GG_NT',
    TIEN_GG: 'TIEN_GG',
    PT_CK: 'PT_CK',
    T_CK_NT: 'T_CK_NT',
    T_CK: 'T_CK',
    PT_NK: 'PT_NK',
    T_NK_NT: 'T_NK_NT',
    T_NK: 'T_NK',
    PT_DB: 'PT_DB',
    T_DB_NT: 'T_DB_NT',
    T_DB: 'T_DB',
    T_CP_NT: 'T_CP_NT',
    T_CP: 'T_CP',
    T_CP_NT0: 'T_CP_NT0',
    T_CP0: 'T_CP0',
    T_CP_NT1: 'T_CP_NT1',
    T_CP1: 'T_CP1',
    TIEN_TT_NT: 'TIEN_TT_NT',
    TIEN_TT: 'TIEN_TT',
    PT_THUE: 'PT_THUE',
    T_THUE_NT: 'T_THUE_NT',
    T_THUE: 'T_THUE',
    THUE_GTGT: 'THUE_GTGT',
    TIEN_THUE: 'TIEN_THUE',
    GIAM_TRU: 'GIAM_TRU',
    TIEN_GT: 'TIEN_GT'
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
const LoaiPhi = {
    LP1: 'LP1',
    LP2: 'LP2',
    LP3: 'LP3'
}
export const useVoucher = (tableWin: ITableWin, voucherCode?: string, currentTab?: ITabWin,
    changeOtherDetail?: React.RefObject<boolean>, onNewDetail?: (e: any, addDetailMore?: Record<string, any>) => Promise<IData | null>) => {
    const tableCthv = 'CTHV';
    const paramSystem = useDataApp((state) => state.paramSystem);
    const onChangeValue = useDataItemWin((state) => state.onChangeValue);

    const defaultTk = useDataApp((state) => state.paramSystem?.TK);

    const dataMaster = useDataItemWin((state) => state.dataItems[tableWin]);
    const dataDetails = useDataItemWin((state) => state.dataItemDetail[tableWin]?.[currentTab?.TAB_TABLE ?? "Empty"]);

    const dataCthvs = useDataItemWin((state) => state.dataItemDetail[tableWin]?.[tableCthv]);
    const setDataItemDetail = useDataItemWin((state) => state.setDataItemDetail);
    const onChangeValueDetail = useDataItemWin((state) => state.onChangeValueDetail);
    const onAddDetail = useDataItemWin((state) => state.onAddDetail);

    const { isHt2, changeCtHv, changePsCf, changePbDt } = useVoucherHv(voucherCode, changeOtherDetail);

    const { tangSoCt, changeCtKt, changePsThue } = useVoucherKt(voucherCode, changeOtherDetail);
    const { showToast } = useToast();

    const valueChange = useCallback((dataItem: IData | null, change: Record<string, any>) => {
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

    const getGiaHv = useCallback(async (MA_HV: string, DVT: string) => {
        const _fGia_nt = isHt2 ? 'GIA_NT2' : 'GIA_NT';
        const _fGia = isHt2 ? 'GIA2' : 'GIA';
        const res = await api.post({
            link: `/api/System/Command`,
            data: {
                command: 'GET_GIA_HV',
                parameter: {
                    DVCS_ID: dataMaster!.DVCS_ID,
                    MA_CT: dataMaster!.MA_CT,
                    NGAY_CT: dataMaster!.NGAY_CT,
                    SO_CT: dataMaster!.SO_CT,
                    MA_DT: dataMaster!.MA_DT0,
                    MA_HV: MA_HV,
                    DVT_CB: DVT
                }
            },
        });
        const price = res.data[0];
        return {
            ...(dataMaster?.TY_GIA === 1 && { [_fGia]: price?.[_fGia] ?? 0 }),
            ...(dataMaster?.TY_GIA !== 1 && { [_fGia_nt]: price?.[_fGia_nt] ?? 0 })
        };

    }, [dataMaster, isHt2]);
    const onScanned = useCallback((value: string, quantity: number, warehouseCode: string, groupCode: boolean, afterChange: () => void) => {
        const fixValue = encodeURIComponent(value);
        const expression: Record<string, string> = currentTab?.EXPRESSION?.['MA_HV'] ?? {};
        const defaultNew = currentTab?.DEFAULT_VALUE ?? {};
        api.get({
            link: `/api/System/GetDataByReferencesId?id=c0c79756-5702-4e39-840e-11c3fa759b81&filtervalue=${fixValue}`,
            callBack: async (res: IData[]) => {
                if (res && res.length > 0) {
                    const product = res[0];
                    const idx = (dataCthvs ?? []).findIndex(item => item.MA_HV === product.MA_HV);
                    if (idx !== -1 && groupCode) {
                        const existProduct = dataCthvs![idx];
                        const changeAdd: Record<string, any> = changeCtHv(existProduct, { SO_LUONG: existProduct.SO_LUONG + quantity });
                        onChangeValueDetail(tableWin, tableCthv, idx, changeAdd);
                        afterChange();
                    } else {
                        if (onNewDetail) {
                            let addExpression: any = { MA_HV: product.MA_HV };
                            if (expression) {
                                Object.keys(expression).map(key => {
                                    addExpression[key] = product[expression[key]] || null;
                                });
                            }

                            const priceInfo: Record<string, any> = await getGiaHv(product.MA_HV, product.DVT);

                            const newItemDetail: IData | null = await onNewDetail(null, {
                                SO_LUONG: quantity,
                                MA_KHO: warehouseCode,
                                ...defaultNew,
                                ...addExpression
                            });

                            const change = valueChange(newItemDetail!, priceInfo);

                            onAddDetail(tableWin, tableCthv, { ...newItemDetail, ...change });
                            afterChange();

                        }
                    }
                } else {
                    showToast(`Không tìm thấy mã BarCode [${value}]`, { type: "warning" });
                }
            }
        })
    }, [changeCtHv, dataCthvs, dataMaster, isHt2, onAddDetail, onChangeValueDetail, onNewDetail, showToast, tableWin, valueChange, getGiaHv, defaultTk]);

    const pbPsCf = useCallback(() => {

        const _fTIEN_NT = isHt2 ? 'TIEN_NT2' : 'TIEN_NT';
        const _fTIEN = isHt2 ? 'TIEN2' : 'TIEN';

        const totalCthv = dataCthvs!.reduce((acc, item) => {
            acc.T_CP_NT += Number(item.T_CP_NT);
            acc.T_CP += Number(item.T_CP);
            acc.T_CP_NT1 += Number(item.T_CP_NT1);
            acc.T_CP1 += Number(item.T_CP1);
            acc.T_CP_NT0 += Number(item.T_CP_NT0);
            acc.T_CP0 += Number(item.T_CP0);
            acc.T_PB_NT += Number(item[_fTIEN_NT]) - item.T_CK_NT - item.T_GG_NT + item.T_NK_NT + item.T_DB_NT;
            acc.T_PB += Number(item[_fTIEN]) - item.T_CK - item.T_GG + item.T_NK + item.T_DB;
            return acc;
        }, { T_CP_NT: 0, T_CP: 0, T_CP_NT1: 0, T_CP1: 0, T_CP_NT0: 0, T_CP0: 0, T_PB_NT: 0, T_PB: 0 });

        const totalCp0 = dataDetails!.reduce((acc, item) => {
            acc.T_CP_NT += Number(item.TIEN_NT);
            acc.T_CP += Number(item.TIEN);
            acc.T_CP_NT1 += item.LOAI_PHI === LoaiPhi.LP2 ? Number(item.TIEN_NT) : 0;
            acc.T_CP1 += item.LOAI_PHI === LoaiPhi.LP2 ? Number(item.TIEN) : 0;
            acc.T_CP_NT0 += item.LOAI_PHI === LoaiPhi.LP3 ? Number(item.TIEN_NT) : 0;
            acc.T_CP0 += item.LOAI_PHI === LoaiPhi.LP3 ? Number(item.TIEN) : 0;
            return acc;
        }, { T_CP_NT: 0, T_CP: 0, T_CP_NT1: 0, T_CP1: 0, T_CP_NT0: 0, T_CP0: 0 });

        if (totalCthv.T_CP_NT === totalCp0.T_CP_NT && totalCthv.T_CP === totalCp0.T_CP &&
            totalCthv.T_CP_NT1 === totalCp0.T_CP_NT1 && totalCthv.T_CP1 === totalCp0.T_CP1 &&
            totalCthv.T_CP_NT0 === totalCp0.T_CP_NT0 && totalCthv.T_CP0 === totalCp0.T_CP0
        ) return null;


        const totalCp = dataDetails!.filter(i => [LoaiPhi.LP2, LoaiPhi.LP3].includes(i.LOAI_PHI)).reduce((acc, item) => {
            const key = `${(item.LOAI_PHI ?? LoaiPhi.LP3)}_${item.TK_NO ?? ''}`
            acc[key] = acc[key] || {
                TIEN_NT: 0, TIEN: 0, keyField: {
                    TIEN_NT: item.LOAI_PHI === LoaiPhi.LP2 ? 'T_CP_NT1' : 'T_CP_NT0',
                    TIEN: item.LOAI_PHI === LoaiPhi.LP2 ? 'T_CP1' : 'T_CP0'
                }
            };
            acc[key].TIEN_NT += Number(item.TIEN_NT);
            acc[key].TIEN += Number(item.TIEN);
            return acc;
        }, {} as Record<string, {
            TIEN_NT: number, TIEN: number, keyField: {
                TIEN_NT: string;
                TIEN: string;
            };
        }>);


        const dataPb = (dataCthvs ?? []).map(item => ({
            id: item.id,
            TK_PB: item.TK_NO,
            T_PB_NT: Number(item[_fTIEN_NT]) - item.T_CK_NT - item.T_GG_NT + item.T_NK_NT + item.T_DB_NT,
            T_PB: Number(item[_fTIEN]) - item.T_CK - item.T_GG + item.T_NK + item.T_DB
        }));

        const fields = ['T_CP_NT', 'T_CP', 'T_CP_NT1', 'T_CP1', 'T_CP_NT0', 'T_CP0'];
        const updatesZezo = { T_CP_NT: 0, T_CP: 0, T_CP_NT1: 0, T_CP1: 0, T_CP_NT0: 0, T_CP0: 0 };
        const updates: Record<string, { T_CP_NT: number, T_CP: number, T_CP_NT1: number, T_CP1: number, T_CP_NT0: number, T_CP0: number, T_PB_NT: number, T_PB: number }> = {};

        const phanBoTotal = distribute(dataPb, { TIEN_NT: paramSystem?.rAmountNt!, TIEN: paramSystem?.rAmount! },
            {
                totalNeedDistribute: { TIEN_NT: totalCp0.T_CP_NT, TIEN: totalCp0.T_CP },
                keyField: { TIEN_NT: 'T_CP_NT', TIEN: 'T_CP' }
            }
        );

        const phanBoGroup = distribute(dataPb, { TIEN_NT: paramSystem?.rAmountNt!, TIEN: paramSystem?.rAmount! },
            undefined,
            totalCp
        );

        const phanBoAll = mergeByIdWithFields(fields, phanBoTotal, phanBoGroup)

        for (const item of phanBoAll) {
            const { id, ...newItem } = item;
            updates[item.id] = newItem;
        }

        setDataItemDetail(tableWin, tableCthv, (dataCthvs ?? []).map((item: IData) => ({ ...item, ...(updates[item.id] || updatesZezo) })));

        return totalCp0;
    }, [isHt2, dataDetails, setDataItemDetail, tableWin, dataCthvs, paramSystem]);

    const pbPsThue = useCallback(() => {
        const _fTIEN_NT = isHt2 ? 'TIEN_NT2' : 'TIEN_NT';
        const _fTIEN = isHt2 ? 'TIEN2' : 'TIEN';
        const totalVat = dataDetails!.reduce((acc, item) => {
            acc.MA_THUE = item.MA_THUE;
            acc.PT_THUE = item.PT_THUE;
            acc.TIEN_NT += Number(item.TIEN_NT);
            acc.TIEN += Number(item.TIEN);
            return acc;
        }, { MA_THUE: '', PT_THUE: 0, TIEN_NT: 0, TIEN: 0 });
        const totalCthv = dataCthvs!.reduce((acc, item) => {
            acc.T_THUE_NT += Number(item.T_THUE_NT);
            acc.T_THUE += Number(item.T_THUE);
            acc.T_PB_NT += Number(item[_fTIEN_NT]) - item.T_CK_NT - item.T_GG_NT + item.T_NK_NT + item.T_DB_NT;
            acc.T_PB += Number(item[_fTIEN]) - item.T_CK - item.T_GG + item.T_NK + item.T_DB;
            return acc;
        }, { T_THUE_NT: 0, T_THUE: 0, T_PB_NT: 0, T_PB: 0 });
        console.log("log>>", totalCthv, totalVat);
        if (totalCthv.T_THUE_NT === totalVat.TIEN_NT && totalCthv.T_THUE === totalVat.TIEN) return null;

        const dataPb = (dataCthvs ?? []).map(item => ({
            id: item.id,
            T_PB_NT: Number(item[_fTIEN_NT]) - item.T_CK_NT - item.T_GG_NT + item.T_NK_NT + item.T_DB_NT,
            T_PB: Number(item[_fTIEN]) - item.T_CK - item.T_GG + item.T_NK + item.T_DB
        }));

        const updates: Record<string, { MA_THUE: string; PT_THUE: number | null; T_THUE_NT: number; T_THUE: number }> = {};

        let sumThueNt = 0;
        let sumThue = 0;

        dataPb.forEach((item, idx) => {
            if (item.T_PB === 0) return;

            if (idx === dataPb.length - 1) {
                // dòng cuối cùng: lấy phần còn lại
                updates[item.id] = {
                    MA_THUE: totalVat.MA_THUE, PT_THUE: totalVat.PT_THUE,
                    T_THUE_NT: totalVat.TIEN_NT - sumThueNt,
                    T_THUE: totalVat.TIEN - sumThue,
                };
            } else {
                // các dòng trước
                const T_THUE_NT = Helper.round(
                    Number(totalCthv.T_PB_NT) !== 0 ? totalVat.TIEN_NT * (item.T_PB_NT / totalCthv.T_PB_NT) : 0,
                    paramSystem?.rAmountNt!
                );
                const T_THUE = Helper.round(
                    totalVat.TIEN * (item.T_PB / totalCthv.T_PB),
                    paramSystem?.rAmount!
                );

                sumThueNt += T_THUE_NT;
                sumThue += T_THUE;

                updates[item.id] = { MA_THUE: totalVat.MA_THUE, PT_THUE: totalVat.PT_THUE, T_THUE_NT, T_THUE };
            }
        });
        setDataItemDetail(tableWin, tableCthv, (dataCthvs ?? []).map((item: IData) =>
            updates[item.id] !== undefined
                ? { ...item, ...updates[item.id] }
                : item
        ));

        return totalVat;
    }, [isHt2, dataDetails, setDataItemDetail, tableWin, dataCthvs, paramSystem]);

    const sumCthv = useCallback(() => {
        const _fTIEN_NT = isHt2 ? 'TIEN_NT2' : 'TIEN_NT';
        const _fTIEN = isHt2 ? 'TIEN2' : 'TIEN';
        const totalCtHv = sumByFields(dataDetails ?? [],
            [
                'SO_LUONG', _fTIEN_NT, _fTIEN, 'T_GG_NT', 'T_GG', 'T_CK_NT', 'T_CK', 'T_THUE_NT', 'T_THUE',
                'T_NK_NT', 'T_NK', 'T_DB_NT', 'T_DB', 'T_CP_NT', 'T_CP', 'T_CP_NT0', 'T_CP0', 'T_CP_NT1', 'T_CP1', 'TIEN_GT'
            ],
            [
                'T_SL', 'T_TIEN_HANG_NT', 'T_TIEN_HANG', 'T_TGG_NT', 'T_TGG', 'T_TCK_NT', 'T_TCK', 'T_THUE_NT', 'T_THUE',
                'T_TNK_NT', 'T_TNK', 'T_TDB_NT', 'T_TDB', 'T_CP_NT', 'T_CP', 'T_TCP_NT0', 'T_TCP0', 'T_TCP_NT1', 'T_TCP1', 'T_TIEN_GT'
            ]
        );
        const tTien_tt = dataMaster!.MA_CT === 'PCP' ? {
            T_TIEN_TT_NT: totalCtHv.T_CP_NT,
            T_TIEN_TT: totalCtHv.T_CP
        } : {
            T_TIEN_TT_NT: totalCtHv.T_TIEN_HANG_NT - totalCtHv.T_TGG_NT - totalCtHv.T_TCK_NT + totalCtHv.T_TDB_NT + totalCtHv.T_TCP_NT1 + totalCtHv.T_TNK_NT,
            T_TIEN_TT: totalCtHv.T_TIEN_HANG - totalCtHv.T_TGG - totalCtHv.T_TCK + totalCtHv.T_TDB + totalCtHv.T_TCP1 + totalCtHv.T_TNK
        }
        return {
            ...totalCtHv,
            ...tTien_tt,
            T_TIEN_NT: tTien_tt.T_TIEN_TT_NT + totalCtHv.T_THUE_NT,
            T_TIEN: tTien_tt.T_TIEN_TT + totalCtHv.T_THUE - totalCtHv.T_TIEN_GT
        };
    }, [dataDetails, isHt2]);

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
                changeMaster = sumCthv();
                break;
            case TableWin.PSTHUE:
                if (tableWin === TableWin.DPHV) {
                    const totalVat = pbPsThue();
                    console.log('totalVat>>', totalVat);
                    if (!totalVat) break;
                    changeMaster = {
                        T_THUE_NT: totalVat.TIEN_NT,
                        T_THUE: totalVat.TIEN,
                        T_TIEN_NT: dataMaster?.T_TIEN_TT_NT + totalVat.TIEN_NT,
                        T_TIEN: dataMaster?.T_TIEN_TT + totalVat.TIEN
                    }
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
                            T_TIEN: totals.TIEN_TT + totals.TIEN
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
                if (tableWin === TableWin.DPHV) {
                    const totalCf = pbPsCf();
                    if (!totalCf) break;
                    changeMaster = {
                        T_CP_NT: totalCf.T_CP_NT,
                        T_CP: totalCf.T_CP,
                        T_TCP_NT1: totalCf.T_CP_NT1,
                        T_TCP1: totalCf.T_CP1,
                        T_TCP_NT0: totalCf.T_CP_NT0,
                        T_TCP0: totalCf.T_CP0,
                        T_TIEN_NT: dataMaster?.T_TIEN_TT_NT + dataMaster?.T_THUE_NT + totalCf.T_CP_NT,
                        T_TIEN: dataMaster?.T_TIEN_TT + dataMaster?.T_THUE + totalCf.T_CP
                    }
                }
                break;
        }
        if (changeMaster !== null) onChangeValue(tableWin, changeMaster);
    }, [voucherCode, currentTab, onChangeValue, tableWin, dataMaster, dataDetails, sumCthv, pbPsCf, pbPsThue]);

    return {
        showToast,
        isHt2,
        tangSoCt,
        valueChange,
        changeOther,
        getGiaHv,
        onScanned
    }
};
const useVoucherHv = (voucherCode?: string, changeOtherDetail?: React.RefObject<boolean>) => {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const currencies = useDataApp((state) => state.currencies);
    const listVoucher2 = useDataApp((state) => state.listVoucher2);
    const isHt2 = listVoucher2.includes(voucherCode ?? '***');
    const _fTIEN_NT = isHt2 ? 'TIEN_NT2' : 'TIEN_NT';
    const _fTIEN = isHt2 ? 'TIEN2' : 'TIEN';
    const _refreshAmount = useCallback((dataItem: IData, change: Record<string, any>, currentValue: Record<string, string>,
        type: 'all' | 'amount' | 't_gg' | 't_ck' | 't_db' | 't_nk' | 't_thue' | 'tien_thue' | 'tien_gt' = "all") => {
        if (changeOtherDetail) changeOtherDetail.current = true;
        let changeAdd: any = currentValue;
        let changeAdd0: any = {
            TIEN_NT2: Number(dataItem.TIEN_NT2),
            TIEN2: Number(dataItem.TIEN2),
            TIEN_NT: Number(dataItem.TIEN_NT),
            TIEN: Number(dataItem.TIEN),
            TIEN_THUE: Number(dataItem.TIEN_THUE),
            T_TT_NT: Number(dataItem[_fTIEN_NT]),
            T_TT: Number(dataItem[_fTIEN]),
            T_TT_NK_NT: Number(dataItem.TIEN_NT) + Number(dataItem.T_CP_NT1),
            T_TT_NK: Number(dataItem.TIEN) + Number(dataItem.T_CP1),
        }
        if (type === "all") {
            changeAdd.TIEN_NT2 = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA_NT2 || dataItem.GIA_NT2), paramSystem?.rAmountNt!);
            changeAdd.TIEN2 = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA2 || dataItem.GIA2), paramSystem?.rAmount!);
            changeAdd.TIEN_NT = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA_NT || dataItem.GIA_NT), paramSystem?.rAmountNt!);
            changeAdd.TIEN = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA || dataItem.GIA), paramSystem?.rAmount!);
            changeAdd0 = {
                TIEN_NT2: changeAdd.TIEN_NT2,
                TIEN2: changeAdd.TIEN2,
                TIEN_NT: changeAdd.TIEN_NT,
                TIEN: changeAdd.TIEN,
                TIEN_THUE: Number(dataItem.TIEN_THUE),
                T_TT_NT: Number(changeAdd[_fTIEN_NT]),
                T_TT: Number(changeAdd[_fTIEN]),
                T_TT_NK_NT: changeAdd.TIEN_NT + Number(dataItem.T_CP_NT1),
                T_TT_NK: changeAdd.TIEN + Number(dataItem.T_CP1),
            };
        }
        // giảm giá
        if (['all', 'amount', 't_gg'].includes(type)) {
            if (Number(change.PT_GG || dataItem.PT_GG) !== 0) {
                changeAdd = {
                    ...changeAdd,
                    ...changeNumberPT(
                        changeAdd0[_fTIEN_NT], changeAdd0[_fTIEN], Number(change.PT_GG || dataItem.PT_GG),
                        paramSystem!.rAmountNt, paramSystem!.rAmount, 'T_GG_NT', 'T_GG'
                    )
                };
            } else {
                changeAdd.T_GG_NT = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA_GG_NT || dataItem.GIA_GG_NT), paramSystem?.rAmountNt!);
                changeAdd.T_GG = Helper.round(Number(change.SO_LUONG || dataItem.SO_LUONG) * Number(change.GIA_GG || dataItem.GIA_GG), paramSystem?.rAmount!);
            }
        }
        changeAdd0.T_TT_NT -= changeAdd.T_GG_NT || dataItem.T_GG_NT;
        changeAdd0.T_TT -= changeAdd.T_GG || dataItem.T_GG;

        changeAdd0.T_TT_NK_NT -= changeAdd.T_GG_NT || dataItem.T_GG_NT;
        changeAdd0.T_TT_NK -= changeAdd.T_GG || dataItem.T_GG;

        // chiết khấu
        if (['all', 'amount', 't_ck'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    changeAdd0[_fTIEN_NT], changeAdd0[_fTIEN], Number(change.PT_CK || dataItem.PT_CK),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'T_CK_NT', 'T_CK'
                )
            };
        }
        changeAdd0.T_TT_NT -= changeAdd.T_CK_NT || dataItem.T_CK_NT;
        changeAdd0.T_TT -= changeAdd.T_CK || dataItem.T_CK;

        changeAdd0.T_TT_NK_NT -= changeAdd.T_CK_NT || dataItem.T_CK_NT;
        changeAdd0.T_TT_NK -= changeAdd.T_CK || dataItem.T_CK;
        // đặc biệt
        if (['all', 'amount', 't_db'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    changeAdd0[_fTIEN_NT], changeAdd0[_fTIEN], Number(change.PT_DB || dataItem.PT_DB),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'T_DB_NT', 'T_DB'
                )
            };
        }
        changeAdd0.T_TT_NT += changeAdd.T_DB_NT || dataItem.T_DB_NT;
        changeAdd0.T_TT += changeAdd.T_DB || dataItem.T_DB;
        // nhập khẩu
        if (['all', 'amount', 't_nk'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    changeAdd0.T_TT_NK_NT, changeAdd0.T_TT_NK, Number(change.PT_NK || dataItem.PT_NK),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'T_NK_NT', 'T_NK'
                )
            };
        }
        changeAdd0.T_TT_NT += changeAdd.T_NK_NT || dataItem.T_NK_NT;
        changeAdd0.T_TT += changeAdd.T_NK || dataItem.T_NK;
        // thuế
        if (['all', 'amount', 't_thue'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    changeAdd0.T_TT_NT, changeAdd0.T_TT, Number(change.PT_THUE || dataItem.PT_THUE),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'T_THUE_NT', 'T_THUE'
                )
            };
        }
        // thuế HKD
        if (['all', 'amount', 'tien_thue'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    changeAdd0.T_TT_NT, changeAdd0.T_TT, Number(change.THUE_GTGT || dataItem.THUE_GTGT),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'TIEN_THUE_NT', 'TIEN_THUE'
                )
            };
        }
        changeAdd0.TIEN_THUE = changeAdd.TIEN_THUE || changeAdd0.TIEN_THUE;
        // thuế HKD
        if (['all', 'amount', 'tien_gt'].includes(type)) {
            changeAdd = {
                ...changeAdd,
                ...changeNumberPT(
                    0, changeAdd0.TIEN_THUE, Number(change.GIAM_TRU || dataItem.GIAM_TRU),
                    paramSystem!.rAmountNt, paramSystem!.rAmount, 'TIEN_GT_NT', 'TIEN_GT'
                )
            };
        }
        return changeAdd;
    }, []);

    const changeCtHv = useCallback((dataItem: IData, change: Record<string, any>) => {
        const isMultiplication = !!currencies?.[dataItem.MA_NT].isMultiplication; //tỷ giá: phép nhân || phép chia
        let changeAdd: any = {};
        Object.keys(change).map(f => {
            switch (f) {
                case Field.SO_LUONG:
                    changeAdd = _refreshAmount(dataItem, change, { SO_LUONG: change.SO_LUONG });
                    break;
                case Field.GIA_NT2:
                    changeAdd = _refreshAmount(dataItem, change, { GIA_NT2: change.GIA_NT2 });
                    break;
                case Field.GIA2:
                    changeAdd = _refreshAmount(dataItem, change, { GIA2: change.GIA2 });
                    break;
                case Field.TIEN_NT2:
                    changeAdd = {
                        ..._refreshAmount(dataItem, change, { TIEN_NT2: change.TIEN_NT2 }, "amount"),
                        TIEN2: changeNumberNt(
                            isMultiplication, Number(change.TIEN_NT2),
                            dataItem.TY_GIA, paramSystem!.rAmount
                        )
                    };
                    break;
                case Field.TIEN2:
                    const vTien2 = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_NT2), Number(change.TIEN2), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien2) break;
                    changeAdd = { ..._refreshAmount(dataItem, change, { TIEN2: change.TIEN2 }, "amount"), TIEN2: vTien2 };
                    break;
                case Field.GIA_NT:
                    changeAdd = _refreshAmount(dataItem, change, { GIA_NT: change.GIA_NT });
                    break;
                case Field.GIA:
                    changeAdd = _refreshAmount(dataItem, change, { GIA: change.GIA });
                    break;
                case Field.TIEN_NT:
                    changeAdd = {
                        ..._refreshAmount(dataItem, change, { TIEN_NT: change.TIEN_NT }, "amount"),
                        TIEN: changeNumberNt(
                            isMultiplication, Number(change.TIEN_NT),
                            dataItem.TY_GIA, paramSystem!.rAmount
                        )
                    };
                    break;
                case Field.TIEN:
                    const vTien = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_NT), Number(change.TIEN), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien) break;
                    changeAdd = { ..._refreshAmount(dataItem, change, { TIEN: change.TIEN }, "amount"), TIEN: vTien };
                    break;
                case Field.PT_GG:
                    changeAdd = _refreshAmount(dataItem, change, { PT_GG: change.PT_GG }, 't_gg');
                    break;
                case Field.GIA_GG_NT:
                    changeAdd = _refreshAmount(dataItem, change, { GIA_GG_NT: change.GIA_GG_NT }, 't_gg');
                    break;
                case Field.GIA_GG:
                    changeAdd = _refreshAmount(dataItem, change, { GIA_GG: change.GIA_GG }, 't_gg');
                    break;
                case Field.TIEN_GG_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN_GG = changeNumberNt(
                        isMultiplication, Number(change.TIEN_GG_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.TIEN_GG:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_gg = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_GG_NT), Number(change.TIEN_GG), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_gg) break;
                    changeAdd.TIEN = vTien_gg;
                    break;
                case Field.PT_CK:
                    changeAdd = _refreshAmount(dataItem, change, { PT_CK: change.PT_CK }, 't_ck');
                    break;
                case Field.T_CK_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.T_CK = changeNumberNt(
                        isMultiplication, Number(change.T_CK_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.T_CK:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_ck = changeNumber(
                        isMultiplication, Number(dataItem.T_CK_NT), Number(change.T_CK), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_ck) break;
                    changeAdd.T_CK = vTien_ck;
                    break;
                case Field.PT_NK:
                    changeAdd = _refreshAmount(dataItem, change, { PT_NK: change.PT_NK }, 't_nk');
                    break;
                case Field.T_NK_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.T_NK = changeNumberNt(
                        isMultiplication, Number(change.T_NK_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.T_NK:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_nk = changeNumber(
                        isMultiplication, Number(dataItem.T_NK_NT), Number(change.T_NK), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_nk) break;
                    changeAdd.T_NK = vTien_nk;
                    break;
                case Field.PT_DB:
                    changeAdd = _refreshAmount(dataItem, change, { PT_DB: change.PT_DB }, 't_db');
                    break;
                case Field.T_DB_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.T_DB = changeNumberNt(
                        isMultiplication, Number(change.T_DB_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.T_DB:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_db = changeNumber(
                        isMultiplication, Number(dataItem.T_DB_NT), Number(change.T_DB), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_db) break;
                    changeAdd.T_DB = vTien_db;
                    break;
                case Field.PT_THUE:
                    changeAdd = _refreshAmount(dataItem, change, { PT_THUE: change.PT_THUE }, 't_thue');
                    break;
                case Field.T_THUE_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.T_THUE = changeNumberNt(
                        isMultiplication, Number(change.T_THUE_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    break;
                case Field.T_THUE:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_thue = changeNumber(
                        isMultiplication, Number(dataItem.T_THUE_NT), Number(change.T_THUE), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_thue) break;
                    changeAdd.T_THUE = vTien_thue;
                    break;
                case Field.THUE_GTGT:
                    changeAdd = _refreshAmount(dataItem, change, { THUE_GTGT: change.THUE_GTGT }, 'tien_thue');
                    break;
                case Field.TIEN_THUE:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN_GT = Helper.round(change.TIEN_THUE * (dataItem.GIAM_TRU ?? 0) / 100, paramSystem!.rAmount);
                    changeAdd.TIEN_ST = dataItem.TIEN2 - dataItem.T_CK - changeAdd.TIEN_GT;
                    break;
                case Field.GIAM_TRU:
                    changeAdd = _refreshAmount(dataItem, change, { GIAM_TRU: change.GIAM_TRU }, 'tien_gt');
                    changeAdd.TIEN_ST = dataItem.TIEN2 - dataItem.T_CK - changeAdd.TIEN_GT;
                    break;
                case Field.TIEN_GT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN_ST = dataItem.TIEN2 - dataItem.T_CK - dataItem.TIEN_GT;
                    break;
                case Field.T_CP_NT:
                    break;
                case Field.T_CP:
                    break;
                case Field.T_CP_NT0:
                    break;
                case Field.T_CP0:
                    break;
                case Field.T_CP_NT1:
                    break;
                case Field.T_CP1:
                    break;
            }
        });
        return { ...change, ...changeAdd };
    }, [changeOtherDetail, currencies, paramSystem]);

    const changePsCf = useCallback((dataItem: IData, change: Record<string, any>) => {
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
    }, [changeOtherDetail, currencies, paramSystem]);

    const changePbDt = useCallback((dataItem: IData, change: Record<string, any>) => {
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

    const changeCtKt = useCallback((dataItem: IData, change: Record<string, any>) => {
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
    }, [changeOtherDetail, currencies, paramSystem]);

    const changePsThue = useCallback((dataItem: IData, change: Record<string, any>) => {
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
                    changeAdd.TONG_TIEN_NT = changeAdd.TIEN_TT_NT + Number(dataItem.TIEN_NT);
                    changeAdd.TONG_TIEN = changeAdd.TIEN_TT + Number(dataItem.TIEN);
                    break;
                case Field.TIEN_TT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien_tt = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_TT_NT), Number(change.TIEN_TT), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien_tt) break;
                    changeAdd.TIEN_TT = vTien_tt;
                    changeAdd.TONG_TIEN = changeAdd.TIEN_TT + Number(dataItem.TIEN);
                    break;
                case Field.PT_THUE:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd = changeNumberPT(
                        Number(dataItem.TIEN_TT_NT), Number(dataItem.TIEN_TT), Number(change.PT_THUE),
                        paramSystem!.rAmountNt, paramSystem!.rAmount
                    );
                    changeAdd.TONG_TIEN_NT = Number(dataItem.TIEN_TT_NT) + changeAdd.TIEN_NT;
                    changeAdd.TONG_TIEN = Number(dataItem.TIEN_TT) + changeAdd.TIEN;
                    break;
                case Field.TIEN_NT:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    changeAdd.TIEN = changeNumberNt(
                        isMultiplication, Number(change.TIEN_NT),
                        dataItem.TY_GIA, paramSystem!.rAmount
                    );
                    changeAdd.TONG_TIEN_NT = changeAdd.TIEN_NT + Number(dataItem.TIEN_TT_NT);
                    changeAdd.TONG_TIEN = changeAdd.TIEN + Number(dataItem.TIEN_TT);
                    break;
                case Field.TIEN:
                    if (changeOtherDetail) changeOtherDetail.current = true;
                    const vTien = changeNumber(
                        isMultiplication, Number(dataItem.TIEN_NT), Number(change.TIEN), dataItem.TY_GIA,
                        paramSystem!.rAmountNt, paramSystem!.minAmountChange
                    );
                    if (!vTien) break;
                    changeAdd.TIEN = vTien;
                    changeAdd.TONG_TIEN = changeAdd.TIEN + Number(dataItem.TIEN_TT);
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

const sumByFields = (array: IData[], fields: string[], fieldsTotal?: string[]) => {
    fieldsTotal = fieldsTotal || fields;
    const init = fields.reduce((acc, f, idx) => {
        acc[fieldsTotal[idx]] = 0;
        return acc;
    }, {} as Record<string, number>);

    return array.reduce((acc, item) => {
        fields.forEach((f, idx) => {
            acc[fieldsTotal[idx]] += item[f] || 0;
        });
        return acc;
    }, init);
};

/**
 * Phân bổ số tiền với làm tròn và xử lý chênh lệch
 */
function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
        const k = key(item);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}


function allocateWithRounding(
    items: IData[],
    totalNeedDistribute: { TIEN_NT: number, TIEN: number },
    round: { TIEN_NT: number, TIEN: number },
    keyField: { TIEN_NT: string, TIEN: string }
): IData[] {
    const total = items.reduce((sum, i) => {
        sum.T_PB_NT += i.T_PB_NT;
        sum.T_PB += i.T_PB;
        return sum
    }, { T_PB_NT: 0, T_PB: 0 });

    // Tính tỷ lệ, làm tròn
    let allocated: any[] = items.map(i => ({
        id: i.id,
        T_PB_NT: i.T_PB_NT,
        T_PB: i.T_PB,
        TIEN_NT: total.T_PB_NT !== 0 ? Helper.round((i.T_PB_NT / total.T_PB_NT) * totalNeedDistribute.TIEN_NT, round.TIEN_NT) : 0,
        TIEN: total.T_PB !== 0 ? Helper.round((i.T_PB / total.T_PB) * totalNeedDistribute.TIEN, round.TIEN) : 0
    }));

    // Kiểm tra chênh lệch
    const diff = allocated.reduce((sum, i) => {
        sum.T_TIEN_NT += i.TIEN_NT;
        sum.T_TIEN += i.TIEN;
        return sum;
    }, { T_TIEN_NT: 0, T_TIEN: 0 });

    if (diff.T_TIEN_NT !== totalNeedDistribute.TIEN_NT || diff.T_TIEN !== totalNeedDistribute.TIEN) {
        // Cộng/trừ chênh lệch vào các dòng có giá trị lớn nhất (hoặc nhỏ nhất)
        // để đảm bảo tổng chính xác
        if (diff.T_TIEN !== totalNeedDistribute.TIEN) {
            const sorted = [...allocated].sort((a, b) => b.T_PB - a.T_PB);
            sorted[0].TIEN += totalNeedDistribute.TIEN - diff.T_TIEN;
            // copy lại giá trị TIEN đã chỉnh
            allocated = allocated.map(item => {
                const fixed = sorted.find(s => s.id === item.id)!;
                return { ...item, TIEN: fixed.TIEN };
            });
        }
        if (diff.T_TIEN_NT !== totalNeedDistribute.TIEN_NT) {
            const sorted = [...allocated].sort((a, b) => b.T_PB_NT - a.T_PB_NT);
            sorted[0].TIEN_NT += totalNeedDistribute.TIEN_NT - diff.T_TIEN_NT;
            // copy lại giá trị TIEN_NT đã chỉnh
            allocated = allocated.map(item => {
                const fixed = sorted.find(s => s.id === item.id)!;
                return { ...item, TIEN_NT: fixed.TIEN_NT };
            });
        }
    }
    return allocated.map(i => ({ id: i.id, [keyField.TIEN_NT]: i.TIEN_NT, [keyField.TIEN]: i.TIEN }));;
}

function distribute(
    data: IData[],
    round: { TIEN_NT: number, TIEN: number },
    global?: {
        totalNeedDistribute: { TIEN_NT: number, TIEN: number },
        keyField: { TIEN_NT: string, TIEN: string }
    },
    groupPb?: Record<string, { TIEN_NT: number, TIEN: number, keyField: { TIEN_NT: string, TIEN: string } }>
): IData[] {
    if (!!global) {
        return allocateWithRounding(data, global.totalNeedDistribute, round, global.keyField);
    }
    if (!!groupPb) {
        const result: IData[] = [];
        const groups = groupBy(data, i => i.TK_PB);
        Object.keys(groupPb).map(key => {
            const TK_PB = key.split('_')[1];
            const group = groups[TK_PB] ?? [];
            if (group.length > 0) {
                result.push(...allocateWithRounding(group, groupPb[key], round, groupPb[key].keyField));
            }
        });
        return result;
    }

    return data.map(i => ({ id: i.id, TIEN_NT: 0, TIEN: 0 }));
}

function mergeByIdWithFields(
    fields: string[],
    ...arrays: IData[][]
) {
    const allIds = new Set<string>();

    // Gom tất cả id
    for (const arr of arrays) {
        for (const item of arr) {
            allIds.add(item.id.toString());
        }
    }

    // Map từng mảng để lookup nhanh
    const maps = arrays.map(arr => {
        const m = new Map<string, IData>();
        for (const item of arr) m.set(item.id.toString(), item);
        return m;
    });
    // Merge

    const result: any[] = [];
    for (const id of allIds) {
        const row: any = { id };

        fields.forEach((f) => {
            row[f] = 0;
            for (const m of maps) {
                const found = m.get(id);
                if (found && found[f] !== undefined) {
                    row[f] += found[f]; // cộng dồn nếu bị trùng key
                }
            }
        });

        result.push(row);
    }

    return result;
}