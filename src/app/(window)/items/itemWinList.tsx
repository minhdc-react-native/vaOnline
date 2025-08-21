import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { IRowsColsField } from "@/components/UIEngine/types";
import { theme } from "@/theme/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from "react-native";
interface IProps {
    schemaView: IRowsColsField,
    item: IData,
    onLayout?: (id: string, e: LayoutChangeEvent) => void,
    onPress?: (item: IData) => void,
    dataSource?: Record<string, any[]>,
    isHideIcon?: boolean
}
export const ItemWinList = ({ schemaView, item, onLayout, onPress, dataSource, isHideIcon }: IProps) => {
    return (
        <View
            onLayout={(e) => onLayout?.(item.id?.toString(), e)}
            style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                overflow: 'hidden',
                paddingHorizontal: 10,
                marginHorizontal: 10,
                marginVertical: 5
            }}>
            <TouchableOpacity onPress={() => onPress?.(item)}>
                <View style={styles.container}>
                    <View style={{ paddingVertical: 10, paddingHorizontal: 10, flex: 1 }}>
                        <SchemaUIEngine schema={schemaView} data={item} dataSource={dataSource} />
                    </View>
                    {!isHideIcon && <MaterialIcons name="keyboard-double-arrow-left" size={24} color={theme.colors.backdrop} />}
                </View>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 10
    }
});