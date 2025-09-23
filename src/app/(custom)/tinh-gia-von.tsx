// app/welcome.tsx
import { useLoading } from '@/components/dialog/loadingProvider';
import { useToast } from '@/components/dialog/useToast';
import LoadingScreen from '@/components/loadingScreen';
import { useZodValidation } from '@/components/UIEngine/hooks/useZodValidation';
import { SchemaUIEngine } from '@/components/UIEngine/schemaUIEngine';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { tinhGiaVonSchema } from '@/schemaUI/tinhGiaVonSchema';
import { api } from '@/utils/apiMethods';
import { Helper } from '@/utils/Helper';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
const dataType = [
    { id: 1, value: 'Bình quân gia quyền' },
    { id: 2, value: 'Trung bình di động' },
    { id: 3, value: 'Fifo' }
]

const dataFifo = [
    { id: 1, value: 'Theo ngày' },
    { id: 2, value: 'Theo tháng' }
]

export default function TinhGiaVon() {
    const { colors } = useTheme();
    const { view, zod, dataDefault } = tinhGiaVonSchema;

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

    const [dataSource] = useState({ list_time: Helper.filterTime, type: dataType, fifo: dataFifo });
    const [loading, setLoading] = useState(true);
    const { show, hide } = useLoading();
    const { showToast } = useToast();
    const onRun = useCallback(async (dataPost: Record<string, any>) => {
        api.post({
            link: `/api/TongHop/TinhGiaVon`,
            data: dataPost,
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
    }, []);

    const actionMap = {
        onConfirm: async () => {
            if (!checkData()) return;
            onRun(data);
        },
    }

    const getDataDefault = useCallback(() => {
        const sql = encodeURIComponent(`select top 1 * from Config_gv Where Dvcs_id=N'${orgUnit}'`);
        api.get({
            link: `/api/System/ExecuteQuery?sql=${sql}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    const result = res[0];
                    onChangeItemData({
                        type: result.TYPE,
                        fifo: result.FIFO,
                        Lh_thang: (result.LH_THANG ? 1 : 0)
                    });
                }
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
            </Card>
        </View>
    );
}
