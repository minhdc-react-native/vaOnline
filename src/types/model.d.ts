export { };
declare global {
    interface IParamSystem {
        rQuantity: number;
        rPrice: number;
        rPriceNt: number;
        rAmount: number;
        rAmountNt: number;
        rPercentage: number;
        rExchangeRate: number;
        rRate: number;
        minAmountChange: number;
    }
    interface IData {
        id: string | number;
        [key: string]: any;
    }
    interface DrawerItem {
        label: DrawerLabel;
        path: string;
        icon: string;
    }
    interface IMenuWin {
        id: string,
        tableWin: ITableWin,
        label: string,
        labelE: string,
        icon?: {
            type: 'A' | 'E' | 'F' | 'I' | 'M',
            name: string,
            color?: string,
            size?: number
        },
        row: number,
        col: number,
        typeWin: '(window)' | '(winMaster)' | '(winTree)',
        codeField?: string;
        defaultValue?: Record<string, any>
    }

    interface ITabWin {
        id: string;
        value: string;
        TAB_ID: string;
        TAB_TABLE: ITableWin;
        TAB_NAME: string;
        FOREIGN_KEY: string;
        PERMISSION: { NEW: boolean, EDIT: boolean, DELETE: boolean }
    }
    interface IWinConfig {
        window: {
            WINDOW_ID: string;
            MA_CT: string;
            WINDOW_NAME: string;
            Tabs: ITabWin[]
        }
    }

    interface IParamWin {
        continue?: boolean | null;
        page: number;
        count: number;
        filter: IFilter[];
        infoparam: any;
        start: number;
        tlbparam: any[];
        window_id: string;
    }

    interface IFilter {
        columnName: string,
        columnType: string,
        value: any
    };
    type IRoundNumber = 'rQuantity' | 'rPrice' | 'rPriceNt' | 'rPercentage' | 'rAmount' | 'rAmountNt' | 'rExchangeRate' | 'rRate';

    type ITableWin = 'Empty' | 'Year' |
        'DMNHDT' | 'DMDT' | 'DMDT_NGH' | 'DMBP' | 'DMPX' | 'DMOB' | 'DMTK' |
        'DMKHO' | 'DMNHHV' | 'DMHV' | 'DMHV_DVT' | 'DMHV_GIA' | 'DMDVT';

    type ITableSearch = 'DMMNGH' | 'DMMCN' | 'DMTK';

    type IKeyMenuWin = 'acCatalogBalance' | 'acCatalogBank' | 'acCatalogGood' | 'acCatalogOther' | 'acCatalogPartner'

    var isNotEmpty: (value: any) => boolean;
}