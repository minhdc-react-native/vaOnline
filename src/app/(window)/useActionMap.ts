
import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
import { api } from "@/utils/apiMethods";
import { viewDocument } from '@react-native-documents/viewer';
import { File } from 'expo-file-system';
import * as Sharing from "expo-sharing";
import { useMemo } from "react";

interface IShareFile {
    uri: string;
    title?: string;
    type?:
    | "text/xml"
    | "application/pdf"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.ms-excel";
    isDelete?: boolean;
}
function getUTI(type: string): string {
    switch (type) {
        case "application/pdf":
            return "com.adobe.pdf";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "org.openxmlformats.spreadsheetml.sheet";
        case "application/vnd.ms-excel":
            return "com.microsoft.excel.xls";
        case "text/xml":
        default:
            return "public.xml";
    }
}

export const openFile = async (param: IShareFile) => {
    await viewDocument({ uri: param.uri })
        .then(() => {
            // mở thành công
            console.log("Document opened");
        })
        .catch(async (error) => {
            await shareFile(param);
        });
}

const shareFile = async ({
    uri,
    title = "Chia sẻ file ...",
    type = "application/pdf",
    isDelete = true,
}: IShareFile) => {
    if (!uri) return;
    try {
        await Sharing.shareAsync(uri, {
            mimeType: type,
            UTI: getUTI(type),
            dialogTitle: title,
        });
    } finally {
        if (isDelete) {
            try {
                const file = new File(uri);
                file.delete();
                console.log("✅ Xoá thành công:", uri);
            } catch (err) {
                console.warn("❌ Lỗi xoá file:", err);
            }
        }
    }
};
interface IProgs {
    handleRefresh: () => void,
    checkLayoutAction: (actionName: string, callBack: (values: Record<string, any>) => void, data?: Record<string, any>) => void
}
export const useActionMap = ({ handleRefresh, checkLayoutAction }: IProgs) => {
    const { show, hide } = useLoading();
    const { showToast } = useToast();
    const { showPopup } = usePopup();
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
                        await openFile({
                            uri: file.uri, title: values.REPORT_FILE,
                            type: "application/pdf"
                        });
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