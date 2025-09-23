import { CustomDrawerContent } from '@/components/drawerContent';
import { VcData } from '@/constants/vcData';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { IconButton, useTheme } from 'react-native-paper';

export default function LayoutHkd() {
    const { colors } = useTheme();
    const lang = useDataApp((state) => state.lang);
    const dataTitle = lang === 'vi' ? VcData.drawerTitle : VcData.drawerTitleE;
    return (
        <Drawer
            initialRouteName="dashboard"
            screenOptions={({ route, navigation }) => {
                return ({
                    headerRight: () => <HeaderRight name={route.name} />,
                    title: dataTitle[route.name as keyof typeof dataTitle],
                    headerShown: true,
                    drawerStyle: {
                        backgroundColor: 'transparent',
                        width: 200,
                    },
                    headerLeft: () => <IconButton icon="menu" size={24} iconColor={colors.primary} onPress={() => navigation.toggleDrawer()} />
                });
            }}
            drawerContent={() => <CustomDrawerContent drawerItems={VcData.drawerHkd} title={lang === "vi" ? "Hộ Kinh Doanh" : "Household"} />}
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
            return (
                <IconButton icon={'apps'} iconColor={colors.secondary} onPress={() => router.replace("/list-app")} />
            );
    }
}