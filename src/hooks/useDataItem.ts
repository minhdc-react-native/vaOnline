import { create } from 'zustand';

interface IDataItemWin {
    editMode: 'new' | 'edit' | null;
    setEditMode: (editMode: 'new' | 'edit' | null) => void;
    dataSources: Partial<Record<ITableWin, Record<string, any[]>>>;
    setDataSource: (tableWin: ITableWin, key: string, data: any) => void;
    dataItems: Partial<Record<ITableWin, IData>>;
    setDataItem: (tableWin: ITableWin, item: IData) => void;
    onChangeValue: (tableWin: ITableWin, valueChange: Record<string, any>) => void;
    onChangeValueDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, index: number, valueChange: Record<string, any>) => void;
    onAddDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, newItem: IData) => void;
    onRemoveDetail: (tableWin: ITableWin, tableWinDetail: ITableWin, item: IData) => void;
    resetItem: (tableWin: ITableWin) => void;
    resetSource: (tableWin: ITableWin) => void;
    resetAll: () => void;
}

export const useDataItemWin = create<IDataItemWin>((set) => ({
    editMode: null,
    setEditMode: (editMode) =>
        set((state) => ({
            editMode: editMode
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
    onAddDetail: (tableWin, tableWinDetail, newItem) =>
        set((state) => {
            const itemDetail = state.dataItems[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItems: {
                    ...state.dataItems,
                    [tableWin]: {
                        ...state.dataItems[tableWin],
                        [tableWinDetail]: [...itemDetail, newItem]
                    },
                },
            }
        }),
    onRemoveDetail: (tableWin, tableWinDetail, item) =>
        set((state) => {
            const itemDetail = state.dataItems[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItems: {
                    ...state.dataItems,
                    [tableWin]: {
                        ...state.dataItems[tableWin],
                        [tableWinDetail]: itemDetail.filter((detail: IData, idx: number) => detail.id !== item.id)
                    },
                },
            }
        }),
    onChangeValueDetail: (tableWin, tableWinDetail, index, valueChange) =>
        set((state) => {
            const itemDetail = state.dataItems[tableWin]?.[tableWinDetail] ?? [];
            return {
                dataItems: {
                    ...state.dataItems,
                    [tableWin]: {
                        ...state.dataItems[tableWin],
                        [tableWinDetail]: itemDetail.map(
                            (detail: IData, idx: number) => idx === index ? { ...detail, ...valueChange } : detail
                        )
                    },
                },
            }
        }),
    resetItem: (tableWin) =>
        set((state) => {
            const { [tableWin]: _, ...rest } = state.dataItems;
            return { dataItems: rest };
        }),
    resetSource: (tableWin) =>
        set((state) => {
            const { [tableWin]: _, ...rest } = state.dataSources;
            return { dataSources: rest };
        }),
    resetAll: () => set({ dataItems: {}, dataSources: {} }),
}));
