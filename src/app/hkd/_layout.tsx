import { CustomDrawerContent } from '@/components/drawerContent';
import { VcData } from '@/constants/vcData';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { IconButton, useTheme } from 'react-native-paper';

export default function LayoutAccounting() {
    const { colors } = useTheme();
    return (
        <Drawer
            initialRouteName="dashboard"
            screenOptions={({ route, navigation }) => {
                return ({
                    headerRight: () => <HeaderRight name={route.name} />,
                    title: VcData.drawerTitle[route.name as keyof typeof VcData.drawerTitle] as any,
                    headerShown: true,
                    drawerStyle: {
                        backgroundColor: 'transparent',
                        width: 200,
                    },
                    headerLeft: () => <IconButton icon="menu" size={24} iconColor={colors.primary} onPress={() => navigation.toggleDrawer()} />
                });
            }}
            drawerContent={() => <CustomDrawerContent drawerItems={VcData.drawerHkd} />}
        />
    );
}

const HeaderRight = ({ name }: { name: string }) => {
    const { colors } = useTheme();
    switch (name) {
        case 'dashboard':
            return (
                <IconButton icon={'apps'} iconColor={colors.secondary} onPress={() => router.replace("/list-app")} />
            );
        default:
            return null;
    }
}