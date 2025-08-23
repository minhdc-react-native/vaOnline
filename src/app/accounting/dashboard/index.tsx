import { useAuth } from '@/hooks/useAuth';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';

export default function Dashboard() {
    const { colors } = useTheme();
    const { infoDvcs, getInfoDvcs } = useAuth();
    const currentYear = useDataApp((state) => state.currentYear);
    useEffect(() => {
        const _getData = async () => {
            await getInfoDvcs();
        }
        _getData();
    }, []);
    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <Card style={{ gap: 10, backgroundColor: colors.background, padding: 20 }}>
                <Chip style={{ alignSelf: "flex-start" }}><Text>{currentYear}</Text></Chip>
                <Text variant='titleMedium' style={{ color: colors.secondary }}>{`${infoDvcs?.DVCS_ID} - ${infoDvcs?.TEN_DVCS}`}</Text>
                <Text variant='titleSmall'>{`Mã số thuế: ${infoDvcs?.MS_THUE}`}</Text>
            </Card>
        </View>
    );
}
