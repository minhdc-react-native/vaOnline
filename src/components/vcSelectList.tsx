import { useTranslation } from "@/context/TranslationContext";
import { schemaWin, schemaWinEmpty } from "@/schema";
import { getListItemViewByRefId, ItemViewIdKey, ItemViewValueKey } from "@/schema/voucher/itemView";
import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator, Divider, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useToast } from "./dialog/useToast";
import { useEvalExpr } from "./UIEngine/hooks/useEvalExpr";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
import { IRowsColsField } from "./UIEngine/types";
type IListProps = {
    label?: string;
    placeholder?: string;
    data: IData[];
    value: string | number;
    disabled?: boolean;
    fDisplay?: { fId?: string, fValue?: string, field?: string };
    onChange: (item: IData | null) => void;
    typeDisplay?: 'value' | 'both';
    fId?: string;
    fValue?: string;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
    tableWin?: ITableWin,
    idRef?: string;
    itemView?: IRowsColsField,
    isError?: boolean;
    isNewEdit?: boolean;
    notFistFilter?: boolean;
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
};

const ViewComponent: React.FC<IListProps> = ({
    label, placeholder, data, value, onChange, fDisplay, typeDisplay = "value", disabled = false,
    fId = "id", fValue = "value", clean = true, rightIcon, style, loading, tableWin, isError, isNewEdit = false, notFistFilter = true, checkSelected, idRef, itemView
}) => {
    fId = idRef ? ItemViewIdKey[idRef] ?? fId : fId;
    fValue = idRef ? ItemViewValueKey[idRef] ?? fValue : fValue;
    itemView = idRef ? (getListItemViewByRefId(idRef) ?? itemView) : itemView;

    const colors = useTheme<VACOMTheme>().colors;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const [searchText, setSearchText] = useState('');
    const [itemSelected, setItemSelected] = useState<IData | null>(data.find(item => item[fId] === value) || null);
    const { _ } = useTranslation();
    const filteredList = useMemo(() => {
        if (!searchText) return data;
        const _searchText = Helper.rmTone(searchText).toLowerCase();
        return data.filter(item =>
            Helper.rmTone(item[fId].toString()).toLowerCase().includes(_searchText) ||
            Helper.rmTone(item[fValue]).toLowerCase().includes(_searchText)
        );
    }, [searchText, data, fId, fValue]);

    const openModalSelect = () => {
        if (disabled) return;
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(2);
    }
    const getItemSelected = (item: IData | null) => {
        bottomSheetRef.current?.close();
        onChange(item);
        if (itemSelected?.[fId] !== value) setItemSelected(item);
        // closeModal(() => { });
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

    useEffect(() => {
        if (notFistFilter) return;
        setSearchText(value?.toString());
    }, []);

    return (
        <>
            <Pressable
                style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1, borderColor: isError ? colors.error : colors.vacom.borderColor, backgroundColor: disabled ? colors.elevation.level1 : colors.background }, style]}
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
                            (placeholder || label || `${_('CHON')}...`)
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
                    <HeaderView setSearchText={setSearchText} txtSearch={notFistFilter ? '' : value?.toString()} label={label || placeholder} tableWin={tableWin} closeModal={closeModal} isNewEdit={isNewEdit} />
                    <BottomSheetFlatList
                        data={filteredList}
                        keyExtractor={(item: IData) => item[fId].toString()}
                        showsVerticalScrollIndicator={false}
                        // ListHeaderComponent={<HeaderView setSearchText={setSearchText} label={label || placeholder} table={table} closeModal={closeModal} isNewEdit={isNewEdit} />}
                        renderItem={({ item, index }: { item: IData, index: number }) => <ItemView item={item} onPress={getItemSelected}
                            isSelect={item[fId] === itemSelected?.[fId]} itemView={itemView}
                            tableWin={tableWin} closeModal={closeModal} isNewEdit={isNewEdit} checkSelected={checkSelected} />}
                        ItemSeparatorComponent={() => <Divider />}
                        keyboardShouldPersistTaps="always"
                        ListFooterComponent={() => <View style={{ height: 50 }} />}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={10}
                    />
                </BottomSheet>
            </Portal>
        </>
    );
};
export const VcSelectList = React.memo(ViewComponent);

type IProps = {
    item: IData;
    onPress: (item: IData) => void;
    isSelect?: boolean;
    tableWin?: ITableWin;
    itemView?: IRowsColsField,
    closeModal: (callBack: () => void) => void;
    isNewEdit: boolean;
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
};

const ItemViewComponent: React.FC<IProps> = ({
    item,
    onPress,
    isSelect,
    tableWin,
    itemView,
    closeModal,
    isNewEdit,
    checkSelected,
}) => {
    const { colors } = useTheme();
    const isShowEdit = tableWin !== undefined && isNewEdit;
    const { showToast } = useToast();
    const viewSchema = itemView || (schemaWin[tableWin ?? "Empty"] ?? schemaWinEmpty).config.itemList;

    // Tạo object chỉ chứa các key cần theo dõi
    const watchRequiredValues = useMemo(() => {

        let obj: Record<string, any> = {};
        checkSelected?.requiredKeys.forEach(k => {
            obj[k] = item[k];  // lấy giá trị hiện tại trong data
        });
        return obj;
    }, [JSON.stringify(checkSelected?.requiredKeys.map(k => item[k]))]);

    // eval expression
    const evalExpr = useEvalExpr(watchRequiredValues);

    return (
        <Pressable onPress={() => {
            if (checkSelected) {
                const isError = evalExpr(checkSelected.isError, checkSelected.requiredKeys);
                if (isError) {
                    showToast(checkSelected.message, { type: "warning" });
                    return;
                }
            }
            onPress(item);
        }} style={{
            paddingHorizontal: 10, flexDirection: "row",
            alignItems: tableWin ? "flex-start" : "center", justifyContent: "space-between", backgroundColor: isSelect ? colors.elevation.level1 : "transparent"
        }}>
            <View style={{ paddingVertical: 10, paddingLeft: 10, paddingHorizontal: isShowEdit ? 0 : 10, flex: 1 }}>
                <SchemaUIEngine schema={viewSchema} data={item} />
            </View>
            {isShowEdit && <Pressable style={{ backgroundColor: colors.elevation.level1, borderRadius: 50, marginTop: 5 }} onPress={() => {
                closeModal(() => { });
            }}><IconButton icon={() => <EvilIcons name="pencil" size={24} color={colors.secondary} />} size={20} iconColor={"purple"} style={{ margin: 0 }} /></Pressable>}
        </Pressable>
    );
};
const ItemView = React.memo(ItemViewComponent);

const HeaderView = ({ setSearchText, txtSearch, label, tableWin, closeModal, isNewEdit }: {
    setSearchText: (value: string) => void;
    txtSearch?: string;
    label?: string;
    tableWin?: ITableWin;
    closeModal: (callBack: () => void) => void;
    isNewEdit: boolean
}) => {
    const { _ } = useTranslation();
    label = label || _('CHON')
    const [valueSearch, setValueSerach] = useState(txtSearch);
    const { colors } = useTheme();
    return (
        <View style={{ justifyContent: "center", flexDirection: "row", paddingLeft: 20, paddingRight: 10, gap: 5, alignItems: "center", borderBottomWidth: 0.4, paddingBottom: 10, borderBottomColor: colors.backdrop }}>
            <View style={{ maxWidth: "30%" }}>
                <Text variant="titleSmall" numberOfLines={1} style={{ alignSelf: "center", marginRight: 10 }}>{label}</Text>
            </View>
            <TextInput
                placeholder={_('SEARCH')}
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
                closeModal(() => { });
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