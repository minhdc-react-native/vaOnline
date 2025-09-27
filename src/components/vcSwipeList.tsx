import { FlashList, FlashListProps } from "@shopify/flash-list";
import React, { useCallback, useRef } from "react";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Divider } from "react-native-paper";

export type SwipeListProps<T> = Omit<FlashListProps<T>, "renderItem"> & {
    multipleOpen?: boolean;
    renderItemContent: (item: T, index: number) => React.ReactNode;
    renderRightActions?: (item: T, index: number) => React.ReactNode;
    renderLeftActions?: (item: T, index: number) => React.ReactNode;
    itemKey: (item: T, index: number) => string;
    isSeparator?: boolean
};

function VcSwipeList<T>({
    data,
    multipleOpen = true,
    renderItemContent,
    renderRightActions,
    renderLeftActions,
    itemKey, isSeparator,
    ...rest
}: SwipeListProps<T>) {
    // lưu ref từng row
    const rowRefs = useRef<Record<string, SwipeableMethods | null>>({}).current;
    // lưu id đang mở gần nhất
    const openRowId = useRef<string | null>(null);

    const handleRowOpen = useCallback((id: string) => {
        if (!multipleOpen) {
            if (openRowId.current && openRowId.current !== id) {
                rowRefs[openRowId.current]?.close();
            }
            openRowId.current = id;
        }
    }, [multipleOpen, rowRefs]);

    const renderItem = useCallback(({ item, index }: { item: T; index: number }) => {
        const key = itemKey(item, index);
        return (
            <ReanimatedSwipeable
                key={key}
                // @ts-ignore
                ref={(ref: SwipeableMethods | null) => (rowRefs[key] = ref)}
                renderRightActions={renderRightActions ? () => renderRightActions(item, index) : undefined}
                renderLeftActions={renderLeftActions ? () => renderLeftActions(item, index) : undefined}
                onSwipeableWillOpen={() => handleRowOpen(key)}
                onSwipeableClose={() => {
                    if (openRowId.current === key) {
                        openRowId.current = null;
                    }
                }}
            >
                {renderItemContent(item, index)}
            </ReanimatedSwipeable>
        );
    }, [handleRowOpen, itemKey, renderItemContent, renderLeftActions, renderRightActions, rowRefs]);
    return (
        <FlashList
            {...rest}
            data={data}
            keyExtractor={(item, index) => itemKey(item, index)}
            ItemSeparatorComponent={() => isSeparator ? <Divider /> : undefined}
            renderItem={renderItem}
        />
    );
}

export default VcSwipeList;
