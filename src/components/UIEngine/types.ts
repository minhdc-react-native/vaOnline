import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DimensionValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
import * as z from "zod";

export const ICON_REGISTRY = {
    A: AntDesign,
    E: Entypo,
    F: FontAwesome,
    I: Ionicons,
    M: MaterialCommunityIcons,
} as const;

export type IFieldBase = {
    bind?: string;
    keySource?: string;
    visibleIf?: string;
    requiredKeys?: string[];
    disabled?: boolean | string;
    props?: any;
};

export type ITextField = IFieldBase & {
    type: 'text';
    label?: string;
    textStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    variant?: VariantProp<never> | undefined,
    numberOfLines?: number,
    compute?: string;
    format?: {
        type: 'text' | 'link' | 'number' | 'date' | 'select' | 'selectMulti' | 'checkbox' | 'status' | 'tag' | 'rating',
        roundNumber?: 'rQuantity' | 'rPrice' | 'rAmount' | 'rPercentage',
        formatDate?: 'dd/MM/yyyy HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss',
        removeTime?: boolean,
        typeCheckBox?: "checkbox" | 'switch',
        maxRating?: number, // dùng cho rating
        isShowAll?: boolean,// dùng cho rating
        fValue?: string, // dùng cho selectList
        separator?: string, // dùng cho selectMulti
        typeLink?: 'tel' | 'mailto' | 'web'
    }
};
export type INumField = IFieldBase & {
    type: 'number';
    label?: string;
    style?: StyleProp<ViewStyle>;
    format?: 'rQuantity' | 'rPrice' | 'rAmount' | 'rPercentage';
    compute?: string;
    fWord?: string;
    notOverride?: boolean;
};
export type IDateField = IFieldBase & {
    type: 'date';
    label?: string;
    style?: StyleProp<ViewStyle>;
};
export type ITimeField = IFieldBase & {
    type: 'time';
    label?: string;
    style?: StyleProp<ViewStyle>;
};
export type IInputField = IFieldBase & {
    type: 'input';
    label?: string;
    typeInput?: 'text' | 'multi' | 'password';
    style?: StyleProp<ViewStyle>;
    showPassword?: boolean;
    setShowPassWord?: (show: boolean) => void;
    texRight?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    upperCase?: boolean;
    height?: DimensionValue
};
export type IIconField = IFieldBase & {
    type: 'icon';
    iconType: 'A' | 'E' | 'F' | 'I' | 'M',
    name: string;
    size?: number;
    color?: string;
};

export type IRowsColsField = IFieldBase & {
    type: 'rows' | 'cols' | 'card';
    style?: StyleProp<ViewStyle>;
    height?: DimensionValue;
    fields: IField[];
};

export type IActionListField = IFieldBase & {
    type: 'actionList';
    typeView?: 'rows' | 'cols';
    typeButton?: 'btnRight' | 'btnRightTop' | 'btnRightBottom' | 'btnCenter' | 'btnLeft' | 'btnOnlyOne' | 'btnOnlyOneTop' | 'btnOnlyOneCenter' | 'btnOnlyOneBottom';
    actionName: string;
    param?: { message?: string, data: Record<string, any>, layoutName?: string }
    checkAction?: { isError: string, message: string };
    style?: StyleProp<ViewStyle>;
    fields: IField[];
};

export type ISelectField = IFieldBase & {
    type: 'select';
    label?: string;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
};

export type ISearchListField = IFieldBase & {
    type: 'search';
    tableSearch: ITableSearch;
    fField: string;
    expression?: Record<string, string>;
    label?: string;
    placeholder?: string;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
};

export type ISelectListField = IFieldBase & {
    type: 'selectList';
    label?: string;
    placeholder?: string;
    typeDisplay?: 'value' | 'both';
    fId?: string;
    fValue?: string;
    fDisplay?: { fId: string, fValue: string, field?: string };
    expression?: Record<string, string>;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
    tableWin: ITableWin;
    isNewEdit?: boolean
};

export type ISelectListMultiField = IFieldBase & {
    type: 'selectListMulti';
    label?: string;
    placeholder?: string;
    typeDisplay?: 'value' | 'both';
    fId?: string;
    fValue?: string;
    fDisplay?: { fId: string, fValue: string, field?: string };
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
    tableWin: ITableWin;
    isNewEdit?: boolean
};

export type ISelectListPageField = IFieldBase & {
    type: 'selectListPage';
    menuId: string;
    tableWin: ITableWin,
    fValue: string;
    fValueRef: string;
    label?: string;
    placeholder?: string;
    fId?: string;
    clean?: boolean; // nếu true thì có nút xóa
    rightIcon?: React.ReactNode; // nếu có thì hiển thị icon bên phải
    style?: StyleProp<ViewStyle>;
    loading?: boolean,
    defaultFilter?: IFilterRows[];
    isNewEdit?: boolean
};

export type ILineField = IFieldBase & {
    type: "line"
}

export type IEmptyField = IFieldBase & {
    type: "empty";
    style?: StyleProp<ViewStyle>;
}

export type IExpand = IFieldBase & {
    type: "expand";
    title: string | IField;
    fields: IField[];
    icon?: IField;
    defaultExpanded?: boolean;
    expanded?: boolean; // controlled
    style?: ViewStyle;
    containerStyle?: ViewStyle;
    styleHeader?: ViewStyle,
    typeExpand?: 'top' | 'bottom'
}
export type ICheckBox = IFieldBase & {
    type: "checkbox";
    label: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    align?: 'left' | 'right';
    typeView?: "checkbox" | 'switch',
    actionName?: string;
}
export type IOption = IFieldBase & {
    type: "option";
    label: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export type IButton = IFieldBase & {
    type: "button";
    label: string;
    actionName: string;
    style?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    mode?: "text" | "outlined" | "elevated" | "contained" | "contained-tonal"
}

export type IField =
    | IRowsColsField
    | ITextField
    | INumField
    | IDateField
    | ITimeField
    | IInputField
    | IIconField
    | IActionListField
    | ISelectField
    | ISearchListField
    | ISelectListField
    | ISelectListMultiField
    | ISelectListPageField
    | ILineField
    | IEmptyField
    | IExpand
    | ICheckBox
    | IOption
    | IButton

export type ISchemaUIProps = {
    schema: IRowsColsField;
    data?: Record<string, any>;
    dataSource?: Record<string, any[]>;
    style?: StyleProp<ViewStyle>;
    onChangeItemData?: (change: Record<string, any>) => void,
    actionMap?: Record<string, (param?: any) => void>;
    errors?: Record<string, string>,
    dataActionMap?: any
};

export type ISource = Record<string, {
    data?: any[],
    tableWin?: ITableWin,
    url?: string, type?: 'post' | 'get', requiredKeys?: string[], dataPost?: Record<string, any>, getColor?: (item: IData) => string
}>

export interface ISchemaForm {
    view: IRowsColsField;
    dataSource?: ISource,
    dataDefault?: Record<string, any>,
    zod?: z.ZodObject
}