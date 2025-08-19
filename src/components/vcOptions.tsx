import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import VcCheckBox from "./vcCheckbox";
interface IOption {
    id: string | number,
    value: string
}
interface IProgs {
    data: IOption[],
    label?: string;
    value: string | number,
    onChange: (value: string | number) => void;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean
}
export const VcOptions = ({ label, data, value, onChange, textStyle, disabled }: IProgs) => {
    const { colors } = useTheme<VACOMTheme>();
    return (
        <View style={{ marginTop: 6, gap: 10, paddingHorizontal: 10, paddingTop: label ? 20 : 10, paddingBottom: 10, backgroundColor: disabled ? colors.elevation.level1 : colors.background, borderWidth: 0.5, borderColor: colors.vacom.borderColor, borderRadius: 6 }}>
            {data.map((item) => {
                return (
                    <VcCheckBox key={`option-${item.id}`} align="right" style={{ justifyContent: "flex-start", gap: 10 }} isOptionIcon={true}
                        value={item.id === value} label={item.value} onChange={(checked) => onChange(item.id)} />
                )
            })}
            {!Helper.isEmpty(label) && <View style={styles.label}>
                <View style={styles.label}>
                    <Text style={{ color: colors.inverseSurface, fontSize: 12.7 }}>{label}</Text>
                </View>
                <Text style={{ color: colors.background, paddingHorizontal: 4 }}>{label}</Text>
                <View style={[styles.line, { borderColor: colors.background }]} />
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    line: {
        position: "absolute",
        width: "100%",
        borderWidth: 1,
        top: 3,
        left: 2,
        zIndex: 1
    },
    label: {
        position: "absolute",
        fontSize: 12,
        top: -4,
        left: 8,
        zIndex: 2
    },
});