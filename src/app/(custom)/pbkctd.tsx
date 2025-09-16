// app/welcome.tsx
import { useLoading } from '@/components/dialog/loadingProvider';
import { useToast } from '@/components/dialog/useToast';
import LoadingScreen from '@/components/loadingScreen';
import { useZodValidation } from '@/components/UIEngine/hooks/useZodValidation';
import { SchemaUIEngine } from '@/components/UIEngine/schemaUIEngine';
import VcCheckBox from '@/components/vcCheckbox';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { pbKcTdSchema } from '@/schemaUI/pbkctdSchema';
import { api } from '@/utils/apiMethods';
import { Helper } from '@/utils/Helper';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export default function PbKcTd() {
    const { colors } = useTheme();
    const { view, zod, dataDefault } = pbKcTdSchema;

    const orgUnit = useDataApp(state => state.orgUnit);
    const currentYear = useDataApp((state) => state.currentYear);

    const [data, setData] = useState<Record<string, string>>(dataDefault ?? {});

    const { validate, errors, setErrors } = useZodValidation(data, zod);

    const onChangeItemData = (valueChange: Record<string, any>) => {
        let addChange: any = {};
        if (valueChange.list_time !== undefined) {
            const dateRange = Helper.getDateRange(valueChange.list_time, Number(currentYear));
            addChange.ngay1 = dateRange.fromDate;
            addChange.ngay2 = dateRange.toDate;
        }
        setData(prev => ({ ...prev, ...valueChange, ...addChange }));
    };

    const checkData = () => {
        const isResult = validate();
        if (!isResult) {
            setTimeout(() => {
                setErrors({});
            }, 5000);
        }
        return isResult;
    }

    const [dataSource] = useState({ list_time: Helper.filterTime });

    const [loading, setLoading] = useState(true);
    const { show, hide } = useLoading();
    const { showToast } = useToast();

    const [listPbKc, setListPbKc] = useState<IData[]>([]);

    const onPresListPbKc = useCallback((index: number) => {
        setListPbKc(prev => {
            const newList = [...prev];
            newList[index] = { ...newList[index], chon: (newList[index].chon === 1 ? 0 : 1) };
            return newList;
        });
    }, []);
    const onRun = useCallback(async (dataPost: Record<string, any>) => {
        const ids = listPbKc.filter(i => i.chon === 1).map(item => item.id).join(',');
        onChangeItemData({ LstOrd_grp: ids });
        api.post({
            link: `/api/TongHop/PhanBoKCTD`,
            data: { ...dataPost, LstOrd_grp: ids },
            callBack: (res) => {
                if (res && res.error) {
                    showToast(res.error, { type: "error" });
                }
                if (res && res.message) {
                    showToast(res.message, { type: "success" });
                }
            },
            setLoading: (loading) => loading ? show() : hide()
        })
    }, [listPbKc]);

    const actionMap = {
        onConfirm: async () => {
            if (!checkData()) return;
            onRun(data);
        },
    }

    const getDataDefault = useCallback(() => {
        const sql = encodeURIComponent(`Execute GET_LIST_PBKC '${orgUnit}','${currentYear}','A'`);
        api.get({
            link: `/api/System/ExecuteQuery?sql=${sql}`,
            callBack: (res: IData[]) => {
                setListPbKc(res);
            },
            setLoading: setLoading
        })
    }, []);
    useEffect(() => {
        getDataDefault();
    }, []);
    if (loading) return <LoadingScreen />
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Card style={{ padding: 20, backgroundColor: colors.background }} contentStyle={{ gap: 20 }}>
                <SchemaUIEngine schema={view} data={data} errors={errors} actionMap={actionMap}
                    onChangeItemData={onChangeItemData} dataSource={dataSource} />
                <View style={{ paddingHorizontal: 10, gap: 5 }}>
                    {listPbKc.map((item, index) => {
                        return (
                            <VcCheckBox align='right' key={item.id} value={item.chon} label={item.BUT_TOAN} onChange={(itemPress) => onPresListPbKc(index)} />
                        );
                    })}
                </View>
            </Card>
        </View>
    );
}
