import { create } from 'zustand';

interface IDataItemWin {
    editMode: 'new' | 'edit' | null;
    setEditMode: (editMode: 'new' | 'edit' | null) => void;
    layoutData: Record<ITableWin, Record<string, any>> | null;
    setLayoutData: (layoutData: Record<ITableWin, Record<string, any>>) => void;
    dataSources: Partial<Record<ITableWin, Record<string, any[]>>>;
    setDataSource: (tableWin: ITableWin, key: string, data: any) => void;
    dataItems: Partial<Record<ITableWin, IData>>;
    setDataItem: (tableWin: ITableWin, item: IData) => void;
    dataTags: Partial<Record<ITableWin, ITabWin[]>>;
    setDataTags: (tableWin: ITableWin, data: ITabWin[]) => void;
    dataItemDetail: Partial<Record<ITableWin, Record<ITableWin, IData[]>>>;
    setDataItemDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, data: IData[]) => void;
    onChangeValue: (tableWin: ITableWin, valueChange: Record<string, any>) => void;
    onChangeValueDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, index: number, valueChange: Record<string, any>) => void;
    onAddDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, newItem: IData) => void;
    onRemoveDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, item: IData) => void;
    resetItem: (tableWin: ITableWin) => void;
    resetAll: () => void;
    resetTableWin: (tableWin: ITableWin) => void;
}

export const useDataItemWin = create<IDataItemWin>((set) => ({
    editMode: null,
    setEditMode: (editMode) =>
        set((state) => ({
            editMode: editMode
        })),
    layoutData: null,
    setLayoutData: (layoutData: Record<ITableWin, Record<string, any>>) =>
        set((state) => ({
            layoutData: layoutData
        })),
    dataSources: {},
    setDataSource: (tableWin, key, data) =>
        set((state) => ({
            dataSources: {
                ...state.dataSources,
                [tableWin]: { ...state.dataSources[tableWin], [key]: data },
            },
        })),
    dataItems: {},
    setDataItem: (tableWin, item) =>
        set((state) => ({
            dataItems: {
                ...state.dataItems,
                [tableWin]: item,
            },
        })),
    onChangeValue: (tableWin, valueChange) =>
        set((state) => {
            return {
                dataItems: {
                    ...state.dataItems,
                    [tableWin]: { ...state.dataItems[tableWin], ...valueChange },
                },
            }
        }),
    dataTags: {},
    setDataTags: (tableWin, data) =>
        set((state) => ({
            dataTags: {
                ...state.dataTags,
                [tableWin]: data,
            },
        })),
    dataItemDetail: {},
    setDataItemDetail: (tableWin, tableWinDetail, data) =>
        set((state) => ({
            dataItemDetail: {
                ...state.dataItemDetail,
                [tableWin]: {
                    ...state.dataItemDetail[tableWin],
                    [tableWinDetail]: data
                },
            },
        })),
    onAddDetail: (tableWin, tableWinDetail, newItem) =>
        set((state) => {
            const itemDetail = state.dataItemDetail[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItemDetail: {
                    ...state.dataItemDetail,
                    [tableWin]: {
                        ...state.dataItemDetail[tableWin],
                        [tableWinDetail]: [...itemDetail, newItem]
                    },
                },
            }
        }),
    onRemoveDetail: (tableWin, tableWinDetail, item) =>
        set((state) => {
            const itemDetail = state.dataItemDetail[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItemDetail: {
                    ...state.dataItemDetail,
                    [tableWin]: {
                        ...state.dataItemDetail[tableWin],
                        [tableWinDetail]: itemDetail.filter((detail: IData, idx: number) => detail.id !== item.id)
                    },
                },
            }
        }),
    onChangeValueDetail: (tableWin, tableWinDetail, index, valueChange) =>
        set((state) => {
            const itemDetail = state.dataItemDetail[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItemDetail: {
                    ...state.dataItemDetail,
                    [tableWin]: {
                        ...state.dataItemDetail[tableWin],
                        [tableWinDetail]: itemDetail.map(
                            (detail: IData, idx: number) => idx === index ? { ...detail, ...valueChange } : detail
                        )
                    },
                },
            }
        }),
    resetTableWin: (tableWin) =>
        set((state) => {
            const { [tableWin]: _, ...restItems } = state.dataItems;
            const { [tableWin]: __, ...restSources } = state.dataSources;
            const { [tableWin]: ___, ...restTags } = state.dataTags;
            const { [tableWin]: ____, ...restDetails } = state.dataItemDetail;

            return {
                dataItems: restItems,
                dataSources: restSources,
                dataTags: restTags,
                dataItemDetail: restDetails,
                layoutData: null
            };
        }),
    resetItem: (tableWin) =>
        set((state) => {
            const { [tableWin]: _, ...rest } = state.dataItems;
            return { dataItems: rest };
        }),
    resetAll: () => set({ dataItems: {}, dataSources: {}, dataItemDetail: {} }),
}));
