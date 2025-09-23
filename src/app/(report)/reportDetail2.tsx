import LoadingScreen from '@/components/loadingScreen';
import { api } from '@/utils/apiMethods';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReportDetail from './reportDetail';

export default function ReportDetail2() {
    const { report } = useLocalSearchParams();
    const reportItem: { reportId: string, dataFilter: Record<string, any>, routerNumber: number, vnd_nt: '1' | '2' | '3' } = JSON.parse(report?.toString());
    const [reportDefault, setReportDefault] = useState<IReportItemDefault | null>(null);
    useEffect(() => {
        const url = encodeURIComponent(`SELECT * FROM VC_REPORT WHERE id='${reportItem.reportId}'`);
        api.get({
            link: `/api/System/ExecuteQuery?sql=${url}`,
            callBack: (res: IData[]) => {
                if (res && res.length > 0) {
                    setReportDefault({ reportItem: res[0], dataFilter: reportItem.dataFilter, routerNumber: reportItem.routerNumber, vnd_nt: reportItem.vnd_nt });
                }
            }
        });
    }, []);
    return (
        !reportDefault ? <SafeAreaView style={{ flex: 1, paddingTop: 50 }}><LoadingScreen />
        </SafeAreaView> : <ReportDetail reportDefault={reportDefault} />
    );
}
