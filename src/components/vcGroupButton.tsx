import { useDataApp } from "@/hooks/zustand/useDataApp";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import UUID from 'react-native-uuid';
import DashedLine from "./dashedLine";
import ExpandableView from "./expandableView";
import { ICON_REGISTRY } from "./UIEngine/types";

interface IProgsGroupButton {
    title: string;
    data: IMenuWin[];
    onPress: (item: IMenuWin) => void,
    icon?: React.ReactNode;
    expanded?: boolean;
    disabled?: boolean
}
export const VcGroupButton = ({ title, data, onPress, icon, expanded = true, disabled }: IProgsGroupButton) => {
    const { colors } = useTheme();
    const lang = useDataApp((state) => state.lang);
    const rowsMap: any = {};
    const keyMap: any = {};
    data.forEach(item => {
        if (!rowsMap[item.row]) {
            rowsMap[item.row] = [];
        }
        rowsMap[item.row].push(item);
        keyMap[item.row] = UUID.v4();
    });
    // Sắp xếp các row theo số tăng dần
    const sortedRows = Object.keys(rowsMap).sort((a, b) => Number(a) - Number(b));

    return (
        <ExpandableView title={title} defaultExpanded={expanded} icon={icon} disabled={disabled}>
            <View style={styles.container}>
                {sortedRows.map(rowNum => {
                    // Sắp xếp các item trong row theo col
                    const rowItems = rowsMap[rowNum].sort((a: any, b: any) => a.col - b.col);
                    return (
                        <View key={keyMap[rowNum]} style={styles.row}>
                            {rowItems.map((item: IMenuWin, index: number) => {
                                if (item.id.startsWith("LINE-")) return (<DashedLine key={item.id} />);
                                const IconComponent = item.icon ? ICON_REGISTRY[item.icon.type] : null;
                                return (
                                    <ButtonSetting
                                        key={`${item.id}-${index}`}
                                        title={lang === 'vi' ? item.label : item.labelE}
                                        onPress={() => onPress(item)}
                                        left={IconComponent && <IconComponent
                                            name={item.icon?.name as any}
                                            size={item.icon?.size ?? 20}
                                            color={item.icon?.color ?? colors.secondary}
                                        />}
                                    />
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </ExpandableView>
    )
};

interface IProgsButton {
    title: string;
    left?: React.ReactNode;
    onPress: () => void;
    color?: string;
    textStyle?: StyleProp<TextStyle>,
    borderRadius?: number
}
const ButtonSetting = ({ title, onPress, left, color = "black", textStyle, borderRadius }: IProgsButton) => {
    return (
        <View style={{ borderRadius: borderRadius ?? 20, overflow: "hidden", flex: 1 }}>
            <TouchableRipple onPress={onPress} style={{ padding: 5 }}>
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-start", alignItems: "center" }}>
                    {left}
                    <View style={{ flex: 1 }}><Text variant='titleSmall' style={[{ color: color }, textStyle]}>{title}</Text></View>
                </View>
            </TouchableRipple>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 10,
        gap: 10
    },
    row: {
        flexDirection: 'row'
    }
})