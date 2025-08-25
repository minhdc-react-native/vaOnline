import FormWrapper from "@/components/formWrapper";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { VcHeaderWin } from "@/components/vcHeaderWin";
import { useWinPage } from "@/hooks/useWinPage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const NewEditWin = () => {
    const { windowId, tableWin, id, title, sDataMaster, sAction, sPermissions } = useLocalSearchParams();
    const titleWin = title?.toString();
    const actionNewEdit = JSON.parse(sAction?.toString());
    const fixTableWin = tableWin?.toString() as ITableWin;
    const permissions = JSON.parse(sPermissions?.toString());
    const navigation = useNavigation();
    const {
        colors, schemaUI, resetItem,
        itemData, dataSource, onChangeItemData, handleAction, onBack, errors
    } = useWinPage({
        windowId: windowId?.toString(),
        tableWin: fixTableWin,
        idItem: id?.toString()
    });
    const [edit, setEdit] = useState<boolean>(id === undefined);

    const onPressAction = () => {
        if (!edit) {
            setEdit(true);
        } else {
            handleAction.save();
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            resetItem(fixTableWin); // xoá dữ liệu khi không dùng đến...
        });
        return unsubscribe;
    }, [navigation]);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <VcHeaderWin title={titleWin} edit={edit} onPressAction={onPressAction} onBack={onBack} isEdit={actionNewEdit.edit && permissions?.mnEdit !== undefined} />
            <FormWrapper style={{ padding: 10 }}>
                {edit ? <SchemaUIEngine schema={schemaUI.config.itemEdit} data={itemData}
                    onChangeItemData={onChangeItemData} errors={errors} dataSource={dataSource} /> :
                    <Card mode="contained" style={{ backgroundColor: colors.background, paddingVertical: 10, paddingHorizontal: 20 }}>
                        <SchemaUIEngine schema={schemaUI.config.itemShow} data={itemData} dataSource={dataSource} />
                        {(schemaUI.config.tabs?.length ?? 0) > 0 &&
                            <Button mode="elevated" style={{ marginTop: 10, alignSelf: "flex-end" }}
                                onPress={() => router.navigate({
                                    pathname: "/(window)/tabMultiList",
                                    params: {
                                        idMaster: itemData?.id, jsonTabs: JSON.stringify(schemaUI.config.tabs ?? []),
                                        sDataMaster: sDataMaster,
                                        sAction: JSON.stringify(actionNewEdit)
                                    }
                                })}>
                                {`Chi tiết [${schemaUI.config.tabs?.length}]`}
                            </Button>}
                    </Card>}
            </FormWrapper>
        </SafeAreaView>
    )
};
export default NewEditWin;