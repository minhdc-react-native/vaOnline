import LoadingScreen from "@/components/loadingScreen";
import { api } from "@/utils/apiMethods";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Group, SkFont, Text as TxtSkia, useFont } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import {
    Pie,
    PieSliceData,
    PolarChart,
} from "victory-native";

interface IProgs {
    numRefresh: number;
    onFinish: () => void;
}
export default function PieChartScreen({ numRefresh, onFinish }: IProgs) {
    const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 10);
    const isDrawerOpen = useDrawerStatus() === 'open';
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const getData = useCallback(() => {
        api.get({
            link: `/api/Dashboard/GetExpensesStruct`,
            callBack: (res: any[]) => {
                setData(res);
                onFinish();
            },
            callError: (err => onFinish()),
            setLoading: setLoading
        })
    }, [])
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [numRefresh]);

    return (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
            {loading ? <LoadingScreen /> : <View>
                <Text style={{ textAlign: "center", paddingBottom: 10, fontWeight: "bold", color: colors.secondary }}>CƠ CẤU CHI PHÍ</Text>
                <Divider />
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ margin: 20 }}>
                    {data.map((item, index) => (
                        <View key={`barTexts${index}`} style={{
                            flexDirection: "row", gap: 5, alignItems: "center",
                            marginRight: 10, backgroundColor: colors.elevation.level1,
                            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 0.5, borderColor: colors.elevation.level5
                        }}>
                            <View style={{ borderRadius: 10, height: 10, width: 10, backgroundColor: item.Color }} /><Text>{item.Name}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={{ height: 250 }}>
                    <PolarChart
                        key={isDrawerOpen ? 'drawerOpen' : 'drawerClosed'}
                        data={data}
                        colorKey={"Color"}
                        valueKey={"Amount"}
                        labelKey={"Name"}
                    >
                        <Pie.Chart>
                            {({ slice }) => {
                                return (
                                    <>
                                        <Pie.Slice>
                                            <Pie.Label radiusOffset={0.6}>
                                                {/* {(position) => (
                                                    <PieChartCustomLabel
                                                        position={position}
                                                        slice={slice}
                                                        font={font}
                                                    />
                                                )} */}
                                            </Pie.Label>
                                        </Pie.Slice>
                                        <Pie.SliceAngularInset
                                            angularInset={{
                                                angularStrokeWidth: 1,
                                                angularStrokeColor: colors.background
                                            }}
                                        />
                                    </>
                                );
                            }}
                        </Pie.Chart>
                    </PolarChart>
                </View>
            </View>}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        paddingVertical: 20,
        marginTop: 20
    },
    safeView: {
        flex: 1,
    },
});


export const PieChartCustomLabel = ({
    slice,
    font,
    position,
}: {
    slice: PieSliceData;
    font: SkFont | null;
    position: { x: number; y: number };
}) => {
    const { x, y } = position;
    const fontSize = font?.getSize() ?? 0;
    const getLabelWidth = (text: string) =>
        font
            ?.getGlyphWidths(font.getGlyphIDs(text))
            .reduce((sum, value) => sum + value, 0) ?? 0;

    const isGoodUnits = slice.value > 130;
    const label = slice.label;
    const value = `${slice.value}`;
    const centerLabel = (font?.getSize() ?? 0) / 2;
    const { colors } = useTheme();
    return (
        <Group transform={[{ translateY: -centerLabel }]}>
            <TxtSkia
                x={x - getLabelWidth(label) / 2}
                y={y}
                text={label}
                font={font}
                color={colors.secondary}
            />
            <Group>
                <TxtSkia
                    x={x - getLabelWidth(value) / 2}
                    y={y + fontSize}
                    text={value}
                    font={font}
                    color={colors.primary}
                />
            </Group>
        </Group>
    );
};