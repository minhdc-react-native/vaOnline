
import { useLoading } from "@/components/dialog/loadingProvider";
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

    return {
    };
}