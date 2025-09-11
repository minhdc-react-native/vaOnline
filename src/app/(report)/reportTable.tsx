import { useLoading } from '@/components/dialog/loadingProvider';
import { useToast } from '@/components/dialog/useToast';
import { useTranslation } from '@/context/TranslationContext';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { Divider, Menu, useTheme } from 'react-native-paper';
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
    const [currentId, setCurrentId] = useState<any | null>(null);
    const [visible, setVisible] = useState<Record<string, boolean>>({});
    const { showToast } = useToast();
    const openMenu = (idRow: string) => setVisible(prev => ({ ...prev, [idRow]: true }));

    const closeMenu = (idRow: string) => setVisible(prev => ({ ...prev, [idRow]: false }));

    const onPressRow = useCallback((itemTable: any) => {
        setCurrentId(itemTable.idRow)
        openMenu(itemTable.idRow);
    }, []);
    const onPressMenu = useCallback((menu: IData, item: IData) => {
        closeMenu(item.idRow);
        if (menu.id === 'EDIT_VOUCHER') {
            showToast('Chức năng này chưa thực hiện', { type: "info" })
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
                routerNumber: routerNumber + 1
            };
            if (routerNumber + 1 > 3) {
                showToast('Ứng dụng đang không cho phép truy vấn sâu hơn 4 cấp !', { type: "info" })
                return;
            } // chưa có...
            router.navigate({
                // @ts-ignore:next-line
                pathname: `/(report)/reportDetail${routerNumber + 1}`,
                params: { report: JSON.stringify(report) }
            })
        }
    }, [routerNumber, filterKey]);
    const rowRenderer = useCallback((__: string | number, item: T) => {
        const fnVisible = new Function('parentRow', item.VISIBLE_WHEN || 'return true');
        const newMenu = menuRow.filter(menu => fnVisible(menu));
        const isVoucher = isNotEmpty(item.MA_CT) && isNotEmpty(item.DOC_ID);
        return ((newMenu.length > 0 || isVoucher) ? <Menu
            mode='elevated'
            contentStyle={{ backgroundColor: colors.background }}
            visible={visible[item.idRow]}
            onDismiss={() => closeMenu(item.idRow)}
            anchor={
                <ReportTableItem item={item} groupedColumns={groupedColumns[vnd_nt]} filter={filterKey}
                    paramSystem={paramSystem} onPress={onPressRow} currentId={currentId} />
            }>
            {isVoucher && <Menu.Item leadingIcon={() => <FontAwesome name={'edit'} size={24} color={colors.secondary} />} onPress={() => onPressMenu({ id: 'EDIT_VOUCHER' }, item)} title={_('EDIT_VOUCHER')} />}
            {newMenu.length > 0 && <Divider />}
            {newMenu.map(menu => {
                return (
                    <Menu.Item key={menu.id} leadingIcon={() => <FontAwesome name={menu.icon || 'table'} size={24} color={menu.icon_color || colors.secondary} />} onPress={() => onPressMenu(menu, item)} title={menu.value} />
                )
            })}
        </Menu> : <ReportTableItem item={item} groupedColumns={groupedColumns[vnd_nt]} filter={filterKey}
            paramSystem={paramSystem} onPress={onPressRow} currentId={currentId} />);

    }, [visible, menuRow, groupedColumns, vnd_nt, filterKey, paramSystem, currentId, onPressRow, onPressMenu, colors]);

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