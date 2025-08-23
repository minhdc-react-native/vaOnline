import { schemaWin, schemaWinEmpty } from "@/app/(window)/schema";
import { DataConfigMenu } from "@/constants/vcData";
import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator, Divider, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
interface IProgs {
    label?: string;
    placeholder?: string;
    data: IData[];
    value: string | number;
    disabled?: boolean;
    fDisplay?: { fId: string, fValue: string, field?: string };
    onChange: (item: IData | null) => void;
    typeDisplay?: 'value' | 'both';
    fId?: string;
    fValue?: string;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
    tableWin?: ITableWin,
    isError?: boolean;
    isNewEdit?: boolean
}
const VcSelectList = ({ label, placeholder, data, value, onChange, fDisplay, typeDisplay = "value", disabled = false,
    fId = "id", fValue = "value", clean, rightIcon, style, loading, tableWin, isError, isNewEdit = false }: IProgs) => {
    const colors = useTheme<VACOMTheme>().colors;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const [searchText, setSearchText] = useState('');
    const [itemSelected, setItemSelected] = useState<IData | null>(data.find(item => item[fId] === value) || null);

    const filteredList = useMemo(() => {
        if (!searchText) return data;
        const _searchText = Helper.rmTone(searchText).toLowerCase();
        return data.filter(item =>
            Helper.rmTone(item[fId].toString()).toLowerCase().includes(_searchText) ||
            Helper.rmTone(item[fValue]).toLowerCase().includes(_searchText)
        );
    }, [searchText, data]);

    const openModalSelect = () => {
        if (disabled) return;
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(2);
    }
    const getItemSelected = (item: IData | null) => {
        onChange(item);
        setItemSelected(item);
        closeModal(() => { });
    }
    const closeModal = (callBack: () => void) => {
        setTimeout(() => {
            bottomSheetRef.current?.close();
            callBack();
        }, 100); // delay nhẹ
    }
    useEffect(() => {
        if (value) {
            const selectedItem = data.find(item => item[fId] === value);
            setItemSelected(selectedItem || null);
        } else {
            setItemSelected(null);
        }
    }, [value, data]);
    return (
        <>
            <Pressable
                style={[styles.button, { borderColor: isError ? colors.error : colors.vacom.borderColor, backgroundColor: disabled ? colors.elevation.level1 : colors.background }, style]}
                // pressStyle={{
                //     backgroundColor: colors.background, justifyContent: "space-between", flexDirection: "row", alignItems: "center",
                //     paddingVertical: 10, paddingHorizontal: 20, gap: 10, borderRadius: 6
                // }} 
                onPress={openModalSelect}>
                {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator
                    size={20}
                    color={colors.backdrop}
                /></View> : <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" numberOfLines={1} style={{ color: itemSelected ? "#000" : colors.backdrop, paddingLeft: 8 }}>{
                        itemSelected ? (fDisplay?.field ? (itemSelected[fDisplay.field] ?? '???') : (typeDisplay !== "both" ? (itemSelected[fDisplay?.fValue ||
                            fValue] ?? '???') : "".concat((itemSelected[fDisplay?.fId || fId] ?? '???'), " - ").concat((itemSelected[fDisplay?.fValue || fValue] ?? '???')))) :
                            (placeholder || label || "Chọn...")
                    }</Text>
                </View>}
                {itemSelected && clean && !disabled ? (rightIcon || <Pressable
                    onPress={(event) => {
                        event.stopPropagation(); // Ngăn sự kiện lan lên cha
                        getItemSelected(null);
                    }}
                    style={{ right: -15 }}
                >
                    <IconButton icon="close-circle" size={15} iconColor={colors.primary} />
                </Pressable>) : <FontAwesome name="angle-down" size={20} color={colors.secondary} />}
                {!Helper.isEmpty(value) && label &&
                    <View style={styles.label}>
                        <View style={styles.label}>
                            <Text style={{ color: colors.inverseSurface, fontSize: 12.7 }}>{label}</Text>
                        </View>
                        <Text style={{ color: disabled ? colors.elevation.level1 : colors.background, paddingHorizontal: 4 }}>{label}</Text>
                        <View style={[styles.line, { borderColor: colors.background }]} />
                    </View>
                }
            </Pressable>
            <Portal>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1} // đóng mặc định
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            disappearsOnIndex={-1}     // khi index = -1 (đóng) thì backdrop biến mất
                            appearsOnIndex={0}         // khi index >= 0 thì backdrop hiện ra
                            opacity={0.5}              // độ mờ
                        />
                    )}
                    enableContentPanningGesture={true}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    containerStyle={{ marginTop: 60 }}
                >
                    <HeaderView setSearchText={setSearchText} label={label || placeholder} tableWin={tableWin} closeModal={closeModal} isNewEdit={isNewEdit} />
                    <BottomSheetFlatList
                        data={filteredList}
                        keyExtractor={(item: IData) => item[fId].toString()}
                        // ListHeaderComponent={<HeaderView setSearchText={setSearchText} label={label || placeholder} table={table} closeModal={closeModal} isNewEdit={isNewEdit} />}
                        renderItem={({ item, index }) => <ItemView item={item} onPress={getItemSelected}
                            isSelect={item[fId] === itemSelected?.[fId]} typeDisplay={typeDisplay}
                            fId={fId} fValue={fValue} tableWin={tableWin} closeModal={closeModal} isNewEdit={isNewEdit} fDisplay={fDisplay} />}
                        ItemSeparatorComponent={() => <Divider />}
                        keyboardShouldPersistTaps="always"
                        ListFooterComponent={() => <View style={{ height: 50 }} />}
                    />
                </BottomSheet>
            </Portal>
        </>
    );
}
const ItemView = ({ item, onPress, isSelect, typeDisplay, fDisplay, fId, fValue, tableWin, closeModal, isNewEdit }: {
    item: IData;
    onPress: (item: IData) => void;
    isSelect?: boolean;
    fDisplay?: { fId: string, fValue: string };
    typeDisplay: 'value' | 'both';
    fId: string;
    fValue: string;
    tableWin?: ITableWin;
    closeModal: (callBack: () => void) => void;
    isNewEdit: boolean
}) => {
    const { colors } = useTheme();
    const isShowEdit = tableWin !== undefined && isNewEdit;
    return (
        <Pressable onPress={() => onPress(item)} style={{
            paddingHorizontal: 10, flexDirection: "row",
            alignItems: tableWin ? "flex-start" : "center", justifyContent: "space-between", backgroundColor: isSelect ? colors.elevation.level1 : "transparent"
        }}>
            <View style={{ paddingVertical: 10, paddingLeft: 10, paddingHorizontal: isShowEdit ? 0 : 10 }}>
                <SchemaUIEngine schema={(schemaWin[tableWin ?? "Empty"] ?? schemaWinEmpty).config.itemList} data={item} />
            </View>
            {isShowEdit && <Pressable style={{ backgroundColor: colors.elevation.level1, borderRadius: 50, marginTop: 5 }} onPress={() => {
                closeModal(() => {
                    router.navigate({
                        pathname: "/(window)/newEditModal",
                        params: { menuId: DataConfigMenu[tableWin].id, tableWin: tableWin, id: item.id, title: DataConfigMenu[tableWin].title }
                    });
                });
            }}><IconButton icon={() => <EvilIcons name="pencil" size={24} color={colors.secondary} />} size={20} iconColor={"purple"} style={{ margin: 0 }} /></Pressable>}
        </Pressable>
    );
}

const HeaderView = ({ setSearchText, label = "Chọn", tableWin, closeModal, isNewEdit }: {
    setSearchText: (value: string) => void;
    label?: string;
    tableWin?: ITableWin;
    closeModal: (callBack: () => void) => void;
    isNewEdit: boolean
}) => {
    const [valueSearch, setValueSerach] = useState("");
    const { colors } = useTheme();
    return (
        <View style={{ justifyContent: "center", flexDirection: "row", paddingLeft: 20, paddingRight: 10, gap: 5, alignItems: "center", borderBottomWidth: 0.4, paddingBottom: 10, borderBottomColor: colors.backdrop }}>
            <View style={{ maxWidth: "30%" }}>
                <Text variant="titleSmall" numberOfLines={1} style={{ alignSelf: "center", marginRight: 10 }}>{label}</Text>
            </View>
            <TextInput
                placeholder="Tìm kiếm"
                mode="outlined"
                left={<TextInput.Icon icon={() => <EvilIcons name="search" size={24} color={colors.secondary} />} />}
                right={valueSearch ? <TextInput.Icon icon={"close"} color={colors.primary} onPress={() => {
                    if (!valueSearch) return;
                    setValueSerach("");
                    setSearchText("");
                }} /> : undefined}

                value={valueSearch}
                onChangeText={(value) => {
                    setValueSerach(value);
                    setSearchText(value);
                }}
                outlineStyle={{ padding: 0, margin: 0, borderWidth: 0.5, borderRadius: 20, borderColor: colors.backdrop }}
                style={{ flex: 1, height: 40 }}
            />
            {tableWin && isNewEdit && <IconButton icon={"plus"} style={{ margin: 0 }} iconColor="darkblue" onPress={() => {
                closeModal(() => {
                    router.navigate({
                        pathname: "/(window)/newEditModal",
                        params: { menuId: DataConfigMenu[tableWin].id, tableWin: tableWin, title: DataConfigMenu[tableWin].title }
                    });
                });
            }} />}
        </View>
    );
};
const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 0.5,
        height: 42
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
    }
});
export default VcSelectList;