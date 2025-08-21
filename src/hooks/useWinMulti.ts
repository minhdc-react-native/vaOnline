import { schemaWin, schemaWinEmpty } from "@/app/(window)/schema";
import { usePopup } from "@/components/dialog/popupProvider";
import { useEvalExpr } from "@/components/UIEngine/hooks/useEvalExpr";
import { api } from "@/utils/apiMethods";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DimensionValue, LayoutChangeEvent } from "react-native";
import UUID from 'react-native-uuid';
import { useDataApp } from "./zustand/useDataApp";

interface IProgs {
    tabs: ITabWin[];
    idMaster: string;
    dataMaster?: Record<string, any>;
    actionNewEdit?: { new: boolean, edit: boolean }
}
export const useWinMulti = ({ tabs, idMaster, dataMaster = {}, actionNewEdit = { new: true, edit: true } }: IProgs) => {
    const [data, setData] = useState<Partial<Record<ITableWin, IData[]>>>({});
    const [currentTab, setCurrentTab] = useState<ITabWin>(tabs?.[0]);
    const evalExpr = useEvalExpr(dataMaster);

    const schemaUI = useMemo(() => {
        return schemaWin[currentTab.realCode || currentTab.code] ?? schemaWinEmpty;
    }, [currentTab]);

    const numberAction: number = useMemo(() => {
        return schemaUI.config.itemAction.fields.length;
    }, [schemaUI]);

    const [isLoading, setLoading] = useState(true);
    const { showPopup } = usePopup();

    const getData = useCallback(async () => {
        await loadDataBegin();
        let promises: any[] = [];
        tabs.forEach((tab) => {
            const fixRowId = tab.rowIdValue ? evalExpr(tab.rowIdValue) : idMaster;
            promises.push(api.get({ link: `/api/app/data-object/tab-detail?tabId=${tab.id}&rowId=${fixRowId}` }));
        });
        await Promise.all(promises)
            .then((results) => {
                tabs.map((tab, index) => {
                    setData(prev => ({ ...prev, [tab.code]: results[index] }));
                });
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    const refreshData = useCallback(() => {
        const fixRowId = currentTab.rowIdValue ? evalExpr(currentTab.rowIdValue) : idMaster;
        api.get({
            link: `/api/app/data-object/tab-detail?tabId=${currentTab.id}&rowId=${fixRowId}`,
            callBack: (res) => {
                setData(prev => ({ ...prev, [currentTab.code]: res }));
            },
            setLoading: setLoading
        });
    }, [currentTab]);
    const [dataItem, setDataItem] = useState<IData | null>(null);

    const [showNewEdit, setShowNewEdit] = useState(false);

    const handleAction = useMemo(() => {
        return {
            newItem: () => {
                const newDefault = Object.fromEntries(
                    Object.entries(schemaUI.defaultNew).map(([key, value]) => [key, evalExpr(value)])
                );
                setDataItem({
                    id: UUID.v4(),
                    editmode: 1,
                    [currentTab.refKey as string]: idMaster,
                    ...newDefault
                });
                setShowNewEdit(true);
            },
            itemSelect: (index: number) => {
                const isEdit = schemaUI.action?.edit !== false;
                if (!isEdit) return;
                setDataItem(data?.[currentTab.code]?.[index] ?? null);
                setShowNewEdit(true);
            },
            post: (data?: IData) => {
                if (!data) {
                    setShowNewEdit(false);
                    setDataItem(null);
                    return;
                };
                api.post({
                    link: `/api/app/data-object/save-form/${currentTab.id}?editmode=${data.editmode === 1 ? 1 : 2}`,
                    data: data,
                    callBack: (res) => {
                        setShowNewEdit(false);
                        setDataItem(null);
                        refreshData();
                    },
                    setLoading: setLoading
                });
            },
            delete: (rowId: string) => {
                showPopup({
                    message: "Bạn có muốn xoá dữ liệu",
                    iconType: "question",
                    showCancel: true,
                    onConfirm: () => {
                        api.delete({
                            link: `/api/app/data-object/form?tabId=${currentTab.id}&rowId=${rowId}`,
                            data: dataItem,
                            callBack: (res) => refreshData(),
                            setLoading: setLoading
                        });
                    }
                });

            }
        }
    }, [dataItem, currentTab, data]);

    const [rowHeights, setRowHeights] = useState<Record<string, DimensionValue>>({});
    const handleLayout = (itemId: string, event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        setRowHeights((prev) => ({
            ...prev,
            [itemId]: height,
        }));
    };

    const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const [tableRefresh, setTableRefresh] = useState<Record<string, { url: string, key: string }>>({});

    const loadDataBegin = async () => {
        let source: any = {};
        tabs.forEach((tab) => {
            const _source = schemaWin[tab.code]?.dataSource ?? {};
            source = { ...source, ..._source };
        });
        // const schema = schemaWin[currentTab.code] ?? schemaWinEmpty;
        // const source: any = schema.dataSource ?? {};
        const promises = Object.keys(source).map(async (key: any) => {
            if (source[key]?.data) {
                setDataSource(prev => ({
                    ...prev,
                    [key]: source[key]?.data
                }));
            }
            if (source[key]?.url) {
                const url = source[key].url;
                await api.get({
                    link: url, callBack: (res => {
                        if (res) {
                            const fields: string[] = source[key].fields || Object.keys(res[0]);
                            const result = res.map((item: any) =>
                                Object.fromEntries(fields.map(key => [key, item[key]]))
                            );
                            setDataSource(prev => ({
                                ...prev,
                                [key]: result
                            }));

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
    const shouldRefresh = useDataApp((state) => state.shouldRefresh);
    const setShouldRefresh = useDataApp((state) => state.setShouldRefresh);
    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            // refresh datasource...
            api.get({
                link: tableRefresh[shouldRefresh].url,
                callBack: (res) => {
                    setDataSource(prev => ({
                        ...prev,
                        [tableRefresh[shouldRefresh].key]: res
                    }));
                    setShouldRefresh(null);
                }
            });
        }
    }, [shouldRefresh]);

    useEffect(() => {
        getData();
    }, []);

    return {
        schemaUI,
        currentTab,
        numberAction,
        isLoading,
        data,
        handleAction,
        rowHeights,
        dataSource,
        dataItem,
        showNewEdit,
        refreshData,
        setShowNewEdit,
        setCurrentTab,
        handleLayout
    }
}