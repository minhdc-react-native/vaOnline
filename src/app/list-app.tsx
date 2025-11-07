import LoadingScreen from '@/components/loadingScreen';
import { StatusBarOnFocus } from '@/components/statusBarOnFocus';
import VcSelectList from '@/components/vcSelectList';
import { VcData } from '@/constants/vcData';
import { useAuth } from '@/hooks/useAuth';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { saveYear } from '@/utils/vcStorage';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';

export default function ListApp() {
    const { listApp, getListApp, infoDvcs, getInfoDvcs, getLicenseInfo, logout, onSelectApp } = useAuth();
    const years = useDataApp((state) => state.years);
    const currentYear = useDataApp((state) => state.currentYear);
    const setCurrentYear = useDataApp((state) => state.setCurrentYear);
    const lang = useDataApp((state) => state.lang);
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const onSelectYear = async (year: any) => {
        saveYear(year.NAM);
        setCurrentYear(year.NAM);
    }

    useEffect(() => {
        const _getData = async () => {
            await getListApp();
            await getInfoDvcs(setLoading);
            await getLicenseInfo();
        }
        _getData();
    }, []);

    return (
        <View style={{ flex: 1, gap: 50 }}>
            <StatusBarOnFocus />
            <LinearGradient
                colors={[colors.elevation.level1, '#fff', '#fff', colors.secondary]}
                style={styles.container}
                locations={[0, 0.3, 0.7, 1]}
            >
                <Card style={{ marginHorizontal: 20, marginBottom: 50, paddingTop: 10, backgroundColor: colors.background }}>
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, alignItems: "center" }}>
                        <VcSelectList clean={false} style={{ flex: 1 }} tableWin='Year' label={lang === 'vi' ? 'Năm làm việc' : 'Year of work'} value={currentYear ?? ''} fId='NAM' fValue='NAM' data={years} onChange={onSelectYear} />
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                            <IconButton icon={() => <AntDesign name="logout" size={24} color={colors.secondary} />} size={24} onPress={logout} />
                        </View>
                    </View>
                    <View style={{ paddingVertical: 10, paddingHorizontal: 20, gap: 5 }}>
                        {loading ? <LoadingScreen style={{ height: 80 }} /> : <>
                            <Text variant='titleMedium' style={{ color: colors.secondary }}>{`${infoDvcs?.DVCS_ID} - ${infoDvcs?.TEN_DVCS}`}</Text>
                            <Text variant='titleSmall'>{`${lang === 'vi' ? 'Mã số thuế:' : 'TaxCode:'} ${infoDvcs?.MS_THUE}`}</Text>
                        </>}
                    </View>
                </Card>
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 50, paddingHorizontal: 20, flexWrap: "wrap" }}>
                    {listApp.map((app) => (
                        <Pressable key={app.id} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, justifyContent: "center", alignItems: "center" }]} onPress={() => onSelectApp(app.id.toString())}>
                            <Card style={{ backgroundColor: app.BACKGROUND_COLOR, width: 100, height: 80, justifyContent: "center", alignItems: "center" }}>
                                <Icon source={(VcData.iconApp as any)[app.id]} size={50} color={colors.background} />
                            </Card>
                            <Text variant='titleMedium' style={{ textAlign: "center", fontWeight: "bold", flexShrink: 1 }}>{app[lang === 'vi' ? 'NAME' : 'en_NAME']}</Text>
                        </Pressable>
                    ))}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: '#fff'
    }
})