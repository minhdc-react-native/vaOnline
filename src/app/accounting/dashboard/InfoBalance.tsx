import LoadingScreen from "@/components/loadingScreen";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Divider, Text, useTheme } from "react-native-paper";

interface IProgs {
    numRefresh: number;
    onFinish: () => void;
}
export default function InfoBalance({ numRefresh, onFinish }: IProgs) {
    const [data, setData] = useState<any[]>();
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
    return (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
            {loading ? <LoadingScreen /> :
                <View>
                    <Text style={{ paddingTop: 10, textAlign: "center", fontWeight: "bold", color: colors.secondary }}>THÔNG TIN SỐ DƯ</Text>
                    <View style={{ flexDirection: "row", gap: 5, padding: 10 }}>
                        <ScrollView horizontal contentContainerStyle={{ gap: 10, padding: 10 }} showsHorizontalScrollIndicator={false}>
                            {data && data.map((item, index) => (
                                <ViewCard key={`infoCard${index}`} index={index} item={item} />
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
    item: any
}
const ViewCard = ({ index, item }: IProgViewCard) => {
    const { colors } = useTheme<VACOMTheme>();
    return (
        <View style={{ backgroundColor: colors.background, padding: 10, borderRadius: 10, borderWidth: 0.5, gap: 5, borderColor: colors.vacom.borderColor }}>
            <Text style={{ textAlign: "left", flex: 1 }}><FontAwesome name={icons[item.TK]} size={15} color={item.COLOR || colors.secondary} /> {titles[item.TK]}</Text>
            <Divider />
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <Text>{'Nợ:'}</Text>
                <Text style={{ color: colors.secondary, fontWeight: "bold", flex: 1, textAlign: "right" }}>{Helper.formatAmount(item.DU_NO)}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <Text>{'Có:'}</Text>
                <Text style={{ color: colors.secondary, fontWeight: "bold", flex: 1, textAlign: "right" }}>{Helper.formatAmount(item.DU_CO)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});


