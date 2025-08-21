import { VcHeader } from "@/components/vcHeader";
import { useWinPage } from "@/hooks/useWinPage";
import { useDataApp } from "@/hooks/zustand/useDataApp";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, View } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { ItemWinList } from "./items/itemWinList";
import { ItemWinListAction } from "./items/itemWinListAction";
import ParamScreen from "./paramScreen";
import { IHandleActionConfig } from "./schema";
import { layoutHandleAction } from "./schema/layoutHandleAction";
import { useActionMap } from "./useActionMap";
interface IProgs {
    menuWin0?: IMenuWin;
}
const WindowScreen = ({ menuWin0 }: IProgs) => {
    const { menuWin } = useLocalSearchParams();
    const itemMenuWin: IMenuWin = menuWin0 || JSON.parse(menuWin.toString());
    const insets = useSafeAreaInsets();
    const {
        colors,
        tableWin,
        schemaUI,
        numberAction,
        params,
        loading,
        data,
        infoData,
        handleAction,
        rowHeights,
        dataSource,
        showFilter,
        voucherTemplates,
        permissions,
        resetSource,
        setFilterRows,
        setTextSearch,
        handleLayout,
        getConfigWin,
        refreshData,
        handleLoadMore,
        handleRefresh
    } = useWinPage({ menuId: itemMenuWin.id, tableWin: itemMenuWin.tableWin, typeWin: itemMenuWin.typeWin });

    const renderFooter = useCallback(() => {
        if (!loading.loadMore || loading.refresh) return <View style={{ height: 100 }} />
        return (
            <ActivityIndicator
                size='large'
                style={{ margin: 10 }}
            />
        )
    }, [loading]);

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

    const ViewMap = useMemo(() => {
        return !menuWin0 ? SafeAreaView : View;
    }, []);

    const checkLayoutAction = useCallback((actionName: string, callBack: (values: Record<string, any>) => void, data?: Record<string, any>) => {
        if (layoutHandleAction[actionName]) {
            typeParam.current = 'other';
            const action = layoutHandleAction[actionName];
            const layoutAction = typeof action === "function" ? action({ printTemplateId: voucherTemplates ?? [] }) : action;
            const valueMap = layoutAction.valueMap || {};
            // lấy giá trị cũ đã lưu trước đó.
            if (data) {
                Object.keys(layoutAction.values).forEach((key) => {
                    const fixKey = valueMap[key] || key;
                    if (data[fixKey as keyof typeof data] !== undefined) {
                        layoutAction.values[key as keyof typeof layoutAction.values] = data[fixKey as keyof typeof data] as never;
                    }
                });
            }
            setLayoutAction(layoutAction);
            onConfirm.current = callBack;
        }
    }, [voucherTemplates])

    const actionMap = useActionMap({ handleRefresh: handleRefresh, checkLayoutAction: checkLayoutAction });

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

    const onFilter = () => {
        if (schemaUI.config.filterConfig) {
            typeParam.current = 'filter';
            currentValue.current = currentValue.current || schemaUI.config.filterConfig.values;
            setLayoutAction(schemaUI.config.filterConfig);
            onConfirm.current = (values) => {
                setFilterRows(values);
            };
        }
    };

    const onCleanFilterValue = (columnName: string) => {
        const values = { ...currentValue.current, [columnName]: '' };
        currentValue.current = values;
        setFilterRows(values);
    }

    useEffect(() => {
        if (layoutAction) {
            setShowParam(true);
        }
    }, [layoutAction]);

    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            resetSource(itemMenuWin.tableWin); // xoá dữ liệu khi không dùng đến...
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ViewMap style={{ flex: 1 }}>
            <VcHeader title={itemMenuWin.label} numRow={infoData.total} onSearch={setTextSearch}
                showSearch={showFilter.showSearch}
                showFilter={showFilter.showFilter} onFilter={onFilter}
                valuesTypeFilter={schemaUI.config.filterConfig?.valuesType}
                valuesFilter={currentValue.current ?? undefined} onCleanFilterValue={onCleanFilterValue}
                valueDisplay={schemaUI.config.filterConfig?.valueDisplay}
                valueIgnoreFilter={schemaUI.config.filterConfig?.valueIgnoreFilter}
                hideFilter={schemaUI.config.filterConfig?.hideFilter}
                isFastView={menuWin0 !== undefined} />
            <SwipeListView
                data={data}
                style={{ backgroundColor: colors.vacom.backLayout, paddingTop: 5 }}
                keyExtractor={(item: IData, index) => item.id + index.toString()}
                renderItem={({ item }) => <ItemWinList item={item} schemaView={schemaUI.config.itemList}
                    onLayout={handleLayout} onPress={handleAction.edit} dataSource={dataSource} isHideIcon={numberAction === 0} />}
                renderHiddenItem={({ item }) => <ItemWinListAction item={item} actionMap={actionMapAll}
                    schemaView={schemaUI.config.itemAction} height={rowHeights[item.id ?? '']} />}
                rightOpenValue={-70 * numberAction}
                disableLeftSwipe={numberAction === 0}
                disableRightSwipe
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        key={String(loading.refresh)} // ép re-render
                        refreshing={loading.refresh}
                        onRefresh={handleRefresh}
                    />
                }
                // ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: 20 }} />}
                ListFooterComponent={renderFooter}
            />
            {(schemaUI.action?.new !== false && permissions?.mnPlus !== undefined) && <FAB
                icon="plus"
                style={{
                    // width: 55,
                    // height: 55,
                    // borderRadius: 55,
                    bottom: (!menuWin0 ? insets.bottom : 0) + 20,
                    right: 20,
                    position: 'absolute',
                }}
                onPress={handleAction.new}
                variant='primary'
            />}
            {showParam && layoutAction && <ParamScreen onConfirm={runActionWithParam} schemaConfig={layoutAction}
                paramKey={typeParam.current === 'filter' ? currentValue.current : undefined}
                timeItem={typeParam.current === 'filter' ? currentValue.current?.timeItem : undefined} />}
        </ViewMap>
    );
}
export default WindowScreen;