import { IConfigDateMenuWin, VcData } from "@/constants/vcData";
import { useTranslation } from "@/context/TranslationContext";
import { api } from "@/utils/apiMethods";
import { clearRemember, clearToken, saveOrgUnit, saveRemember, saveToken, saveYear } from "@/utils/vcStorage";
import { router } from "expo-router";
import { useState } from "react";
import * as Keychain from "react-native-keychain";
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
    const setOrgUnit = useDataApp((state) => state.setOrgUnit);
    const setUserLogin = useDataApp((state) => state.setUserLogin);
    const setCurrentYear = useDataApp((state) => state.setCurrentYear);
    const setMenuIds = useDataApp((state) => state.setMenuIds);
    const setParamSystem = useDataApp((state) => state.setParamSystem);
    const setDataMenuWin = useDataApp((state) => state.setDataMenuWin);
    const setLang = useDataApp((state) => state.setLang);
    const setListVoucher2 = useDataApp((state) => state.setListVoucher2);
    const setCurrencies = useDataApp((state) => state.setCurrencies);
    const { setTranslations, _ } = useTranslation();

    const saveBiometric = async (password: string) => {
        const biometryType = await Keychain.getSupportedBiometryType();
        if (biometryType) {
            await Keychain.setGenericPassword("user", password, {
                service: "com.anonymous.accountingonline",
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            });
        } else {
            showToast('❌ Máy của bạn chưa cài đặt sinh trắc học!');
            await Keychain.setGenericPassword("user", password, {
                service: "com.anonymous.accountingonline",
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            });
        }
    };

    const biometricLogin = async (callBack: (password: string) => void) => {
        try {
            const credentials = await Keychain.getGenericPassword({
                authenticationPrompt: {
                    title: "Đăng nhập",
                    subtitle: "Xác thực bằng Face ID / vân tay",
                    description: "Sử dụng sinh trắc học để đăng nhập",
                },
                service: "com.anonymous.accountingonline",
            });
            console.log("credentials>>", credentials);
            if (credentials) {
                console.log("✅ Lấy token:", credentials.password);
                callBack(credentials.password);
                return credentials.password; // password lưu trước đó
            }
            return null;
        } catch (e) {
            console.log("❌ Lỗi sinh trắc học:", e);
            logout();
            showToast("❌ Lỗi sinh trắc học");
            return null;
        }
    };

    const logout = async () => {
        showPopup({
            message: _('MUON_THOAT'),
            showCancel: true,
            cancelText: _('KHONG'),
            confirmText: _('CO'),
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
                await saveBiometric(data.pass);
                await saveToken(res.token);

                setOrgUnit(data.dvcs);
                setUserLogin(data.username);

                await saveOrgUnit(data.dvcs);

                if (data.remember) {
                    await saveRemember(data);
                } else {
                    await clearRemember();
                }
                await getRoundNumber();
                setYears(res.nam);
                saveYear(res.nam?.[0].NAM);
                setCurrentYear(res.nam?.[0].NAM);

                setLang(data.lang ?? 'vi');
                await getListVoucher2();

                await getCurrencies();
                await getLangTitle(data.lang ?? 'vi');
                setLoggedIn(true);
                //
                router.replace("/list-app");
            },
            setLoading: (loading) => setLoading(loading, false, 'Truy cập...'),
            callError: (err) => {
                console.log("error>>", JSON.stringify(err));
            }
        });
    }
    const getRoundNumber = async () => {
        await api.get({
            link: `/api/System/GetConfigNumber`,
            callBack: (res) => {
                const item = res?.[0];
                setParamSystem({
                    rQuantity: item?.SL ?? 2,
                    rPrice: item?.GIA ?? 2,
                    rPriceNt: item?.GIA_NT ?? 2,
                    rAmount: item?.TIEN ?? 2,
                    rAmountNt: item?.TIEN_NT ?? 2,
                    rPercentage: item?.PT ?? 2,
                    rExchangeRate: item?.TY_GIA ?? 2,
                    rRate: item?.TY_LE ?? 2,
                    minAmountChange: 1000,
                });
            }
        })
    }
    const getLangTitle = async (lang: string) => {
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

    const getCurrencies = async () => {
        await api.get({
            link: `/api/System/GetDataByReferencesId?id=98665935-a3db-487e-8bc5-2a63515972b5`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    setCurrencies(Object.fromEntries(
                        res.map(({ MA_NT, CONG_THUC, TY_GIA }) => [MA_NT, { isMultiplication: CONG_THUC === 1, TY_GIA }])
                    ))
                }
            },
            // setLoading: setLoading
        });
    }

    const getListVoucher2 = async () => {
        const sql = encodeURIComponent("SELECT LIST_CT FROM TYPE_CT WHERE TYPE_CT= '000'");
        await api.get({
            link: `/api/System/ExecuteQuery?sql=${sql}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    setListVoucher2(res[0].LIST_CT);
                }
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
        setLoggedIn,
        getDvcsByUser,
        biometricLogin,
        login,
        logout,
        getListApp,
        getInfoDvcs,
        getLicenseInfo,
        onSelectApp
    }
}