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

    interface IFilterRows { };

    type ITableWin = 'Empty';
    type ITableSearch = 'Empty';


    var isNotEmpty: (value: any) => boolean;
}