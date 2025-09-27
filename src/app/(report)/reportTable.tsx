import { useLoading } from '@/components/dialog/loadingProvider';
import { useToast } from '@/components/dialog/useToast';
import { useTranslation } from '@/context/TranslationContext';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { api } from '@/utils/apiMethods';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { Divider, Menu, Text, useTheme } from 'react-native-paper';
import {
    DataProvider,
    LayoutProvider,
    RecyclerListView
} from 'recyclerlistview';
import { ReportTableHeader } from './reportTableHeader';
import { ReportTableItem } from './reportTableItem';
const flattenGroupedColumns = (columns: IColumnReport[]) => {
    const result: IColumnReport[] = [];

    columns.forEach(col => {
        if (col.children && col.children.length > 0) {
            result.push(...col.children);
        } else {
            result.push(col);
        }
    });

    return result;
};

const ROW_HEIGHT = 25;

interface IProgs<T> {
    vnd_nt: '1' | '2' | '3';
    routerNumber: number,
    menuRow: IData[]
    reportSchema: ISchemaReport;
    data: T[];
    filterKey: Record<string, any>,
    onRefresh: () => void,
    loading: boolean
}
export const ReportTable = <T extends IData>({ vnd_nt, routerNumber, menuRow, reportSchema, data, filterKey, onRefresh, loading }: IProgs<T>) => {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const orgUnit = useDataApp((state) => state.orgUnit);
    const lang = useDataApp(state => state.lang);
    const { show, hide } = useLoading();
    const { colors } = useTheme();
    const scrollX = useRef(new Animated.Value(0)).current;
    const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
    const { _ } = useTranslation();
    const groupedColumns = reportSchema.columnsTable;
    const scrollableColumns = flattenGroupedColumns(groupedColumns[vnd_nt]);
    const TOTAL_WIDTH = scrollableColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    const layoutProvider = new LayoutProvider(
        () => 'ROW',
        (_, dim) => {
            dim.width = TOTAL_WIDTH;
            dim.height = ROW_HEIGHT;
        }
    );
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [rowIdShowMenu, setRowIdShowMenu] = useState<string | null>(null);

    const { showToast } = useToast();

    const onPressRow = useCallback((itemTable: IData) => {
        setCurrentId(itemTable.idRow);
        setRowIdShowMenu(itemTable.idRow);
    }, []);
    const onDismiss = useCallback((itemTable: IData) => {
        setRowIdShowMenu(null);
    }, []);
    const onPressMenu = useCallback(async (menu: IData, item: IData) => {
        setRowIdShowMenu(null);
        if (menu.id === 'EDIT_VOUCHER') {
            const url = encodeURIComponent(`SELECT TOP 1 a.WINDOW_ID,a.WINDOW_NAME,b.DP FROM VC_WINDOW a INNER JOIN DMCT b ON a.MA_CT=b.MA_CT AND b.DVCS_ID=N'${orgUnit}' WHERE a.ma_ct='${item.MA_CT}'`);
            await api.get({
                link: `/api/System/ExecuteQuery?sql=${url}`,
                callBack: (res: IData[]) => {
                    if (res && res.length > 0) {
                        const itemWin = res[0];
                        const itemMenuWin: IMenuWin = {
                            id: itemWin.WINDOW_ID, typeWin: "(winMaster)", tableWin: itemWin.DP === "HV" ? 'DPHV' : 'DPKT',
                            label: itemWin.WINDOW_NAME, labelE: itemWin.WINDOW_NAME,
                            row: 1, col: 1, typeView: { _typeView: 1 },
                            defaultValue: { MA_CT: item.MA_CT }
                        };
                        router.navigate({
                            pathname: `/(window)/newEditWinMaster`,
                            params: {
                                sItemMenuWin: JSON.stringify(itemMenuWin), id: item.DOC_ID, title: _(itemWin.WINDOW_NAME), isEdit: 'C'
                            }
                        });
                    }
                }
            });
        } else {
            const param: any[] = menu.PARAMETERS.split(';');
            let filter: Record<string, any> = {};
            param.forEach(p => {
                const [type, pValue, pParam] = p.replace(/[{}]/g, "").split(":");
                filter[pParam] = type === '1' ? (filterKey[pValue] || pValue) : (item[pValue] || '');
            });
            const report = {
                reportId: menu.REPORT_ID,
                dataFilter: filter,
                routerNumber: routerNumber + 1,
                vnd_nt: vnd_nt
            };
            if (routerNumber + 1 > 3) {
                showToast(lang === 'vi' ? 'Ứng dụng đang không cho phép truy vấn sâu hơn 4 cấp !' : 'The application is not allowing queries deeper than 4 levels!', { type: "info" })
                return;
            } // chưa có...
            router.navigate({
                // @ts-ignore:next-line
                pathname: `/(report)/reportDetail${routerNumber + 1}`,
                params: { report: JSON.stringify(report) }
            })
        }
    }, [orgUnit, _, routerNumber, vnd_nt, filterKey, showToast]);
    const rowRenderer = useCallback((__: string | number, item: T) => {
        const newMenu = menuRow.filter(menu => {
            const fnVisible = new Function('parentRow', menu.VISIBLE_WHEN || 'return true');
            return fnVisible(item);
        });
        const isVoucher = isNotEmpty(item.MA_CT) && isNotEmpty(item.DOC_ID);
        const isMenuVisible = rowIdShowMenu === item.idRow;
        return ((newMenu.length > 0 || isVoucher) ? <Menu
            mode='elevated'
            key={isMenuVisible ? 'true' : 'false'}
            contentStyle={{ backgroundColor: colors.background }}
            visible={isMenuVisible}
            onDismiss={() => onDismiss(item.idRow)}
            anchor={
                <ReportTableItem item={item} groupedColumns={groupedColumns[vnd_nt]} filter={filterKey}
                    paramSystem={paramSystem} onPress={onPressRow} selected={item.idRow === currentId} />
            }>
            {isVoucher && <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingHorizontal: 10 }]} onPress={() => onPressMenu({ id: 'EDIT_VOUCHER' }, item)}>
                <View style={{ flexDirection: "row", gap: 5, paddingVertical: 5 }}>
                    <FontAwesome name={'edit'} size={20} color={colors.secondary} />
                    <Text numberOfLines={1}>{_('EDIT_VOUCHER')}</Text>
                </View>
            </Pressable>}
            {isVoucher && newMenu.length > 0 && <Divider />}
            {newMenu.map(menu => {
                return (
                    <Pressable key={menu.id} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingHorizontal: 10 }]} onPress={() => onPressMenu(menu, item)}>
                        <View style={{ flexDirection: "row", gap: 5, paddingVertical: 5 }}>
                            <FontAwesome name={menu.icon || 'hand-o-right'} size={20} color={menu.icon_color || colors.secondary} />
                            <Text numberOfLines={1}>{menu.value}</Text>
                        </View>
                    </Pressable>
                )
            })}
        </Menu> : <ReportTableItem item={item} groupedColumns={groupedColumns[vnd_nt]} filter={filterKey}
            paramSystem={paramSystem} onPress={onPressRow} selected={item.idRow === currentId} />);

    }, [menuRow, groupedColumns, vnd_nt, filterKey, paramSystem, currentId, rowIdShowMenu, onPressRow, onPressMenu, colors, _]);

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        loading ? show('Đang tải dữ liệu...') : hide();
    }, [loading, show, hide]);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                horizontal
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={{ flex: 1 }}>

                    <ReportTableHeader groupedColumns={groupedColumns[vnd_nt]} filterKey={filterKey} />
                    {data.length > 0 && <RecyclerListView
                        dataProvider={dataProvider}
                        layoutProvider={layoutProvider}
                        rowRenderer={rowRenderer}
                        scrollViewProps={{
                            showsVerticalScrollIndicator: false,
                            refreshControl: (<RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                            />)
                        }}
                        style={{ height: '100%' }}
                    />}
                </View>
            </Animated.ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cell: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    headerCell: {
        backgroundColor: '#eee',
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});