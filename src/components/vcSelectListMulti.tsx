import { schemaWin, schemaWinEmpty } from "@/schema";
import { getListItemViewByRefId, ItemViewIdKey, ItemViewValueKey } from "@/schema/voucher/itemView";
import { VACOMTheme } from "@/theme/theme";
import { Helper } from "@/utils/Helper";
import { EvilIcons, FontAwesome6 } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList
} from "@gorhom/bottom-sheet";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import {
    ActivityIndicator,
    Chip,
    Divider,
    IconButton,
    Portal,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
import { IRowsColsField } from "./UIEngine/types";

interface IProgs {
    label?: string;
    placeholder?: string;
    data: IData[];
    value: string; // Ex: "id1,id2"
    fDisplay?: { fId?: string; fValue?: string; field?: string };
    onChange: (value: string) => void;
    typeDisplay?: "value" | "both";
    fId?: string;
    fValue?: string;
    style?: StyleProp<ViewStyle>;
    loading?: boolean;
    tableWin?: ITableWin;
    idRef?: string;
    itemView?: IRowsColsField,
    isError?: boolean;
    isNewEdit?: boolean;
    separator?: string;
    disabled?: boolean;
}

const VcSelectListMulti = ({
    label,
    placeholder,
    data,
    value,
    onChange,
    fDisplay,
    typeDisplay = "value",
    fId,
    fValue,
    style,
    loading,
    tableWin,
    isError,
    isNewEdit = false,
    separator = ",",
    disabled,
    idRef,
    itemView
}: IProgs) => {
    const colors = useTheme<VACOMTheme>().colors;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "70%", "90%"], []);
    const [searchText, setSearchText] = useState("");
    const [itemSelected, setItemSelected] = useState<IData[]>([]);

    fId = fId || (idRef ? ItemViewIdKey[idRef] ?? fId : fId) || 'id';
    fValue = fValue || (idRef ? ItemViewValueKey[idRef] ?? fValue : fValue) || 'value';

    const selectedSet = useMemo(
        () => new Set(itemSelected.map((i) => i[fId].toString())),
        [itemSelected, fId]
    );

    const debouncedSearch = useMemo(
        () =>
            debounce((txt: string) => {
                setSearchText(txt);
            }, 300),
        []
    );

    const filteredList = useMemo(() => {
        if (!searchText) return data;
        const _searchText = Helper.rmTone(searchText).toLowerCase();
        return data.filter(
            (item) =>
                Helper.rmTone(item[fId].toString()).toLowerCase().includes(_searchText) ||
                Helper.rmTone(item[fValue]).toLowerCase().includes(_searchText)
        );
    }, [searchText, data, fId, fValue]);

    const openModalSelect = () => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(2);
    };

    itemView = useMemo(() => {
        return itemView || (idRef ? (getListItemViewByRefId(idRef) ?? itemView) : itemView);
    }, [idRef, itemView]);

    const addItemSelected = (item: IData) => {
        const exist = itemSelected.find((i) => i[fId] === item[fId]);
        if (!exist) {
            const updated = [...itemSelected, item];
            setItemSelected(updated);
            onChange(updated.map((i) => i[fId]).join(separator));
        } else {
            removeItemSelected(exist.id);
        }
        // closeModal(() => { });
    };

    const removeItemSelected = (itemId: string | number) => {
        const updated = itemSelected.filter((i) => i[fId] !== itemId);
        setItemSelected(updated);
        onChange(updated.map((i) => i[fId]).join(separator));
    };

    const closeModal = (callBack: () => void) => {
        setTimeout(() => {
            bottomSheetRef.current?.close();
            callBack();
        }, 100);
    };

    useEffect(() => {
        const ids = value ? value.split(separator) : [];
        const selectedItems = data.filter((item) =>
            ids.includes(item[fId].toString())
        );
        const existingIdsSet = new Set(data.map((item) => item[fId].toString()));
        const notFoundIds = ids.filter(id => !existingIdsSet.has(id));
        const itemsNotFound = notFoundIds.map((id) => { return { id: id, value: "???" } });
        setItemSelected([...selectedItems, ...itemsNotFound]);
    }, [value, data]);
    return (
        <>
            <View
                style={[
                    styles.button,
                    {
                        borderColor: isError ? colors.error : colors.vacom.borderColor,
                        backgroundColor: colors.background
                    },
                    style
                ]}
            >
                {loading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={20} color={colors.backdrop} />
                    </View>
                ) : (
                    <View style={{ flex: 1, paddingVertical: 5 }}>
                        {itemSelected.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {itemSelected.map((item) => (
                                    <Chip
                                        key={item[fId].toString()}
                                        onClose={() => removeItemSelected(item[fId])}
                                        style={{ marginRight: 6, backgroundColor: colors.elevation.level1, borderColor: colors.elevation.level3 }}
                                    >
                                        <Text variant="bodySmall">{fDisplay?.field
                                            ? (item[fDisplay.field] ?? '???')
                                            : typeDisplay !== "both"
                                                ? item[fDisplay?.fValue || fValue] ?? '???'
                                                : `${item[fDisplay?.fId || fId]} - ${item[fDisplay?.fValue || fValue] ?? '???'
                                                }`}</Text>
                                    </Chip>
                                ))}
                            </ScrollView>
                        ) : (
                            <Text
                                variant="bodyLarge"
                                numberOfLines={1}
                                style={{ color: colors.backdrop, paddingLeft: 8 }}
                            >
                                {placeholder || label || "Chọn..."}
                            </Text>
                        )}
                    </View>
                )}
                <IconButton icon={() => <FontAwesome6 name="list-check" size={20} color={colors.secondary} />} onPress={openModalSelect} />
            </View>

            <Portal>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            disappearsOnIndex={-1}
                            appearsOnIndex={0}
                            opacity={0.5}
                        />
                    )}
                    enableContentPanningGesture
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    containerStyle={{ marginTop: 60 }}
                >
                    <HeaderView
                        setSearchText={debouncedSearch}
                        label={label || placeholder}
                        tableWin={tableWin}
                        closeModal={closeModal}
                        isNewEdit={isNewEdit}
                    />
                    <BottomSheetFlatList
                        data={filteredList}
                        keyExtractor={(item: IData) => item[fId].toString()}
                        renderItem={({ item }: { item: IData }) => (
                            <ItemView
                                item={item}
                                onPress={addItemSelected}
                                isSelect={selectedSet.has(item[fId].toString())}
                                tableWin={tableWin}
                                itemView={itemView}
                                closeModal={closeModal}
                                isNewEdit={isNewEdit}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
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


type IProps = {
    item: IData;
    onPress: (item: IData) => void;
    isSelect?: boolean;
    tableWin?: ITableWin;
    itemView?: IRowsColsField,
    closeModal: (cb: () => void) => void;
    isNewEdit: boolean;
};

const ItemViewComponent: React.FC<IProps> = ({
    item,
    onPress,
    isSelect,
    tableWin,
    closeModal,
    isNewEdit,
    itemView
}) => {
    const { colors } = useTheme();
    const isShowEdit = tableWin !== undefined && isNewEdit;
    return (
        <Pressable
            onPress={() => onPress(item)}
            style={{
                paddingHorizontal: 10,
                flexDirection: "row",
                alignItems: tableWin ? "flex-start" : "center",
                justifyContent: "space-between",
                backgroundColor: isSelect ? colors.elevation.level1 : "transparent"
            }}
        >
            <View
                style={{
                    paddingVertical: 10,
                    paddingLeft: 10,
                    paddingHorizontal: isShowEdit ? 0 : 10
                }}
            >
                <SchemaUIEngine
                    schema={itemView || (schemaWin[tableWin ?? "Empty"] ?? schemaWinEmpty).config.itemList}
                    data={item}
                />
            </View>
            {isShowEdit && (
                <Pressable
                    style={{
                        backgroundColor: colors.elevation.level1,
                        borderRadius: 50,
                        marginTop: 5
                    }}
                    onPress={() => {
                        closeModal(() => { });
                    }}
                >
                    <IconButton
                        icon={() => (
                            <EvilIcons name="pencil" size={24} color={colors.secondary} />
                        )}
                        size={20}
                        iconColor={"purple"}
                        style={{ margin: 0 }}
                    />
                </Pressable>
            )}
        </Pressable>
    );
};
const ItemView = React.memo(ItemViewComponent);

const HeaderView = ({
    setSearchText,
    label = "Chọn mã",
    tableWin,
    closeModal,
    isNewEdit
}: {
    setSearchText: (value: string) => void;
    label?: string;
    tableWin?: ITableWin;
    closeModal: (callBack: () => void) => void;
    isNewEdit: boolean;
}) => {
    const [valueSearch, setValueSearch] = useState("");
    const { colors } = useTheme();
    return (
        <View
            style={{
                justifyContent: "center",
                flexDirection: "row",
                paddingLeft: 20,
                paddingRight: 10,
                gap: 5,
                alignItems: "center",
                borderBottomWidth: 0.4,
                paddingBottom: 10,
                borderBottomColor: colors.backdrop
            }}
        >
            <View style={{ maxWidth: "30%" }}>
                <Text variant="titleSmall" numberOfLines={1} style={{ alignSelf: "center", marginRight: 10 }}>
                    {label}
                </Text>
            </View>
            <TextInput
                placeholder="Tìm kiếm"
                mode="outlined"
                left={<TextInput.Icon icon={() => <EvilIcons name="search" size={24} color={colors.secondary} />} />}
                right={
                    valueSearch ? (
                        <TextInput.Icon
                            icon={"close"}
                            color={colors.primary}
                            onPress={() => {
                                setValueSearch("");
                                setSearchText("");
                            }}
                        />
                    ) : undefined
                }
                value={valueSearch}
                onChangeText={(value) => {
                    setValueSearch(value);
                    setSearchText(value);
                }}
                outlineStyle={{
                    padding: 0,
                    margin: 0,
                    borderWidth: 0.5,
                    borderRadius: 20,
                    borderColor: colors.backdrop
                }}
                style={{ flex: 1, height: 40 }}
            />
            {tableWin && isNewEdit && (
                <IconButton
                    icon={"plus"}
                    style={{ margin: 0 }}
                    iconColor="darkblue"
                    onPress={() => {
                        closeModal(() => { });
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
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

export default VcSelectListMulti;
