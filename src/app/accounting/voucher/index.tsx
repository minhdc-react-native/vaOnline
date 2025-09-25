import MenuScreen from '@/app/menu';
import { CustomTabBar } from '@/components/customTabBar';
import LoadingScreen from '@/components/loadingScreen';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';

const menuMain = 'voucher';

export default function VoucherAccounting() {
    const { colors } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const dataMenuWin = useDataApp((state) => state.dataMenuWin);
    const lang = useDataApp((state) => state.lang);

    const allRoutes = [
        { key: 'goodDocuments', title: lang === 'vi' ? 'Chứng từ hàng hoá' : 'Goods documents', keyMenuWin: 'goodDocuments' },
        { key: 'accountingDocuments', title: lang === 'vi' ? 'Chứng từ kế toán' : 'Accounting documents', keyMenuWin: 'accountingDocuments' },
        { key: 'congTacCuoiKy', title: lang === 'vi' ? 'Công tác cuối kỳ' : 'Work at the end of the period', keyMenuWin: 'congTacCuoiKy' }
    ];

    const hasPermission = (keyMenuWin: IKeyMenuWin) => {
        return !!dataMenuWin[menuMain]?.[keyMenuWin];
    };

    // Tạo routes hợp lệ
    const routes = useMemo(() => allRoutes.filter(r => hasPermission(r.keyMenuWin as any)), []);

    // Render scene động
    const renderScene = ({ route }: { route: any }) => {
        return <MenuScreen menuMain={menuMain} keyMenuWin={route.keyMenuWin} />;
    };
    const LazyPlaceholder = useMemo(() => {
        return <LoadingScreen />
    }, []);
    return (
        <View style={{ flex: 1, gap: 10, backgroundColor: colors.background }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                lazy
                renderLazyPlaceholder={() => LazyPlaceholder}
                renderTabBar={(pros: any) => <CustomTabBar {...pros} setIndex={setIndex} />}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}
