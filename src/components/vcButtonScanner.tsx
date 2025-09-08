import ScannerCode from "@/components/ScannerCode";
import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";

interface IProps {
    onScanned: (value: string, quantity?: number | null) => void;
    style?: StyleProp<ViewStyle>;
}
const ButtonScannerComponent: React.FC<IProps> = ({
    onScanned,
    style
}) => {
    const [scannerVisible, setScannerVisible] = useState(false);
    return (
        <View style={style}>
            <IconButton icon={'barcode-scan'} onPress={() => setScannerVisible(true)} />
            {scannerVisible && <ScannerCode scannerVisible={scannerVisible} setScannerVisible={setScannerVisible} continuous={true} onScanned={onScanned} />}
        </View>
    );
}

export const VcButtonScanner = React.memo(ButtonScannerComponent);
