import LoadingScreen from '@/components/loadingScreen';
import VcSelectList from '@/components/vcSelectList';
import VcSelector from '@/components/vcSelector';
import { useTranslation } from '@/context/TranslationContext';
import { useReport } from '@/hooks/useReport';
import { getListItemView } from '@/schema/voucher/itemView';
import { VACOMTheme } from '@/theme/theme';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Appbar, Card, IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParamReport from './paramReport';
import { ReportTable } from './reportTable';
const currencies = [
    { id: '1', value: 'VNĐ' },
    { id: '2', value: 'NT' },
    { id: '3', value: 'VNĐ & NT' }
]
export default function ReportScreen() {
    const { bottom } = useSafeAreaInsets();
    const { menuWin } = useLocalSearchParams();
    const itemMenuWin: IMenuWin = JSON.parse(menuWin?.toString());
    const { _ } = useTranslation();
    const { reports, menuRow, routerNumber, reportSchema, currentReport, setCurrentReport, loading, showParam, onCreateReport,
        setShowParam, layoutFilter, dataFilter, timeItem, onFilter, vnd_nt, setVnd_nt, data, onRefresh, dataSource
    } = useReport({ itemMenuWin });
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
        <View style={{ flex: 1, marginBottom: bottom }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <VcSelectList label={_('REPORT_NAME')} style={{ flex: 1 }} clean={false} data={reports} itemView={getListItemView('REPORT_ID', 'REPORT_NAME')}
                    value={currentReport?.REPORT_ID} fId='REPORT_ID' fValue='REPORT_NAME' onChange={setCurrentReport} />
                <Appbar.Action icon={'filter-outline'} onPress={() => setShowParam(true)} />
            </Appbar.Header>
            <Card style={{ backgroundColor: colors.background, margin: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                    <View style={{ flex: 1 }}>
                        <VcSelector containerStyle={{ marginTop: 0 }} itemStyle={{ paddingVertical: 5 }} value={vnd_nt} data={currencies} onChange={(item) => setVnd_nt(item.id as any)} type='box' />
                    </View>
                    <IconButton icon={() => <FontAwesome name="file-pdf-o" size={24} color="orange" />} onPress={() => onCreateReport('pdf', dataFilter)} />
                    <IconButton icon={() => <FontAwesome name="file-excel-o" size={24} color="green" />} onPress={() => onCreateReport('excel', dataFilter)} />
                </View>
            </Card>
            {reportSchema ? <ReportTable routerNumber={routerNumber} data={data} menuRow={menuRow} vnd_nt={vnd_nt} reportSchema={reportSchema} filterKey={dataFilter} onRefresh={onRefresh} loading={loading} /> : <LoadingScreen />}
            {showParam && layoutFilter && renderFilter}
        </View>
    );
}
