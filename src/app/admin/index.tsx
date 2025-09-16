import { CustomTabBar } from '@/components/customTabBar';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Appbar, Divider, IconButton, useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';
import MenuScreen from '../menu';
const menuMain = 'system';
export default function AdminScreen() {
    const { colors } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const dataMenuWin = useDataApp((state) => state.dataMenuWin);
    const lang = useDataApp((state) => state.lang);

    const allRoutes = [
        { key: 'systemAdmin', title: lang === 'vi' ? 'Chức năng' : 'Function', keyMenuWin: 'systemAdmin' }
    ];

    const hasPermission = (keyMenuWin: IKeyMenuWin) => {
        return !!dataMenuWin[menuMain][keyMenuWin];
    };

    // Tạo routes hợp lệ
    const routes = useMemo(() => allRoutes.filter(r => hasPermission(r.keyMenuWin as any)), []);

    // Render scene động
    const renderScene = ({ route }: { route: any }) => {
        return <MenuScreen menuMain={menuMain} keyMenuWin={route.keyMenuWin} />;
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.Content title={lang === "vi" ? "Quản trị" : "Admin"} />
                <IconButton icon={'apps'} iconColor={colors.secondary} onPress={() => router.replace("/list-app")} />
            </Appbar.Header>
            <Divider />
            <View style={{ flex: 1, gap: 10, backgroundColor: colors.background }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={(pros: any) => <CustomTabBar {...pros} setIndex={setIndex} />}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </View>
        </View>
    );
} 
