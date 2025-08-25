import { IConfigDateMenuWin, VcData } from "@/constants/vcData";
import { useTranslation } from "@/context/TranslationContext";
import { api } from "@/utils/apiMethods";
import { clearRemember, clearToken, getToken, saveOrgUnit, saveRemember, saveToken, saveYear } from "@/utils/vcStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFeedback } from "./useFeedback";
import { useDataApp } from "./zustand/useDataApp";

const collectAllIds = (menuItems: any[]): string[] => {
    const ids: string[] = [];
    function traverse(items: any[]) {
        for (const item of items) {
            if (item.id) {
                ids.push(item.window_id);
            }
            // Đệ quy nếu có submenu là mảng
            if (item.submenu && Array.isArray(item.submenu)) {
                traverse(item.submenu);
            }
        }
    }
    traverse(menuItems);
    return ids;
}
function filterDataMenu(
    data: Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>>,
    ids: string[]
): Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>> {
    return Object.fromEntries(
        Object.entries(data)
            .map(([sectionKey, sectionValue]) => {
                if (!sectionValue) return [sectionKey, {}];

                const filteredSection = Object.fromEntries(
                    Object.entries(sectionValue)
                        .map(([menuKey, arr]) => {
                            if (!arr) return [menuKey, []];

                            const newArr = arr.map(section => ({
                                ...section,
                                data: section.data.filter(item => ids.includes(item.id))
                            }));

                            // Bỏ các section không có data
                            const nonEmptySections = newArr.filter(s => s.data.length > 0);
                            return [menuKey, nonEmptySections];
                        })
                        // Bỏ key nếu toàn bộ arr rỗng
                        .filter(([, arr]) => (arr as IConfigDateMenuWin[]).length > 0)
                );

                return [sectionKey, filteredSection];
            })
            // Bỏ cả section nếu không còn gì
            .filter(([, sectionValue]) => Object.keys(sectionValue).length > 0)
    );
}


export const useAuth = () => {
    const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [listApp, setListApp] = useState<IData[]>([]);
    const [listDvcs, setListDvcs] = useState<IData[]>([]);
    const [infoDvcs, setInfoDvcs] = useState<IData>();
    const [licenseInfo, setLicenseInfo] = useState<IData>();
    const { setLoading, showToast, showPopup } = useFeedback();
    const setYears = useDataApp((state) => state.setYears);
    const setCurrentYear = useDataApp((state) => state.setCurrentYear);
    const setMenuIds = useDataApp((state) => state.setMenuIds);
    const setDataMenuWin = useDataApp((state) => state.setDataMenuWin);
    const { setTranslations } = useTranslation();

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
                saveYear(res.nam?.[0].NAM);
                setCurrentYear(res.nam?.[0].NAM);
                await getLang('vi');
                //
                router.replace("/list-app");
            },
            setLoading: (loading) => setLoading(loading, false, 'Truy cập...'),
            callError: (err) => {
                console.log("error>>", JSON.stringify(err));
            }
        });
    }

    const getLang = async (lang: string) => {
        await api.get({
            link: `/api/System/GetLanguagesByMa?lang=${lang}`,
            callBack: (res) => {
                const dict: Record<string, string> = {};
                res.forEach((item: any) => {
                    dict[item.KEY_LANG] = item.VALUES_LANG;
                });
                setTranslations(dict);
            }
        })
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
            callBack: (res) => {
                setLicenseInfo(res)
            }
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
                setListApp(res.data.filter((item: any) => VcData.listApp.includes(item.id)));
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

    const onSelectApp = async (id: string) => {
        await api.get({
            link: `/api/System/GetAppMenu?id=${id}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    const ids = collectAllIds(res);
                    setMenuIds(ids);
                    const filtered = filterDataMenu((VcData.menuApp as any)[id], ids);
                    setDataMenuWin(filtered);
                } else {
                    setDataMenuWin((VcData.menuApp as any)[id]);
                }
                router.replace((VcData.routerApp as any)[id]);
            },
            setLoading: setLoading
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
        getLicenseInfo,
        onSelectApp
    }
}