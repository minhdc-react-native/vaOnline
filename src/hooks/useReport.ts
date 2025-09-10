import { shareFile } from "@/app/(window)/useActionMap";
import { useLoading } from "@/components/dialog/loadingProvider";
import { useToast } from "@/components/dialog/useToast";
import { IField } from "@/components/UIEngine/types";
import { useTranslation } from "@/context/TranslationContext";
import { IDataSource, IHandleActionConfig } from "@/schema";
import { api } from "@/utils/apiMethods";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useDataApp } from "./zustand/useDataApp";

const FROM_DATE = ['P_NGAY_CT1'];
const TO_DATE = ['P_NGAY_CT2'];

interface IProgs {
    itemMenuWin: IMenuWin
}
export const useReport = ({ itemMenuWin }: IProgs) => {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<IData[]>([]);
    const [currentReport, setCurrentReport] = useState<IData | null>(null);
    const [showParam, setShowParam] = useState(false);
    const dataReportFilter = useDataApp((state) => state.dataReportFilter);
    const setDataReportFilter = useDataApp((state) => state.setDataReportFilter);
    const lang = useDataApp((state) => state.lang);
    const orgUnit = useDataApp((state) => state.orgUnit);
    const userLogin = useDataApp((state) => state.userLogin);
    const { _ } = useTranslation();
    const { show, hide } = useLoading();
    const { showToast } = useToast();
    const getReports = useCallback(() => {
        api.get({
            link: `/api/Report/GetListByUser?windowId=${itemMenuWin.id}`,
            callBack: (res: IData[]) => {
                if (res.length > 0) {
                    setReports(res)
                } else {
                    setLoading(false);
                }

            }
        })
    }, [itemMenuWin]);

    useEffect(() => {
        getReports();
    }, []);

    useEffect(() => {
        if (reports.length > 0) {
            setCurrentReport(reports[0]);
        } else {
            setCurrentReport(null);
        }
    }, [reports]);

    const [data, setData] = useState<IData[]>([]);

    const [columns, setColumns] = useState<IData[]>([]);
    const [vnd_nt, setVnd_nt] = useState<'1' | '2' | '3'>('1');
    const [dataFilter, setDataFilter] = useState<Record<string, any>>({});
    const [timeItem, setTimeItem] = useState<IData | null>();

    const [layoutFilter, setLayoutFilter] = useState<IHandleActionConfig | null>(null);
    const filtered = useRef(false);
    const defaultFilter = useRef(dataReportFilter);
    defaultFilter.current = dataReportFilter;
    const getConfigReport = useCallback(async () => {
        if (!currentReport) return;
        filtered.current = false;
        setTimeItem(undefined);
        await api.get({
            link: `/api/Report/GetColumns?reportid=${currentReport.id}&menuid=`
        });
        await api.get({
            link: `/api/Report/GetInfoQuery?infoWindowId=${currentReport.INFOWINDOW_ID}`,
            callBack: (res) => {
                const configFilter = mapLayoutFilter(res, orgUnit!, userLogin!, lang, defaultFilter.current, _);
                setDataFilter(configFilter.values);
                setLayoutFilter(configFilter.layoutView);
            }
        });
        setLoading(false);
        setShowParam(true);
    }, [_, currentReport, lang, orgUnit, userLogin]);

    const onCreateReport = useCallback(async (type: 'json' | 'pdf' | 'excel', paramKey?: Record<string, any>) => {
        const dataPost = {
            afterload: null,
            infowindow_id: currentReport!.INFOWINDOW_ID,
            parameters: { ...paramKey, p_Loai_bc: vnd_nt },
            type: type,
            report_id: currentReport!.id,
            vnd_nt: vnd_nt
        };
        if (type === "json") {
            api.post({
                link: `/api/System/CreateReport`,
                data: dataPost,
                callBack: (res) => {
                    filtered.current = true;
                    setData(res)
                },
                setLoading: setLoading
            });
        } else {
            if (!filtered.current) {
                showToast('Bạn chưa xác nhận bộ lọc', { type: "warning" });
                return;
            }
            show('Tải file ...');
            const file = await api.file.post({
                link: `/api/System/CreateReport`,
                data: dataPost,
                fileName: currentReport!.REPORT_FILE
            });
            hide();
            if (file) {
                if (type === "pdf") {
                    router.navigate({ pathname: '/viewPdf', params: { title: currentReport!.REPORT_NAME, uriPdf: file.uri } });
                } else {
                    await shareFile({ uri: file.uri, title: currentReport!.REPORT_NAME, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                }
            }
        }
    }, [vnd_nt, show, hide, currentReport]);

    const onFilter = useCallback((paramKey?: Record<string, any>, timeItem?: IData | null) => {
        setShowParam(false);
        if (timeItem) setTimeItem(timeItem);
        if (paramKey) {
            setDataFilter(paramKey);
            if (layoutFilter?.isSelectTime?.from && layoutFilter?.isSelectTime?.to) {
                setDataReportFilter({ NGAY_CT1: paramKey[layoutFilter.isSelectTime.from], NGAY_CT2: paramKey[layoutFilter.isSelectTime.to] });
            }
            onCreateReport("json", paramKey);
        }
    }, [setDataReportFilter, onCreateReport, layoutFilter?.isSelectTime]);

    useEffect(() => {
        setLoading(true);
        getConfigReport();
    }, [getConfigReport]);

    return {
        loading,
        reports,
        currentReport,
        showParam,
        layoutFilter,
        dataFilter,
        timeItem,
        vnd_nt,
        setVnd_nt,
        setLoading,
        getConfigReport,
        getReports,
        onFilter,
        setShowParam,
        setCurrentReport,
        onCreateReport
    }
}


const getUrlReference = (id: string) => `/api/System/GetDataByReferencesId?id=${id}`;

const pick = ({ id, ROW, COL, NAME, TYPE_EDITOR, CAPTION, REF_ID }: IData) =>
    ({ id: String(id), ROW, COL, NAME, TYPE_EDITOR, CAPTION, REF_ID });
const mapLayoutFilter = (dataFilter: IData[], orgUnit: string, userLogin: string, lang: string,
    dataReportFilter: Record<string, any>, _: (key?: string) => string) => {
    const title = lang === "vi" ? dataFilter[0].WINDOW_NAME : dataFilter[0].en_NAME;

    const arrReplace: Record<string, any> = {
        DVCS_ID: orgUnit,
        USER: userLogin,
        ...dataReportFilter
    };
    let paramHidden: any = [];
    let isSelectTime: any = { check: false, from: null, to: null };
    let zod: Record<string, {
        type: "string" | "number";
        msgError?: string;
    }> = {};

    let dataSource: IDataSource = {};

    const values = dataFilter.reduce((acc, item) => {
        if (item.NAME !== 'p_list_time') {
            const defaultValue = (item.DEFAULTVALUE ?? '').replace('@Default=', '');
            acc[item.NAME] = arrReplace[defaultValue] !== undefined ? arrReplace[defaultValue] : defaultValue;
            if (item.HIDDEN === "C") paramHidden.push(item.NAME);
            if (FROM_DATE.includes((item.NAME as string).toUpperCase())) isSelectTime.from = item.NAME;
            if (TO_DATE.includes((item.NAME as string).toUpperCase())) isSelectTime.to = item.NAME;

            if (['gridcombo', 'combo', 'multiselect', 'treesuggest', 'richselect'].includes(item.TYPE_EDITOR)) {
                dataSource[item.NAME] = { url: getUrlReference(item.REF_ID) };
            }

            if ([...FROM_DATE, ...TO_DATE].includes((item.NAME as string).toUpperCase())) zod[item.NAME] = { type: "string" };

        } else {
            isSelectTime.check = true;
        }
        return acc;
    }, {} as Record<string, any>);

    const newDataFilter = dataFilter.filter(f => f.HIDDEN !== "C" && f.NAME !== 'p_list_time').reduce((acc, item) => {
        if (!acc[item.ROW]) acc[item.ROW] = [];
        acc[item.ROW].push(pick(item));
        return acc;
    }, {} as Record<number, { id: string; ROW: number; COL: number, NAME: string, TYPE_EDITOR: string, CAPTION: string, REF_ID: string }[]>);

    const layout: IField[] = Object.values(newDataFilter).map((items) => {
        if (items.length === 1) return getConfigView(items[0], _);
        return { type: 'rows', style: { alignItems: 'center' }, fields: items.map(_item => getConfigView(_item, _, { flex: 1 })) };
    });
    const layoutView: IHandleActionConfig = {
        title: title,
        values: values,
        view: {
            type: "cols",
            fields: layout
        },
        dataSource: dataSource,
        isSelectTime: isSelectTime.check ? { from: isSelectTime.from, to: isSelectTime.to } : undefined,
        zod: zod
    }
    return { layoutView, values, isSelectTime };
}
// map view
const TypeEditor = {
    text: 'text',
    gridcombo: 'gridcombo',
    combo: 'combo',
    treesuggest: 'treesuggest',
    richselect: 'richselect',
    gridsuggest: 'gridsuggest',
    dateedit: 'dateedit',
    multiselect: 'multiselect'
}
const getConfigView = (item: IData, _: (key?: string) => string, style?: StyleProp<ViewStyle>): IField => {
    switch (item.TYPE_EDITOR) {
        case TypeEditor.text:
            return {
                type: "input",
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.gridcombo:
            return {
                type: "selectList",
                tableWin: "Empty",
                fValue: 'id',
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.combo:
            return {
                type: "selectList",
                tableWin: "Empty",
                fValue: 'id',
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.richselect:
            return {
                type: "selectList",
                tableWin: "Empty",
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.treesuggest:
            return {
                type: "selectList",
                tableWin: "Empty",
                fValue: 'id',
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.gridsuggest:
            return {
                type: "search",
                tableSearch: "CUSTOM",
                idRef: item.REF_ID,
                fField: 'id',
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.dateedit:
            return {
                type: "date",
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.multiselect:
            return {
                type: "selectListMulti",
                tableWin: "Empty",
                fValue: 'id',
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        default:
            return { type: "empty", style: style }
    }
}