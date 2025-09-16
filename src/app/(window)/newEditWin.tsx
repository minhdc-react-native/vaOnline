import FormWrapper from "@/components/formWrapper";
import { SchemaUIEngine } from "@/components/UIEngine/schemaUIEngine";
import { VcHeaderWin } from "@/components/vcHeaderWin";
import { useTranslation } from "@/context/TranslationContext";
import { useWinPage } from "@/hooks/useWinPage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";

const NewEditWin = () => {
    const { sItemMenuWin, id, title, sDataMaster, sAction } = useLocalSearchParams();
    const titleWin = title?.toString();
    const actionNewEdit = JSON.parse(sAction?.toString());
    const navigation = useNavigation();
    const itemMenuWin: IMenuWin = JSON.parse(sItemMenuWin.toString());
    const { _ } = useTranslation();
    const {
        colors, schemaUI, resetItem, configExpression,
        itemData, dataSource, onChangeItemData, handleAction, onBack, errors
    } = useWinPage({
        itemMenuWin: itemMenuWin
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
            resetItem(itemMenuWin.tableWin); // xoá dữ liệu khi không dùng đến...
        });
        return unsubscribe;
    }, [navigation]);
    return (
        <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <Appbar.Header>
                <VcHeaderWin title={titleWin} edit={edit} onPressAction={onPressAction} onBack={onBack} isEdit={actionNewEdit.edit} />
            </Appbar.Header>
            <FormWrapper style={{ padding: 10 }}>
                {edit ? <SchemaUIEngine schema={schemaUI.config.itemEdit} data={itemData} configExpression={configExpression}
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
                                {`${_('DETAILS')} [${schemaUI.config.tabs?.length}]`}
                            </Button>}
                    </Card>}
                <View style={{ height: 100 }} />
            </FormWrapper>
        </View>
    )
};
export default NewEditWin;