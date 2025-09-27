import LoadingScreen from "@/components/loadingScreen";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { VcButtonScanner } from "@/components/vcButtonScanner";
import VcCheckBox from "@/components/vcCheckbox";
import { VcHeaderWin } from "@/components/vcHeaderWin";
import VcSearchList from "@/components/vcSearchList";
import { VcTabBar } from "@/components/vcTabBar";
import { useTranslation } from "@/context/TranslationContext";
import { useVoucher } from "@/hooks/useVoucher";
import { useWinPage } from "@/hooks/useWinPage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Appbar, Divider, FAB, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    const { sItemMenuWin, id, title, isEdit } = useLocalSearchParams();
    const titleWin = menu?.title || title?.toString();
    const itemMenuWin: IMenuWin = JSON.parse(sItemMenuWin.toString());
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { _ } = useTranslation();
    const {
        colors, schemaUI, resetItem, handleAction, setIsChange, configExpression,
        itemData, dataSource, onChangeItemData, onBack, detail, getDataById, resetTableWin, isLangVi
    } = useWinPage({
        itemMenuWin: itemMenuWin
    });

    const [showEditMaster, setShowEditMaster] = useState<boolean>(id === undefined && schemaUI.action?.showEditMaster !== false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            resetItem(itemMenuWin.tableWin); // xoá dữ liệu khi không dùng đến...
            if (!!isEdit) {
                resetTableWin(itemMenuWin.tableWin);
            }
        });
        return unsubscribe;
    }, [isEdit, itemMenuWin.tableWin, navigation, resetItem, resetTableWin]);

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
        const getData = async () => {
            if (!!isEdit) {
                await getDataById(id?.toString());
            } else {
                detail.loadDetail(id?.toString());
            }
        }
        getData();
    }, []);

    useEffect(() => {
        if (!!isEdit && itemData && detail.loadingDetail) {
            detail.loadDetail(id?.toString());
        }
    }, [itemData]);

    useEffect(() => {
        if (!!isEdit && !detail.currentTab) {
            detail.setCurrentTab(detail.tabs[0]);
        }
    }, [detail, isEdit]);

    const { showToast, changeOther, onScanned } = useVoucher(itemMenuWin.tableWin, itemMenuWin.defaultValue?.MA_CT, detail.currentTab, undefined, detail.handleActionDetail.new);

    useEffect(() => {
        if (detail.changeOtherDetail.current === true) {
            changeOther();
            detail.changeOtherDetail.current = false;
        }
    }, [changeOther, detail.changeOtherDetail, detail.dataDetail]);
    const [MA_KHO, setMA_KHO] = useState('');
    const [groupCode, setGroupCode] = useState(true);

    const onScanBarCode = useCallback((value: string, quantity?: number | null) => {
        if (!isNotEmpty(MA_KHO)) {
            showToast(isLangVi ? 'Bạn cần nhập mã kho trước!' : 'You need to enter the warehouse code first!', { type: "warning" });
            return;
        }
        onScanned(value, quantity ?? 1, MA_KHO, groupCode, () => {
            detail.changeOtherDetail.current = true;
            setIsChange(true)
        });
    }, [MA_KHO, detail.changeOtherDetail, groupCode, onScanned, setIsChange, showToast]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout, marginBottom: insets.bottom }}>
            {(!itemData || detail.loadingDetail) ? <LoadingScreen style={{ marginTop: 100 }} /> : <>
                <Appbar.Header>
                    <VcHeaderWin edit={true} title={titleWin} onBack={onBack} onPressAction={handleAction.save} />
                </Appbar.Header>
                <Divider />
                <View style={{ backgroundColor: colors.background, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 0 }}>
                    <SchemaUIEngine schema={schemaUI.config.itemShow} data={itemData} configExpression={configExpression} dataSource={dataSource} onChangeItemData={onChangeItemData} />
                    {schemaUI.action?.showEditMaster !== false && <IconButton style={{ position: "absolute", bottom: 0, right: 10, backgroundColor: colors.backdrop }} icon={'pencil'} iconColor={colors.background} onPress={() => setShowEditMaster(true)} />}
                </View>
                {detail.tabs.length > 0 && <VcTabBar style={{ borderRadius: 0, borderWidth: 0 }} value={detail.currentTab?.id ?? ''} data={detail.tabs} onPress={(tab: any) => detail.setCurrentTab(tab)} />}
                {/* <Divider /> */}
                {detail.currentTab?.TAB_TABLE === "CTHV" &&
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, backgroundColor: colors.background }}>
                            <VcCheckBox label={_('GOP_MA')} type="switch" value={groupCode} onChange={(value) => setGroupCode(typeof value === "boolean" ? value : value === "C")} />
                            <VcSearchList style={{ flex: 1, height: 35 }} placeholder={_('MA_KHO')}
                                checkSelected={{ isError: "{{BOLD==='C'}}", message: "Bạn phải chọn kho chi tiết", requiredKeys: ["BOLD"] }}
                                tableSearch="DMKHO" fField="MA_KHO" value={MA_KHO} onChange={(item) => setMA_KHO(item?.id)} />
                            <VcButtonScanner onScanned={onScanBarCode} />
                        </View>
                        <Divider />
                    </>
                }
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
                        width: 55,
                        height: 55,
                        borderRadius: 55,
                        bottom: 20,
                        right: 20,
                        position: 'absolute',
                    }}
                    onPress={detail.handleActionDetail.new}
                    variant='primary'
                />}
                {detail.showNewEdit && <NewEditWinMulti title={_(detail.currentTab?.TAB_NAME)}
                    refreshSourceDvtCb={detail.refreshSourceDvtCb} configExpression={detail.configExpression}
                    data={detail.itemDetail} schemaUi={detail.schemaWinDetail} changeOtherDetail={detail.changeOtherDetail}
                    tableWin={itemMenuWin.tableWin} voucherCode={itemMenuWin.defaultValue?.MA_CT} currentTab={detail.currentTab}
                    dataSource={dataSource} onSave={detail.handleActionDetail.update} titleButton={_('COMPLETE')} />}

                {showEditMaster && <NewEditWinMulti title={titleWin} configExpression={configExpression}
                    tableWin={itemMenuWin.tableWin} data={itemData ?? null} schemaUi={schemaUI}
                    dataSource={dataSource} onSave={onSaveMaster} titleButton={_('COMPLETE')} />}
            </>}
        </View>
    )
};
export default NewEditWinMaster;
