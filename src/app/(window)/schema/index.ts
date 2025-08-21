import { IRowsColsField } from "@/components/UIEngine/types";
import { theme } from "@/theme/theme";
import * as z from "zod";
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
    zod?: z.ZodObject,
};
type IDataSource = Record<string, { data?: any[], api?: { url: string, tableWin?: ITableWin, type?: 'get' | 'post', data?: Record<string, any>, fields?: string[] } }>;

export type IHandleActionConfig = {
    title?: string;
    dataSource?: IDataSource,
    values: Record<string, any>,
    valueMap?: Record<string, string>,
    view: IRowsColsField,
    zod?: z.ZodObject,
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
    dataSource?: Record<string, { tableWin?: ITableWin, url?: string, data?: any[], fId?: string, fValue?: string, field?: string, getColor?: (item: IData) => string }>,
    fieldSearch?: string,
    defaultNew: Record<string, any>,
    dataMaster?: string[],
    zod: z.ZodObject
}
export const schemaWin: Partial<Record<ITableWin, ISchemaWinValue>> = {
    Empty: empty, Year: year
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
    defaultNew: {},
    zod: z.object()
};

export const schemaItemSearch: Record<ITableSearch, IRowsColsField> = {
    Empty: {
        type: "cols",
        fields: [
            {
                type: "text",
                bind: "code",
                textStyle: { fontWeight: "bold", color: colors.secondary }
            },
            {
                type: "text",
                bind: "name"
            }
        ]
    }
}