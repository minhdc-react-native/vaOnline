import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import { Pressable, View } from "react-native";
import { customText, useTheme } from "react-native-paper";
const Text = customText<'customVariant'>();
const ROW_HEIGHT = 25;
const BORDER_WIDTH = 0.5;
interface IProgs {
    item: any,
    groupedColumns: IColumnReport[],
    paramSystem: IParamSystem | null,
    onPress?: (item: any) => void,
    currentId?: any | null,
    filter: Record<string, any>
}
export const ReportTableItem = ({ item, groupedColumns, paramSystem, onPress, currentId, filter }: IProgs) => {
    const { colors } = useTheme<VACOMTheme>();
    const isBold = item.BOLD === "C";
    return (
        <Pressable style={{ flexDirection: 'row' }} onPress={() => {
            onPress?.(item);
        }}>
            {groupedColumns.map((col, index) => {
                const indexEnd = col.children ? col.children.length - 1 : 0;
                const isGroup = col.children && col.children.length > 0
                const width = isGroup && col.children ? col.children.reduce((sum, col) => sum + (col.width || 0), 0) : col.width; // Default width if not specified
                let itemValue = col.id ? item[col.id] : "";
                const isNumber = typeof itemValue === 'number';
                const isRed = isNumber && itemValue < 0;
                switch (col.format?.type) {
                    case "number":
                        itemValue = Helper.formatAmount(itemValue, false, paramSystem![col.format?.roundNumber ?? "rAmount"]);
                        break;
                    case "date":
                        itemValue = Helper.isEmpty(itemValue) ? '' : Helper.getFormattedDate(itemValue, "dd/MM/yyyy HH:mm:ss", true);
                        break;
                    default:
                        break;
                }
                return (
                    <View
                        key={`${col.title}-${index}`}
                        style={[
                            {
                                borderTopWidth: BORDER_WIDTH,
                                borderBottomWidth: BORDER_WIDTH,
                                borderRightWidth: BORDER_WIDTH,
                                borderColor: colors.vacom.borderColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: item.idRow === currentId ? colors.elevation.level1 : '#fff',
                            },
                            index === 0 ? { borderLeftWidth: BORDER_WIDTH } : {},
                        ]}
                    >
                        {!col.children && <View style={[
                            {
                                width: width, height: ROW_HEIGHT,
                                alignSelf: "center", justifyContent: "center", paddingHorizontal: 10
                            }
                        ]}>
                            <Text variant='bodySmall' numberOfLines={1} style={[
                                isBold && { fontWeight: "bold" },
                                isNumber && { textAlign: "right" },
                                isRed && { color: colors.primary },
                                col.textStyle
                            ]}>{itemValue}</Text>
                        </View>}
                        {isGroup && (
                            <View style={{ flexDirection: "row", borderTopWidth: BORDER_WIDTH, borderColor: colors.vacom.borderColor }}>
                                {col.children && col.children.map((child, index) => {
                                    let itemValueChild = child.id ? item[child.id] : "";
                                    const isNumberChild = typeof itemValueChild === 'number';
                                    const isRedChild = isNumberChild && itemValueChild < 0;
                                    switch (child.format?.type) {
                                        case "number":
                                            itemValueChild = Helper.formatAmount(itemValueChild, false, paramSystem![child?.format?.roundNumber ?? "rAmount"]);
                                            break;
                                        case "date":
                                            itemValueChild = Helper.isEmpty(itemValueChild) ? '' : Helper.getFormattedDate(itemValueChild, "dd/MM/yyyy HH:mm:ss", true);
                                            break;
                                        default:
                                            break;
                                    }
                                    return (
                                        <View key={child.id} style={{ width: child.width, height: ROW_HEIGHT, justifyContent: 'center', borderRightWidth: index === indexEnd ? 0 : BORDER_WIDTH, borderColor: colors.vacom.borderColor, paddingHorizontal: 10 }}>
                                            <Text variant='bodySmall' numberOfLines={1} style={[
                                                isBold && { fontWeight: "bold" },
                                                isNumberChild && { textAlign: "right" },
                                                isRedChild && { color: colors.primary },
                                                child.textStyle
                                            ]}>{itemValueChild}</Text>
                                        </View>)
                                })}
                            </View>
                        )}
                    </View>
                );
            })}
        </Pressable>
    );
}