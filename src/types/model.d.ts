export { };
declare global {
    interface IParamSystem {
        rQuantity: number;
        rPrice: number;
        rAmount: number;
        rPercentage: number;
        minAmountChange: number;
    }
    interface IData {
        id: string | number;
        [key: string]: any;
    }

    interface IMenuWin {
        id: string,
        tableWin: ITableWin,
        label: string,
        icon?: {
            type: 'A' | 'E' | 'F' | 'I' | 'M',
            name: string,
            color?: string,
            size?: number
        },
        row: number,
        col: number,
        typeWin: '(window)' | '(winMaster)'
    }

    interface IPermissionsWin {
        mnCopy?: 'mnCopy';
        mnDelete?: 'mnDelete';
        mnEdit?: 'mnEdit';
        mnPlus?: 'mnPlus';
        mnRefresh?: 'mnRefresh'
    }

    interface ITabWin {
        id: string;
        value: string;
        code: ITableWin;
        realCode?: ITableWin;
        refKey?: string | null;
        hasQuickSearch?: boolean;
        rowIdValue?: string;
    }
    interface IWinConfig {
        permissions: IPermissionsWin,
        // references: Record<string, any>,
        window: {
            id: string;
            code: ITableWin;
            name: string;
            tabs: ITabWin[]
        },
        voucherTemplates?: { id: string, value: string, code: string }[];
    }

    interface IParamWin {
        continue?: boolean | null;
        filterAdvanced: IFilterRows[];
        page: number;
        count: number;
        filterRows: IFilterRows[];
        menuId: string;
        quickSearch: string;
        start: number;
        tlbparam: any[];
        windowId: string;
    }

    interface IFilterRows { };

    type ITableWin = 'Empty' | 'Year' | 'DMDT';
    type ITableSearch = 'Empty';


    var isNotEmpty: (value: any) => boolean;
}