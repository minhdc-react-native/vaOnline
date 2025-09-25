import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Button, Divider, IconButton, Portal, Text, useTheme } from 'react-native-paper';
import ShowBottom from './dialog/showBottom';

interface IProgs {
    label?: string;
    placeholder?: string;
    value: string | null;
    onChange: (value: string) => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    isError?: boolean
}
const ViewComponent = ({ label, value, onChange, disabled, style, placeholder, isError }: IProgs) => {
    const { colors } = useTheme<VACOMTheme>();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value ?? "");
    const onChangeTime = (time: string) => {
        setSelectedTime(time);
        setModalVisible(false);
        onChange(time);
    }
    return (
        <>
            <View style={[{ marginTop: 5 }, style]}>
                <Pressable style={[styles.button, { backgroundColor: colors.background, borderColor: isError ? colors.error : colors.vacom.borderColor }]} onPress={() => {
                    if (disabled) return;
                    setModalVisible(true);
                }}>
                    <View style={[styles.input]}>
                        <View style={{ flex: 1 }}><Text variant='bodyLarge' style={styles.inputText}>
                            {value || <Text style={{ color: colors.backdrop, fontSize: 16, width: "auto" }}>{placeholder || label}</Text>}
                        </Text></View>
                    </View>
                    {(Helper.isEmpty(value) || disabled) && <MaterialCommunityIcons name="av-timer" size={20} color={colors.secondary} />}
                </Pressable>
                {!Helper.isEmpty(value) && !disabled && <IconButton style={{ position: "absolute", right: -5 }} icon="close-circle" size={15} iconColor={colors.primary} onPress={() => onChangeTime("")} />}
                {!Helper.isEmpty(value) &&
                    <View style={styles.label}>
                        <View style={styles.label}>
                            <Text style={{ color: colors.inverseSurface, fontSize: 12.7 }}>{label}</Text>
                        </View>
                        <Text style={{ color: colors.background, paddingHorizontal: 4 }}>{label}</Text>
                        <View style={[styles.line, { borderColor: colors.background }]} />
                    </View>
                }
            </View>
            {modalVisible && <TimePicker
                visible={modalVisible}
                initialValue={selectedTime}
                onClose={() => setModalVisible(false)}
                onConfirm={onChangeTime}
            />}
        </>
    );
}
export const VcTimePicker = React.memo(ViewComponent);
interface IPropsTime {
    visible: boolean;
    onClose: () => void;
    onConfirm: (time: string) => void;
    initialValue?: string; // "HH:mm" or "HH:mm:ss"
}

const TimePicker = ({
    visible,
    onClose,
    onConfirm,
    initialValue = '00:00:00',
}: IPropsTime) => {
    const { colors } = useTheme<VACOMTheme>();
    const parseInitial = useCallback(() => {
        const [h, m] = initialValue.split(':').map((v) => parseInt(v));
        return { h: h || 0, m: m || 0 };
    }, [initialValue]);

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);

    useEffect(() => {
        if (visible) {
            const { h, m } = parseInitial();
            setHour(h);
            setMinute(m);
        }
    }, [visible, parseInitial]);

    const pad = useCallback((n: number) => n.toString().padStart(2, '0'), []);

    const confirm = useCallback(() => {
        const timeStr = `${pad(hour)}:${pad(minute)}:00`;
        onConfirm(timeStr);
    }, [hour, minute, onConfirm, pad]);

    const hourOptions = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minuteOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), []);

    const renderGrid = useCallback(
        (items: number[], selected: number, onSelect: (v: number) => void, numColumns = 3) => (
            <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            [styles.cell, { backgroundColor: colors.elevation.level1 }],
                            {
                                width: `${100 / numColumns}%`,
                            },
                            selected === item && { backgroundColor: colors.primary },
                        ]}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={[styles.cellText, selected === item && styles.selectedText]}>
                            {pad(item)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        ),
        [pad]
    );

    return (
        <Portal>
            <ShowBottom hideCalendar={onClose} style={[{ borderRadius: 16 }]} position='center'>
                <View style={styles.popup}>
                    <Text variant='titleMedium' style={styles.columnTitle}>{`Thời gian: ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`}</Text>
                    <Divider />
                    <View style={styles.gridContainer}>
                        <View style={[styles.column, { flex: 4 }]}>
                            {renderGrid(hourOptions, hour, setHour, 4)}
                        </View>
                        <View style={{ width: 1, backgroundColor: colors.elevation.level1 }} />
                        <View style={[styles.column, { flex: 3 }]}>
                            {renderGrid(minuteOptions, minute, setMinute)}
                        </View>
                    </View>
                    <Divider />
                    <Button style={{ marginTop: 10, width: 150, alignSelf: "center" }} mode='contained' onPress={confirm}>Xác nhận</Button>
                </View>
            </ShowBottom>
        </Portal>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
        borderWidth: 0.5,
        borderRadius: 5
    },
    line: {
        position: "absolute",
        width: "100%",
        borderWidth: 1,
        top: 4,
        left: 2,
        zIndex: 1
    },
    label: {
        position: "absolute",
        fontSize: 12,
        top: -4,
        left: 8,
        zIndex: 2
    },
    input: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 10,
        height: 40
    },
    inputText: {
        color: '#333',
        width: 90
    },
    overlay: {
        flex: 1,
        // backgroundColor: '#00000055',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        width: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    columnTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 10
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cell: {
        width: 50,
        height: 40,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    cellText: {
        fontSize: 14,
    },
});
