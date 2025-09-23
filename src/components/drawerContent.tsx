import { VcData } from '@/constants/vcData';
import { useAuth } from '@/hooks/useAuth';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { getRemember, saveYear } from '@/utils/vcStorage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import VcSelectList from './vcSelectList';

export function CustomDrawerContent({ drawerItems, title }: { drawerItems: DrawerItem[], title: string }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [remember, setRemember] = useState<any>(null);
    const years = useDataApp((state) => state.years);
    const currentYear = useDataApp((state) => state.currentYear);
    const setCurrentYear = useDataApp((state) => state.setCurrentYear);

    const { colors } = useTheme();
    const onSelectYear = async (year: any) => {
        saveYear(year.NAM);
        setCurrentYear(year.NAM);
    }
    useEffect(() => {
        const getStorage = async () => {
            const remember = await getRemember();
            setRemember(remember);
        }
        getStorage();
    }, []);
    return (
        <LinearGradient
            colors={[colors.secondary, '#fff', '#fff', colors.secondary]}
            style={styles.container}
            locations={[0, 0.3, 0.7, 1]}
        >
            <Text numberOfLines={2} variant='titleLarge'
                style={{ textAlign: "center", fontWeight: "bold", color: colors.elevation.level5, paddingVertical: 10, paddingHorizontal: 20 }}>{`${title}`}</Text>
            <View style={styles.avatar} >
                <Pressable onPress={() => { }} style={{ borderWidth: 2, borderRadius: 50, borderColor: colors.elevation.level5 }}>
                    <Avatar.Image style={{ backgroundColor: colors.backdrop }}
                        source={require("@/assets/images/empty-user.png")} size={50} />
                </Pressable>
                <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: colors.secondary, marginBottom: 10 }}>{remember?.username}</Text>
                <VcSelectList clean={false} style={{ width: 120 }} tableWin='Year' value={currentYear ?? ''} fId='NAM' fValue='NAM' data={years} onChange={onSelectYear} />
            </View>
            <View style={styles.content}>
                {drawerItems.map((item) => (
                    <ItemDrawer key={item.path} item={item} pathname={pathname} />
                ))}
            </View>
            <View style={styles.logout}>
                <IconButton
                    icon={() => <AntDesign name="logout" size={24} color={colors.secondary}
                    />} onPress={logout} />
            </View>
        </LinearGradient>
    );
}

interface IProgs {
    item: DrawerItem,
    pathname: string
}
const ItemDrawer = ({ item, pathname }: IProgs) => {
    const isSelected = pathname.startsWith(item.path);
    const lang = useDataApp((state) => state.lang);
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => !isSelected && router.push(item.path as any)}
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
                    {lang === 'vi' ?
                        VcData.drawerTitle[item.label as keyof typeof VcData.drawerTitle] :
                        VcData.drawerTitleE[item.label as keyof typeof VcData.drawerTitleE]}
                </Text>
            </>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#fff',
        paddingTop: 100
    },
    content: {
    },
    avatar: {
        gap: 10,
        marginBottom: 20,
        alignSelf: "center",
        alignItems: "center"
    },
    logout: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    }
});