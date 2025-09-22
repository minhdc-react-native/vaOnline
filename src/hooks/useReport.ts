import { shareFile } from "@/app/(window)/useActionMap";
import { useLoading } from "@/components/dialog/loadingProvider";
import { useToast } from "@/components/dialog/useToast";
import { IField } from "@/components/UIEngine/types";
import { useTranslation } from "@/context/TranslationContext";
import { IDataSource, IHandleActionConfig } from "@/schema";
import { getListItemView, ListItemView } from "@/schema/voucher/itemView";
import { api } from "@/utils/apiMethods";
import { Helper } from "@/utils/Helper";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import FileViewer from 'react-native-file-viewer';
import UUID from 'react-native-uuid';
import { useDataApp } from "./zustand/useDataApp";

const fixWidth = 1.07;

const FROM_DATE = ['P_NGAY_CT1', 'P_NGAY1'];
const TO_DATE = ['P_NGAY_CT2', 'P_NGAY2'];

const FROM_DATE0 = ['P_NGAY_CT01', 'P_NGAY01'];
const TO_DATE0 = ['P_NGAY_CT02', 'P_NGAY02'];

interface IProgs {
    itemMenuWin?: IMenuWin,
    reportDefault?: IReportItemDefault
}
export const useReport = ({ itemMenuWin, reportDefault }: IProgs) => {
    const [loading, setLoading] = useState(!reportDefault);
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

    useEffect(() => {
        if (reports.length > 0) {
            setCurrentReport(reports[0]);
        } else {
            setCurrentReport(null);
        }
    }, [reports]);

    const [data, setData] = useState<IData[]>([]);
    const [menuRow, setMenuRow] = useState<IData[]>([]);

    const routerNumber = useRef(reportDefault?.routerNumber ?? 0);

    const [reportSchema, setReportSchema] = useState<ISchemaReport | null>(null);
    const [vnd_nt, setVnd_nt] = useState<'1' | '2' | '3'>(reportDefault?.vnd_nt ?? '1');
    const [dataFilter, setDataFilter] = useState<Record<string, any>>({});
    const [timeItem, setTimeItem] = useState<IData | null>();

    const [layoutFilter, setLayoutFilter] = useState<IHandleActionConfig | null>(null);
    const filtered = useRef(false);
    const defaultFilter = useRef(dataReportFilter);
    defaultFilter.current = dataReportFilter;
    const sourceKey = useRef<IDataSource>({});

    const getReports = useCallback(() => {
        if (itemMenuWin) {
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
        }
        if (reportDefault) {
            setReports([reportDefault.reportItem]);
        }
    }, [itemMenuWin, reportDefault]);

    useEffect(() => {
        getReports();
    }, []);

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
            await api.post({
                link: `/api/System/CreateReport`,
                data: dataPost,
                callBack: (res) => {
                    filtered.current = true;
                    setData(res.map((row: IData) => ({ ...row, idRow: UUID.v4() })))
                },
                setLoading: setLoading
            });
        } else {
            if (!filtered.current) {
                showToast('Bạn chưa xác nhận bộ lọc', { type: "warning" });
                return;
            }
            const file = await api.file.post({
                link: `/api/System/CreateReport`,
                data: dataPost,
                fileName: currentReport!.REPORT_FILE,
                setLoading: setLoading
            });
            if (file) {
                FileViewer.open(file.uri) // mở theo trình đọc của thiết bị.
                    .then(() => console.log('Opened'))
                    .catch(async (error) => {
                        console.log(error);
                        await shareFile({
                            uri: file.uri, title: currentReport!.REPORT_NAME,
                            type: type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        }
                        );
                    });
            }
        }
    }, [vnd_nt, currentReport, showToast]);

    const onFilter = useCallback((paramKey?: Record<string, any>, timeItem?: IData | null) => {
        setShowParam(false);
        if (paramKey) {
            setData([]);
            if (timeItem) setTimeItem(timeItem);
            setDataFilter(paramKey);
            if (layoutFilter?.isSelectTime?.from && layoutFilter?.isSelectTime?.to) {
                setDataReportFilter({ NGAY_CT1: paramKey[layoutFilter.isSelectTime.from], NGAY_CT2: paramKey[layoutFilter.isSelectTime.to] });
            }
            onCreateReport("json", paramKey);
        }
    }, [setDataReportFilter, onCreateReport, layoutFilter?.isSelectTime]);

    const onRefresh = useCallback((filter?: Record<string, any>) => {
        if (!filtered.current) {
            showToast('Bạn chưa xác nhận bộ lọc', { type: "warning" });
            return;
        }
        onFilter(filter || dataFilter);
    }, [dataFilter, onFilter, showToast]);

    const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const [tableRefresh, setTableRefresh] = useState<Record<string, { url: string, type?: string, dataPost?: Record<string, any>, key: string }>>({});
    const setSource = useCallback((res: IData[] | string[], source: any, key: string) => {
        if (res.length === 0) {
            setDataSource(prev => ({
                ...prev,
                [key]: []
            }));
            return;
        };
        const configSource: any = source[key];

        if (res.length > 0 && typeof res[0] === "string") res = (res as string[]).map(r => ({ id: r as string, value: r as string }));

        if (configSource.typeData === "tree") res = Helper.sortTreeFlat((res as IData[]), configSource.fieldCode);
        const fields: string[] = configSource.fields || Object.keys(res[0]);
        const isColor = fields.indexOf("color") < 0 && typeof configSource.getColor === "function";
        const result = res.map((item: any) => {
            const obj = Object.fromEntries(
                fields.map(f => [f, item[f]])
            );
            if (isColor) {
                obj.color = configSource.getColor(item);
            }
            return obj;
        });
        setDataSource(prev => ({
            ...prev,
            [key]: result
        }));
    }, []);

    const loadDataBegin = useCallback(async () => {
        const source = sourceKey.current;
        const promises = Object.keys(source).map(async (key: any) => {
            const configSource: any = source[key];
            if (configSource?.data) {
                setDataSource(prev => ({
                    ...prev,
                    [key]: source[key]?.data
                }));
            }
            if (configSource?.url) {
                const url = (configSource.url as string).replace('#DVCS_ID#', encodeURIComponent(orgUnit!));

                const apiGetPost = configSource.type === "post" ? api.post : api.get;
                await apiGetPost({
                    link: url, data: configSource.dataPost,
                    callBack: (res => {
                        if (res) {
                            setSource(res, source, key);
                            if (configSource?.tableWin) {
                                setTableRefresh(prev => ({
                                    ...prev,
                                    [configSource.tableWin]: { url: configSource.url, type: configSource.type, dataPost: configSource.dataPost, key: key }
                                }));
                            }
                        }
                    })
                });
            }
        });
        await Promise.all(promises);
        setLoading(false);
    }, [orgUnit, setSource]);

    const getConfigReport = useCallback(async () => {
        if (!currentReport) return;
        filtered.current = false;
        setTimeItem(undefined);
        setReportSchema(null);
        setData([]);
        await api.get({
            link: `/api/Report/GetColumns?reportid=${currentReport.id}&menuid=`,
            callBack: (res) => {
                const columns = mapColumnTable(res);
                setReportSchema({ columnsTable: columns, onPressItem: undefined });
            }
        });
        await api.get({
            link: `/api/Report/GetInfoQuery?infoWindowId=${currentReport.INFOWINDOW_ID}`,
            callBack: async (res) => {
                const configFilter = mapLayoutFilter(res, orgUnit!, userLogin!, lang, defaultFilter.current, _);
                sourceKey.current = configFilter.dataSource;
                await loadDataBegin();
                setLayoutFilter(configFilter.layoutView);
                if (!reportDefault) {
                    setDataFilter(configFilter.values);
                    setShowParam(true);
                } else {
                    const filter = { ...configFilter.values, ...reportDefault.dataFilter };
                    setDataFilter(filter);
                    filtered.current = true;
                    onRefresh(filter)
                }
            }
        });
        const url = encodeURIComponent(`SELECT id,REPORT_ID,MENU_ID,PARAMETERS,VISIBLE_WHEN,ICON icon,ICON_COLOR icon_color,CAPTION as value FROM VC_MENUROW WHERE VC_REPORT_id='${currentReport.id}' ORDER BY MENU_ID`);
        await api.get({
            link: `/api/System/ExecuteQuery?sql=${url}`,
            callBack: (res: IData[]) => setMenuRow(res.filter(menu => menu.REPORT_ID))
        });

        if (!reportDefault) setLoading(false);
    }, [_, currentReport, lang, orgUnit, userLogin, loadDataBegin]);

    const shouldRefresh = useDataApp((state) => state.shouldRefresh);
    const setShouldRefresh = useDataApp((state) => state.setShouldRefresh);

    useEffect(() => {
        if (shouldRefresh && tableRefresh[shouldRefresh]) {
            const source = sourceKey.current;
            const apiConfig = tableRefresh[shouldRefresh];
            const apiRefresh = apiConfig.type === "post" ? api.post : api.get;
            apiRefresh({
                link: apiConfig.url,
                data: apiConfig.dataPost,
                callBack: (res) => {
                    setSource(res, source, apiConfig.key);
                    setShouldRefresh(null);
                }
            });
        }
    }, [setShouldRefresh, setSource, shouldRefresh, tableRefresh]);

    useEffect(() => {
        setLoading(true);
        getConfigReport();
    }, [getConfigReport]);
    return {
        loading,
        reports,
        reportSchema,
        currentReport,
        showParam,
        layoutFilter,
        dataFilter,
        timeItem,
        vnd_nt,
        data,
        dataSource,
        menuRow,
        routerNumber: routerNumber.current,
        onRefresh,
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
const mapColumnTable = (arr: IData[]): Record<'1' | '2' | '3', IColumnReport[]> => {
    return {
        '1': groupByColspan(arr.filter(f => f.HIDDEN !== 'C' && (f.VND_NT ?? '1,2,3').includes('1'))),
        '2': groupByColspan(arr.filter(f => f.HIDDEN !== 'C' && (f.VND_NT ?? '1,2,3').includes('2'))),
        '3': groupByColspan(arr.filter(f => f.HIDDEN !== 'C')),
    }
};
// layout column
const TYPE_NUMBER = ['VC_TIEN', 'VC_DONGIA', 'VC_SOLUONG', 'VC_PT', 'decimal'];
const TYPE_DATE = ['VC_DATE', 'VC_DATETIME', 'datetime']
const getFormat = (type: string | null): "string" | "number" | "date" => {
    if (!type) return "string";
    return TYPE_NUMBER.includes(type) ? "number" : (TYPE_DATE.includes(type) ? "date" : "string");
}
const MapRoundNumber: Record<string, IRoundNumber> = {
    '#SO_LUONG#': 'rQuantity',
    '#GIA#': 'rPrice',
    '#GIA_NT#': 'rPriceNt',
    '#TIEN#': 'rAmount',
    '#TIEN_NT#': 'rAmountNt',
    '#PT#': 'rPercentage',
    '#TY_GIA#': 'rExchangeRate',
    '#TY_LE#': 'rRate'
}
const getColumn = (item: IData) => {
    const { HEADER, REPORTCOLUMN_FIELD, REPORTCOLUMN_NAME, COLUMN_TYPE, REPORTCOLUMN_FOMAT, REPORTCOLUMN_WIDTH } = item;
    const header = HEADER ? JSON.parse(HEADER) : null;
    const field = REPORTCOLUMN_FIELD.toUpperCase().replace('_HTML', '');
    const name = Array.isArray(header) && header.length > 1 ? (header[1]?.text || REPORTCOLUMN_NAME) : REPORTCOLUMN_NAME;
    const formatType = getFormat(COLUMN_TYPE);
    const keyRoundNumber: IRoundNumber = MapRoundNumber[REPORTCOLUMN_FOMAT ?? '#TIEN#'];
    return {
        id: field,
        title: name,
        width: REPORTCOLUMN_WIDTH * fixWidth,
        format: {
            type: formatType,
            roundNumber: formatType === "number" ? keyRoundNumber : undefined
        }
    };
}
function groupByColspan(arr: IData[]): IColumnReport[] {
    const res: IColumnReport[] = [];
    let i = 0;
    while (i < arr.length) {
        const item = arr[i];
        const header = item.HEADER ? JSON.parse(item.HEADER) : null;
        const colspan = Array.isArray(header) && header.length > 0 ? (header[0]?.colspan ?? 0) : 0;
        const column = getColumn(item);
        if (colspan >= 2) {
            const end = Math.min(arr.length, i + colspan);
            const children: IColumnReport[] = [];
            for (let j = i; j < end; j++) {
                const columnChild = getColumn(arr[j]);
                children.push({ ...columnChild });
            }
            res.push({ title: header[0]?.text, children });
            i = end;
        } else {
            res.push(column);
            i++;
        }
    }
    return res;
}
// layout filter
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
    let isSelectTime: any = { check: false, from: null, to: null, from0: null, to0: null };
    let zod: Record<string, {
        type: "string" | "number";
        msgError?: string;
    }> = {};

    let dataSource: IDataSource = {};

    const values = dataFilter.reduce((acc, item) => {
        const isNotListTime = (item.NAME as string).toUpperCase() !== 'P_LIST_TIME';
        if (isNotListTime) {
            const defaultValue = (item.DEFAULTVALUE ?? '').replace('@Default=', '');
            acc[item.NAME] = arrReplace[defaultValue] !== undefined ? arrReplace[defaultValue] : (['checkbox', 'autonumeric'].includes(item.TYPE_EDITOR) ? Number(defaultValue) : defaultValue);

            if (item.HIDDEN === "C") paramHidden.push(item.NAME);

            if (FROM_DATE.includes((item.NAME as string).toUpperCase())) isSelectTime.from = item.NAME;
            if (TO_DATE.includes((item.NAME as string).toUpperCase())) isSelectTime.to = item.NAME;
            if (FROM_DATE0.includes((item.NAME as string).toUpperCase())) isSelectTime.from0 = item.NAME;
            if (TO_DATE0.includes((item.NAME as string).toUpperCase())) isSelectTime.to0 = item.NAME;

            if (['gridcombo', 'combo', 'multiselect', 'treesuggest', 'richselect', 'radio'].includes(item.TYPE_EDITOR)) {
                dataSource[item.REF_ID] = item.TYPE_EDITOR !== 'radio' ? { url: getUrlReference(item.REF_ID) } : { data: JSON.parse(item.LIST_COLUMN) };
            }
            if ([...FROM_DATE, ...TO_DATE, ...FROM_DATE0, ...TO_DATE0].includes((item.NAME as string).toUpperCase())) zod[item.NAME] = { type: "string" };

        } else {
            isSelectTime.check = true;
        }
        return acc;
    }, {} as Record<string, any>);
    const newDataFilter = dataFilter.filter(f => f.HIDDEN !== "C" && (f.NAME as string).toUpperCase() !== 'P_LIST_TIME').reduce((acc, item) => {
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
            style: { gap: 5 },
            fields: layout
        },
        // dataSource: dataSource,
        isSelectTime: isSelectTime.check ? { from: isSelectTime.from, to: isSelectTime.to, from0: isSelectTime.from0, to0: isSelectTime.to0 } : undefined,
        zod: zod
    }
    return { layoutView, values, isSelectTime, dataSource };
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
    multiselect: 'multiselect',
    checkbox: 'checkbox',
    radio: 'radio',
    autonumeric: 'autonumeric'
}
const getItemViewReport = (typeEditor: string, listColumn0: string) => {

    if (!!typeEditor && ['combo', 'richselect'].includes(typeEditor)) return ListItemView.VALUE;

    const listColumn: any[] = isNotEmpty(listColumn0) ? JSON.parse(listColumn0) : null;

    if (!listColumn) return undefined;

    const fixListColumn = listColumn.filter(col0 => !col0.hidden);

    if (fixListColumn.length > 1) {
        return getListItemView(fixListColumn[0].id, fixListColumn[1].id);
    } else {
        return undefined;
    }
};

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
                fDisplay: { fValue: 'id' },
                itemView: getItemViewReport(item.TYPE_EDITOR, item.LIST_COLUMN),
                idRef: item.REF_ID,
                keySource: item.REF_ID,
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.combo:
            return {
                type: "selectList",
                tableWin: "Empty",
                idRef: item.REF_ID,
                itemView: ListItemView.VALUE,
                keySource: item.REF_ID,
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.richselect:
            return {
                type: "selectList",
                tableWin: "Empty",
                idRef: item.REF_ID,
                itemView: ListItemView.VALUE,
                keySource: item.REF_ID,
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.treesuggest:
            return {
                type: "selectList",
                tableWin: "Empty",
                fDisplay: { fValue: 'id' },
                idRef: item.REF_ID,
                itemView: getItemViewReport(item.TYPE_EDITOR, item.LIST_COLUMN),
                keySource: item.REF_ID,
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.gridsuggest:
            return {
                type: "search",
                tableSearch: "CUSTOM",
                idRef: item.REF_ID,
                itemView: getItemViewReport(item.TYPE_EDITOR, item.LIST_COLUMN),
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
                fDisplay: { fValue: 'id' },
                idRef: item.REF_ID,
                keySource: item.REF_ID,
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        case TypeEditor.checkbox:
            return {
                type: "checkbox",
                label: _(item.CAPTION),
                align: "right",
                bind: item.NAME,
                style: style
            };
        case TypeEditor.radio:
            return {
                type: "option",
                label: _(item.CAPTION),
                bind: item.NAME,
                keySource: item.REF_ID,
                style: style
            };
        case TypeEditor.autonumeric:
            return {
                type: "number",
                label: _(item.CAPTION),
                bind: item.NAME,
                style: style
            };
        default:
            return { type: "empty", style: style }
    }
}