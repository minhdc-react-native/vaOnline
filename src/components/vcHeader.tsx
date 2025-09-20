import { Helper } from "@/utils/Helper";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import debounce from "lodash.debounce";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Chip, Divider, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { StatusBarOnFocus } from "./statusBarOnFocus";
interface IProgs {
    onSearch?: (textSearch: string) => void,
    onFilter?: () => void,
    title?: string;
    numRow?: number;
    placeholder?: string;
    titleView?: React.ReactNode;
    backgroundColor?: string;
    onPress?: () => void;
    leftIcon?: React.ReactNode;
    showSearch?: boolean;
    showFilter?: boolean;
    valuesTypeFilter?: Record<string, { columnType: 'string' | 'date' | 'decimal' }>;
    valuesFilter?: Record<string, any>;
    valueDisplay?: Record<string, string>;
    valueIgnoreFilter?: string[];
    hideFilter?: string[];
    onCleanFilterValue?: (columnName: string) => void;
    isFastView?: boolean;
}
export const VcHeader = ({ title, numRow, placeholder, titleView, backgroundColor, onPress, onSearch, onFilter,
    leftIcon, showSearch, isFastView,
    showFilter, valuesTypeFilter = {}, valuesFilter, onCleanFilterValue, valueDisplay = {}, valueIgnoreFilter = [], hideFilter = [] }: IProgs) => {
    const { colors } = useTheme();
    const [isSearch, setIsSearch] = useState(false);
    const [txtSearch, setTxtSearch] = useState("");

    const onDebounceSearch = (value: string) => {
        onSearch?.(value);
    }
    const debouncedSearch = useMemo(() => debounce(onDebounceSearch, 500), [onSearch])

    const onChangeTextSearch = (value: string) => {
        if (value === txtSearch) return;
        setTxtSearch(value);
        debouncedSearch(value);
    }

    const onLeftIconPress = () => {
        if (onPress) {
            onPress();
            return;
        }
        router.back();
    }
    const arrFilterValues = useMemo(() => {
        return Object.entries(valuesFilter ?? {}).filter(([field, value]) => !Helper.isEmpty(value) && valueIgnoreFilter.indexOf(field) < 0 && hideFilter.indexOf(field) < 0);
    }, [valuesFilter]);

    return (
        <>
            <StatusBarOnFocus backgroundColor={backgroundColor ?? colors.background} />
            {!isFastView && <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                backgroundColor: backgroundColor ?? colors.background
            }}>
                {isSearch ?
                    <TextInput
                        left={<TextInput.Icon icon={"close"} color={colors.primary} onPress={() => {
                            setIsSearch(false);
                            onChangeTextSearch("");
                        }} />}
                        value={txtSearch}
                        onChangeText={(value) => onChangeTextSearch(value)}
                        mode="outlined"
                        placeholder={placeholder || "Tìm kiếm"}
                        style={{ height: 65, flex: 1 }}
                        outlineStyle={{ borderWidth: 0 }}
                    /> :
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: onSearch ? 10 : 0, flex: 1 }}>
                        <View style={{
                            flexDirection: "row", alignItems: "center", flex: 1
                        }}>
                            {leftIcon || <IconButton icon={() => <MaterialIcons name="keyboard-arrow-left" size={30} color={colors.secondary} />} onPress={onLeftIconPress} />}
                            {titleView || <>
                                <Text variant='titleLarge' numberOfLines={1} style={{ flexShrink: 1, paddingRight: 10 }}>{title}</Text>
                                <Text variant="bodySmall" style={{ color: colors.primary }}>{numRow ? numRow : ''}</Text>
                            </>}
                        </View>
                        {onSearch && showSearch && <IconButton icon={() => <Feather name="search" size={24} color={colors.secondary} />} onPress={() => setIsSearch(true)} />}
                        {onFilter && showFilter && <IconButton icon={'filter-outline'} onPress={onFilter} iconColor={'darkgreen'} />}
                    </View>}
            </View>}
            {!isFastView && <Divider />}
            {(arrFilterValues.length > 0 || isFastView) &&
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, height: 50, padding: 10 }}>
                    {isFastView && onFilter && showFilter && <IconButton icon={() => <AntDesign name="filter" size={24} color={colors.secondary} />} onPress={onFilter} />}
                    {isFastView && <Text variant="bodySmall" style={{ color: colors.primary, marginRight: 10 }}>{numRow ? numRow : ''}</Text>}
                    <View style={{ flex: 1 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {arrFilterValues.map(([columnName, value]) => (
                                <Chip
                                    key={columnName.toString()}
                                    onClose={() => onCleanFilterValue?.(columnName)}
                                    style={{ marginRight: 6, backgroundColor: colors.elevation.level1, borderColor: colors.elevation.level3 }}
                                >
                                    <Text variant="bodySmall">{valuesFilter && valueDisplay[columnName] ? valuesFilter[valueDisplay[columnName]] :
                                        (valuesTypeFilter[columnName]?.columnType === "date" ? Helper.getFormattedDate(value, "dd/MM/yyyy HH:mm:ss", true) : value)}</Text>
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>
                    <Divider />
                </View>}
        </>
    );
}