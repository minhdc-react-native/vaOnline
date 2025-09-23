import { IRowsColsField } from "@/components/UIEngine/types";
import { VcReferences } from "@/constants/vcData";
import { theme } from "@/theme/theme";
import { dmbp } from "./category/dmbp";
import { dmdt } from "./category/dmdt/dmdt";
import { dmdt_ngh } from "./category/dmdt/dmdt_ngh";
import { dmdvt } from "./category/dmdvt";
import { dmhv } from "./category/dmhv/dmhv";
import { dmhv_dvt } from "./category/dmhv/dmhv_dvt";
import { dmhv_gia } from "./category/dmhv/dmhv_gia";
import { dmkho } from "./category/dmkho";
import { dmnhdt } from "./category/dmnhdt";
import { dmnhhv } from "./category/dmnhhv";
import { dmob } from "./category/dmob";
import { dmpx } from "./category/dmpx";
import { dmtk } from "./category/dmtk";
import { lstdvcs } from "./category/lstdvcs";
import { empty } from "./empty";
import { cthv } from "./voucher/hv/cthv";
import { dphv } from "./voucher/hv/dphv";
import { pbdt } from "./voucher/hv/pbdt";
import { pscf } from "./voucher/hv/pscf";
import { ctkt } from "./voucher/kt/ctkt";
import { dpkt } from "./voucher/kt/dpkt";
import { psthue } from "./voucher/psthue";
import { year } from "./year";
const colors = theme.colors;
export type IIsSelectTime = { from: string, to: string, from0?: string, to0?: string, expression?: Record<string, string>, data?: any[] };
export type IActionFilter = {
    title?: string;
    dataSource?: IDataSource,
    values: Record<string, any>,
    valuesType: Record<string, { columnType: 'string' | 'date' | 'decimal', compareField?: string, operator?: string, label?: string }>,
    valueIgnoreFilter?: string[];
    fieldAdvanced?: string[];
    tlbParam?: string[];
    hideFilter?: string[];
    valueDisplay?: Record<string, string>;
    view: IRowsColsField,
    isSelectTime?: IIsSelectTime,
    zod?: IZod,
};

// type IDataSource = Record<string, { data?: any[], api?: { url: string, tableWin?: ITableWin, type?: 'get' | 'post', data?: Record<string, any>, fields?: string[] } }>;

export type IDataSource = Record<string, {
    tableWin?: ITableWin,
    url?: string, type?: 'get' | 'post', dataPost?: Record<string, any>, typeData?: 'normal' | 'tree', fieldCode?: string, fields?: string[],
    data?: any[], fId?: string, fValue?: string, field?: string, getColor?: (item: IData) => string
}>;

export type IHandleActionConfig = {
    title?: string;
    dataSource?: IDataSource,
    values: Record<string, any>,
    valueMap?: Record<string, string>,
    view: IRowsColsField,
    zod?: IZod,
    isSelectTime?: IIsSelectTime
};

export type IHandleAction = Record<string, IHandleActionConfig | ((dataSource: Record<string, any[]>) => IHandleActionConfig)>

export interface ISchemaWin {
    itemAction: IRowsColsField;
    itemList: IRowsColsField;
    itemShow: IRowsColsField;
    itemEdit: IRowsColsField;
    filterConfig?: IActionFilter,
    tabs?: ITabWin[]
}
export type IZod = Record<string, { type: 'string' | 'number', requiredIf?: string | string[], msgError?: string }>;

export interface ISchemaWinValue {
    config: ISchemaWin,
    action?: { new?: boolean, edit?: boolean, showEditMaster?: boolean },
    dataSource?: Record<string, keyof typeof VcReferences>,
    mapDataSource?: Record<string, string>,
    fieldSearch?: string, isRmTone?: boolean, require?: boolean,
    defaultNew: Record<string, any>,
    dataMaster?: string[],
    addDetails?: string[],
    zod?: IZod
}

export const schemaWin: Partial<Record<ITableWin, ISchemaWinValue>> = {
    Empty: empty, Year: year,
    DMNHDT: dmnhdt, DMDT: dmdt, DMDT_NGH: dmdt_ngh, DMBP: dmbp, DMPX: dmpx, DMOB: dmob, DMTK: dmtk,
    DMKHO: dmkho, DMNHHV: dmnhhv, DMDVT: dmdvt, DMHV: dmhv, DMHV_DVT: dmhv_dvt, DMHV_GIA: dmhv_gia,
    DPKT: dpkt, CTKT: ctkt, PSTHUE: psthue, DPHV: dphv, CTHV: cthv, PSCF: pscf, PBDT: pbdt,
    LSTDVCS: lstdvcs
}

export const schemaWinEmpty: ISchemaWinValue = {
    config: {
        itemAction: {
            type: "cols",
            fields: []
        },
        itemList: {
            type: "cols",
            fields: []
        },
        itemShow: {
            type: "cols",
            fields: []
        },
        itemEdit: {
            type: "cols",
            fields: []
        }
    },
    defaultNew: {}
};

export const schemaItemSearch: Partial<Record<ITableSearch, IRowsColsField>> = {
    DMMNGH: {
        type: "cols",
        fields: [
            {
                type: "text",
                bind: "MA_NGH",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_NGH"
            }
        ]
    },
    DMMCN: {
        type: "cols",
        fields: [
            {
                type: "text",
                bind: "MA_CN",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "TEN_CN"
            }
        ]
    }
}