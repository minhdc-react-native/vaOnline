import { schemaItemSearch } from "@/schema";
import { getListItemViewByRefId } from "@/schema/voucher/itemView";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { EvilIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator, Divider, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useToast } from "./dialog/useToast";
import { useEvalExpr } from "./UIEngine/hooks/useEvalExpr";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
import { IRowsColsField } from "./UIEngine/types";

const EmptyView: IRowsColsField = {
    type: "cols",
    fields: [
        {
            type: "text",
            requiredKeys: ["id", "value"],
            label: "{{`${id} - ${value}`}}"
        }
    ]
};
const getUrlReference = (id: string) => `/api/System/GetDataByReferencesId?id=${id}&filtervalue=#filterValue#`
const urlBase: Record<ITableSearch, string> = { // gắn api cho đỡ nhầm...
    CUSTOM: '???',
    DMTHUE: '6bba44d6-6a47-4471-ad98-656ed502fc5a',
    DMQS: '9c19a269-2c63-46df-8912-e4c9569fd46b',
    DMDT: '86de5f41-4277-4a91-bf68-16acc89295c4',
    DMCS: 'a228db46-2754-4fa3-a2b4-6729d3f0c248',
    DMKM: '49e80ac4-2b07-47ef-8297-6efb2074fbdd',
    DMHDG: '67b663cb-d062-4057-83ff-cec81a60a996',
    DMVV: '4fcca1d7-9011-4b4f-b9e8-721a546aa637',
    DMMNGH: '0b22c919-a275-4d05-83bd-c34844d9ec67',
    DMMCN: '0600dd65-9cf4-4fd7-bf43-ff50a5578b42',
    DMTK: '0a93c38b-5f1f-422a-8039-a6cee1967af2',
    DMTTDB: 'ad61024c-69cc-4d3b-9d5e-e5685db5bdce',
    DMDVT: '2beb4691-3bc8-40aa-a5ba-6170fef7a7c4',
    DMKHO: '189d7179-da87-40cc-a5b3-64f52cef8b86',
    DMHV: 'c0c79756-5702-4e39-840e-11c3fa759b81',
    DMLH: '77b75702-c884-4752-bfe5-2170214945ba',
    DMNG: '4f263d9d-a736-447b-a126-e338fc700f5d'
}
interface IProgs {
    tableSearch: ITableSearch,
    idRef?: string;
    itemView?: IRowsColsField,
    label?: string;
    placeholder?: string;
    value: string | number | null;
    fField: string;
    onChange: (item: Record<string, any> | null) => void;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    disabled?: boolean,
    isLoading?: boolean,
    numCharSearch?: number,
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
    isError?: boolean
}
const ViewComponent: React.FC<IProgs> = ({ tableSearch, idRef, label, placeholder, value, fField, onChange, clean = true, rightIcon, style, isLoading, disabled, checkSelected, itemView, numCharSearch = 2, isError }: IProgs) => {
    idRef = idRef || urlBase[tableSearch]
    const url = useMemo(() => {
        return tableSearch === "CUSTOM" ? getUrlReference(idRef ?? '') : getUrlReference(urlBase[tableSearch]);
    }, [idRef, tableSearch]);

    itemView = itemView || (idRef ? (getListItemViewByRefId(idRef) ?? itemView) : itemView);

    const { colors } = useTheme<VACOMTheme>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const [data, setData] = useState<IData[]>([]);
    const [loading, setLoading] = useState(false);
    const _txtSearch = value?.toString() ?? '';
    const [txtSearch, setTxtSearch] = useState(_txtSearch);

    const onDebounceSearch = (value: string) => {
        onSearch(value);
    }
    const onSearch = useCallback((value: string) => {
        if (Helper.isEmpty(value) || value.length < numCharSearch) {
            setData([]);
        } else {
            const urlSearch = url.replace('#filterValue#', encodeURIComponent(value));
            api.get({ link: urlSearch, callBack: (res) => setData(res), setLoading: setLoading })
        }
    }, [numCharSearch, url])

    const debouncedSearch = useMemo(() => debounce(onDebounceSearch, 500), [onSearch])

    const onChangeTextSearch = (value: string) => {
        if (value === txtSearch) return;
        setTxtSearch(value);
        debouncedSearch(value);
    }

    const openModalSelect = () => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(2);
    }
    const getItemSelected = (item: Record<string, any> | null) => {
        bottomSheetRef.current?.close();
        if (item?.[fField] !== value) onChange(item);
        // closeModal(() => { });
    }
    const closeModal = (callBack: () => void) => {
        setTimeout(() => {
            bottomSheetRef.current?.close();
            callBack();
        }, 100); // delay nhẹ
    }
    useEffect(() => {
        if (isNotEmpty(_txtSearch)) {
            onSearch(_txtSearch);
        }
    }, []);
    return (
        <>
            <Pressable
                style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1, borderColor: isError ? colors.error : colors.vacom.borderColor, backgroundColor: disabled ? colors.elevation.level1 : colors.background }, style]}
                onPress={openModalSelect}>
                {isLoading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator
                    size={20}
                    color={colors.backdrop}
                /></View> : <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" numberOfLines={1} style={{ color: (value) ? "#000" : colors.backdrop, paddingLeft: 8 }}>{
                        (value || placeholder || label || "Chọn mã...")
                    }</Text>
                </View>}
                {(value) && clean ? (rightIcon || <Pressable
                    onPress={(event) => {
                        event.stopPropagation(); // Ngăn sự kiện lan lên cha
                        getItemSelected(null);
                    }}
                    style={{ right: -15 }}
                >
                    <IconButton icon="close-circle" size={15} iconColor={colors.primary} />
                </Pressable>) : <EvilIcons name="search" size={24} color={colors.secondary} />}
                {!Helper.isEmpty(value) && label &&
                    <View style={styles.label}>
                        <View style={styles.label}>
                            <Text style={{ color: colors.inverseSurface, fontSize: 12.7 }}>{label}</Text>
                        </View>
                        {!Helper.isEmpty(label) && <Text style={{ color: disabled ? colors.elevation.level1 : colors.background, paddingHorizontal: 4 }}>{label}</Text>}
                        {!Helper.isEmpty(label) && <View style={[styles.line, { borderColor: colors.background }]} />}
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
                    <HeaderView setSearchText={onChangeTextSearch} txtSearch={txtSearch} label={label || placeholder} numCharSearch={numCharSearch} />
                    {loading ? <View style={{ marginVertical: 50 }}><ActivityIndicator
                        size={30}
                        color={colors.primary}

                    /></View> : <BottomSheetFlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item: Record<string, any>) => item.id}
                        renderItem={({ item, index }: { item: IData, index: number }) => <ItemView item={item} onPress={getItemSelected} isSelect={item[fField] === value} tableSearch={tableSearch} checkSelected={checkSelected} itemView={itemView} />}
                        ItemSeparatorComponent={() => <Divider />}
                        ListFooterComponent={() => <View style={{ height: 50 }} />}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={10}
                    />}
                </BottomSheet>
            </Portal>
        </>
    );
}
const VcSearchList = React.memo(ViewComponent);

type IProps = {
    tableSearch: ITableSearch;
    itemView?: IRowsColsField,
    item: Record<string, any>;
    onPress: (item: Record<string, any>) => void;
    isSelect?: boolean;
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
};

const ItemViewComponent: React.FC<IProps> = ({ item, onPress, isSelect, tableSearch, checkSelected, itemView }) => {
    const { showToast } = useToast();

    const viewSchema = itemView || schemaItemSearch[tableSearch] || EmptyView;

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
    const { colors } = useTheme();
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
            flexDirection: "row",
            alignItems: "flex-start", backgroundColor: isSelect ? colors.elevation.level1 : "transparent"
        }}>
            <View style={{ paddingVertical: 10, paddingHorizontal: 20, flex: 1 }}>
                <SchemaUIEngine schema={viewSchema} data={item} />
            </View>
        </Pressable>
    );
};
const ItemView = React.memo(ItemViewComponent);

const HeaderView = ({ setSearchText, txtSearch, label = "Chọn mã", numCharSearch }: {
    setSearchText: (value: string) => void;
    label?: string;
    txtSearch: string;
    numCharSearch: number,
}) => {
    const [valueSearch, setValueSerach] = useState(txtSearch);
    const { colors } = useTheme();
    return (
        <>
            <View style={{ justifyContent: "center", flexDirection: "row", paddingLeft: 20, paddingRight: 10, gap: 5, alignItems: "center", borderBottomWidth: 0.4, paddingBottom: 10, borderBottomColor: colors.backdrop }}>
                <View style={{ maxWidth: "30%" }}>
                    <Text variant="titleSmall" numberOfLines={1} style={{ alignSelf: "center", paddingRight: 10 }}>{label}</Text>
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
                    outlineStyle={{ padding: 0, margin: 0, borderWidth: 0.5, borderRadius: 20, borderColor: colors.secondary }}
                    style={{ flex: 1, height: 40 }}
                />
            </View>
            {(Helper.isEmpty(valueSearch) || valueSearch.length < numCharSearch) && <Text variant="bodySmall" style={{ textAlign: "center", color: colors.secondary, paddingVertical: 10 }}>{`Bạn phải tìm tối thiểu ${numCharSearch} ký tự!`}</Text>}
        </>
    );
};
const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 0.7,
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
export default VcSearchList;