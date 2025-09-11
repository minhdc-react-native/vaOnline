interface IColumnReport {
    title: string;
    requiredKeys?: string[];
    id?: string;
    width?: number;
    format?: {
        type: 'number' | 'date' | 'string';
        roundNumber?: IRoundNumber
    },
    textStyle?: StyleProp<TextStyle>
    children?: IColumnReport[];
}

type IOpenReport = {
    name: 'openDetail';
    itemReport?: IItemButtonReport;
    params: IParam[],
    requiredKeys?: string[];
    pressWhen?: string
}
type IOpenVoucher = {
    name: 'editVoucher';
    docId: string;
    voucherCode: string;
    requiredKeys?: string[];
    pressWhen?: string
}

type IOnPressItem = IOpenReport | IOpenVoucher;

interface ISchemaReport {
    columnsTable: Record<'1' | '2' | '3', IColumnReport[]>,
    onPressItem?: IOnPressItem;
}

interface IReportItemDefault {
    reportItem: IData;
    dataFilter: Record<string, any>;
    routerNumber: number;
}