import { IRowsColsField } from "@/components/UIEngine/types";
import { VcReferences } from "@/constants/vcData";
import { theme } from "@/theme/theme";
import { dmbp } from "./category/dmbp";
import { dmdt } from "./category/dmdt/dmdt";
import { dmdt_ngh } from "./category/dmdt/dmdt_ngh";
import { dmdvt } from "./category/dmdvt";
import { dmhv } from "./category/dmhv/dmhv";
import { dmkho } from "./category/dmkho";
import { dmnhdt } from "./category/dmnhdt";
import { dmnhhv } from "./category/dmnhhv";
import { dmob } from "./category/dmob";
import { dmpx } from "./category/dmpx";
import { dmtk } from "./category/dmtk";
import { empty } from "./empty";
import { year } from "./year";
const colors = theme.colors;

export type IActionFilter = {
    title?: string;
    urlFilter?: string;
    dataSource?: Record<string, { data?: any[], api?: { url: string, tableWin?: ITableWin, type?: 'get' | 'post', data?: Record<string, any>, fields?: string[] } }>,
    values: Record<string, any>,
    valuesType: Record<string, { columnType: 'string' | 'date' | 'decimal', compareField?: string, operator?: string, label?: string }>,
    valueIgnoreFilter?: string[];
    fieldAdvanced?: string[];
    tlbParam?: string[];
    hideFilter?: string[];
    valueDisplay?: Record<string, string>;
    view: IRowsColsField,
    isSelectTime?: { from: string, to: string, expression?: Record<string, string>, data?: any[] },
    zod?: Record<string, { type: 'string' | 'number', msgError?: string }>,
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
    zod?: Record<string, { type: 'string' | 'number', msgError?: string }>,
    isSelectTime?: { from: string, to: string, expression?: Record<string, string>, data?: any[] }
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

export interface ISchemaWinValue {
    config: ISchemaWin,
    action?: { new?: boolean, edit?: boolean, showEditMaster?: boolean },
    dataSource?: Record<string, keyof typeof VcReferences>,
    fieldSearch?: string, isRmTone?: boolean, require?: boolean,
    defaultNew: Record<string, any>,
    dataMaster?: string[],
    zod?: Record<string, { type: 'string' | 'number', msgError?: string }>
}

export const schemaWin: Partial<Record<ITableWin, ISchemaWinValue>> = {
    Empty: empty, Year: year,
    DMNHDT: dmnhdt, DMDT: dmdt, DMDT_NGH: dmdt_ngh, DMBP: dmbp, DMPX: dmpx, DMOB: dmob, DMTK: dmtk,
    DMKHO: dmkho, DMNHHV: dmnhhv, DMDVT: dmdvt, DMHV: dmhv
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

export const schemaItemSearch: Record<ITableSearch, IRowsColsField> = {
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
    },
    DMTK: {
        type: "cols",
        fields: [
            {
                type: "text",
                requiredKeys: ["id", "value"],
                label: "{{`${id} - ${value}`}}"
            }
        ]
    },
}