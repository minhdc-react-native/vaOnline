import { useEvalExpr } from "@/app/(window)/hooks/useEvalExpr";
import { useThemeVacom } from "@/hooks/useThemeVacom";
import { View } from "react-native";
import { customText } from "react-native-paper";
const Text = customText<'customVariant'>();
const HEADER_HEIGHT = 20;
const BORDER_WIDTH = 0.5;
interface IProgs {
    groupedColumns: IColumnReport[],
    filterKey: Record<string, any>,
}
export const ReportTableHeader = ({ groupedColumns, filterKey }: IProgs) => {
    const { colors } = useThemeVacom();
    const evalExpr = useEvalExpr(filterKey);
    return (
        <View style={{ flexDirection: 'row' }}>
            {groupedColumns.map((col, index) => {
                const indexEnd = col.children ? col.children.length - 1 : 0;
                const isGroup = col.children && col.children.length > 0
                const width = isGroup && col.children ? col.children.reduce((sum, col) => sum + (col.width || 0), 0) : col.width; // Default width if not specified
                const title = evalExpr(col.title);
                return (
                    <View
                        key={`${title}-${index}`}
                        style={[
                            {
                                borderTopWidth: BORDER_WIDTH,
                                borderBottomWidth: BORDER_WIDTH,
                                borderRightWidth: BORDER_WIDTH,
                                borderColor: colors.vacom.borderColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                            },
                            index === 0 ? { borderLeftWidth: BORDER_WIDTH } : {},
                        ]}
                    >
                        <View style={[
                            {
                                width: width, height: HEADER_HEIGHT,
                                alignSelf: "center", justifyContent: "center"
                            }
                        ]}>
                            <Text variant='titleSmall' style={{ fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
                        </View>
                        {isGroup && (
                            <View style={{ flexDirection: "row", borderTopWidth: BORDER_WIDTH, borderColor: colors.vacom.borderColor }}>
                                {col.children && col.children.map((child, index) => {
                                    const titleChild = evalExpr(child.title);
                                    return (
                                        <View key={child.id} style={{ width: child.width, height: HEADER_HEIGHT, justifyContent: 'center', alignItems: 'center', borderRightWidth: index === indexEnd ? 0 : BORDER_WIDTH, borderColor: colors.vacom.borderColor }}>
                                            <Text variant='titleSmall'>{titleChild}</Text>
                                        </View>)
                                })}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
}