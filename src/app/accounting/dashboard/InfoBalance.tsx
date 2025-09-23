import LoadingScreen from "@/components/loadingScreen";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Divider, Text, useTheme } from "react-native-paper";

const reportsId: any = {
    '111': '094A6BAE-A9D2-4532-9EC2-4E74DAAD5DF0',
    '112': '679C5FC1-D71A-4CE0-AD32-632C4E278E38',
    '131': 'BBDC45C3-6412-491C-9337-9BB35BD0B0D1',
    '331': 'BBDC45C3-6412-491C-9337-9BB35BD0B0D1'
}

interface IProgs {
    numRefresh: number;
    onFinish: () => void;
}
export default function InfoBalance({ numRefresh, onFinish }: IProgs) {
    const [data, setData] = useState<Record<string, any>[]>();
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const getData = useCallback(() => {
        api.get({
            link: `/api/Dashboard/GetAccountingBalance`,
            callBack: (res) => {
                setData(res.Data);
                onFinish();
            },
            setLoading: setLoading
        });
    }, [])
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [numRefresh]);
    const onPressItem = (item: Record<string, any>) => {
        const reportId = reportsId[item.TK];
        if (reportId) {
            const report = {
                reportId: reportId,
                dataFilter: { p_Tk: item.TK, p_Ngay_ct1: item.TU_NGAY, p_Ngay_ct2: item.DEN_NGAY },
                routerNumber: 1
            };
            router.navigate({
                pathname: '/(report)/reportDetail1',
                params: { report: JSON.stringify(report) }
            })
        }
    }
    return (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
            {loading ? <LoadingScreen /> :
                <View>
                    <Text style={{ paddingTop: 10, textAlign: "center", fontWeight: "bold", color: colors.secondary }}>THÔNG TIN SỐ DƯ</Text>
                    <View style={{ flexDirection: "row", gap: 5, padding: 10 }}>
                        <ScrollView horizontal contentContainerStyle={{ gap: 10, padding: 10 }} showsHorizontalScrollIndicator={false}>
                            {data && data.map((item, index) => (
                                <ViewCard onPress={() => onPressItem(item)} key={`infoCard${index}`} index={index} item={item} />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            }
        </Card>
    );
}
const icons: any = {
    '111': 'money',
    '112': 'bank',
    '131': 'money',
    '331': 'money'
}
const titles: any = {
    '111': 'Tiền mặt (111)',
    '112': 'Tiền gửi (112)',
    '131': 'Phải thu (131)',
    '331': 'Phải trả (331)'
}
interface IProgViewCard {
    index: number,
    item: Record<string, any>,
    onPress: () => void
}
const ViewCard = ({ index, item, onPress }: IProgViewCard) => {
    const { colors } = useTheme<VACOMTheme>();
    const fullNumberNo = Helper.formatFullNumber(item.DU_NO);
    const fullNumberCo = Helper.formatFullNumber(item.DU_CO);
    return (
        <Pressable onPress={onPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, backgroundColor: colors.elevation.level1, padding: 10, borderRadius: 10, borderWidth: 0.5, gap: 5, borderColor: colors.elevation.level5 }]}>
            <Text style={{ textAlign: "left", flex: 1, fontWeight: "bold" }}><FontAwesome name={icons[item.TK]} size={15} color={item.COLOR || colors.secondary} /> {titles[item.TK]}</Text>
            <Divider />
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <Text>{'Nợ:'}</Text>
                <Text style={{ color: item.COLOR || colors.secondary, fontWeight: "bold", flex: 1, textAlign: "right" }}>{`${fullNumberNo?.textNum} ${fullNumberNo?.label}`}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <Text>{'Có:'}</Text>
                <Text style={{ color: item.COLOR || colors.secondary, fontWeight: "bold", flex: 1, textAlign: "right" }}>{`${fullNumberCo?.textNum} ${fullNumberCo?.label}`}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});


