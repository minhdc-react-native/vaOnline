import { useTranslation } from "@/context/TranslationContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { Button, Divider, IconButton, Text, useTheme } from "react-native-paper";
import { StatusBarOnFocus } from "./statusBarOnFocus";
interface IProgs {
    title: string;
    edit?: boolean;
    onPressAction?: () => void,
    onBack: () => void;
    isEdit?: boolean
}
export const VcHeaderWin = ({ title, edit, onPressAction, onBack, isEdit = true }: IProgs) => {
    const { colors } = useTheme();
    const { _ } = useTranslation();
    return (
        <>
            <StatusBarOnFocus backgroundColor={colors.background} />
            <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                backgroundColor: colors.background
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 10 }}>
                    <View style={{
                        flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flex: 1
                    }}>
                        <IconButton icon={() => <MaterialIcons name="keyboard-arrow-left" size={30} color={colors.secondary} />} onPress={onBack} />
                        <Text variant='titleLarge' numberOfLines={1} style={{ flexShrink: 1 }}>{title}</Text>
                    </View>
                    {isEdit && <Button onPress={onPressAction}>{edit ? _('SAVE') : _('EDIT')}</Button>}
                </View>
            </View>
            <Divider />
        </>
    );
}