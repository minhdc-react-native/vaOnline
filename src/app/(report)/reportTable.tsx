import { useLoading } from '@/components/dialog/loadingProvider';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
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
    reportSchema: ISchemaReport;
    data: T[];
    filterKey: Record<string, any>,
    onRefresh: () => void,
    loading: boolean
}
export const ReportTable = <T extends { idRow: string;[key: string]: any } = any>({ reportSchema, data, filterKey, onRefresh, loading }: IProgs<T>) => {
    const paramSystem = useDataApp((state) => state.paramSystem);
    const { show, hide } = useLoading();
    const { colors } = useTheme();
    const scrollX = useRef(new Animated.Value(0)).current;
    const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
    const groupedColumns = reportSchema.columnsTable;
    const scrollableColumns = flattenGroupedColumns(groupedColumns);
    const TOTAL_WIDTH = scrollableColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    const layoutProvider = new LayoutProvider(
        () => 'ROW',
        (_, dim) => {
            dim.width = TOTAL_WIDTH;
            dim.height = ROW_HEIGHT;
        }
    );
    const [currentId, setCurrentId] = useState<any | null>(null);

    const rowRenderer = useCallback((_: string | number, item: T) => {
        return (<ReportTableItem reportSchema={reportSchema} item={item} groupedColumns={groupedColumns} filter={filterKey}
            paramSystem={paramSystem} onPress={(itemTable: any) => setCurrentId(itemTable.idRow)} currentId={currentId} />)
    }, [currentId, groupedColumns, dataProvider]);

    useEffect(() => {
        loading ? show('Đang tải dữ liệu...') : hide();
    }, [loading]);

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
                    <ReportTableHeader groupedColumns={groupedColumns} filterKey={filterKey} />
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