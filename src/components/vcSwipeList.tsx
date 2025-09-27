import { FlashList, FlashListProps } from "@shopify/flash-list";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
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
    multipleOpen = false,
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

    const handleRowOpen = (id: string) => {
        if (!multipleOpen) {
            if (openRowId.current && openRowId.current !== id) {
                rowRefs[openRowId.current]?.close();
            }
            openRowId.current = id;
        }
    };

    const renderItem = ({ item, index }: { item: T; index: number }) => {
        const key = itemKey(item, index);
        return (
            <ReanimatedSwipeable
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
    };
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

const styles = StyleSheet.create({
    row: {
        padding: 16,
        backgroundColor: "#fff",
    },
});

export default VcSwipeList;
