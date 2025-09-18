import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Linking, Pressable, StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
interface IProg {
    text?: string | null;
    style?: StyleProp<TextStyle>;
    variant?: VariantProp<never>;
    typeLink?: 'tel' | 'mailto' | 'web';
    numberOfLines?: number
}
export const VcTextLink = ({ text, style, variant, typeLink = 'tel', numberOfLines }: IProg) => {
    const { colors } = useTheme();
    const onOpenLink = async () => {
        if (!text) return;
        switch (typeLink) {
            case 'tel':
                await Linking.openURL(`tel:${text?.replace(/\D/g, '')}`); // chỉ giữ lại từ 0-9
                break;
            case 'mailto':
                await Linking.openURL(`mailto:${text}`);
                break;
            default:
                await Linking.openURL(text);
                break;
        }
    }
    return !text ? null : (
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, styles.button]} onPress={() => onOpenLink()}>
            {typeLink === "tel" && <LottieView
                source={require('@/assets/animations/phone-comming.json')}
                autoPlay
                loop
                style={styles.lottie}
            />}
            {typeLink !== "tel" && <MaterialCommunityIcons style={{ paddingRight: 5 }} name={typeLink === "web" ? "web" : "email-arrow-right"} size={20} color={colors.secondary} />}
            <Text numberOfLines={numberOfLines} variant={variant} style={style}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    lottie: {
        width: 40,
        height: 40
    }
});