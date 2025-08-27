import { schemaItemSearch } from "@/schema";
import { VACOMTheme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { EvilIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import debounce from "lodash.debounce";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator, Divider, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { useToast } from "./dialog/useToast";
import { useEvalExpr } from "./UIEngine/hooks/useEvalExpr";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
const urlBase: Record<ITableSearch, string> = { // gắn api cho đỡ nhầm...
    DMMNGH: '/api/System/GetDataByReferencesId?id=0b22c919-a275-4d05-83bd-c34844d9ec67&filtervalue=#filterValue#',
    DMMCN: '/api/System/GetDataByReferencesId?id=0600dd65-9cf4-4fd7-bf43-ff50a5578b42&filtervalue=#filterValue#',
    DMTK: '/api/System/GetDataByReferencesId?id=0a93c38b-5f1f-422a-8039-a6cee1967af2&filtervalue=#filterValue#'
}
interface IProgs {
    tableSearch: ITableSearch,
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
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
}
const VcSearchList = ({ tableSearch, label, placeholder, value, fField, onChange, clean = true, rightIcon, style, isLoading, disabled, checkSelected }: IProgs) => {

    const url = useMemo(() => {
        return urlBase[tableSearch];
    }, [tableSearch]);

    const { colors } = useTheme<VACOMTheme>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const [data, setData] = useState<IData[]>([]);
    const [loading, setLoading] = useState(false);
    const [txtSearch, setTxtSearch] = useState("");

    const onDebounceSearch = (value: string) => {
        onSearch(value);
    }
    const onSearch = useCallback((value: string) => {
        if (Helper.isEmpty(value) || value.length < 3) {
            setData([]);
        } else {
            const urlSearch = url.replace('#filterValue#', value);
            api.get({ link: urlSearch, callBack: (res) => setData(res), setLoading: setLoading })
        }
    }, [])

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
        onChange(item);
        // closeModal(() => { });
    }
    const closeModal = (callBack: () => void) => {
        setTimeout(() => {
            bottomSheetRef.current?.close();
            callBack();
        }, 100); // delay nhẹ
    }

    return (
        <>
            <Pressable
                style={[styles.button, { borderColor: colors.vacom.borderColor, backgroundColor: disabled ? colors.elevation.level1 : colors.background }, style]}
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
                    <HeaderView setSearchText={onChangeTextSearch} label={label || placeholder} />
                    {loading ? <View style={{ marginVertical: 50 }}><ActivityIndicator
                        size={30}
                        color={colors.primary}

                    /></View> : <BottomSheetFlatList
                        data={data}
                        keyExtractor={(item: Record<string, any>) => item.id}
                        renderItem={({ item, index }) => <ItemView item={item} onPress={getItemSelected} isSelect={item[fField] === value} tableSearch={tableSearch} checkSelected={checkSelected} />}
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

type IProps = {
    tableSearch: ITableSearch;
    item: Record<string, any>;
    onPress: (item: Record<string, any>) => void;
    isSelect?: boolean;
    checkSelected?: { isError: string, message: string, requiredKeys: string[] };
};

const ItemViewComponent: React.FC<IProps> = ({ item, onPress, isSelect, tableSearch, checkSelected }) => {
    const { showToast } = useToast();
    const evalExpr = useEvalExpr(item);
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
                <SchemaUIEngine schema={schemaItemSearch[tableSearch]} data={item} />
            </View>
        </Pressable>
    );
};
const ItemView = React.memo(ItemViewComponent);

const HeaderView = ({ setSearchText, label = "Chọn mã" }: {
    setSearchText: (value: string) => void;
    label?: string;
}) => {
    const [valueSearch, setValueSerach] = useState("");
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
            {(Helper.isEmpty(valueSearch) || valueSearch.length < 3) && <Text variant="bodySmall" style={{ textAlign: "center", color: colors.secondary, paddingVertical: 10 }}>Bạn phải tìm tối thiểu 3 ký tự!</Text>}
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