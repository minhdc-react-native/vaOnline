import axios from 'axios';
import { clearToken, getOrgUnit, getSubDomain, getToken, getYear } from './vcStorage';

const vcAxios = axios.create();

export const attachInterceptors = (showSessionExpiredDialog: () => void) => {
    vcAxios.interceptors.request.use(async (config) => {

        const token = await getToken();
        const year = await getYear();
        const dvcs = await getOrgUnit();
        const subDomain = await getSubDomain();

        if (subDomain) {
            config.baseURL = `https://${subDomain}.vaonline.vn`;
        } else {
            config.baseURL = 'https://demoketoan.vaonline.vn';
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token};${dvcs ?? ''};${year ?? ''};vi`;
        }
        // config.headers['X-Rquested-With'] = "XMLHttpRequest";
        config.headers["Accept-language"] = "vi";
        // config.headers["X-Orgcode"] = await getOrgUnit();
        // config.headers["__tenant"] = await getTenant();
        return config;
    });

    vcAxios.interceptors.response.use(
        (response) => {
            const responseType = response.config?.responseType;
            if (responseType === 'arraybuffer' || responseType === 'blob' || responseType === 'text') {
                return response;
            }
            if (!response.data) {
                return null;
            }
            return response.data || response;
        },
        async (error) => {
            console.log("error>>", error);
            if (error.response?.status === 401) {
                await clearToken();
                showSessionExpiredDialog();
            }
            return Promise.reject(error);
        }
    );
};

export default vcAxios;
