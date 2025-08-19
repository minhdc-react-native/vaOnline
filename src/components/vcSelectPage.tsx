import { schemaWin, schemaWinEmpty } from "@/app/(window)/schema";
import { DataConfigMenu } from "@/constants/vcData";
import { useWinPage } from "@/hooks/useWinPage";
import { useDataApp } from "@/hooks/zustand/useDataApp";
import { Helper } from "@/utils/Helper";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, Divider, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { SchemaUIEngine } from "./UIEngine/schemaUIEngine";
interface IProgs {
    menuId: string;
    tableWin: ITableWin,
    label?: string;
    placeholder?: string;
    value: string | number | null;
    display: string | number;
    onChange: (item: Record<string, any> | null) => void;
    fId?: string;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    isLoading?: boolean,
    isError?: boolean,
    defaultFilter?: IFilterRows[];
    isNewEdit?: boolean;
    disabled?: boolean
}
const VcSelectPage = ({ menuId, tableWin, label, placeholder, value, display, onChange, fId = "id", clean, rightIcon, style, isLoading, isError, defaultFilter = [], isNewEdit = true, disabled }: IProgs) => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const paramSystem = useDataApp((state) => state.paramSystem);

    const {
        colors,
        params,
        data,
        loading,
        setTextSearch,
        dispatch,
        handleLayout,
        getConfigWin,
        refreshData,
        handleLoadMore,
        handleRefresh
    } = useWinPage({ menuId: menuId, tableWin: tableWin });

    useEffect(() => {
        getConfigWin();
    }, []);

    useEffect(() => {
        refreshData();
    }, [params]);

    const shouldRefresh = useDataApp((state) => state.shouldRefresh);
    const setShouldRefresh = useDataApp((state) => state.setShouldRefresh);
    useEffect(() => {
        if (shouldRefresh && shouldRefresh === tableWin) {
            handleRefresh();
            setShouldRefresh(null);
        }
    }, [shouldRefresh]);

    const openModalSelect = () => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(2);
    }
    const getItemSelected = (item: Record<string, any> | null) => {
        onChange(item);
        closeModal(() => { });
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
                style={[styles.button, { borderColor: isError ? colors.error : colors.vacom.borderColor, backgroundColor: disabled ? colors.elevation.level1 : colors.background }, style]}
                onPress={openModalSelect}>
                {isLoading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator
                    size={20}
                    color={colors.backdrop}
                /></View> : <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" numberOfLines={1} style={{ color: (display || value) ? "#000" : colors.backdrop, paddingLeft: 8 }}>{
                        (display || placeholder || label || "Chọn mã...")
                    }</Text>
                </View>}
                {(display || value) && clean ? (rightIcon || <Pressable
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
                    <HeaderView setSearchText={setTextSearch} label={label || placeholder} tableWin={tableWin} closeModal={closeModal} isNewEdit={isNewEdit} />
                    <BottomSheetFlatList
                        data={data}
                        keyExtractor={(item: Record<string, any>) => item.id}
                        renderItem={({ item, index }) => <ItemView item={item} onPress={getItemSelected} isSelect={item[fId] === value} tableWin={tableWin} closeModal={closeModal} paramSystem={paramSystem} isNewEdit={isNewEdit} />}
                        ItemSeparatorComponent={() => <Divider />}
                        keyboardShouldPersistTaps="always"
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => <View style={{ height: 50 }} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading.refresh}
                                onRefresh={handleRefresh}
                            />
                        }
                    />
                </BottomSheet>
            </Portal>
        </>
    );
}
const ItemView = ({ item, onPress, isSelect, tableWin, closeModal, dataSource, paramSystem, isNewEdit }: {
    tableWin: ITableWin;
    item: Record<string, any>;
    onPress: (item: Record<string, any>) => void;
    isSelect?: boolean;
    closeModal: (callBack: () => void) => void;
    dataSource?: Record<string, any[]>,
    paramSystem: IParamSystem | null;
    isNewEdit: boolean
}) => {
    const { colors } = useTheme();
    const isShowEdit = tableWin !== undefined && isNewEdit;
    return (
        <Pressable onPress={() => onPress(item)} style={{
            flexDirection: "row",
            alignItems: tableWin ? "flex-start" : "center", justifyContent: "space-between", backgroundColor: isSelect ? colors.elevation.level1 : "transparent"
        }}>
            <View style={{ paddingVertical: 10, paddingLeft: isShowEdit ? 20 : 0, paddingHorizontal: isShowEdit ? 0 : 20 }}>
                <SchemaUIEngine schema={(schemaWin[tableWin] ?? schemaWinEmpty).config.itemList} data={item} dataSource={dataSource} />
            </View>
            {isShowEdit && <Pressable style={{ backgroundColor: colors.elevation.level1, borderRadius: 50, marginTop: 5, marginRight: 10 }} onPress={() => {
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

const HeaderView = ({ setSearchText, label = "Chọn mã", tableWin, closeModal, isNewEdit }: {
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
            {tableWin && isNewEdit && <IconButton icon={"plus"} style={{ margin: 0 }} iconColor="darkblue" onPress={() => {
                closeModal(() => {
                    closeModal(() => {
                        router.navigate({
                            pathname: "/(window)/newEditModal",
                            params: { menuId: DataConfigMenu[tableWin].id, tableWin: tableWin, title: DataConfigMenu[tableWin].title }
                        });
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
export default VcSelectPage;