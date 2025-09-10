import LoadingScreen from '@/components/loadingScreen';
import VcSelectList from '@/components/vcSelectList';
import { useTranslation } from '@/context/TranslationContext';
import { useReport } from '@/hooks/useReport';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { getListItemView } from '@/schema/voucher/itemView';
import { VACOMTheme } from '@/theme/theme';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Appbar, Divider, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import ParamReport from './paramReport';
import ReportView from './reportView';
const currencies = [
    { value: '1', label: 'VNĐ' },
    { value: '2', label: 'NT' },
    { value: '3', label: 'VNĐ & NT' }
]
export default function ReportScreen() {
    const { menuWin } = useLocalSearchParams();
    const lang = useDataApp((state) => state.lang);
    const itemMenuWin: IMenuWin = JSON.parse(menuWin?.toString());
    const { _ } = useTranslation();
    const { reports, currentReport, setCurrentReport, loading, showParam, onCreateReport,
        setShowParam, layoutFilter, dataFilter, timeItem, onFilter, vnd_nt, setVnd_nt
    } = useReport({ itemMenuWin });
    const { colors } = useTheme<VACOMTheme>();

    const onConfirm = useCallback((paramKey?: Record<string, any> | undefined, timeItem?: IData | null) => {
        onFilter(paramKey, timeItem);
    }, [onFilter]);

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`${lang === "vi" ? itemMenuWin.label : itemMenuWin.labelE}`} />
                <Appbar.Action icon={'filter-outline'} onPress={() => setShowParam(true)} />
            </Appbar.Header>
            <View style={{ backgroundColor: colors.background }}>
                <VcSelectList label={_('REPORT_NAME')} style={{ marginHorizontal: 20, marginTop: 10 }} clean={false} data={reports} itemView={getListItemView('REPORT_ID', 'REPORT_NAME')}
                    value={currentReport?.REPORT_ID} fId='REPORT_ID' fValue='REPORT_NAME' onChange={setCurrentReport} />
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <SegmentedButtons density="small" value={vnd_nt} buttons={currencies} onValueChange={(value: any) => setVnd_nt(value)} />
                    </View>
                    <IconButton icon={() => <FontAwesome name="file-pdf-o" size={24} color="orange" />} onPress={() => onCreateReport('pdf', dataFilter)} />
                    <IconButton icon={() => <FontAwesome name="file-excel-o" size={24} color="green" />} onPress={() => onCreateReport('excel', dataFilter)} />
                </View>
            </View>
            <Divider />
            {loading ? <LoadingScreen /> : <ReportView />}
            {showParam && layoutFilter && <ParamReport onConfirm={onConfirm}
                paramKey={dataFilter} timeItem={timeItem}
                schemaConfig={layoutFilter} />}
        </View>
    );
}
