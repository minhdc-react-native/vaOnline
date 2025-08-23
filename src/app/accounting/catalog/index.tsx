import { CustomTabBar } from '@/components/customTabBar';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import AccCatalogBalance from './acc-catalog-balance';
import AccCatalogBank from './acc-catalog-bank';
import AccCatalogGood from './acc-catalog-good';
import AccCatalogOther from './acc-catalog-other';
import AccCatalogPartner from './acc-catalog-partner';

const renderScene = SceneMap({
    partner: AccCatalogPartner,
    good: AccCatalogGood,
    balance: AccCatalogBalance,
    bank: AccCatalogBank,
    other: AccCatalogOther
});
const routes = [
    { key: 'partner', title: 'Đối tượng' },
    { key: 'good', title: 'Hàng hoá' },
    { key: 'balance', title: 'Số dư' },
    { key: 'bank', title: 'Ngân hàng' },
    { key: 'other', title: 'Khác' }
];

export default function CatalogAccounting() {
    const { colors } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
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
