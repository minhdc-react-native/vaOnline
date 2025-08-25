import MenuScreen from '@/app/menu';
import { CustomTabBar } from '@/components/customTabBar';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';

const allRoutes = [
    { key: 'partner', title: 'Đối tượng', keyMenuWin: 'acCatalogPartner' },
    { key: 'good', title: 'Hàng hoá', keyMenuWin: 'acCatalogGood' },
    { key: 'balance', title: 'Số dư', keyMenuWin: 'acCatalogBalance' },
    { key: 'bank', title: 'Ngân hàng', keyMenuWin: 'acCatalogBank' },
    { key: 'other', title: 'Khác', keyMenuWin: 'acCatalogOther' },
];
const menuMain = 'catalog';

export default function CatalogAccounting() {
    const { colors } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const dataMenuWin = useDataApp((state) => state.dataMenuWin);

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
        <View style={{ flex: 1, gap: 10, backgroundColor: colors.background }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(pros: any) => <CustomTabBar {...pros} setIndex={setIndex} />}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}
