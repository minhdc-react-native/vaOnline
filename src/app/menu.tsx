import { VcGroupButton } from '@/components/vcGroupButton';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { VACOMTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function MenuScreen({ menuMain, keyMenuWin }: { menuMain: string, keyMenuWin: IKeyMenuWin }) {
    const dataMenuWin = useDataApp((state) => state.dataMenuWin);
    const lang = useDataApp((state) => state.lang);
    const dataMenu = useMemo(() => {
        return dataMenuWin[menuMain][keyMenuWin];
    }, [dataMenuWin, keyMenuWin, menuMain]);

    const onPress = (item: IMenuWin) => {
        const pathName: any = item.typeWin === "(custom)" ? '/(custom)' : (item.typeWin === "(report)" ? '/(report)' : '/(window)');
        router.navigate({ pathname: pathName, params: { menuWin: JSON.stringify(item) } });
    };
    const { colors } = useTheme<VACOMTheme>();
    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: colors.vacom.backLayout }}>
            {dataMenu && dataMenu.map((item, idx) => {
                return (
                    <VcGroupButton key={idx} title={lang === 'vi' ? item.title : item.titleE} expanded={item.expanded !== undefined ? item.expanded : true}
                        data={item.data} icon={item.icon} disabled={item.disable} onPress={onPress} />
                )
            })}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}
