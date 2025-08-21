import { VcData } from "@/constants/vcData";
import { api } from "@/utils/apiMethods";
import { clearRemember, clearToken, getToken, getYear, saveOrgUnit, saveRemember, saveToken, saveYear } from "@/utils/vcStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFeedback } from "./useFeedback";
import { useDataApp } from "./zustand/useDataApp";
export const useAuth = () => {
    const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [listApp, setListApp] = useState<IData[]>([]);
    const [listDvcs, setListDvcs] = useState<IData[]>([]);
    const [infoDvcs, setInfoDvcs] = useState<IData>();
    const [licenseInfo, setLicenseInfo] = useState<IData>();
    const { setLoading, showToast, showPopup } = useFeedback();
    const setYears = useDataApp((state) => state.setYears);
    useEffect(() => {
        const checkLogin = async () => {
            const token = await getToken();
            setLoggedIn(!!token);
        };
        checkLogin();
    }, []);

    const logout = async () => {
        showPopup({
            message: "Bạn có muốn thoát ứng dụng không?",
            showCancel: true,
            cancelText: "Không",
            confirmText: "Có thoát",
            iconType: "question",
            onConfirm: async () => {
                await clearToken();
                setLoggedIn(false);
                router.replace('/(auth)/login'); // 👈 chuyển về màn login
            }
        });
    };

    const login = async (data: Record<string, string>) => {
        await api.post({
            link: `/api/Account/Login`,
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            data: data,
            callBack: async (res) => {
                if (res && res.error) {
                    showToast(res.error, { type: "error" });
                    return;
                }
                await saveToken(res.token);
                await saveOrgUnit(data.dvcs);
                if (data.remember) {
                    await saveRemember(data);
                } else {
                    await clearRemember();
                }
                setYears(res.nam);
                const currentYear = await getYear();
                if (!currentYear) {
                    await saveYear(res.nam?.[0].NAM);
                }
                //
                router.replace("/list-app");
            },
            setLoading: (loading) => setLoading(loading, false, 'Truy cập...'),
            callError: (err) => {
                console.log("error>>", JSON.stringify(err));
            }
        });
    }

    const getDvcsByUser = async (username: string) => {
        api.get({
            link: `/api/System/GetDvcsByUser?username=${username}`,
            callBack: (res) => {
                setListDvcs(res);
            },
            setLoading: setLoading
        })
    }
    const getLicenseInfo = async () => {
        api.get({
            link: `/api/License/Info`,
            callBack: (res) => setLicenseInfo(res)
        })
    }
    const getListApp = async () => {
        await api.post({
            link: `/api/System/Command`,
            data: {
                command: 'G_APP_ICON',
                parameter: {}
            },
            callBack: (res: any) => {
                if (res && res.error) {
                    showToast(res.error, { type: "error" });
                    return;
                }
                setListApp(res.filter((item: any) => VcData.listApp.includes(item.id)));
            },
            // setLoading: setLoading
        });
    }

    const getInfoDvcs = async () => {
        await api.get({
            link: `/api/System/GetInfoDvcs`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    setInfoDvcs(res[0]);
                }
            },
            // setLoading: setLoading
        });
    }

    return {
        isLoggedIn,
        listApp,
        listDvcs,
        infoDvcs,
        licenseInfo,
        getDvcsByUser,
        login,
        logout,
        getListApp,
        getInfoDvcs,
        getLicenseInfo
    }
}