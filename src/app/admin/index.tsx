import { CustomTabBar } from '@/components/customTabBar';
import { router } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import AdminOther from './admin-other';
import AdminUser from './admin-user';
import OrgUnit from './org-unit';

const renderScene = SceneMap({ orgUnit: OrgUnit, user: AdminUser, other: AdminOther });
const routes = [{ key: 'orgUnit', title: 'Danh sách đơn vị' }, { key: 'user', title: 'Người dùng' }, { key: 'other', title: 'Khác' },];

export default function Admin() {
    const { colors } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.Content title="Quản trị" />
                <IconButton icon={'apps'} iconColor={colors.secondary} onPress={() => router.replace("/list-app")} />
            </Appbar.Header>
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
