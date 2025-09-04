import LoadingScreen from "@/components/loadingScreen";
import { api } from "@/utils/apiMethods";
import { Text as TxtSkia, useFont } from "@shopify/react-native-skia";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text, useTheme } from "react-native-paper";
import { BarGroup, CartesianChart } from "victory-native";

const barColors = ["darkblue", "darkred"];
const barTexts = ["Doanh thu", "Chi phí"];
interface IProgs {
  numRefresh: number;
  onFinish: () => void;
}
export default function BarChartScreen({ numRefresh, onFinish }: IProgs) {
  const [data, setData] = useState<any[]>([]);

  const lengthData = useMemo(() => {
    if (data.length === 0) return 0;
    return data[data.length - 1].MONTH - data[0].MONTH + 1;
  }, [data]);

  const [maxValue, setMaxValue] = useState(0);
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 10);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const getData = useCallback(() => {
    api.get({
      link: `/api/Dashboard/GetRevenueExpenseByMonth`,
      callBack: (res: any[]) => {
        const _maxValue = res.reduce((max, item: any) => {
          const itemMax = Math.max(item.EXPENSE, item.REVENUE);
          return Math.max(max, itemMax);
        }, -Infinity);
        setMaxValue(_maxValue);
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
      {loading ? <LoadingScreen /> :
        <View>
          <Text style={{ paddingTop: 10, textAlign: "center", fontWeight: "bold", color: colors.secondary }}>DOANH THU - CHI PHÍ CÁC THÁNG (theo %)</Text>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, paddingTop: 10 }}>
            {barTexts.map((text, index) => (
              <View key={`barTexts${index}`} style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                <View style={{ borderRadius: 10, height: 10, width: 10, backgroundColor: barColors[index] }} /><Text>{text}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.chart, { width: 70 * lengthData }]}>
              <CartesianChart
                data={data}
                xKey="MONTH"
                yKeys={["REVENUE", "EXPENSE"]}
                domain={{ y: [0, maxValue] }}
                padding={{ left: 10, right: 10, bottom: 5, top: 15 }}
                domainPadding={{ left: 50, right: 50, top: 30 }}
                axisOptions={{
                  font,
                  tickCount: { y: 5, x: lengthData },
                  lineColor: "#d4d4d8",
                  labelColor: colors.secondary,
                }}
              >
                {({ points, chartBounds }) => (
                  <BarGroup
                    chartBounds={chartBounds}
                    betweenGroupPadding={0.2}
                    withinGroupPadding={0.01}
                    roundedCorners={{
                      topLeft: 5,
                      topRight: 5,
                    }}
                  >
                    <BarGroup.Bar points={points.REVENUE} animate={{ type: "timing" }} color={barColors[0]}>
                      {points.REVENUE.map((p, i) => (
                        <TxtSkia
                          key={`rev-${i}`}
                          x={p.x - ((p?.yValue ?? 0) > 99 ? 22 : ((p?.yValue ?? 0) > 9 ? 20 : 18))}
                          y={(p.y ?? 0) - 2} // đặt text cao hơn đầu cột 10px
                          text={`${p?.yValue?.toFixed(0)}`} // hiển thị giá trị
                          font={font}
                        />
                      ))}
                    </BarGroup.Bar>
                    <BarGroup.Bar points={points.EXPENSE} animate={{ type: "timing" }} color={barColors[1]} >
                      {points.EXPENSE.map((p, i) => (
                        <TxtSkia
                          key={`rev-${i}`}
                          x={p.x + ((p?.yValue ?? 0) > 99 ? 4 : ((p?.yValue ?? 0) > 9 ? 6 : 8))}
                          y={(p.y ?? 0) - 2} // đặt text cao hơn đầu cột 10px
                          text={`${p?.yValue?.toFixed(0)}`} // hiển thị giá trị
                          font={font}
                        />
                      ))}
                    </BarGroup.Bar>
                  </BarGroup>
                )}
              </CartesianChart>
            </View>
          </ScrollView>
        </View>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20
  },
  chart: {
    height: 350
  },
});