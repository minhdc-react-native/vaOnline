import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
import { buildZodSchema } from "@/components/UIEngine/buildZodSchema";
import { useEvalExpr } from "@/components/UIEngine/hooks/useEvalExpr";
import { useZodValidation } from "@/components/UIEngine/hooks/useZodValidation";
import { defaultNumberNew, VcReferences } from "@/constants/vcData";
import { useTranslation } from "@/context/TranslationContext";
import { IDataSource, IZod, schemaWin, schemaWinEmpty } from "@/schema";
import { getListItemView, ListItemView } from "@/schema/voucher/itemView";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { getSubDomain } from "@/utils/vcStorage";
import dayjs from 'dayjs';
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DimensionValue, LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";
import UUID from 'react-native-uuid';
import { useDataItemWin } from "./useDataItem";
import { useVoucher } from "./useVoucher";
import { useDataApp } from "./zustand/useDataApp";

const getUrlReference = (id: string) => {
    return { url: `/api/System/GetDataByReferencesId?id=${id}` }
};

const FIELD_MAP = {
    SO_TK: "_soTk",
    LOAI_TK: "_loaiTk",
    IS_CP0: "_isCp0",
    MA_DT_BT: "_maDtBt",
    T_TNK: "_tTnk",
    T_TDB: "_tTdb",
    T_TCK: "_tTck",
    MA_KHO: "_maKho",
    MA_KHO_DC: "_maKhoDc",
    MA_HV_DC: "_maHvDc",
    TK_NO: "_tkNo",
    TK_NO2: "_tkNo2",
    PT_THUE: "_tThue",
    THUE_GTGT: '_thueHKD',
    T_NK: "_tNk",
    T_CK: "_tCk",
    T_DB: "_tDb",
    LOAI_PHI: "_loaiPhi",
    NHOM_HD: "_nhomHd"
} as const;

const backHandQuestion = { title: "Cảnh báo", message: "Dữ liệu đã thay đổi, bạn có muốn thoát không?" };
const backHandQuestionE = { title: "Warning", message: "Data has changed, do you want to exit?" };
const TYPE_NUMBER = ['VC_SOLUONG', 'VC_DONGIA', 'VC_TIEN', 'VC_INT', 'VC_MONTH', 'VC_DAY', 'VC_PT', 'VC_SMALLINT', 'VC_TINYINT', 'VC_TYGIA'];
interface IProgs {
    itemMenuWin: IMenuWin
    pageSize?: number,
    loadingBegin?: boolean;
}
export const useWinPage = ({ itemMenuWin, pageSize = 20, loadingBegin = false }: IProgs) => {

    const { id: windowId, tableWin, typeWin } = itemMenuWin;
    const { tangSoCt } = useVoucher(tableWin, itemMenuWin.defaultValue?.MA_CT);
    const { colors } = useTheme<VACOMTheme>();
    const [rowHeights, setRowHeights] = useState<Record<string, DimensionValue>>({});
    const handleLayout = (itemId: string, event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        setRowHeights((prev) => ({
            ...prev,
            [itemId]: height,
        }));
    };
    const stateLoading = useRef({ refresh: false, loadMore: false, loading: loadingBegin });

    const shouldRefresh = useDataApp((state) => state.shouldRefresh);
    const setShouldRefresh = useDataApp((state) => state.setShouldRefresh);

    const { showToast } = useToast();
    const { show, hide } = useLoading();
    const { showPopup } = usePopup();

    // const [winConfig, setWinConfig] = useState<IWinConfig | null>();

    const winConfig = useDataItemWin((state) => state.winConfig)[tableWin];
    const setWinConfig = useDataItemWin((state) => state.setWinConfig);

    const [data, setData] = useState<IData[]>([]);
    const dataSources = useDataItemWin((state) => state.dataSources);
    const setDataSource = useDataItemWin((state) => state.setDataSource);
    const resetTableWin = useDataItemWin((state) => state.resetTableWin);

    const dataItems = useDataItemWin((state) => state.dataItems);
    const setItemData = useDataItemWin((state) => state.setDataItem);

    const editMode = useDataItemWin((state) => state.editMode);
    const setEditMode = useDataItemWin((state) => state.setEditMode);

    const onChangeValue = useDataItemWin((state) => state.onChangeValue);

    const dataTags = useDataItemWin((state) => state.dataTags);
    const setDataTags = useDataItemWin((state) => state.setDataTags);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(true);
    const dataItemDetail = useDataItemWin((state) => state.dataItemDetail);
    const setDataItemDetail = useDataItemWin((state) => state.setDataItemDetail);

    const onChangeValueDetail = useDataItemWin((state) => state.onChangeValueDetail);
    const onAddDetail = useDataItemWin((state) => state.onAddDetail);
    const onRemoveDetail = useDataItemWin((state) => state.onRemoveDetail);

    const orgUnit = useDataApp((state) => state.orgUnit);
    const userLogin = useDataApp((state) => state.userLogin);
    const currentYear = useDataApp((state) => state.currentYear);
    const currencies = useDataApp((state) => state.currencies);
    const isLangVi = !!(useDataApp((state) => state.lang) === "vi");

    const resetItem = useDataItemWin((state) => state.resetItem);
    const { _ } = useTranslation();

    const layoutData = useDataItemWin((state) => state.layoutData);
    const setLayoutData = useDataItemWin((state) => state.setLayoutData);

    const [infoData, setInfoData] = useState({
        total: 0,
        hasMore: true,
    });

    const [params, setParams] = useState<IParamWin>();

    const schemaUI = useMemo(() => {
        const tabMaster = winConfig?.window.Tabs[0];
        const defaultSchema = schemaWin[tableWin] ?? schemaWinEmpty;
        const zod = { ...layoutData?.[tableWin]?.zod, ...tabMaster?.ZOD };
        return Helper.deepMerge(defaultSchema, { ...layoutData?.[tableWin], zod });
    }, [layoutData, tableWin, winConfig?.window.Tabs]);

    const getFilterRows = useCallback((values: Record<string, any>) => {
        return values;
    }, []);

    const watchRequiredValues = useMemo(() => {
        let obj: Record<string, any> = {};
        (schemaUI?.dataMaster ?? []).forEach(k => {
            obj[k] = dataItems?.[tableWin]?.[k];  // lấy giá trị hiện tại trong data
        });
        return obj;
    }, [schemaUI, dataItems, tableWin]);

    // eval expression
    const evalExpr = useEvalExpr(watchRequiredValues);


    const numberAction: number = useMemo(() => {
        return schemaUI.config.itemAction.fields.length;
    }, [schemaUI]);

    const showFilter = useMemo(() => {
        return {
            showSearch: !!schemaUI.fieldSearch,
            showFilter: schemaUI.config.filterConfig ? true : false
        };
    }, [schemaUI]);
    const getConfigTab = useCallback((tab: IData) => {
        const groups: Record<string, string[]> = {
            DPKT: ["_soTk", "_loaiTk"],
            CTKT: ["_isCp0", "_maDtBt", "_tkNo"],
            DPHV: ["_tTnk", "_tTdb", "_tTck"],
            CTHV: ["_maKho", "_maKhoDc", "_maHvDc", "_tkNo", "_tkNo2", "_tThue", "_thueHKD", "_tNk", "_tCk", "_tDb"],
            PSCF: ["_loaiPhi"],
            PSTHUE: ["_nhomHd"]
        };

        const _getGroup = (display: any, groupName: string) => {
            const keys = groups[groupName] || [];
            return keys.reduce((acc, key) => {
                acc[key] = display[key];
                return acc;
            }, {} as any);
        };

        const FIELD_DISPLAY = Object.keys(FIELD_MAP);

        // Object display với key _camelCase
        let display: any = {
            // DPKT
            _soTk: false, _loaiTk: false,
            // CTKT
            _isCp0: false, _maDtBt: false,
            // DPHV
            _tThue: false, _thueHKD: false, _tTnk: false, _tTdb: false, _tTck: false,
            // CTHV
            _maKho: false, _maKhoDc: false, _maHvDc: false, _tkNo2: false, _tNk: false, _tCk: false, _tDb: false,
            // PSCF
            _loaiPhi: false,
            // PSTHUE
            _nhomHd: false
        };
        let result: any = {
            EXPRESSION: {},
            EXPRESSION_If_EMPTY: {},
            DEFAULT_VALUE: {},
            CAPTION: {},
            REF_ID: {},
        };
        let zod: IZod = {};

        const fields: IData[] = tab.Fields;
        fields.map(f => {

            if (!f.HIDDEN && isNotEmpty(f.VALID_RULE) && ['isNotEmpty', 'isFieldCode'].includes(f.VALID_RULE)) {
                zod[f.COLUMN_NAME] = { type: TYPE_NUMBER.includes(f.COLUMN_TYPE) ? 'number' : 'string' };
            }

            if (FIELD_DISPLAY.includes(f.COLUMN_NAME)) display[(FIELD_MAP as any)[f.COLUMN_NAME]] = !f.HIDDEN;

            if (isNotEmpty(f.DEFAULT_VALUE) && (f.DEFAULT_VALUE as string).startsWith('@Default=')) {
                const valueDefault = (f.DEFAULT_VALUE as string).replace('@Default=', '').trim();
                result.DEFAULT_VALUE[f.COLUMN_NAME] = (TYPE_NUMBER.includes(f.COLUMN_TYPE) ? Number(valueDefault) : valueDefault);
            }
            if (isNotEmpty(f.CAPTION)) {
                result.CAPTION[f.COLUMN_NAME] = f.CAPTION;
            }
            if (isNotEmpty(f.FIELD_EXPRESSION)) {
                const param: any[] = f.FIELD_EXPRESSION.split(';');
                let filter: Record<string, any> = {};
                let notReplace: string[] = [];
                param.forEach(p => {
                    const [fValue, fParam, isNotReplace] = p.replace(/[{}]/g, "").split(":");
                    filter[fParam] = fValue;
                    if (isNotReplace !== undefined) {
                        notReplace.push(fParam);
                    }
                });
                result.EXPRESSION[f.COLUMN_NAME] = filter;
                if (notReplace.length > 0) result.EXPRESSION_If_EMPTY[f.COLUMN_NAME] = notReplace;
            }
            if (isNotEmpty(f.REF_ID)) result.REF_ID[f.COLUMN_NAME] = {
                id: f.REF_ID, LIST_COLUMN: isNotEmpty(f.LIST_COLUMN) ? JSON.parse(f.LIST_COLUMN) : undefined,
                TYPE_EDITOR: f.TYPE_EDITOR
            };
        });
        return { config: result, display: _getGroup(display, tab.TAB_TABLE), zod };
    }, []);
    const extractWinConfig = useCallback((dataConfig: any): IWinConfig => {
        setParams({
            page: 1,
            count: typeWin === "(winTree)" ? 99999 : pageSize,
            filter: [],
            start: 0,
            infoparam: null,
            tlbparam: [],
            window_id: windowId
        });
        const tabsWin: any[] = [...dataConfig.Tabs].filter((tab: any) => tab.HIDE_EDIT !== 'C').slice(1);
        const newTabs = tabsWin.map((tab) => {
            const configTab = getConfigTab(tab);
            return {
                id: tab.TAB_ID,
                value: _(tab.TAB_NAME),
                TAB_ID: tab.TAB_ID,
                TAB_NAME: tab.TAB_NAME,
                FOREIGN_KEY: tab.FOREIGN_KEY,
                TAB_TABLE: tab.TAB_TABLE,
                PERMISSION: { NEW: !!tab.INSERT_STORE_PROCEDURE, EDIT: !!tab.UPDATE_STORE_PROCEDURE, DELETE: !!tab.DELETE_STORE_PROCEDURE },
                DISPLAY: configTab.display,
                ZOD: configTab.zod,
                ...configTab.config
            }
        });
        setDataTags(tableWin, newTabs);
        const dmct = dataConfig.DATA_EXTRA.find((f: any) => f.id === 'dmct');

        const mapSource: Record<string, string> = schemaWin[tableWin]?.mapDataSource ?? {};
        let refIds: any = {};
        const resultWinConfig = {
            // references: data.references ?? {},
            window: {
                WINDOW_ID: windowId,
                MA_CT: dataConfig.MA_CT ?? "",
                MA_NT: dmct?.data?.[0]?.MA_NT,
                NHOM_CT: dmct?.data?.[0]?.NHOM_CT,
                WINDOW_NAME: dataConfig.WINDOW_NAME ?? "",
                VC_INFOWINDOW_ID: dataConfig.VC_INFOWINDOW_ID,
                Tabs: dataConfig.Tabs.filter((tab: any) => tab.HIDE_EDIT !== 'C')
                    .map((tab: any): ITabWin => {
                        const configTab = getConfigTab(tab);
                        refIds = { ...refIds, ...configTab.config.REF_ID };
                        return {
                            id: tab.id ?? "",
                            value: tab.TAB_NAME ?? "",
                            TAB_ID: tab.TAB_ID ?? "",
                            TAB_TABLE: tab.TAB_TABLE ?? "",
                            FOREIGN_KEY: tab.FOREIGN_KEY ?? "",
                            TAB_NAME: tab.TAB_NAME ?? "",
                            PERMISSION: {
                                NEW: !Helper.isEmpty(tab.INSERT_STORE_PROCEDURE),
                                EDIT: !Helper.isEmpty(tab.UPDATE_STORE_PROCEDURE),
                                DELETE: !Helper.isEmpty(tab.DELETE_STORE_PROCEDURE)
                            },
                            DISPLAY: configTab.display,
                            ZOD: configTab.zod,
                            ...configTab.config
                        }
                    })
            }
        };
        // get more data source
        let sourceAdd: IDataSource = {};
        Object.keys(mapSource).map(key => {
            if (!!refIds[mapSource[key]]?.id) sourceAdd[key] = getUrlReference(refIds[mapSource[key]]?.id);
        });

        loadDataBegin(sourceAdd);

        return resultWinConfig;
    }, [_, getConfigTab, pageSize, setDataTags, tableWin, typeWin, windowId])

    const tabs = useMemo(() => {
        const _tags = dataTags[tableWin] ?? [];
        return _tags.map(t => ({ ...t, badge: dataItemDetail[tableWin]?.[t.TAB_TABLE]?.length ?? 0 }));
    }, [tableWin, dataTags, dataItemDetail]);

    const [currentTab, setCurrentTab] = useState<ITabWin>(tabs?.[0]);

    const tabMulti = useMemo(() => {
        return (winConfig ? [...winConfig.window.Tabs.filter((tab: any) => tab.HIDE_EDIT !== 'C')].slice(1) : []);
    }, [winConfig]);

    const setTextSearch = (textSearch: string) => {

        if (schemaUI.isRmTone) textSearch = Helper.rmTone(textSearch).replace(/\s+/g, "");

        if (schemaUI.fieldSearch && !!textSearch) {
            setParams(prev => prev ? {
                ...prev, page: 1, start: 0,
                filter: (() => {
                    const filters = [...prev.filter];
                    const index = filters.findIndex(f => f.columnName === schemaUI.fieldSearch);
                    if (index >= 0) {
                        filters[index] = { ...filters[index], value: textSearch };
                    } else {
                        filters.push({ columnName: schemaUI.fieldSearch as string, columnType: "string", value: textSearch, });
                    }
                    return filters;
                })(),
            } : undefined);
        } else {
            setParams(prev => prev ? { ...prev, page: 1, start: 0, filter: [] } : undefined);
        }
    };

    const setFilterRows = (values: Record<string, any>) => {
        const infoparam = getFilterRows(values);
        setParams(prev => prev ? {
            ...prev, page: 1, start: 0,
            infoparam: {
                infowindow_id: winConfig?.window.VC_INFOWINDOW_ID ?? '',
                parameter: infoparam
            }
        } : undefined);
    };

    const getDataPage = useCallback(async () => {
        if (!winConfig?.window.Tabs[0].PERMISSION.NEW) {
            showPopup({ title: isLangVi ? "Thông báo" : "Notification", message: isLangVi ? "Bạn không có quyền xem dữ liệu!" : "You do not have permission to view the data!" });
            return;
        }
        if (params?.page === 1) {
            setInfoData({ total: 0, hasMore: true });
            setData([]);
        }
        stateLoading.current = { ...stateLoading.current, refresh: params?.page === 1, loadMore: params?.page !== 1 };
        const domain = await getSubDomain();
        api.post({
            link: `/api/System/GetDataByWindowNo`,
            data: params,
            config: {
                headers: {
                    'x-tenant-name': domain
                }
            },
            callBack: (res: { data: IData[], total_count: number }) => {
                // const dataPage = typeWin === "(winTree)" ? Helper.sortTreeFlat(res.data, itemMenuWin.codeField) : res.data
                const dataPage = res.data;
                setInfoData(prev => ({
                    ...prev,
                    total: params?.page === 1 ? res.total_count : infoData.total,
                    hasMore: dataPage.length === (params?.count ?? 0)
                }));
                setData(prev => (params?.page === 1 ? dataPage : [...prev, ...dataPage]));
            },
            setLoading: (loading) => {
                // if (params?.page === 1) {
                //     loading ? show("Tải dữ liệu") : hide()
                // }
                stateLoading.current = { ...stateLoading.current, refresh: false, loadMore: params?.page !== 1 ? loading : false };
            },
            callError: (err) => {
                console.error(err);
                showToast(`${isLangVi ? 'Lỗi lấy dữ liệu!' : 'Error retrieving data!'}`, { type: "error" })
            }
        });
    }, [params, winConfig]);

    const refreshData = useCallback(() => {
        if (!params) return;
        getDataPage();
    }, [params]);

    const handleRefresh = useCallback(() => {
        setParams(prev => prev ? { ...prev, page: 1, start: 0, infoparam: null } : undefined)
    }, []);

    const handleLoadMore = useCallback(() => {
        if (!infoData.hasMore || stateLoading.current.refresh) return;
        setParams(prev => prev ? { ...prev, page: prev.page + 1, start: (prev.page + 1) * pageSize } : undefined)
    }, [infoData, stateLoading.current.refresh]);

    const { validate, errors, setErrors } = useZodValidation(dataItems[tableWin], buildZodSchema(schemaUI.zod));

    const [isChange, setIsChange] = useState(false);
    const onChangeItemData = (valueChange: Record<string, any>) => {
        setIsChange(true);
        onChangeValue(tableWin, valueChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChangeItemDataDetail = (tableDetail: ITableWin, index: number, valueChange: Record<string, any>) => {
        setIsChange(true);
        onChangeValueDetail(tableWin, tableDetail, index, valueChange);
    };

    const onNew = useCallback(async () => {
        const arrReplace: Record<string, any> = {
            '#USER_LOGIN#': userLogin,
            '#NAM#': currentYear,
            '#TODAY#': dayjs().format("YYYY-MM-DD"),
            '#MA_NT#': winConfig?.window.MA_NT,
            '#TY_GIA#': currencies?.[winConfig?.window.MA_NT ?? "VND"].TY_GIA ?? 1
        };

        const newDefault = Object.fromEntries(
            Object.entries(schemaUI.defaultNew).map(([key, value]) =>
                typeof value === 'string' && arrReplace.hasOwnProperty(value)
                    ? [key, arrReplace[value]]
                    : [key, value]
            )
        );

        const defaultValue = {
            ...itemMenuWin.defaultValue ?? {},
            ...winConfig?.window.NHOM_CT && { NHOM_CT: winConfig?.window.NHOM_CT }
        };
        const tabMaster = winConfig?.window.Tabs[0];

        const typeView = itemMenuWin.typeView ?? {};
        const defaultValueConfig = tabMaster?.DEFAULT_VALUE ?? {};
        const itemNew: IData = { id: UUID.v4(), _isNew: true, DVCS_ID: orgUnit, ...newDefault, ...defaultValue, ...typeView, ...defaultValueConfig, ...tabMaster?.DISPLAY };
        // nếu là chứng từ
        const soCt = await tangSoCt(itemNew);
        setEditMode('new');
        setItemData(tableWin, { ...itemNew, ...soCt });
        const action = schemaUI.action ? { ...schemaUI.action, edit: tabMaster?.PERMISSION.EDIT, new: tabMaster?.PERMISSION.NEW } : { edit: true, new: true };

        router.navigate({
            pathname: `/(window)/newEditWin${typeWin !== "(winMaster)" ? '' : 'Master'}`,
            params: {
                sItemMenuWin: JSON.stringify(itemMenuWin), title: _(winConfig?.window?.WINDOW_NAME),
                sAction: JSON.stringify(action)
            }
        });
    }, [winConfig]);

    const onEdit = useCallback((item: IData, isEdit: boolean = false) => {
        setEditMode('edit');
        const tabMaster = winConfig?.window.Tabs[0];
        const typeView = {
            ...itemMenuWin.typeView ?? {},
            ...tabMaster?.DISPLAY
        };
        setItemData(tableWin, { ...item, ...typeView });

        if (!isEdit) {
            const action = schemaUI.action ? { ...schemaUI.action, edit: tabMaster?.PERMISSION.EDIT, new: tabMaster?.PERMISSION.NEW } : { edit: true, new: true };

            const dataMaster = schemaUI.dataMaster ? Object.fromEntries(schemaUI.dataMaster.map(f => [f, item[f]])) : {};
            router.navigate({
                pathname: `/(window)/newEditWin${typeWin !== "(winMaster)" ? '' : 'Master'}`,
                params: {
                    sItemMenuWin: JSON.stringify(itemMenuWin), id: item.id, title: _(winConfig?.window?.WINDOW_NAME),
                    sDataMaster: JSON.stringify(dataMaster), sAction: JSON.stringify(action)
                }
            });
        }
    }, [winConfig]);

    const onSave = useCallback(async () => {
        const itemData = dataItems[tableWin]!;
        const _checkSave = () => {
            const isResult = validate();
            if (!isResult) {
                setTimeout(() => {
                    setErrors({});
                }, 5000); //sau 10.000 ms = 10 giây sẽ tự xoá các error message...
            }
            if (tableWin === "DPHV") {
                if (Number(itemData.T_TNK) !== 0 && (!isNotEmpty(itemData.TK_NO_NK) || !isNotEmpty(itemData.TK_CO_NK))) {
                    showToast('Bạn cần hạch toán thuế nhập khẩu', { type: "warning" });
                    return false;
                }
                if (Number(itemData.T_TDB) !== 0 && (!isNotEmpty(itemData.TK_NO_DB) || !isNotEmpty(itemData.TK_CO_DB))) {
                    showToast('Bạn cần hạch toán thuế TTĐB', { type: "warning" });
                    return false;
                }
            }
            return isResult;
        };
        if (!_checkSave()) return;

        const details: any[] = [];
        if (typeWin === "(winMaster)" && tabs.length > 0) {
            let fixTabRequire: Partial<Record<ITableWin, boolean>> = {};
            if (itemData.MA_CT === 'VAT') {
                fixTabRequire['CTHV'] = false
                fixTabRequire['PSTHUE'] = true
            };
            if (itemData.MA_CT === 'PCP') {
                fixTabRequire['PSCF'] = true
            };

            for (const tab of tabs) {
                const isRequire = fixTabRequire[tab.TAB_TABLE] !== undefined ? fixTabRequire[tab.TAB_TABLE] : schemaWin[tab.TAB_TABLE]?.require;
                const dataDetail = dataItemDetail[tableWin] ? dataItemDetail[tableWin][tab.TAB_TABLE] : [];
                let addDetail: Record<string, any> | null = null;
                if (tab.TAB_TABLE === 'CTKT' && !tab.DISPLAY._tkNo) {
                    if (!isNotEmpty(itemData.MA_HT)) {
                        showToast(`${isLangVi ? 'Bạn chưa nhập mã hạch toán' : 'You have not entered MA_HT'} [${_(tab.TAB_NAME)}]!`, { type: "warning" });
                        return;
                    }
                    addDetail = {};
                    // update lại TK_NO, TK_CO
                    // const sql = encodeURIComponent(`SELECT TK_NO,TK_CO FROM DMHT WHERE DVCS_ID=N'${orgUnit}' AND MA_HT=N'${itemData.MA_HT}'`);
                    // const res: IData[] = await api.get({ link: `/api/System/ExecuteQuery?sql=${sql}` });
                    // if (res && res.length > 0) {
                    //     addDetail = { TK_NO: res[0].TK_NO, TK_CO: res[0].TK_CO };
                    // }
                }
                if (isRequire && dataDetail.length === 0) {
                    showToast(`${isLangVi ? 'Bạn chưa nhập chi tiết' : 'You have not entered details'} [${_(tab.TAB_NAME)}]!`, { type: "warning" });
                    return;
                }
                details.push({
                    TAB_ID: tab.TAB_ID,
                    TAB_TABLE: tab.TAB_TABLE,
                    data: addDetail ? dataDetail.map(detail => ({ ...detail, ...addDetail })) : dataDetail
                });
            }
        }
        const domain = await getSubDomain();
        const msgSuccessful = editMode === "new" ? (isLangVi ? "Thêm mới" : "New addition") : (isLangVi ? "Sửa" : "Edit");
        await api.post({
            link: `/api/System/Save`,
            data: {
                windowid: windowId,
                editmode: editMode === "new" ? 1 : 2,
                data: [{ ...itemData, details: details }]
            },
            config: {
                headers: {
                    'x-tenant-name': domain
                }
            },
            callBack: (res => {
                if (res && res.error) {
                    showToast(res.error, { type: "error" });
                } else {
                    setEditMode(null);
                    showToast(isLangVi ? `${msgSuccessful} thành công!` : `${msgSuccessful} successful!`);
                    router.back();
                    setShouldRefresh(itemMenuWin.tableWin);
                }
            }),
            callError: (msgError) => {
                console.log("msgError>>", msgError);
                showToast(msgError, { type: "error" });
            },
            setLoading: (loading) => loading ? show("...") : hide()
        });

    }, [itemMenuWin, dataItems, tabs]);

    const onDelete = useCallback((id: string) => {
        const tabMaster = winConfig?.window.Tabs[0];
        if (!tabMaster?.PERMISSION.DELETE) {
            showPopup({ title: isLangVi ? "Thông báo" : "Notification", message: isLangVi ? "Bạn không có quyền xoá!" : "You do not have permission to delete!" });
            return;
        }
        showPopup({
            message: isLangVi ? "Bạn có muốn xoá dữ liệu" : "Do you want to delete data?",
            iconType: "question",
            showCancel: true,
            onConfirm: async () => {
                const domain = await getSubDomain();
                await api.post({
                    link: `/api/System/Save`,
                    data: {
                        windowid: windowId,
                        editmode: 3,
                        data: [{ id: id }]
                    },
                    config: {
                        headers: {
                            'x-tenant-name': domain
                        }
                    },
                    callBack: (res => {
                        if (res && res.error) {
                            const msgError = res.error.split('|');
                            showToast(`${msgError[0]} ${msgError[2] !== undefined ? msgError[2] : ''}`, { type: "error" });
                        } else {
                            showToast(isLangVi ? "Xoá thành công" : "Delete successful");
                            setShouldRefresh(itemMenuWin.tableWin);
                        }
                    }),
                    setLoading: (loading) => loading ? show(isLangVi ? "Xoá..." : "Delete...") : hide()
                });
            }
        });
    }, [winConfig]);

    const handleAction = {
        new: onNew,
        save: onSave,
        edit: onEdit,
        delete: onDelete
    };

    const loadDetail = useCallback(async (id?: string) => {
        const itemData = dataItems[tableWin]!;
        const addDetails = schemaUI.addDetails ? Object.fromEntries(schemaUI.addDetails.map(f => [f, itemData[f]])) : {};
        const typeView = itemMenuWin.typeView ?? {};
        const promises = tabs.map(async (tab) => {
            if (id) {
                try {
                    await api.get({
                        link: `/api/System/GetDataDetailsByTabTable?window_id=${itemMenuWin.id}&id=${id}&tab_table=${tab.TAB_TABLE}`,
                        callBack: (res: IData[]) => {
                            res = res.map((item, index) => ({
                                ...item,
                                ...addDetails,
                                ...typeView,
                                ...currentTab?.DISPLAY,
                            }));
                            setDataItemDetail(tableWin, tab.TAB_TABLE, res);
                        }
                    })
                } catch (error) {
                    setDataItemDetail(tableWin, tab.TAB_TABLE, []);
                }
            } else {
                setDataItemDetail(tableWin, tab.TAB_TABLE, []);
            }
        });
        setLoadingDetail(true);
        await Promise.all(promises);
        setLoadingDetail(false);
    }, [dataItems, itemMenuWin.id, itemMenuWin.typeView, schemaUI.addDetails, setDataItemDetail, tableWin, tabs, currentTab]);

    const schemaWinDetail = useMemo(() => {
        const defaultSchema = schemaWin[currentTab?.TAB_TABLE ?? "Empty"] ?? schemaWinEmpty;
        const zod = { ...layoutData?.[currentTab?.TAB_TABLE]?.zod, ...currentTab?.ZOD };
        return Helper.deepMerge(defaultSchema, { ...layoutData?.[currentTab?.TAB_TABLE], zod });
    }, [currentTab, layoutData]);

    const numberActionDetail: number = useMemo(() => {
        return schemaWinDetail.config.itemAction.fields.length;
    }, [schemaWinDetail]);

    const [showNewEdit, setShowNewEdit] = useState(false);
    const [itemDetail, setItemDetail] = useState<IData | null>(null);
    const typeNewEdit = useRef<'new' | 'edit' | null>(null);
    const currentIndex = useRef(0);

    const changeOtherDetail = useRef(false);

    const [rowHeightDetails, setRowHeightDetails] = useState<Record<string, DimensionValue>>({});
    const handleLayoutDetail = (itemId: string, event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        setRowHeightDetails((prev) => ({
            ...prev,
            [itemId]: height,
        }));
    };

    const dataDetail = useMemo(() => {
        return dataItemDetail[tableWin]?.[currentTab?.TAB_TABLE ?? "Empty"];
    }, [dataItemDetail, currentTab, tableWin]);

    const onNewDetail = useCallback(async (e: any, addDetailMore?: Record<string, any>) => {
        if (!addDetailMore) typeNewEdit.current = 'new';
        const typeView = itemMenuWin.typeView ?? {};
        const itemData = dataItems[tableWin]!;
        const addDetails = schemaUI.addDetails ? Object.fromEntries(schemaUI.addDetails.map(f => [f, itemData[f]])) : {};

        const arrReplace: Record<string, any> = {
            '#USER_LOGIN#': userLogin,
            '#NAM#': currentYear,
            '#TODAY#': dayjs().format("YYYY-MM-DD")
        };

        const newDefault = Object.fromEntries(
            Object.entries(schemaWinDetail.defaultNew).map(([key, value]) =>
                typeof value === 'string' && arrReplace.hasOwnProperty(value)
                    ? [key, arrReplace[value]]
                    : [key, evalExpr(value)]
            )
        );

        let addTkHt: Record<string, any> | null = null;
        if (currentTab.TAB_TABLE === 'CTKT' && !currentTab.DISPLAY._tkNo && isNotEmpty(itemData.MA_HT)) {
            const sql = encodeURIComponent(`SELECT TK_NO,TK_CO FROM DMHT WHERE DVCS_ID=N'${orgUnit}' AND MA_HT=N'${itemData.MA_HT}'`);
            const res: IData[] = await api.get({ link: `/api/System/ExecuteQuery?sql=${sql}` });
            if (res && res.length > 0) {
                addTkHt = { TK_NO: res[0].TK_NO, TK_CO: res[0].TK_CO };
            }
        }

        const copyFieldDetails = itemMenuWin.copyDetails?.[currentTab.TAB_TABLE] ?? [];

        let copyDetails: any = addTkHt || {};

        if (dataDetail && dataDetail.length > 0) {
            const itemLast = dataDetail[dataDetail.length - 1];
            copyDetails = Object.fromEntries(
                copyFieldDetails.map((f: any) => [f, itemLast[f]])
            );
        }
        const defaultNumber = defaultNumberNew[currentTab.TAB_TABLE] ?? [];
        const initNumber = defaultNumber.reduce((acc, f) => {
            acc[f] = 0;
            return acc;
        }, {} as Record<string, number>);

        const defaultValueConfig = currentTab?.DEFAULT_VALUE ?? {};
        if (addDetailMore !== undefined) {
            return {
                id: UUID.v4(),
                DVCS_ID: orgUnit,
                _isNew: true,
                ...initNumber,
                ...newDefault,
                ...typeView,
                ...addDetails,
                ...copyDetails,
                ...addDetailMore,
                ...defaultValueConfig,
                ...currentTab?.DISPLAY
            };
        } else {
            setItemDetail({
                id: UUID.v4(),
                DVCS_ID: orgUnit,
                _isNew: true,
                ...initNumber,
                ...newDefault,
                ...typeView,
                ...addDetails,
                ...copyDetails,
                ...defaultValueConfig,
                ...currentTab?.DISPLAY
            });
            setShowNewEdit(true);
            return null;
        }
    }, [currentYear, currentTab, dataDetail, dataItems, evalExpr, itemMenuWin.typeView, orgUnit, schemaUI.addDetails, schemaWinDetail.defaultNew, tableWin, userLogin]);

    const refreshSourceDvtCb = useCallback((MA_HV: string) => {
        const url = VcReferences.DVT_CB.url?.replace('#ExtraFilter#', encodeURIComponent(`MA_HV=N'${MA_HV}'`));
        api.get({
            link: url!,
            callBack: (res) => setDataSource(tableWin, 'DVT_CB', res)
        });
    }, [setDataSource, tableWin]);

    const onSelectDetail = useCallback((index: number) => {

        const isEdit = schemaWinDetail.action?.edit !== false;
        if (!isEdit) return;
        typeNewEdit.current = 'edit';
        currentIndex.current = index;
        const itemDetail = dataItemDetail[tableWin]?.[currentTab?.TAB_TABLE ?? "Empty"]?.[index] ?? { id: UUID.v4() };
        const itemData = dataItems[tableWin]!;
        const addDetails = schemaUI.addDetails ? Object.fromEntries(schemaUI.addDetails.map(f => [f, itemData[f]])) : {};
        if (currentTab.TAB_TABLE === "CTHV") refreshSourceDvtCb(itemDetail.MA_HV ?? '***');
        setItemDetail({ ...itemDetail, ...addDetails, ...currentTab?.DISPLAY });
        setShowNewEdit(true);
    }, [refreshSourceDvtCb, currentTab, dataItemDetail, dataItems, schemaUI.addDetails, schemaWinDetail.action?.edit, tableWin]);

    const onChangeDetail = useCallback((valueChange: IData) => {
        setIsChange(true);
        setItemDetail(prev => prev ? { ...prev, ...valueChange } : null);
    }, []);

    const onUpdateDetail = useCallback((data?: IData) => {
        if (data) {
            setIsChange(true);
            if (typeNewEdit.current === 'new') {
                onAddDetail(tableWin, currentTab?.TAB_TABLE ?? "Empty", data!);
            } else {
                onChangeItemDataDetail(currentTab?.TAB_TABLE ?? "Empty", currentIndex.current, data!);
            }
        }
        setShowNewEdit(false);
        setItemDetail(null);
    }, [currentTab?.TAB_TABLE, onAddDetail, onChangeItemDataDetail, tableWin]);

    const onDeleteDetail = useCallback((itemDetail: IData) => {
        showPopup({
            message: _('MUON_XOA'),
            iconType: "question",
            showCancel: true,
            onConfirm: () => {
                setIsChange(true);
                changeOtherDetail.current = true;
                onRemoveDetail(tableWin, currentTab?.TAB_TABLE ?? "Empty", itemDetail);
            }
        });
    }, [currentTab?.TAB_TABLE, onRemoveDetail, showPopup, tableWin]);

    const handleActionDetail = {
        new: onNewDetail,
        select: onSelectDetail,
        change: onChangeDetail,
        update: onUpdateDetail,
        delete: onDeleteDetail
    }

    const [tableRefresh, setTableRefresh] = useState<Record<string, { url: string, type?: string, dataPost?: Record<string, any>, key: string }>>({});


    const setSource = useCallback((res: IData[], source: any, key: string, defaultSource?: IDataSource) => {
        if (res.length === 0) {
            setDataSource(tableWin, key, []);
            return;
        };
        const configSource: any = defaultSource?.[key] || VcReferences[source[key]];
        if (configSource.typeData === "tree") res = Helper.sortTreeFlat(res, configSource.fieldCode);
        const fields: string[] = configSource.fields || Object.keys(res[0]);
        const isColor = fields.indexOf("color") < 0 && typeof configSource.getColor === "function";
        const result = res.map((item: any) => {
            const obj = Object.fromEntries(
                fields.map(f => [f, item[f]])
            );
            if (isColor) {
                obj.color = configSource.getColor(item);
            }
            return obj;
        });
        setDataSource(tableWin, key, result);
    }, [setDataSource, tableWin]);

    const loadDataBegin = useCallback(async (defaultSource?: IDataSource) => {
        let source: any = defaultSource || (schemaWin[tableWin]?.dataSource ?? {});
        // tabs.forEach((tab) => {
        //     const _source = schemaWin[tab.TAB_TABLE]?.dataSource ?? {};
        //     source = { ...source, ..._source };
        // });
        // const source: any = schema.dataSource ?? {};
        const promises = Object.keys(source).map(async (key: any) => {
            const configSource: any = defaultSource?.[key] || VcReferences[source[key]];

            if (configSource?.data) {
                setDataSource(tableWin, key, configSource?.data);
            }
            if (configSource?.url) {
                const url = key === "DVT_CB" ? configSource.url.replace('#ExtraFilter#', encodeURIComponent("MA_HV=N'***'")) : configSource.url;
                const apiGetPost = configSource.type === "post" ? api.post : api.get;
                try {
                    await apiGetPost({
                        link: url, data: configSource.dataPost,
                        callBack: (res => {
                            if (res) {
                                setSource(res, source, key, defaultSource);
                                if (configSource.tableWin) {
                                    setTableRefresh(prev => ({
                                        ...prev,
                                        [configSource.tableWin]: { url: configSource.url, type: configSource.type, dataPost: configSource.dataPost, key: key }
                                    }));
                                }
                            }
                        })
                    });
                } catch (error) {
                    setSource([], source, key, defaultSource);
                }
            }
        });
        await Promise.all(promises);
    }, [setDataSource, setSource, tableWin]);


    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            // refresh datasource...
            let source: any = schemaWin[tableWin]?.dataSource ?? {};
            tabs.forEach((tab) => {
                const _source = schemaWin[tab.TAB_TABLE]?.dataSource ?? {};
                source = { ...source, ..._source };
            });
            const apiRefresh = tableRefresh[shouldRefresh].type === "post" ? api.post : api.get;
            const url = tableRefresh[shouldRefresh].key === "DVT_CB" ?
                tableRefresh[shouldRefresh].url.replace('#ExtraFilter#', encodeURIComponent("MA_HV=N'***'")) : tableRefresh[shouldRefresh].url;
            apiRefresh({
                link: url,
                data: tableRefresh[shouldRefresh].dataPost,
                callBack: (res) => {
                    setSource(res, source, tableRefresh[shouldRefresh].key);
                    setShouldRefresh(null);
                }
            });
        }
    }, [shouldRefresh]);
    //
    const [printSamples, setPrintSamples] = useState<IData[]>([]);
    const getConfigWin = useCallback(async () => {
        // show("...");
        // lấy cấu hình layout từ data
        try {
            const sql = encodeURIComponent(`SELECT LAYOUT_MOBILE FROM VC_WINDOW WHERE WINDOW_ID='${windowId}'`);
            await api.get({
                link: `/api/System/ExecuteQuery?sql=${sql}`,
                callBack: (res) => {
                    if (res && isNotEmpty(res[0])) {

                        const layout = res[0].LAYOUT_MOBILE;
                        const fn = new Function("colors", "getListItemView", "ListItemView", layout);
                        const result = fn(colors, getListItemView, ListItemView);
                        setLayoutData(result);
                    }
                }
            });
        } catch (error) { }
        await api.get({
            link: `/api/System/GetAllByWindowNo?window_id=${windowId}`,
            callBack: (res) => setWinConfig(tableWin, extractWinConfig(res[0])),
        });

        await api.post({
            link: `/api/System/MauIn`,
            data: {
                WINDOW_ID: windowId
            },
            callBack: (res) => setPrintSamples(res ?? []),
        });
        // lấy các dữ liệu reference liên quan
        await loadDataBegin();
        // hide();
    }, [colors, extractWinConfig, loadDataBegin, setLayoutData, setWinConfig, tableWin, windowId]);

    const onBack = useCallback(() => {
        if (isChange) {
            showPopup({
                title: isLangVi ? backHandQuestion.title : backHandQuestionE.title,
                message: isLangVi ? backHandQuestion.message : backHandQuestionE.message,
                showCancel: true,
                confirmText: _('EXIT'),
                onConfirm: () => {
                    router.back();
                }
            })
        } else {
            router.back();
        }
    }, [showPopup, isChange, isLangVi, _]);

    const getDataById = useCallback(async (id: string) => {
        await getConfigWin();
        await api.get({
            link: `/api/System/GetDataById?window_id=${itemMenuWin.id}&id=${id}`,
            callBack: (res: IData[]) => {
                if (res && res.length > 0) {
                    setData(res);
                    onEdit(res[0], true);
                };
            }
        });
    }, [itemMenuWin.id, onEdit, getConfigWin]);
    return {
        colors,
        params,
        schemaUI,
        errors,
        numberAction,
        rowHeights,
        loading: stateLoading.current,
        data,
        itemData: dataItems[tableWin],
        infoData,
        handleAction,
        resetItem,
        resetTableWin,
        tableWin: winConfig?.window?.Tabs[0]?.TAB_TABLE,
        dataSource: dataSources[tableWin],
        showFilter,
        permissions: winConfig?.window.Tabs[0]?.PERMISSION,
        printSamples,
        tabMulti,
        configExpression: {
            expression: winConfig?.window.Tabs[0].EXPRESSION,
            expressionIfEmpty: winConfig?.window.Tabs[0].EXPRESSION_If_EMPTY,
            caption: winConfig?.window.Tabs[0].CAPTION,
            refId: winConfig?.window.Tabs[0].REF_ID
        },
        setIsChange,
        setFilterRows,
        setTextSearch,
        onChangeItemData,
        onBack,
        refreshData,
        getConfigWin,
        handleLayout,
        setParams,
        handleRefresh,
        handleLoadMore,
        getDataById,
        isLangVi,
        detail: {
            tabs,
            loadingDetail,
            loadDetail,
            numberActionDetail,
            changeOtherDetail,
            dataDetail,
            currentTab,
            configExpression: {
                expression: currentTab?.EXPRESSION,
                expressionIfEmpty: currentTab?.EXPRESSION_If_EMPTY,
                caption: currentTab?.CAPTION,
                refId: currentTab?.REF_ID
            },
            refreshSourceDvtCb,
            setCurrentTab,
            itemDetail,
            rowHeightDetails,
            handleLayoutDetail,
            handleActionDetail,
            schemaWinDetail,
            showNewEdit
        }
    };
}