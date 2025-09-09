
import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
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
    const { showToast } = useToast();
    const { showPopup } = usePopup();
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
            exportInvoice: (param?: Record<string, any>) => {
                checkLayoutAction('exportInvoice', async (values: Record<string, any>) => {
                    showPopup({
                        message: `Bạn có muốn đẩy chứng từ [${param?.data?.SO_CT}]? (chỉ hỗ trợ sang M-Invoice)`,
                        showCancel: true,
                        onConfirm: () => {
                            api.post({
                                link: `/api/HoaDon/TaoHoaDon_TT178`,
                                data: {
                                    id: param?.data?.id,
                                    ky_hieu: values.khhdon
                                },
                                callBack: (res) => {
                                    if (res && res.error) {
                                        showToast(res.error?.error, { type: "error" });
                                    } else {
                                        showToast(`Đã đẩy chứng từ [${param?.data?.SO_CT}] sang M-Invoice!`);
                                        handleRefresh();
                                    }
                                },
                                setLoading: (loading) => loading ? show() : hide()
                            });
                        },
                        iconType: "question"
                    });

                });
            },
        }
    }, [checkLayoutAction, hide, show, showToast, showPopup, handleRefresh]);

    return {
        ...handlePrint
    };
}