import { useZodValidation } from "@/components/UIEngine/hooks/useZodValidation";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { IRowsColsField } from "@/components/UIEngine/types";
import VcSelectList from "@/components/vcSelectList";
import { useDataApp } from "@/hooks/zustand/useDataApp";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Button, customText, IconButton, useTheme } from "react-native-paper";
import { IHandleActionConfig } from "../../schema";
const Text = customText<'customVariant'>();
const HEIGHT_WINDOW = Dimensions.get("window").height;
interface IProgs {
    schemaConfig: IHandleActionConfig;
    onConfirm: (paramKey?: Record<string, any>, timeItem?: IData | null) => void;
    paramKey?: Record<string, any> | null;
    timeItem?: IData | null;
}
// thêm vào cho hết warning
export default function ParamScreen({ onConfirm, paramKey, schemaConfig, timeItem }: IProgs) {
    const slideAnim = useRef(new Animated.Value(HEIGHT_WINDOW)).current;
    const { colors } = useTheme();

    const arrReplace: Record<string, any> = {

    };

    const newDefault = Object.fromEntries(
        Object.entries(paramKey ?? schemaConfig.values).map(([key, value]) =>
            typeof value === 'string' && arrReplace.hasOwnProperty(value)
                ? [key, arrReplace[value]]
                : [key, value]
        )
    );

    const [paramKey0, setParamKey0] = useState<Record<string, any>>(newDefault);
    const schemaEdit: IRowsColsField = schemaConfig.view;
    const zod = schemaConfig.zod;
    const isSelectTime = schemaConfig.isSelectTime;
    const [filterTime, setTime] = useState<IData | null>(timeItem || null);
    const setFilterTime = (item: IData | null) => {
        setTime(item);
        const dateRange = Helper.getDateRange(item?.id.toString() ?? "");
        let changeValue = { [isSelectTime?.from ?? "from"]: dateRange.fromDate ?? "", [isSelectTime?.to ?? "to"]: dateRange.toDate ?? "" };
        if (isSelectTime?.expression) {
            Object.keys(isSelectTime.expression).map(key => {
                changeValue[key as any] = item?.[isSelectTime.expression ? isSelectTime.expression?.[key] : key];
            });
        }
        setValue(changeValue);
    }
    const { validate, errors, setErrors } = useZodValidation(paramKey0, zod);
    const checkFilter = () => {
        const isResult = validate();
        if (!isResult) {
            setTimeout(() => {
                setErrors({});
            }, 5000); //sau 10.000 ms = 10 giây sẽ tự xoá các error message...
        }
        return isResult;
    }
    const onSubmit = (confirm: boolean, paramKey?: Record<string, any>) => {
        if (!confirm || checkFilter()) onConfirm(paramKey, filterTime);
    }
    const setValue = (change: Record<string, string>) => {
        setParamKey0(prev => ({ ...prev, ...change }));
    }

    const [containHeight, setContainHeight] = useState<number>(0);

    const setHeight = (height: number) => {
        if (containHeight !== height) setContainHeight(height);
    }

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const closePanel = (confirm: boolean, paramKey?: Record<string, any>) => {
        if (confirm && !checkFilter()) return;
        Animated.timing(slideAnim, {
            toValue: HEIGHT_WINDOW,
            duration: 200,
            useNativeDriver: true,
        }).start(() => onSubmit(confirm, paramKey));
    };

    const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const [tableRefresh, setTableRefresh] = useState<Record<string, Record<string, any>>>({});

    const loadDataBegin = async () => {
        const source: any = schemaConfig.dataSource ?? {};
        const promises = Object.keys(source).map(async (key: any) => {
            if (source[key]?.data) {
                setDataSource(prev => ({
                    ...prev,
                    [key]: source[key]?.data
                }));
            }
            // dataSource?: Record<string, { data?: any[], api?: { url: string, type?: 'get' | 'post', data?: Record<string, any>} }>,
            if (source[key]?.api) {
                const apiConfig = source[key].api;
                if (apiConfig.type === "post") {
                    await api.post({
                        link: apiConfig.url,
                        data: apiConfig.data,
                        callBack: (res => {
                            if (res) {
                                const fields: string[] = apiConfig.fields || Object.keys(res[0]);
                                const result = res.map((item: any) =>
                                    Object.fromEntries(fields.map(key => [key, item[key]]))
                                );
                                setDataSource(prev => ({
                                    ...prev,
                                    [key]: result
                                }));

                                if (apiConfig?.tableWin) {
                                    setTableRefresh(prev => ({
                                        ...prev,
                                        [apiConfig.tableWin]: { url: apiConfig.url, type: apiConfig.type, data: apiConfig.data, key: key }
                                    }));
                                }
                            }
                        })
                    });
                } else {
                    await api.get({
                        link: apiConfig.url, callBack: (res => {
                            if (res) {
                                const fields: string[] = apiConfig.fields || Object.keys(res[0]);
                                const result = res.map((item: any) =>
                                    Object.fromEntries(fields.map(key => [key, item[key]]))
                                );
                                setDataSource(prev => ({
                                    ...prev,
                                    [key]: result
                                }));

                                if (apiConfig?.tableWin) {
                                    setTableRefresh(prev => ({
                                        ...prev,
                                        [apiConfig.tableWin]: { url: apiConfig.url, type: apiConfig.type, data: apiConfig.data, key: key }
                                    }));
                                }
                            }
                        })
                    });
                }
            }
        });
        await Promise.all(promises);
    };
    const shouldRefresh = useDataApp((state) => state.shouldRefresh);
    const setShouldRefresh = useDataApp((state) => state.setShouldRefresh);
    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            const apiConfig = tableRefresh[shouldRefresh];
            if (apiConfig.type === "post") {
                api.post({
                    link: apiConfig.url,
                    data: apiConfig.data,
                    callBack: (res) => {
                        setDataSource(prev => ({
                            ...prev,
                            [apiConfig.key]: res
                        }));
                        setShouldRefresh(null);
                    }
                });
            } else {
                api.get({
                    link: apiConfig.url,
                    callBack: (res) => {
                        setDataSource(prev => ({
                            ...prev,
                            [apiConfig.key]: res
                        }));
                        setShouldRefresh(null);
                    }
                });
            }

        }
    }, [shouldRefresh]);

    useEffect(() => {
        loadDataBegin();
    }, [])

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
                        {isSelectTime ? <VcSelectList
                            data={isSelectTime?.data || Helper.filterTime}
                            placeholder="Chọn ngày"
                            value={filterTime?.id ?? ""}
                            style={{ flex: 1, borderWidth: 0 }}
                            clean={true}
                            onChange={(item) => setFilterTime(item)}
                        /> : <Text style={styles.title}>{schemaConfig.title || 'Tham số'}</Text>}
                        <Button mode="contained" onPress={() => closePanel(true, paramKey0)}>Xác nhận</Button>
                    </View>
                </View>
                <View style={[styles.content]}>
                    <SchemaUIEngine
                        schema={schemaEdit}
                        data={paramKey0}
                        onChangeItemData={setValue}
                        errors={errors}
                        dataSource={dataSource}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    header: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        padding: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        gap: 20,
        marginBottom: 50
    },
});