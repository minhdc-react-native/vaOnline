interface IColumnReport {
    title: string;
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
    pressWhen?: string
}
type IOpenVoucher = {
    name: 'editVoucher';
    docId: string;
    voucherCode: string;
    pressWhen?: string
}

type IOnPressItem = IOpenReport | IOpenVoucher;

interface ISchemaReport {
    columnsTable: IColumnReport[],
    onPressItem?: IOnPressItem;
}