import { VcTabBar } from '@/components/vcTabBar';
import { useWinMulti } from '@/hooks/useWinMulti';
import { VACOMTheme } from '@/theme/theme';
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { Divider, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ItemWinList } from './items/itemWinList';
import { ItemWinListAction } from './items/itemWinListAction';
import NewEditWinMulti from './newEditWinMulti';
import ParamScreen from './paramScreen';
import { IHandleActionConfig } from './schema';
import { layoutHandleAction } from './schema/layoutHandleAction';
import { useActionMap } from './useActionMap';

const TabMultiList = () => {
    const { idMaster, jsonTabs, sDataMaster, sAction, titleWin } = useLocalSearchParams();
    const dataMaster = sDataMaster ? JSON.parse(sDataMaster.toString()) : {};
    const actionNewEdit = JSON.parse(sAction?.toString());
    console.log("vao day>>")
    const insets = useSafeAreaInsets();
    const tabs: ITabWin[] = useMemo(() => {
        return JSON.parse(jsonTabs?.toString() || "[]");
    }, [jsonTabs]);
    const { colors } = useTheme<VACOMTheme>();

    const {
        dataSource, showNewEdit,
        schemaUI, currentTab, setCurrentTab, numberAction, refreshData,
        data, isLoading, handleAction, rowHeights, handleLayout, dataItem
    } = useWinMulti({ tabs, idMaster: idMaster?.toString() || "", dataMaster: dataMaster, actionNewEdit: actionNewEdit });

    const checkLayoutAction = useCallback((actionName: string, callBack: (values: Record<string, any>) => void, data?: Record<string, any>) => {
        if (layoutHandleAction[actionName]) {
            typeParam.current = 'other';
            const action = layoutHandleAction[actionName];
            const layoutAction = typeof action === "function" ? action({ printTemplateId: [] }) : action;
            // lấy giá trị cũ đã lưu trước đó.
            if (data) {
                Object.keys(layoutAction.values).forEach((key) => {
                    if (data[key as keyof typeof data] !== undefined) {
                        layoutAction.values[key as keyof typeof layoutAction.values] = data[key as keyof typeof data] as never;
                    }
                });
            }
            setLayoutAction(layoutAction);
            onConfirm.current = callBack;
        }
    }, [])

    const actionMap = useActionMap({ handleRefresh: refreshData, checkLayoutAction: checkLayoutAction });

    const actionMapAll = useMemo(() => {
        return {
            deleteItem: (param?: Record<string, any>) => {
                handleAction.delete(param?.data?.id);
            },
            ...actionMap,
        }
    }, [handleAction]);

    const [layoutAction, setLayoutAction] = useState<IHandleActionConfig | null>(null);

    const onConfirm = useRef<((values: Record<string, any>) => void) | null>(null);
    const currentValue = useRef<Record<string, any> | null>(null);
    const typeParam = useRef<'filter' | 'other'>('other');
    const [showParam, setShowParam] = useState(false);

    const runActionWithParam = (paramKey?: Record<string, any>, timeItem?: IData | null) => {
        if (paramKey) onConfirm.current?.(paramKey);
        switch (typeParam.current) {
            case 'filter':
                if (paramKey) currentValue.current = { ...paramKey, timeItem: timeItem };
                break;
        }
        setLayoutAction(null);
        setShowParam(false);
    }

    useEffect(() => {
        if (layoutAction) {
            setShowParam(true);
        }
    }, [layoutAction])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <View style={styles.header}>
                <IconButton icon={() => <MaterialIcons name="keyboard-arrow-left" size={30} color={colors.secondary} />} onPress={() => router.back()} />
                <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                    <Text numberOfLines={1} variant='titleLarge'>{titleWin?.toString() || `Chi tiết`}</Text><Text variant='bodySmall' style={{ color: colors.primary }}>{(data[currentTab.code] || []).length}</Text>
                </View>
            </View>
            <VcTabBar style={{ borderRadius: 0, borderWidth: 0 }} value={currentTab?.id as any} data={tabs} onPress={(tab: any) => setCurrentTab(tab)} />
            <Divider />
            <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
                <SwipeListView
                    data={data[currentTab.code] || []}
                    style={{ paddingTop: 5 }}
                    keyExtractor={(item: IData, index) => item.id + index.toString()}
                    renderItem={({ item, index }) => <ItemWinList item={item} schemaView={schemaUI.config.itemList}
                        onLayout={handleLayout} onPress={(id) => handleAction.itemSelect(index)} dataSource={dataSource} isHideIcon={numberAction === 0} />}
                    renderHiddenItem={({ item }) => <ItemWinListAction item={item} actionMap={actionMapAll}
                        schemaView={schemaUI.config.itemAction} height={rowHeights[item.id]} />}
                    rightOpenValue={-70 * numberAction}
                    disableLeftSwipe={numberAction === 0}
                    refreshControl={
                        <RefreshControl
                            key={String(isLoading)}
                            refreshing={isLoading}
                            onRefresh={refreshData}
                        />
                    }
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {(schemaUI.action?.new !== false) && <FAB
                icon="plus"
                style={{
                    // width: 55,
                    // height: 55,
                    // borderRadius: 55,
                    bottom: insets.bottom + 20,
                    right: 20,
                    position: 'absolute',
                }}
                onPress={handleAction.newItem}
                variant='primary'
            />}

            {showParam && layoutAction && <ParamScreen onConfirm={runActionWithParam} schemaConfig={layoutAction}
                paramKey={typeParam.current === 'filter' ? currentValue.current : undefined}
                timeItem={typeParam.current === 'filter' ? currentValue.current?.timeItem : undefined} />}

            {showNewEdit && <NewEditWinMulti title={currentTab.value} data={dataItem} schemaUi={schemaUI} dataSource={dataSource} onSave={handleAction.post} />}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // padding: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingRight: 10
    }
});

export default TabMultiList;
