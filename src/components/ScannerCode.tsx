import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { OnReadCodeData } from 'react-native-camera-kit/dist/CameraProps';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import VcCheckBox from './vcCheckbox';
import { VcNum } from './vcNum';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
interface IProgs {
    scannerVisible: boolean;
    setScannerVisible: (visible: boolean) => void;
    onScanned?: (value: string, quantity?: number | null) => void;
    continuous?: boolean;
}

export default function ScannerCode({ onScanned, scannerVisible, setScannerVisible, continuous }: IProgs) {
    const [flashOn, setFlashOn] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const isFocused = useIsFocused();
    const [isContinuous, setIsContinuous] = useState(false);
    const [quantity, setQuantity] = useState<number | null>(1);
    const laserAnim = useRef(new Animated.Value(0)).current;
    const onClose = () => {
        setScannerVisible(false);
    }
    const handleQRCodeRead = (event: OnReadCodeData) => {
        if (!isScanning) return;
        const qrCode = event.nativeEvent.codeStringValue;
        // const codeFormat = event.nativeEvent.codeFormat;
        setIsScanning(false);
        Vibration.vibrate();
        onScanned?.(qrCode, quantity);
        if (!isContinuous) {
            onClose();
        } else {
            setTimeout(() => {
                setIsScanning(true);
            }, 2000); // delay để tránh quét liên tục mã giống nhau
        }
    };
    useEffect(() => {
        if (scannerVisible) {
            laserAnim.setValue(0); // reset

            const moveDown = Animated.timing(laserAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            });

            const moveUp = Animated.timing(laserAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            });

            Animated.loop(Animated.sequence([moveDown, moveUp])).start();
        }
    }, [scannerVisible]);
    const translateY = laserAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCAN_SIZE - 80], // laser di chuyển từ trên xuống gần đáy khung
    });
    return (
        <Modal visible={scannerVisible} animationType="fade">
            <View style={styles.container}>
                {isFocused && (
                    <Camera
                        style={styles.camera}
                        scanBarcode={true}
                        onReadCode={handleQRCodeRead}
                        showFrame={false}
                        torchMode={flashOn ? 'on' : 'off'}
                        cameraType={CameraType.Back}
                    />
                )}

                <View style={StyleSheet.absoluteFill}>
                    <Svg height="100%" width="100%">
                        <Defs>
                            <Mask id="mask" x="0" y="0" width="100%" height="100%">
                                <Rect x="0" y="0" width="100%" height="100%" fill="white" />
                                <Rect
                                    x={(width - SCAN_SIZE) / 2}
                                    y={(SCREEN_HEIGHT - SCAN_SIZE) / 2}
                                    width={SCAN_SIZE}
                                    height={SCAN_SIZE}
                                    rx={12}
                                    ry={12}
                                    fill="black"
                                />
                            </Mask>
                        </Defs>
                        <Rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="rgba(0,0,0,0.6)"
                            mask="url(#mask)"
                        />
                    </Svg>
                    <View
                        style={{
                            position: 'absolute',
                            top: (SCREEN_HEIGHT - SCAN_SIZE) / 2,
                            left: (width - SCAN_SIZE) / 2,
                            width: SCAN_SIZE,
                            height: SCAN_SIZE,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: 'darkorange',
                        }}
                    />
                </View>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: (SCREEN_HEIGHT - SCAN_SIZE) / 2 + 40,
                        left: (SCREEN_WIDTH - SCAN_SIZE) / 2 + 10,
                        width: SCAN_SIZE - 20,
                        height: 2,
                        backgroundColor: 'red',
                        borderRadius: 1,
                        opacity: 0.8,
                        transform: [{ translateY }],
                    }}
                />
                {/* Tiêu đề giống Zalo */}
                {continuous && <View style={styles.header}>
                    <View style={[styles.containerProduct, { opacity: isContinuous ? 0 : 0 }]}>
                        <Text style={{ textAlign: "center", color: "#c1c1c1" }}>Thông tin quét</Text>

                    </View>
                    <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
                        <VcCheckBox label='Quét liên tục' value={isContinuous} color='orange' onChange={(value) => setIsContinuous(typeof value === "boolean" ? value : value === "C")} type='switch' textStyle={{ color: "#fff", fontWeight: "bold" }} />
                        <VcNum value={quantity}
                            onChange={setQuantity}
                            disabled={true}
                            showMinusPlus={true}
                            style={{ backgroundColor: "transparent", borderColor: "orange" }}
                            width={120}
                            iconColors={{ minus: "#c1c1c1", plus: "#c1c1c1" }}
                            textStyle={{ color: "#fff" }}
                        />
                    </View>
                </View>}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => setFlashOn(!flashOn)}>
                        <Ionicons name={flashOn ? 'flash' : 'flash-off'} size={24} color={flashOn ? 'orange' : 'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },

    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 10,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    containerProduct: {
        paddingTop: 10,
        height: 125,
        width: "100%",
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    scanLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: 'red',
    },
    footer: {
        gap: 50,
        width: "100%",
        position: 'absolute',
        bottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    modeText: {
        color: 'white',
        fontWeight: "bold",
        textAlign: 'center',
    }
});