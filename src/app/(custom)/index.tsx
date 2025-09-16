import { useDataApp } from '@/hooks/zustand/useDataApp';
import { VACOMTheme } from '@/theme/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { Appbar, Divider, useTheme } from 'react-native-paper';
import PbKcTd from './pbkctd';
import TinhGiaVon from './tinh-gia-von';

export default function CustomScreen() {
    const { colors } = useTheme<VACOMTheme>();
    const { menuWin } = useLocalSearchParams();
    const itemMenuWin: IMenuWin = JSON.parse(menuWin?.toString());
    const lang = useDataApp((state) => state.lang);
    const renderCustom = useMemo(() => {
        switch (itemMenuWin.id) {
            case 'TINH_GV':
                return <TinhGiaVon />
            case 'WIN00337':
                return <TinhGiaVon />
            case 'WIN00227':
                return <PbKcTd />
            default:
                return null;
        }
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={lang === 'vi' ? itemMenuWin.label : itemMenuWin.labelE} />
            </Appbar.Header>
            <Divider />
            <View style={{ flex: 1, padding: 10, gap: 10 }}>
                {renderCustom}
            </View>
        </View>
    );
}
