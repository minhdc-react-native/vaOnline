// axiosApiHelper.ts
import { Helper } from '@/utils/Helper';
import { AxiosRequestConfig } from 'axios';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import vcAxios from './vcAxios';

interface IApiParams {
    link: string;
    data?: any;
    config?: AxiosRequestConfig<any>;
    setLoading?: (loading: boolean) => void;
    callBack?: (res: any) => void;
    callError?: (error: any) => void;
}

interface IFileParams {
    link: string;
    fileName?: string;
    isBase64?: boolean;
    setLoading?: (loading: boolean) => void;
}

interface IPostFileParams extends IFileParams {
    data?: any;
}

export const api = {
    get: async ({ link, config, setLoading, callBack, callError }: IApiParams): Promise<any> => {
        try {
            setLoading?.(true);
            const res = await vcAxios.get(link, config);
            if (res?.data?.error) {
                callError?.(res.data);
                return Promise.reject(res.data);
            }
            callBack?.(res.data || res);
            return res.data || res;
        } catch (error: any) {
            const msg = Helper.getMessageError(error?.response?.data || error);
            callError?.(msg);
            __DEV__ && console.log('GET error:', error?.response?.data || error);
            return Promise.reject(msg);
        } finally {
            setLoading?.(false);
        }
    },

    post: async ({ link, data, config, setLoading, callBack, callError }: IApiParams): Promise<any> => {
        try {
            setLoading?.(true);
            const res = await vcAxios.post(link, data, config);
            if (res?.data?.error) {
                callError?.(res.data);
                return Promise.reject(res.data);
            }
            callBack?.(res);
            return res;
        } catch (error: any) {
            const msg = Helper.getMessageError(error?.response?.data || error);
            callError?.(msg);
            __DEV__ && console.log(`POST error:`, error?.response?.data || error);
            return Promise.reject(msg);
        } finally {
            setLoading?.(false);
        }
    },

    put: async ({ link, data, config, setLoading, callBack, callError }: IApiParams): Promise<any> => {
        try {
            setLoading?.(true);
            const res = await vcAxios.put(link, data, config);
            if (res?.data?.error) {
                callError?.(res.data);
                return Promise.reject(res.data);
            }
            callBack?.(res);
            return res;
        } catch (error: any) {
            const msg = Helper.getMessageError(error?.response?.data || error);
            callError?.(msg);
            __DEV__ && console.log('PUT error:', error?.response?.data || error);
            return Promise.reject(msg);
        } finally {
            setLoading?.(false);
        }
    },

    delete: async ({ link, config, setLoading, callBack, callError }: IApiParams): Promise<any> => {
        try {
            setLoading?.(true);
            const res = await vcAxios.delete(link, config);
            if (res?.data?.error) {
                callError?.(res.data);
                return Promise.reject(res.data);
            }
            callBack?.(res);
            return res;
        } catch (error: any) {
            const msg = Helper.getMessageError(error?.response?.data || error);
            callError?.(msg);
            __DEV__ && console.log('DELETE error:', error?.response?.data || error);
            return Promise.reject(msg);
        } finally {
            setLoading?.(false);
        }
    },

    file: {
        get: async ({ link, fileName = 'file-download.png', isBase64 = false, setLoading }: IFileParams) => {
            try {
                setLoading?.(true);
                const res = await vcAxios.get(link, { responseType: 'arraybuffer' });
                const contentDisposition = res.headers?.['content-disposition'];
                const finalName = getFilenameFromContentDisposition(fileName, contentDisposition);
                const base64Str = Buffer.from(res.data, 'binary').toString('base64');
                const fileUri = FileSystem.documentDirectory + finalName;

                await FileSystem.writeAsStringAsync(fileUri, base64Str, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                return {
                    uri: fileUri,
                    base64: isBase64 ? base64Str : undefined,
                };
            } catch (e) {
                console.error('GET FILE error:', e);
                return null;
            } finally {
                setLoading?.(false);
            }
        },

        post: async ({ link, data, fileName = 'file-download.png', isBase64 = false, setLoading }: IPostFileParams) => {
            try {
                setLoading?.(true);
                const res = await vcAxios.post(link, data, { responseType: 'arraybuffer' });
                const contentDisposition = res.headers?.['content-disposition'];
                const finalName = getFilenameFromContentDisposition(fileName, contentDisposition);
                const base64Str = Buffer.from(res.data, 'binary').toString('base64');
                const fileUri = FileSystem.documentDirectory + finalName;

                await FileSystem.writeAsStringAsync(fileUri, base64Str, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                return {
                    uri: fileUri,
                    base64: isBase64 ? base64Str : undefined,
                };
            } catch (e) {
                console.error('POST FILE error:', e);
                return null;
            } finally {
                setLoading?.(false);
            }
        },

        postXml: async ({ link, data, fileName = 'file.xml', setLoading }: IPostFileParams) => {
            try {
                setLoading?.(true);
                const res = await vcAxios.post(link, data, {
                    headers: { Accept: 'application/xml' },
                    responseType: 'text',
                });
                const contentDisposition = res.headers?.['content-disposition'];
                const finalName = getFilenameFromContentDisposition(fileName, contentDisposition);
                const fileUri = FileSystem.documentDirectory + finalName;

                await FileSystem.writeAsStringAsync(fileUri, res.data, {
                    encoding: FileSystem.EncodingType.UTF8,
                });
                return {
                    uri: fileUri,
                    dataXml: res.data,
                };
            } catch (e) {
                console.error('POST XML FILE error:', e);
                return null;
            } finally {
                setLoading?.(false);
            }
        },
    },
};

function getFilenameFromContentDisposition(fallback: string, contentDisposition?: string) {
    if (!contentDisposition) return fallback;

    // Ưu tiên filename* (UTF-8)
    const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].trim());

    // Nếu không có filename*, dùng filename thường
    const normalMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
    if (normalMatch?.[1]) return normalMatch[1].trim();

    return fallback;
}
