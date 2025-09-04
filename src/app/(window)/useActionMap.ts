
import { useLoading } from "@/components/dialog/loadingProvider";
import { api } from "@/utils/apiMethods";
import { router } from "expo-router";
import { useMemo } from "react";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
interface IShareFile {
    uri: string,
    title?: string,
    type?: 'text/xml' | 'application/pdf' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // type: 'application/vnd.ms-excel' xls
    isDelete?: boolean
}
interface IProgs {
    handleRefresh: () => void,
    checkLayoutAction: (actionName: string, callBack: (values: Record<string, any>) => void, data?: Record<string, any>) => void
}
export const useActionMap = ({ handleRefresh, checkLayoutAction }: IProgs) => {
    const { show, hide } = useLoading();

    const shareFile = async ({ uri, title = "Chia sẻ file ...", type = "text/xml", isDelete = true }: IShareFile) => {
        if (!uri) return;
        Share.open({
            url: uri,
            type: type,
            title: title,
        }).finally(() => isDelete && RNFS.unlink(uri));
    };

    const handlePrint = useMemo(() => {
        return {
            printItem: (param?: Record<string, any>) => {
                checkLayoutAction('printItem', async (values: Record<string, any>) => {
                    const data = {
                        parameter: {
                            id: param?.data?.id
                        },
                        CODE: values.id, type: "pdf"
                    };
                    show('Tải file ...');
                    const file = await api.file.post({
                        link: `/api/System/InChungTu`,
                        data: data,
                        fileName: values.REPORT_FILE
                    });
                    hide();
                    if (file) {
                        router.navigate({ pathname: '/viewPdf', params: { title: values.NAME, uriPdf: file.uri } });
                    }
                });
            },
        }
    }, [checkLayoutAction, hide, show]);

    return {
        ...handlePrint
    };
}