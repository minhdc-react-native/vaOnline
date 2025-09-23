import { DataMenuAccounting, WindowAccounting } from "@/constants/dataMenuAccounting";
import { DataMenuHkd, WindowHkd } from "@/constants/dataMenuHkd";
import { IConfigDateMenuWin, VcData } from "@/constants/vcData";
import { useTranslation } from "@/context/TranslationContext";
import { setupCalendarLocales } from "@/locales/locale";
import { theme } from "@/theme/theme";
import { api } from "@/utils/apiMethods";
import { clearRemember, clearToken, saveOrgUnit, saveRemember, saveToken, saveYear } from "@/utils/vcStorage";
import { router } from "expo-router";
import { useState } from "react";
import { useFeedback } from "./useFeedback";
import { useDataApp } from "./zustand/useDataApp";
const colors = theme.colors, nameIcon = "arrow-right-thin";
const icon: any = { type: "M", name: nameIcon, color: colors.secondary };
// reset config
const windowIds = {
    goods: [...WindowAccounting.goods, ...WindowHkd.goods],
    accounting: [...WindowAccounting.accounting, ...WindowHkd.accounting],
    reports: [...WindowAccounting.reports, ...WindowHkd.reports]
}

const collectAllIds = (menuItems: any[], resVoucher: IData[]): string[] => {

    const otherSubsystemsAccounting = DataMenuAccounting.custom.otherSubsystems;
    const otherSubsystemsHkd = DataMenuHkd.custom.otherSubsystems;

    for (let i = 0; i < 3; i++) {
        otherSubsystemsAccounting![i].data = [];
        otherSubsystemsHkd![i].data = []
    }
    resVoucher.map(vourcher => {
        const idx = vourcher.DP === 'KT' ? 1 : 0;
        const copyDetails = vourcher.DP === 'KT' ? { CTKT: ['TK_NO', 'TK_CO'] } : { CTHV: ['MA_KHO'] };
        const tableWin: ITableWin = vourcher.DP === 'KT' ? "DPKT" : "DPHV";
        const lenAcc = otherSubsystemsAccounting![idx].data.length + 1;
        const lenHkd = otherSubsystemsHkd![idx].data.length + 1;
        const menuWin: IMenuWin = {
            id: vourcher.WINDOW_ID, typeWin: "(winMaster)", tableWin: tableWin, label: vourcher.WINDOW_NAME, labelE: vourcher.WINDOW_NAME,
            defaultValue: { MA_CT: vourcher.MA_CT }, copyDetails: copyDetails, icon: icon, col: 1, row: 1, typeView: { _typeView: 2 }
        };
        otherSubsystemsAccounting![idx].data.push({ ...menuWin, row: lenAcc, typeView: { _typeView: 1 } });
        otherSubsystemsHkd![idx].data.push({ ...menuWin, row: lenHkd, typeView: { _typeView: 2 } });
    });
    const ids: string[] = [];
    function traverse(items: any[]) {
        for (const item of items) {
            // Đệ quy nếu có submenu là mảng
            if (item.submenu && Array.isArray(item.submenu)) {
                traverse(item.submenu);
            } else {
                // nếu là báo cáo
                if (item.code === 'reportwindow' && !windowIds.reports.includes(item.window_id)) {
                    const len = otherSubsystemsAccounting![2].data.length + 1;
                    const label = item.value;
                    otherSubsystemsAccounting![2].data.push(
                        {
                            id: item.window_id, typeWin: "(report)", tableWin: "Empty", label: label, labelE: label,
                            icon: icon, row: len, col: 1
                        }
                    );
                    otherSubsystemsHkd![2].data.push(
                        {
                            id: item.window_id, typeWin: "(report)", tableWin: "Empty", label: label, labelE: label,
                            icon: icon, row: len, col: 1
                        }
                    );
                }
                ids.push(item.window_id);
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
                                data: section.data.filter(item => (item.id.startsWith("LINE-") || ids.includes(item.id)))
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
    const orgUnit = useDataApp((state) => state.orgUnit);
    const { setTranslations, _ } = useTranslation();

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
        const _loginError = async () => {
            await clearToken();
            setLoggedIn(false);
            router.replace('/(auth)/login');
        };
        await api.post({
            link: `/api/Account/Login`,
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            data: data,
            callBack: async (res) => {

                if (!!res) {
                    if (res.error) {
                        showToast(res.error, { type: "error" });
                        _loginError();
                        return;
                    } else {
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

                        setupCalendarLocales(data.lang === 'vi' ? 'vi' : 'en');

                        await getListVoucher2();

                        await getCurrencies();
                        await getLangTitle(data.lang ?? 'vi');
                        setLoggedIn(true);
                        //
                        router.replace("/list-app");
                    }
                } else {
                    _loginError();
                }
            },
            setLoading: (loading) => setLoading(loading, false, 'Truy cập...'),
            callError: async (err) => {
                console.log("error>>", JSON.stringify(err));
                _loginError();
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
                    TK: {
                        TK_PTHU: '131',
                        TK_PTRA: '331',
                        TK_CK: '5211'
                    }
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

    const getInfoDvcs = async (setLoading?: (loading: boolean) => void) => {
        await api.get({
            link: `/api/System/GetInfoDvcs`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    setInfoDvcs(res[0]);
                }
            },
            setLoading: setLoading
        });
    }

    const onSelectApp = async (id: string) => {
        // lấy những chứng tự đặc thù.
        const listVoucher = [...windowIds.goods, ...windowIds.accounting];

        const url = encodeURIComponent(`SELECT a.id,a.WINDOW_ID,a.WINDOW_NAME,b.MA_CT,b.DP ` +
            `FROM VC_WINDOW a INNER JOIN DMCT b ON a.MA_CT=b.MA_CT AND b.DVCS_ID=N'${orgUnit}' AND CharIndex(b.DP,'HV,KT')>0 ` +
            `ORDER BY b.DP desc,b.STT_CT,b.MA_CT`);
        const res: IData[] = await api.get({
            link: `/api/System/ExecuteQuery?sql=${url}`
        });

        const resVoucher = res.filter(i => !listVoucher.includes(i.WINDOW_ID));

        await api.get({
            link: `/api/System/GetAppMenu?id=${id}`,
            callBack: (res: any[]) => {
                if (res && res.length > 0) {
                    const ids = collectAllIds(res, resVoucher);
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
        login,
        logout,
        getListApp,
        getInfoDvcs,
        getLicenseInfo,
        onSelectApp
    }
}