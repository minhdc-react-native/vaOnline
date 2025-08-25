import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { VcHeaderWin } from "@/components/vcHeaderWin";
import { VcTabBar } from "@/components/vcTabBar";
import { useTranslation } from "@/context/TranslationContext";
import { useWinPage } from "@/hooks/useWinPage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Card, Divider, FAB, IconButton } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { ItemWinList } from "./items/itemWinList";
import { ItemWinListAction } from "./items/itemWinListAction";
import NewEditWinMulti from "./newEditWinMulti";
interface IProgs {
    menu?: {
        windowId: string;
        tableWin: ITableWin;
        id: string;
        title: string;
        actionNewEdit: { new: boolean, edit: boolean }
    }
}
const NewEditWinMaster = ({ menu }: IProgs) => {
    const { windowId, tableWin, id, title } = useLocalSearchParams();
    const titleWin = menu?.title || title?.toString();
    const fixTableWin = menu?.tableWin || tableWin?.toString() as ITableWin;
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { _ } = useTranslation();
    const {
        colors, schemaUI, resetItem, handleAction,
        itemData, dataSource, onChangeItemData, onBack, detail
    } = useWinPage({
        windowId: menu?.windowId || windowId?.toString(),
        tableWin: fixTableWin,
        idItem: menu?.id || id?.toString(), typeWin: "(winMaster)"
    });

    const [showEditMaster, setShowEditMaster] = useState<boolean>(id === undefined && schemaUI.action?.showEditMaster !== false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            resetItem(fixTableWin); // xoá dữ liệu khi không dùng đến...
        });
        return unsubscribe;
    }, [navigation]);

    const actionMap = useMemo(() => {
        return {
            deleteItem: (param?: Record<string, any>) => {
                detail.handleActionDetail.delete(param?.data);
            }
        }
    }, []);
    const onSaveMaster = useCallback((data?: IData) => {
        if (data) {
            onChangeItemData(data);
        }
        setShowEditMaster(false);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <VcHeaderWin edit={true} title={titleWin} onBack={onBack} onPressAction={handleAction.save} />
            <Card mode="contained" style={{ backgroundColor: colors.background, paddingVertical: 10, paddingHorizontal: 20 }}>
                <SchemaUIEngine schema={schemaUI.config.itemShow} data={itemData} dataSource={dataSource} onChangeItemData={onChangeItemData} />
                {schemaUI.action?.showEditMaster !== false && <IconButton mode="contained-tonal" style={{ position: "absolute", bottom: 0, right: -10 }} icon={'pencil'} onPress={() => setShowEditMaster(true)} />}
            </Card>
            <VcTabBar style={{ borderRadius: 0, borderWidth: 0 }} value={detail.currentTab.TAB_TABLE} data={detail.tabs} onPress={(tab: any) => detail.setCurrentTab(tab)} />
            <Divider />
            <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
                <SwipeListView
                    data={detail.dataDetail ?? []}
                    style={{ paddingTop: 5 }}
                    keyExtractor={(item: IData, index) => (item.id ?? '') + index.toString()}
                    renderItem={({ item, index }) => <ItemWinList item={item} schemaView={detail.schemaWinDetail.config.itemList}
                        onLayout={detail.handleLayoutDetail} onPress={(id) => detail.handleActionDetail.select(index)} dataSource={dataSource} isHideIcon={detail.numberActionDetail === 0} />}
                    renderHiddenItem={({ item }) => <ItemWinListAction item={item} actionMap={actionMap}
                        schemaView={detail.schemaWinDetail.config.itemAction} height={detail.rowHeightDetails[item.id ?? '']} />}
                    rightOpenValue={-70 * detail.numberActionDetail}
                    disableLeftSwipe={detail.numberActionDetail === 0}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {(detail.schemaWinDetail.action?.new !== false) && <FAB
                icon="plus"
                style={{
                    // width: 55,
                    // height: 55,
                    // borderRadius: 55,
                    bottom: insets.bottom + 20,
                    right: 20,
                    position: 'absolute',
                }}
                onPress={detail.handleActionDetail.new}
                variant='primary'
            />}
            {detail.showNewEdit && <NewEditWinMulti title={_(detail.currentTab.TAB_NAME)}
                data={detail.itemDetail} schemaUi={detail.schemaWinDetail}
                dataSource={dataSource} onSave={detail.handleActionDetail.update} titleButton="Hoàn thành" />}

            {showEditMaster && <NewEditWinMulti title={titleWin}
                data={itemData ?? null} schemaUi={schemaUI}
                dataSource={dataSource} onSave={onSaveMaster} titleButton="Hoàn thành" />}

        </SafeAreaView>
    )
};
export default NewEditWinMaster;