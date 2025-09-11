import LoadingScreen from '@/components/loadingScreen';
import { useReport } from '@/hooks/useReport';
import { VACOMTheme } from '@/theme/theme';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Appbar, Divider, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParamReport from './paramReport';
import { ReportTable } from './reportTable';
const currencies = [
    { value: '1', label: 'VNĐ' },
    { value: '2', label: 'NT' },
    { value: '3', label: 'VNĐ & NT' }
]
interface IProg {
    reportDefault: IReportItemDefault
}
export default function ReportDetail({ reportDefault }: IProg) {
    const { bottom } = useSafeAreaInsets();
    const { reportSchema, routerNumber, loading, showParam, onCreateReport,
        setShowParam, layoutFilter, dataFilter, timeItem, onFilter, menuRow, vnd_nt, setVnd_nt, data, onRefresh, dataSource
    } = useReport({ reportDefault });
    const { colors } = useTheme<VACOMTheme>();

    const onConfirm = useCallback((paramKey?: Record<string, any> | undefined, timeItem?: IData | null) => {
        onFilter(paramKey, timeItem);
    }, [onFilter]);
    const renderFilter = useMemo(() => {
        if (!layoutFilter) return null;
        return (
            <ParamReport onConfirm={onConfirm}
                paramKey={dataFilter} timeItem={timeItem} dataSource={dataSource}
                schemaConfig={layoutFilter} />
        );
    }, [dataFilter, dataSource, layoutFilter, onConfirm, timeItem]);

    return (
        <View style={{ flex: 1, paddingBottom: bottom }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={reportDefault.reportItem.REPORT_NAME} />
                <Appbar.Action icon={'filter-outline'} onPress={() => setShowParam(true)} />
            </Appbar.Header>
            <View style={{ backgroundColor: colors.background }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <SegmentedButtons density="small" value={vnd_nt} buttons={currencies} onValueChange={(value: any) => setVnd_nt(value)} />
                    </View>
                    <IconButton icon={() => <FontAwesome name="file-pdf-o" size={24} color="orange" />} onPress={() => onCreateReport('pdf', dataFilter)} />
                    <IconButton icon={() => <FontAwesome name="file-excel-o" size={24} color="green" />} onPress={() => onCreateReport('excel', dataFilter)} />
                </View>
            </View>
            <Divider />
            {reportSchema ? <ReportTable data={data} menuRow={menuRow} routerNumber={routerNumber} vnd_nt={vnd_nt} reportSchema={reportSchema} filterKey={dataFilter} onRefresh={onRefresh} loading={loading} /> : <LoadingScreen />}
            {showParam && layoutFilter && renderFilter}
        </View>
    );
}
