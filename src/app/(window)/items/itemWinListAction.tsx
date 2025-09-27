import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { IRowsColsField } from "@/components/UIEngine/types";
import React, { useEffect, useRef, useState } from "react";
import { DimensionValue, StyleSheet } from "react-native";

interface IProps {
    schemaView: IRowsColsField,
    item: IData,
    height?: DimensionValue | undefined,
    actionMap?: Record<string, (param?: any) => void>
}
const ItemViewComponent: React.FC<IProps> = ({ schemaView, item, height, actionMap }) => {
    const isSetHeight = useRef(false);
    const [fixHeight, setFixHeight] = useState<DimensionValue | null>(null);
    useEffect(() => {
        if (!isSetHeight.current && height) {
            isSetHeight.current = true;
            setFixHeight(height);
        }
    }, [height]);
    return (
        <SchemaUIEngine schema={schemaView} actionMap={actionMap} dataActionMap={item} data={item}
            style={[styles.container, { height: fixHeight ?? "auto", marginVertical: 5, gap: 0, right: -6 }]} />
    )
};
export const ItemWinListAction = React.memo(ItemViewComponent);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 10
    }
});
