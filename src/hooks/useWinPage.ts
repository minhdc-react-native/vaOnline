import { schemaWin, schemaWinEmpty } from "@/app/(window)/schema";
import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
import { useZodValidation } from "@/components/UIEngine/hooks/useZodValidation";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DimensionValue, LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";
import UUID from 'react-native-uuid';
import { useDataItemWin } from "./useDataItem";
import { useDataApp } from "./zustand/useDataApp";
const backHandQuestion = { title: "Cảnh báo", message: "Dữ liệu đã thay đổi, bạn có muốn thoát không?" };
interface ICurrentMenu {
    id: string;
    win: {
        id: string;
        table: ITableWin;
        title: string;
        hasQuickSearch: boolean
    }
    permissions: IPermissionsWin,
}
interface IProgs {
    menuId: string;
    tableWin: ITableWin;
    type?: 'page' | 'all',
    pageSize?: number,
    idItem?: string;
    loadingBegin?: boolean;
    typeWin?: '(window)' | '(winMaster)';
}
export const useWinPage = ({ menuId, tableWin, type = "page", pageSize = 20, idItem, loadingBegin = false, typeWin = "(window)" }: IProgs) => {
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
    // const [itemData, setItemData] = useState<IDataWin>({ id: "" });
    const dataSources = useDataItemWin((state) => state.dataSources);
    const setDataSource = useDataItemWin((state) => state.setDataSource);
    const resetSource = useDataItemWin((state) => state.resetSource);

    const dataItems = useDataItemWin((state) => state.dataItems);
    const setItemData = useDataItemWin((state) => state.setDataItem);
    const editMode = useDataItemWin((state) => state.editMode);
    const setEditMode = useDataItemWin((state) => state.setEditMode);

    const onChangeValue = useDataItemWin((state) => state.onChangeValue);
    const onChangeValueDetail = useDataItemWin((state) => state.onChangeValueDetail);
    const onAddDetail = useDataItemWin((state) => state.onAddDetail);
    const onRemoveDetail = useDataItemWin((state) => state.onRemoveDetail);

    const resetItem = useDataItemWin((state) => state.resetItem);


    const [infoData, setInfoData] = useState({
        total: 0,
        hasMore: true,
    });

    const [params, setParams] = useState<IParamWin>();

    // const currentMenu = useSelector((state: IVcStore) => state.app.other.currentMenu);
    const [currentMenu, setCurrentMenu] = useState<ICurrentMenu | null>(null);
    const schemaUI = useMemo(() => {
        return schemaWin[tableWin] ?? schemaWinEmpty;
    }, []);

    const urlGetPages = useRef('/api/app/data-object/pages'); // có thể thay đổi do bộ lọc...

    const getFilterRows = useCallback((values: Record<string, any>) => {
        const valuesType = schemaUI.config.filterConfig?.valuesType;
        const valueIgnoreFilter = schemaUI.config.filterConfig?.valueIgnoreFilter ?? [];
        const fieldAdvanced = schemaUI.config.filterConfig?.fieldAdvanced ?? [];
        const tlbParam = schemaUI.config.filterConfig?.tlbParam ?? [];

        const valueFilterRow = Object.entries(values)
            .filter(([field, value]) => !Helper.isEmpty(value) && valueIgnoreFilter.indexOf(field) < 0 && fieldAdvanced.indexOf(field) < 0 && tlbParam.indexOf(field) < 0);

        const valueFilterAdvanced = Object.entries(values)
            .filter(([field, value]) => !Helper.isEmpty(value) && valueIgnoreFilter.indexOf(field) < 0 && fieldAdvanced.indexOf(field) >= 0);

        const valueFilterParam = Object.entries(values)
            .filter(([field, value]) => !Helper.isEmpty(value) && valueIgnoreFilter.indexOf(field) < 0 && tlbParam.indexOf(field) >= 0);

        const filterRows = valueFilterRow.map(([columnName, value]) => ({ columnName, columnType: valuesType?.[columnName]?.columnType ?? "string", value }));

        const filterAdvanced = valueFilterAdvanced.map(([columnName, value]) => ({
            columnName,
            columnType: valuesType?.[columnName]?.columnType ?? "string",
            compareField: valuesType?.[columnName]?.compareField,
            operator: valuesType?.[columnName]?.operator,
            value
        }));

        const filterParam = valueFilterParam.map(([columnName, value]) => ({
            columnName,
            fieldType: valuesType?.[columnName]?.columnType ?? "string",
            operator: valuesType?.[columnName]?.operator,
            value
        }));
        if (filterAdvanced.length > 0) {
            urlGetPages.current = schemaUI.config.filterConfig?.urlFilter ?? '/api/app/data-object/pages';
        } else {
            urlGetPages.current = `/api/app/data-object/pages`
        }
        return { filterRows, filterAdvanced, filterParam };
    }, []);

    const defaultFilter = useMemo(() => {
        return getFilterRows(schemaUI.config.filterConfig?.values ?? {});
    }, []);

    const numberAction: number = useMemo(() => {
        return schemaUI.config.itemAction.fields.length;
    }, []);

    const tabs = useMemo(() => {
        return schemaUI.config.tabs ?? []
    }, []);

    const showFilter = useMemo(() => {
        return {
            showSearch: winConfig?.window.tabs[0].hasQuickSearch || false,
            showFilter: schemaUI.config.filterConfig ? true : false
        };
    }, [winConfig]);

    const extractWinConfig = (dataConfig: any): IWinConfig => {
        setParams({
            page: 1,
            count: pageSize,
            filterAdvanced: defaultFilter.filterAdvanced,
            filterRows: defaultFilter.filterRows,
            menuId: menuId,
            quickSearch: "",
            start: 0,
            tlbparam: defaultFilter.filterParam,
            windowId: dataConfig.window?.id
        });
        setCurrentMenu({
            id: menuId,
            win: {
                id: dataConfig.window?.id,
                table: dataConfig.window.code,
                title: dataConfig.window?.name,
                hasQuickSearch: dataConfig.window?.tabs[0].hasQuickSearch ?? false
            },
            permissions: dataConfig.permissions ?? {},
        });
        return {
            permissions: dataConfig.permissions ?? {},
            // references: data.references ?? {},
            window: {
                id: dataConfig.window?.id ?? "",
                code: dataConfig.window.code ?? "",
                name: dataConfig.window?.name ?? "",
                tabs: (dataConfig.window?.tabs ?? []).map((tab: any): ITabWin => ({
                    id: tab.id ?? "",
                    value: tab.name ?? "",
                    code: tab.code ?? "",
                    refKey: tab.refKey ?? "",
                    hasQuickSearch: tab.hasQuickSearch ?? false,
                }))
            },
            voucherTemplates: (dataConfig.voucherTemplates ?? []).map((template: any) => ({
                id: template.id ?? "",
                code: template.code ?? "",
                value: template.name ?? ""
            }))
        };
    }
    const tabMulti = useMemo(() => {
        return (winConfig ? winConfig.window.tabs.shift() : []);
    }, [winConfig]);

    const setTextSearch = (textSearch: string) => {
        if (schemaUI.fieldSearch) {
            setParams(prev => prev ? {
                ...prev,
                page: 1, start: 0,
                filterRows: [...prev.filterRows, { columnName: schemaUI.fieldSearch as string, columnType: "string", value: textSearch }]
            } : undefined);
        } else {
            setParams(prev => prev ? { ...prev, page: 1, start: 0, quickSearch: textSearch } : undefined);
        }
    };

    const setFilterRows = (values: Record<string, any>) => {
        const filter = getFilterRows(values);
        setParams(prev => prev ? { ...prev, page: 1, start: 0, filterAdvanced: filter.filterAdvanced, filterRows: filter.filterRows, tlbparam: filter.filterParam } : undefined);
    };


    const getDataPage = useCallback(() => {
        if (!winConfig?.permissions.mnRefresh) {
            showPopup({ title: "Thông báo", message: "Bạn không có quyền xem dữ liệu!" });
            return;
        }
        if (params?.page === 1) {
            setInfoData({ total: 0, hasMore: true });
            setData([]);
        }
        stateLoading.current = { ...stateLoading.current, refresh: params?.page === 1 };
        api.post({
            link: urlGetPages.current,
            data: params,
            callBack: (res: { data: IData[], total_count: number }) => {
                const isHaveId = res.data.length > 0 ? res.data[0].id !== undefined : true;
                const dataPage = isHaveId ? res.data : res.data.map(_item => ({ ..._item, id: UUID.v4() }))
                setInfoData(prev => ({
                    ...prev,
                    total: params?.page === 1 ? res.total_count : infoData.total,
                    hasMore: dataPage.length > 0
                }));
                setData(prev => (params?.page === 1 ? dataPage : [...prev, ...dataPage]));
            },
            config: {
                headers: {
                    'X-Menu': menuId
                }
            },
            setLoading: (loading) => {
                if (params?.page === 1) {
                    loading ? show("Tải dữ liệu") : hide()
                }
                stateLoading.current = { ...stateLoading.current, refresh: false, loadMore: params?.page !== 1 ? loading : false };
            },
            callError: (err) => {
                console.error(err);
                showToast("Lỗi lấy dữ liệu!", { type: "error" })
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

        };
        const newDefault = Object.fromEntries(
            Object.entries(schemaUI.defaultNew).map(([key, value]) =>
                typeof value === 'string' && arrReplace.hasOwnProperty(value)
                    ? [key, arrReplace[value]]
                    : [key, value]
            )
        );
        setEditMode('new');
        setItemData(tableWin, { id: UUID.v4(), _isNew: true, ...newDefault });

        const action = schemaUI.action ? { ...schemaUI.action, edit: currentMenu?.permissions.mnEdit !== undefined } : { edit: true, new: true };

        router.navigate({
            pathname: `/(window)/newEditWin${typeWin === "(window)" ? '' : 'Master'}`,
            params: {
                menuId: menuId, tableWin: tableWin, title: currentMenu?.win.title,
                sAction: JSON.stringify(action), sPermissions: JSON.stringify(winConfig?.permissions ?? {})
            }
        });
    }, [currentMenu]);

    const onEdit = useCallback((item: IData) => {
        setEditMode('edit');
        setItemData(tableWin, item);

        const action = schemaUI.action ? { ...schemaUI.action, edit: currentMenu?.permissions.mnEdit !== undefined } : { edit: true, new: true };

        const dataMaster = schemaUI.dataMaster ? Object.fromEntries(schemaUI.dataMaster.map(f => [f, item[f]])) : {};
        router.navigate({
            pathname: `/(window)/newEditWin${typeWin === "(window)" ? '' : 'Master'}`,
            params: {
                menuId: menuId, tableWin: tableWin, id: item.id, title: currentMenu?.win.title,
                sDataMaster: JSON.stringify(dataMaster), sAction: JSON.stringify(action),
                sPermissions: JSON.stringify(winConfig?.permissions ?? {})
            }
        });
    }, [currentMenu]);


    const onSave = useCallback(() => {
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

        if (typeWin === "(winMaster)" && tabs.length > 0) {
            if (itemData[tabs[0].code].length === 0) {
                showToast('Bạn chưa nhập chi tiết!', { type: "warning" });
                return;
            }
        }
        if (editMode === "new") {
            api.post({
                link: `/api/app/data-object`,
                data: itemData,
                config: {
                    headers: {
                        'X-Menu': menuId
                    }
                },
                callBack: (res => {
                    setEditMode(null);
                    showToast("Thêm mới thành công");
                    router.back();
                    setShouldRefresh(currentMenu?.win.table ?? null);
                }),
                callError: (msgError) => {
                    console.log("msgError>>", msgError);
                    showToast(msgError, { type: "error" });
                },
                setLoading: (loading) => loading ? show("Thêm mới...") : hide()
            });
        } else {
            api.put({
                link: `/api/app/data-object/${itemData.id}`,
                data: itemData,
                config: {
                    headers: {
                        'X-Menu': menuId
                    }
                },
                callBack: (res => {
                    setEditMode(null);
                    showToast("Cập nhật thành công");
                    router.back();
                    setShouldRefresh(currentMenu?.win.table ?? null);
                }),
                setLoading: (loading) => loading ? show("Cập nhật...") : hide()
            });
        }
    }, [currentMenu, dataItems, tabs]);
    const onDelete = useCallback((id: string) => {
        if (currentMenu?.permissions.mnDelete === undefined) {
            showPopup({ title: "Thông báo", message: "Bạn không có quyền xoá!" });
            return;
        }
        showPopup({
            message: "Bạn có muốn xoá dữ liệu",
            iconType: "question",
            showCancel: true,
            onConfirm: () => {
                api.delete({
                    link: `/api/app/data-object/${id}`,
                    config: {
                        headers: {
                            'X-Menu': menuId
                        }
                    },
                    callBack: (res => {
                        showToast("Xoá thành công");
                        setShouldRefresh(currentMenu?.win.table);
                    }),
                    setLoading: (loading) => loading ? show("Xoá...") : hide()
                });
            }
        });
    }, [currentMenu]);

    const handleAction = {
        new: onNew,
        save: onSave,
        edit: onEdit,
        delete: onDelete
    };


    const [currentTab, setCurrentTab] = useState<ITabWin>(tabs?.[0]);
    const schemaWinDetail = useMemo(() => {
        return schemaWin[currentTab?.realCode || currentTab?.code] ?? schemaWinEmpty;
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
        return dataItems[tableWin]?.[currentTab?.code];
    }, [dataItems, currentTab]);

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
                setItemDetail(dataItems[tableWin]?.[currentTab.code]?.[index] ?? null);
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
                        onAddDetail(tableWin, currentTab.code, data!);
                    } else {
                        onChangeItemDataDetail(currentTab.code, currentIndex.current, data!);
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
                        onRemoveDetail(tableWin, currentTab.code, itemDetail);
                    }
                });
            }
        }
    }, []);

    // const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const [tableRefresh, setTableRefresh] = useState<Record<string, { url: string, key: string }>>({});

    const loadDataBegin = async () => {
        let source: any = schemaWin[tableWin]?.dataSource ?? {};
        tabs.forEach((tab) => {
            const _source = schemaWin[tab.code]?.dataSource ?? {};
            source = { ...source, ..._source };
        });
        // const source: any = schema.dataSource ?? {};
        const promises = Object.keys(source).map(async (key: any) => {
            if (source[key]?.data) {
                setDataSource(tableWin, key, source[key]?.data);
            }
            if (source[key]?.url) {
                const url = source[key].url;
                await api.get({
                    link: url, callBack: (res => {
                        if (res) {
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

                            if (source[key]?.tableWin) {
                                setTableRefresh(prev => ({
                                    ...prev,
                                    [source[key].tableWin]: { url: source[key].url, key: key }
                                }));
                            }
                        }
                    })
                });
            }
        });
        await Promise.all(promises);
    };

    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            // refresh datasource...
            api.get({
                link: tableRefresh[shouldRefresh].url,
                callBack: (res) => {
                    setDataSource(tableWin, tableRefresh[shouldRefresh].key, res);
                    setShouldRefresh(null);
                }
            });
        }
    }, [shouldRefresh]);
    //
    const getConfigWin = useCallback(async () => {
        show("...");
        await api.get({
            link: `/api/app/window/config-by-menu-id/${menuId}`,
            callBack: (res) => setWinConfig(extractWinConfig(res)),
        });
        // lấy các dữ liệu reference liên quan
        await loadDataBegin();
        hide();
    }, []);

    const onBack = () => {
        if (isChange) {
            showPopup({
                title: backHandQuestion.title,
                message: backHandQuestion.message,
                showCancel: true,
                confirmText: "Thoát",
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
        tableWin: currentMenu?.win.table,
        dataSource: dataSources[tableWin],
        showFilter,
        permissions: winConfig?.permissions,
        voucherTemplates: winConfig?.voucherTemplates,
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