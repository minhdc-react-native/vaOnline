import LoadingScreen from "@/components/loadingScreen";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { VcHeaderWin } from "@/components/vcHeaderWin";
import { VcTabBar } from "@/components/vcTabBar";
import { useTranslation } from "@/context/TranslationContext";
import { useVoucher } from "@/hooks/useVoucher";
import { useWinPage } from "@/hooks/useWinPage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Card, Divider, FAB, IconButton } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { ItemWinList } from "./items/itemWinList";
import { ItemWinListAction } from "./items/itemWinListAction";
import { NewEditWinMulti } from "./newEditWinMulti";
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
    const { sItemMenuWin, id, title } = useLocalSearchParams();
    const titleWin = menu?.title || title?.toString();
    const itemMenuWin: IMenuWin = JSON.parse(sItemMenuWin.toString());
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { _ } = useTranslation();
    const {
        colors, schemaUI, resetItem, handleAction,
        itemData, dataSource, onChangeItemData, onBack, detail
    } = useWinPage({
        itemMenuWin: itemMenuWin
    });
    const [showEditMaster, setShowEditMaster] = useState<boolean>(id === undefined && schemaUI.action?.showEditMaster !== false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            resetItem(itemMenuWin.tableWin); // xoá dữ liệu khi không dùng đến...
        });
        return unsubscribe;
    }, [itemMenuWin.tableWin, navigation, resetItem]);

    const actionMap = useMemo(() => {
        return {
            deleteItem: (param?: Record<string, any>) => {
                detail.handleActionDetail.delete(param?.data);
            }
        }
    }, [detail.handleActionDetail]);

    const onSaveMaster = useCallback((data?: IData) => {
        if (data) {
            onChangeItemData(data);
        }
        setShowEditMaster(false);
    }, [onChangeItemData]);

    useEffect(() => {
        detail.loadDetail(id?.toString());
    }, []);

    const { changeOther } = useVoucher(itemMenuWin.tableWin, itemMenuWin.defaultValue?.MA_CT, detail.currentTab);
    useEffect(() => {
        if (detail.changeOtherDetail.current === true) {
            changeOther();
            detail.changeOtherDetail.current = false;
        }
    }, [changeOther, detail.changeOtherDetail, detail.dataDetail]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <VcHeaderWin edit={true} title={titleWin} onBack={onBack} onPressAction={handleAction.save} />
            <Card mode="contained" style={{ backgroundColor: colors.background, paddingVertical: 10, paddingHorizontal: 20 }}>
                <SchemaUIEngine schema={schemaUI.config.itemShow} data={itemData} dataSource={dataSource} onChangeItemData={onChangeItemData} />
                {schemaUI.action?.showEditMaster !== false && <IconButton style={{ position: "absolute", bottom: -15, right: -10, backgroundColor: colors.backdrop }} icon={'pencil'} iconColor={colors.background} onPress={() => setShowEditMaster(true)} />}
            </Card>
            {detail.tabs.length > 0 && <VcTabBar style={{ borderRadius: 0, borderWidth: 0 }} value={detail.currentTab?.id ?? ''} data={detail.tabs} onPress={(tab: any) => detail.setCurrentTab(tab)} />}
            <Divider />
            <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
                {detail.loadingDetail ? <LoadingScreen /> : <SwipeListView
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
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                />}
            </View>
            {(detail.schemaWinDetail.action?.new !== false) && <FAB
                icon="plus"
                style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55,
                    bottom: insets.bottom + 20,
                    right: 20,
                    position: 'absolute',
                }}
                onPress={detail.handleActionDetail.new}
                variant='primary'
            />}
            {detail.showNewEdit && <NewEditWinMulti title={_(detail.currentTab?.TAB_NAME)}
                data={detail.itemDetail} schemaUi={detail.schemaWinDetail} changeOtherDetail={detail.changeOtherDetail}
                tableWin={itemMenuWin.tableWin} voucherCode={itemMenuWin.defaultValue?.MA_CT} currentTab={detail.currentTab}
                dataSource={dataSource} onSave={detail.handleActionDetail.update} titleButton={_('COMPLETE')} />}

            {showEditMaster && <NewEditWinMulti title={titleWin}
                tableWin={itemMenuWin.tableWin} data={itemData ?? null} schemaUi={schemaUI}
                dataSource={dataSource} onSave={onSaveMaster} titleButton={_('COMPLETE')} />}

        </SafeAreaView>
    )
};
export default NewEditWinMaster;
