import VcSelectList from '@/components/vcSelectList';
import { VcData } from '@/constants/vcData';
import { useAuth } from '@/hooks/useAuth';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { saveYear } from '@/utils/vcStorage';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, IconButton, Text, useTheme } from 'react-native-paper';

export default function ListApp() {
    const { listApp, getListApp, infoDvcs, getInfoDvcs, getLicenseInfo, logout, onSelectApp } = useAuth();
    const years = useDataApp((state) => state.years);
    const currentYear = useDataApp((state) => state.currentYear);
    const setCurrentYear = useDataApp((state) => state.setCurrentYear);
    const { colors } = useTheme();
    const onSelectYear = async (year: any) => {
        saveYear(year.NAM);
        setCurrentYear(year.NAM);
    }

    useEffect(() => {
        const _getData = async () => {
            await getListApp();
            await getInfoDvcs();
            await getLicenseInfo();
        }
        _getData();
    }, []);

    return (
        <View style={{ flex: 1, gap: 50 }}>
            <LinearGradient
                colors={[colors.elevation.level1, '#fff', '#fff', colors.secondary]}
                style={styles.container}
                locations={[0, 0.3, 0.7, 1]}
            >
                <View style={{ flexDirection: "row", paddingHorizontal: 20, alignItems: "center" }}>
                    <VcSelectList style={{ flex: 1 }} tableWin='Year' label='Năm làm việc' value={currentYear ?? ''} fId='NAM' fValue='NAM' data={years} onChange={onSelectYear} />
                    <IconButton style={{ flex: 1 }} icon={() => <AntDesign name="logout" size={24} color={colors.secondary} />} size={24} onPress={logout} />
                </View>
                <View style={{ padding: 20, gap: 5 }}>
                    <Text variant='titleMedium' style={{ color: colors.secondary }}>{`${infoDvcs?.DVCS_ID} - ${infoDvcs?.TEN_DVCS}`}</Text>
                    <Text variant='titleSmall'>{`Mã số thuế: ${infoDvcs?.MS_THUE}`}</Text>
                </View>
                <Divider style={{ marginBottom: 50 }} />
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 50, paddingHorizontal: 50, flexWrap: "wrap" }}>
                    {listApp.map((app) => (
                        <Pressable key={app.id} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, justifyContent: "center", alignItems: "center" }]} onPress={() => onSelectApp(app.id.toString())}>
                            <Card style={{ backgroundColor: app.BACKGROUND_COLOR, width: 100, height: 80, justifyContent: "center", alignItems: "center" }}>
                                <Icon source={(VcData.iconApp as any)[app.id]} size={50} color={colors.background} />
                            </Card>
                            <Text variant='titleMedium' style={{ textAlign: "center", flexShrink: 1 }}>{app.NAME}</Text>
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