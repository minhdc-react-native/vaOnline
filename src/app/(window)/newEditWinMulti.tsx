import { usePopup } from "@/components/dialog/popupProvider";
import FormWrapper from "@/components/formWrapper";
import LoadingScreen from "@/components/loadingScreen";
import { buildZodSchema } from "@/components/UIEngine/buildZodSchema";
import { useZodValidation } from "@/components/UIEngine/hooks/useZodValidation";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { IRowsColsField } from "@/components/UIEngine/types";
import { useTranslation } from "@/context/TranslationContext";
import { useDataApp } from "@/hooks/zustand/useDataApp";
import { VACOMTheme } from "@/theme/theme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Button, customText, IconButton, useTheme } from "react-native-paper";
import { ISchemaWinValue } from "../../schema";
const Text = customText<'customVariant'>();
const HEIGHT_WINDOW = Dimensions.get("window").height;

const backHandQuestion = { title: "Cảnh báo", message: "Dữ liệu đã thay đổi, bạn có muốn thoát không?" };
const backHandQuestionE = { title: "Warning", message: "Data has changed, do you want to exit?" };

interface IProps {
    title: string;
    titleButton?: string;
    schemaUi: ISchemaWinValue;
    onSave: (data?: IData) => void;
    data: IData | null;
    dataSource?: Record<string, any[]>;
}

const ViewComponent: React.FC<IProps> = ({ title, titleButton, onSave, data, schemaUi, dataSource }) => {
    const slideAnim = useRef(new Animated.Value(HEIGHT_WINDOW)).current;
    const { colors } = useTheme<VACOMTheme>();
    const { showPopup } = usePopup();
    const [dataItem, setDataItem] = useState<IData | null>(data || null);

    const schemaEdit: IRowsColsField = schemaUi.config.itemEdit;
    const zod = schemaUi.zod;

    const { validate, errors, setErrors } = useZodValidation(dataItem, buildZodSchema(zod));
    const checkFilter = () => {
        const isResult = validate();
        if (!isResult) {
            setTimeout(() => {
                setErrors({});
            }, 5000); //sau 10.000 ms = 10 giây sẽ tự xoá các error message...
        }
        return isResult;
    }
    const onSubmit = (confirm: boolean, data?: IData) => {
        if (!confirm || checkFilter()) onSave(data);
    }
    const setValue = (change: Record<string, string>) => {
        setDataItem(prev => prev ? ({ ...prev, ...change }) : null);
        if (!isChange) setIsChange(true);
    }
    const [containHeight, setContainHeight] = useState<number>(0);

    const setHeight = (height: number) => {
        if (containHeight !== height) setContainHeight(height);
    }

    useEffect(() => {
        setDataItem(data || null);
    }, [data]);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);
    const [isChange, setIsChange] = useState<boolean>(false);
    const isLangVi = !!(useDataApp((state) => state.lang) === "vi");
    const { _ } = useTranslation();

    const closePanel = (confirm: boolean, data?: IData) => {
        if (confirm && !checkFilter()) return;
        const _closeView = () => {
            Animated.timing(slideAnim, {
                toValue: HEIGHT_WINDOW,
                duration: 200,
                useNativeDriver: true,
            }).start(() => onSubmit(confirm, data));
        }
        if (!data && isChange) {
            showPopup({
                title: isLangVi ? backHandQuestion.title : backHandQuestionE.title,
                message: isLangVi ? backHandQuestion.message : backHandQuestionE.message,
                showCancel: true,
                confirmText: _('EXIT'),
                onConfirm: () => {
                    _closeView();
                }
            })
        } else {
            _closeView();
        }
    };

    if (dataItem === null) {
        return <LoadingScreen />
    }

    return (
        <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
            <Pressable onPress={() => closePanel(false)}>
                <View style={{ height: HEIGHT_WINDOW - containHeight }} />
            </Pressable>
            <Animated.View style={[styles.panel, {
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.surface
            }]} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <IconButton icon="close" onPress={() => closePanel(false)} />
                        <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>{`${(dataItem.editmode === 1 || dataItem._isNew) ? `${_('THEM')} ` : `${_('EDIT')} `} ${title}`}</Text>
                        <Button onPress={() => closePanel(true, dataItem ?? undefined)}>{titleButton || _('SAVE')}</Button>
                    </View>
                </View>
                <View style={[styles.content, { height: schemaEdit.height ?? "80%", backgroundColor: colors.vacom.backLayout }]}>
                    <FormWrapper>
                        <SchemaUIEngine
                            schema={schemaEdit}
                            data={dataItem ?? undefined}
                            onChangeItemData={setValue}
                            errors={errors}
                            dataSource={dataSource}
                        />
                    </FormWrapper>
                </View>
            </Animated.View>
        </View>
    );
};
export const NewEditWinMulti = React.memo(ViewComponent);

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
    },
    panel: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between',
    },
    content: {
        padding: 10
    },
});