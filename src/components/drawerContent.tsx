import React, { use } from 'react';
import { useRouter, usePathname, router } from 'expo-router';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VcData } from '@/constants/vcData';
import { useAuth } from '@/context/auth';
import { useSelector } from 'react-redux';
import { IVcStore } from '@/redux/vcStore';

const drawerItems: DrawerItem[] = [
    { label: 'dashboard', path: '/dashboard', icon: 'view-dashboard-outline' },
    { label: 'work', path: '/work', icon: 'firework' },
    { label: 'business', path: '/business', icon: 'briefcase-outline' },
    { label: 'deployment', path: '/deployment', icon: 'cloud-upload-outline' },
    { label: 'development', path: '/development', icon: 'code-tags' },
    { label: 'catalogs', path: '/catalogs', icon: 'book-outline' },
    { label: 'reports', path: '/reports', icon: 'file-chart-outline' },
    { label: 'system', path: '/system', icon: 'cog-outline' },
    // { label: 'chat', path: '/chat', icon: 'chat-processing' },
];

export function CustomDrawerContent() {
    const { colors } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: IVcStore) => state.app.user);
    const { logout } = useAuth();
    return (
        <LinearGradient
            colors={[colors.secondary, '#fff', '#fff', colors.secondary]}
            style={styles.container}
            locations={[0, 0.3, 0.7, 1]}
        >
            <View style={styles.avatar} >
                <Pressable onPress={() => { }} style={{ borderWidth: 1, borderRadius: 50, borderColor: colors.background }}>
                    <Avatar.Image style={{ backgroundColor: colors.backdrop }}
                        source={user.logo ? { uri: user.logo } : require("@/assets/images/empty-user.png")} size={100} />
                </Pressable>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", color: colors.secondary }}>{user.useName}</Text>
            </View>
            <View style={styles.content}>
                {drawerItems.map((item) => (
                    <ItemDrawer key={item.path} item={item} pathname={pathname} />
                ))}
            </View>

            <IconButton
                style={styles.logout}
                icon={() => <AntDesign name="logout" size={24} color={colors.secondary}
                />} onPress={logout} />
        </LinearGradient>
    );
}
type DrawerLabel = 'dashboard' | 'work' | 'business' | 'deployment' | 'development' | 'catalogs' | 'reports' | 'system' | 'chat';

interface DrawerItem {
    label: DrawerLabel;
    path: string;
    icon: string;
}

interface IProgs {
    item: DrawerItem,
    pathname: string
}
const ItemDrawer = ({ item, pathname }: IProgs) => {
    const isSelected = pathname.startsWith(item.path);
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => !isSelected && router.push(item.path)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginHorizontal: 10,
                borderRadius: 10,
                backgroundColor: isSelected ? colors.primary : 'transparent',
            }}
        >
            <>
                <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={isSelected ? colors.background : colors.secondary}
                    style={{ marginRight: 16 }}
                />
                <Text style={{ fontSize: 16, color: isSelected ? colors.background : colors.secondary }}>
                    {VcData.drawerTitle[item.label]}
                </Text>
            </>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#fff'
    },
    content: {
    },
    avatar: {
        gap: 10,
        marginBottom: 20,
        alignSelf: "center"
    },
    logout: {
        alignSelf: "center",
        alignItems: "center",
        marginVertical: 20
    }
});