import BarChartScreen from '@/app/accounting/dashboard/barChartScreen';
import InfoBalance from '@/app/accounting/dashboard/InfoBalance';
import PieChartScreen from '@/app/accounting/dashboard/pieChartScreen';
import FormWrapper from '@/components/formWrapper';
import { useAuth } from '@/hooks/useAuth';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { VACOMTheme } from '@/theme/theme';
import { useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

export default function Dashboard() {
    const { colors } = useTheme<VACOMTheme>();
    const { infoDvcs, getInfoDvcs } = useAuth();
    const currentYear = useDataApp((state) => state.currentYear);
    const lang = useDataApp((state) => state.lang);
    const [numRefresh, setNumberRefresh] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [refreshView, setRefreshView] = useState({ barChart: false, pieChart: false, infoBalance: false })
    const onRefresh = () => {
        setRefresh(true);
        setNumberRefresh(numRefresh + 1);
    }
    useEffect(() => {
        if (refreshView.barChart && refreshView.pieChart && refreshView.infoBalance) {
            setRefresh(false);
        }
    }, [refreshView]);

    const onFinish = (change: Record<string, boolean>) => {
        setRefreshView(prev => ({ ...prev, ...change }));
    }

    useEffect(() => {
        const _getData = async () => {
            await getInfoDvcs();
        }
        _getData();
    }, []);

    useEffect(() => {
        onRefresh();
    }, [currentYear]);

    return (
        <FormWrapper
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[colors.primary]} // màu vòng quay (Android)
                    tintColor={colors.primary}  // màu vòng quay (iOS)
                />
            }
            stickyHeaderIndices={[0]}
        >
            <View style={{ gap: 10, backgroundColor: colors.background, padding: 20, borderBottomWidth: 0.5, borderBottomColor: colors.vacom.borderColor }}>
                <Chip style={{ alignSelf: "flex-start" }}><Text>{currentYear}</Text></Chip>
                <Text variant='titleMedium' style={{ color: colors.secondary }}>{`${infoDvcs?.DVCS_ID} - ${infoDvcs?.TEN_DVCS}`}</Text>
                <Text variant='titleSmall'>{`${lang === 'vi' ? 'Mã số thuế:' : 'TaxCode:'} ${infoDvcs?.MS_THUE}`}</Text>
            </View>
            <InfoBalance numRefresh={numRefresh} onFinish={() => onFinish({ infoBalance: true })} />
            <BarChartScreen numRefresh={numRefresh} onFinish={() => onFinish({ barChart: true })} />
            <PieChartScreen numRefresh={numRefresh} onFinish={() => onFinish({ pieChart: true })} />
            <View style={{ height: 100 }} />
        </FormWrapper>
    );
}
