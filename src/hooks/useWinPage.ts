import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
import { useZodValidation } from "@/components/UIEngine/hooks/useZodValidation";
import { useTranslation } from "@/context/TranslationContext";
import { schemaWin, schemaWinEmpty } from "@/schema";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { getSubDomain } from "@/utils/vcStorage";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DimensionValue, LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";
import UUID from 'react-native-uuid';
import { useDataItemWin } from "./useDataItem";
import { useDataApp } from "./zustand/useDataApp";
const backHandQuestion = { title: "Cảnh báo", message: "Dữ liệu đã thay đổi, bạn có muốn thoát không?" };
const backHandQuestionE = { title: "Warning", message: "Data has changed, do you want to exit?" };

interface IProgs {
    // windowId: string;
    // tableWin: ITableWin;
    // typeWin?: '(window)' | '(winMaster)' | '(winTree)';
    itemMenuWin: IMenuWin
    pageSize?: number,
    loadingBegin?: boolean;
}
export const useWinPage = ({ itemMenuWin, pageSize = 20, loadingBegin = false }: IProgs) => {

    const { id: windowId, tableWin, typeWin } = itemMenuWin;

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
    const [winConfig, setWinConfig] = useState<IWinConfig | null>();
    const [data, setData] = useState<IData[]>([]);
    const dataSources = useDataItemWin((state) => state.dataSources);
    const setDataSource = useDataItemWin((state) => state.setDataSource);
    const resetSource = useDataItemWin((state) => state.resetSource);

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
    const currentYear = useDataApp((state) => state.currentYear);
    const isLangVi = !!(useDataApp((state) => state.lang) === "vi");

    const resetItem = useDataItemWin((state) => state.resetItem);
    const { _ } = useTranslation();

    const [infoData, setInfoData] = useState({
        total: 0,
        hasMore: true,
    });

    const [params, setParams] = useState<IParamWin>();

    const schemaUI = useMemo(() => {
        return schemaWin[tableWin] ?? schemaWinEmpty;
    }, []);

    const getFilterRows = useCallback((values: Record<string, any>) => {
        return { filter: [], tlbparam: [] };
    }, []);

    const defaultFilter = useMemo(() => {
        return getFilterRows(schemaUI.config.filterConfig?.values ?? {});
    }, []);

    const numberAction: number = useMemo(() => {
        return schemaUI.config.itemAction.fields.length;
    }, []);

    const showFilter = useMemo(() => {
        return {
            showSearch: !!schemaUI.fieldSearch,
            showFilter: schemaUI.config.filterConfig ? true : false
        };
    }, [winConfig]);

    const extractWinConfig = (dataConfig: any): IWinConfig => {
        setParams({
            page: 1,
            count: typeWin === "(winTree)" ? 99999 : pageSize,
            filter: defaultFilter.filter ?? [],
            start: 0,
            infoparam: null,
            tlbparam: defaultFilter.tlbparam ?? [],
            window_id: windowId
        });
        const tabsWin: any[] = [...dataConfig.Tabs].slice(1);
        const newTabs = tabsWin.map((tab) => ({
            id: tab.TAB_ID,
            value: tab.TAB_NAME,
            TAB_ID: tab.TAB_ID,
            TAB_NAME: tab.TAB_NAME,
            FOREIGN_KEY: tab.FOREIGN_KEY,
            TAB_TABLE: tab.TAB_TABLE,
            PERMISSION: { NEW: !!tab.INSERT_STORE_PROCEDURE, EDIT: !!tab.UPDATE_STORE_PROCEDURE, DELETE: !!tab.DELETE_STORE_PROCEDURE }
        }));
        setDataTags(tableWin, newTabs);
        return {
            // references: data.references ?? {},
            window: {
                WINDOW_ID: windowId,
                MA_CT: dataConfig.MA_CT ?? "",
                WINDOW_NAME: dataConfig.WINDOW_NAME ?? "",
                Tabs: dataConfig.Tabs.map((tab: any): ITabWin => ({
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
                    }
                }))
            }
        };
    }
    const tabs = useMemo(() => {
        return dataTags[tableWin] ?? [];
    }, [tableWin, dataTags]);

    const [currentTab, setCurrentTab] = useState<ITabWin>(tabs?.[0]);

    const tabMulti = useMemo(() => {
        return (winConfig ? [...winConfig.window.Tabs].slice(1) : []);
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
            setParams(prev => prev ? { ...prev, page: 1, start: 0, filter: defaultFilter.filter ?? [], tlbparam: defaultFilter.tlbparam ?? [] } : undefined);
        }
    };

    const setFilterRows = (values: Record<string, any>) => {
        const filter = getFilterRows(values);
        setParams(prev => prev ? { ...prev, page: 1, start: 0, filter: filter.filter, tlbparam: filter.tlbparam } : undefined);
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
        stateLoading.current = { ...stateLoading.current, refresh: params?.page === 1 };
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
                const dataPage = typeWin === "(winTree)" ? Helper.sortTreeFlat(res.data, itemMenuWin.codeField) : res.data
                setInfoData(prev => ({
                    ...prev,
                    total: params?.page === 1 ? res.total_count : infoData.total,
                    hasMore: dataPage.length > 0
                }));
                setData(prev => (params?.page === 1 ? dataPage : [...prev, ...dataPage]));
            },
            setLoading: (loading) => {
                if (params?.page === 1) {
                    loading ? show("Tải dữ liệu") : hide()
                }
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
        setParams(prev => prev ? { ...prev, page: 1, start: 0 } : undefined)
    }, []);
    const handleLoadMore = useCallback(() => {
        if (!infoData.hasMore || stateLoading.current.refresh) return;
        setParams(prev => prev ? { ...prev, page: prev.page + 1, start: (prev.page + 1) * pageSize } : undefined)
    }, [infoData, stateLoading.current.refresh]);

    const { validate, errors, setErrors } = useZodValidation(dataItems[tableWin], schemaUI.zod);

    const [isChange, setIsChange] = useState(false);
    const onChangeItemData = (valueChange: Record<string, any>) => {
        setIsChange(true);
        onChangeValue(tableWin, valueChange);
    };

    const onChangeItemDataDetail = (tableDetail: ITableWin, index: number, valueChange: Record<string, any>) => {
        setIsChange(true);
        onChangeValueDetail(tableWin, tableDetail, index, valueChange);
    };

    const onNew = useCallback(() => {
        const arrReplace: Record<string, any> = {
            '#NAM#': currentYear
        };

        const newDefault = Object.fromEntries(
            Object.entries(schemaUI.defaultNew).map(([key, value]) =>
                typeof value === 'string' && arrReplace.hasOwnProperty(value)
                    ? [key, arrReplace[value]]
                    : [key, value]
            )
        );

        const defaultValue = itemMenuWin.defaultValue ?? {};

        setEditMode('new');
        setItemData(tableWin, { id: UUID.v4(), _isNew: true, DVCS_ID: orgUnit, ...newDefault, ...defaultValue });

        const tabMaster = winConfig?.window.Tabs[0];
        const action = schemaUI.action ? { ...schemaUI.action, edit: tabMaster?.PERMISSION.EDIT, new: tabMaster?.PERMISSION.NEW } : { edit: true, new: true };

        router.navigate({
            pathname: `/(window)/newEditWin${typeWin !== "(winMaster)" ? '' : 'Master'}`,
            params: {
                sItemMenuWin: JSON.stringify(itemMenuWin), title: _(winConfig?.window?.WINDOW_NAME),
                sAction: JSON.stringify(action)
            }
        });
    }, [winConfig]);

    const onEdit = useCallback((item: IData) => {
        setEditMode('edit');
        setItemData(tableWin, item);
        const tabMaster = winConfig?.window.Tabs[0];

        const action = schemaUI.action ? { ...schemaUI.action, edit: tabMaster?.PERMISSION.EDIT, new: tabMaster?.PERMISSION.NEW } : { edit: true, new: true };

        const dataMaster = schemaUI.dataMaster ? Object.fromEntries(schemaUI.dataMaster.map(f => [f, item[f]])) : {};
        router.navigate({
            pathname: `/(window)/newEditWin${typeWin !== "(winMaster)" ? '' : 'Master'}`,
            params: {
                sItemMenuWin: JSON.stringify(itemMenuWin), id: item.id, title: _(winConfig?.window?.WINDOW_NAME),
                sDataMaster: JSON.stringify(dataMaster), sAction: JSON.stringify(action)
            }
        });
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
            return isResult;
        };
        if (!_checkSave()) return;

        const details: any[] = [];
        if (typeWin === "(winMaster)" && tabs.length > 0) {

            for (const tab of tabs) {
                const isRequire = schemaWin[tab.TAB_TABLE]?.require;
                const dataDetail = dataItemDetail[tableWin] ? dataItemDetail[tableWin][tab.TAB_TABLE] : [];

                if (isRequire && dataDetail.length === 0) {
                    showToast(`${isLangVi ? 'Bạn chưa nhập chi tiết' : 'You have not entered details'} [${tab.TAB_NAME}]!`, { type: "warning" });
                    return;
                }
                details.push({
                    TAB_ID: tab.TAB_ID,
                    TAB_TABLE: tab.TAB_TABLE,
                    data: dataDetail
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

    const loadDetail = async (id?: string) => {
        const promises = tabs.map(async (tab) => {
            if (id) {
                await api.get({
                    link: `/api/System/GetDataDetailsByTabTable?window_id=${itemMenuWin.id}&id=${id}&tab_table=${tab.TAB_TABLE}`,
                    callBack: (res) => setDataItemDetail(tableWin, tab.TAB_TABLE, res)
                })
            } else {
                setDataItemDetail(tableWin, tab.TAB_TABLE, []);
            }
        });
        setLoadingDetail(true);
        await Promise.all(promises);
        setLoadingDetail(false);
    };


    const schemaWinDetail = useMemo(() => {
        return schemaWin[currentTab?.TAB_TABLE ?? "Empty"] ?? schemaWinEmpty;
    }, [currentTab]);

    const numberActionDetail: number = useMemo(() => {
        return schemaWinDetail.config.itemAction.fields.length;
    }, [schemaWinDetail]);

    const [showNewEdit, setShowNewEdit] = useState(false);
    const [itemDetail, setItemDetail] = useState<IData | null>(null);
    const typeNewEdit = useRef<'new' | 'edit' | null>(null);
    const currentIndex = useRef(0);
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
    }, [dataItemDetail, currentTab]);

    const handleActionDetail = useMemo(() => {
        return {
            new: () => {
                typeNewEdit.current = 'new';
                setItemDetail({
                    id: UUID.v4(),
                    _isNew: true,
                    ...schemaWinDetail.defaultNew
                });
                setShowNewEdit(true);
            },
            select: (index: number) => {
                const isEdit = schemaWinDetail.action?.edit !== false;
                if (!isEdit) return;
                typeNewEdit.current = 'edit', currentIndex.current = index;
                setItemDetail(dataItemDetail[tableWin]?.[currentTab?.TAB_TABLE ?? "Empty"]?.[index] ?? null);
                setShowNewEdit(true);
            },
            change: (valueChange: IData) => {
                setIsChange(true);
                setItemDetail(prev => prev ? { ...prev, ...valueChange } : null);
            },
            update: (data?: IData) => {
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
            },
            delete: (itemDetail: IData) => {
                showPopup({
                    message: "Bạn có muốn xoá dữ liệu",
                    iconType: "question",
                    showCancel: true,
                    onConfirm: () => {
                        setIsChange(true);
                        onRemoveDetail(tableWin, currentTab?.TAB_TABLE ?? "Empty", itemDetail);
                    }
                });
            }
        }
    }, [dataItemDetail]);

    // const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const [tableRefresh, setTableRefresh] = useState<Record<string, { url: string, type?: string, dataPost?: Record<string, any>, key: string }>>({});

    const loadDataBegin = async () => {
        let source: any = schemaWin[tableWin]?.dataSource ?? {};
        tabs.forEach((tab) => {
            const _source = schemaWin[tab.TAB_TABLE]?.dataSource ?? {};
            source = { ...source, ..._source };
        });
        // const source: any = schema.dataSource ?? {};
        const promises = Object.keys(source).map(async (key: any) => {
            if (source[key]?.data) {
                setDataSource(tableWin, key, source[key]?.data);
            }
            if (source[key]?.url) {
                const url = source[key].url;
                const apiGetPost = source[key].type === "post" ? api.post : api.get;
                await apiGetPost({
                    link: url, data: source[key].dataPost,
                    callBack: (res => {
                        if (res) {
                            setSource(res, source, key);
                            if (source[key]?.tableWin) {
                                setTableRefresh(prev => ({
                                    ...prev,
                                    [source[key].tableWin]: { url: source[key].url, type: source[key].type, dataPost: source[key].dataPost, key: key }
                                }));
                            }
                        }
                    })
                });
            }
        });
        await Promise.all(promises);
    };

    const setSource = useCallback((res: IData[], source: any, key: string) => {
        if (source[key].typeData === "tree") res = Helper.sortTreeFlat(res, source[key].fieldCode);

        const fields: string[] = source[key].fields || Object.keys(res[0]);
        const isColor = fields.indexOf("color") < 0 && typeof source[key].getColor === "function";
        const result = res.map((item: any) => {
            const obj = Object.fromEntries(
                fields.map(f => [f, item[f]])
            );
            if (isColor) {
                obj.color = source[key].getColor(item);
            }
            return obj;
        });

        setDataSource(tableWin, key, result);
    }, [tableWin]);

    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            // refresh datasource...
            let source: any = schemaWin[tableWin]?.dataSource ?? {};
            const apiRefresh = tableRefresh[shouldRefresh].type === "post" ? api.post : api.get;
            apiRefresh({
                link: tableRefresh[shouldRefresh].url,
                data: tableRefresh[shouldRefresh].dataPost,
                callBack: (res) => {
                    setSource(res, source, tableRefresh[shouldRefresh].key);
                    setShouldRefresh(null);
                }
            });
        }
    }, [shouldRefresh]);
    //
    const [printSamples, setPrintSamples] = useState<any[]>([]);
    const getConfigWin = useCallback(async () => {
        show("...");
        await api.get({
            link: `/api/System/GetAllByWindowNo?window_id=${windowId}`,
            callBack: (res) => setWinConfig(extractWinConfig(res[0])),
        });
        await api.post({
            link: `/api/System/MauIn`,
            data: {
                WINDOW_ID: windowId
            },
            callBack: (res) => setPrintSamples(res ?? []),
        })
        // lấy các dữ liệu reference liên quan
        await loadDataBegin();
        hide();
    }, []);

    const onBack = () => {
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
    }
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
        resetSource,
        tableWin: winConfig?.window?.Tabs[0]?.TAB_TABLE,
        dataSource: dataSources[tableWin],
        showFilter,
        permissions: winConfig?.window.Tabs[0]?.PERMISSION,
        printSamples,
        tabMulti,
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
        detail: {
            tabs,
            loadingDetail,
            loadDetail,
            numberActionDetail,
            dataDetail,
            currentTab,
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