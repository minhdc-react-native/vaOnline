// =============================
import { useTranslation } from '@/context/TranslationContext';
import { getListItemView, ListItemView } from '@/schema/voucher/itemView';
import { VACOMTheme } from '@/theme/theme';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { useContextSelector } from 'use-context-selector';
import { useToast } from '../dialog/useToast';
import { StarRating } from '../starRating';
import VcCheckBox from '../vcCheckbox';
import { VcDatePicker } from '../vcDatePicker';
import { VcNum } from '../vcNum';
import { VcOptions } from '../vcOptions';
import VcSearchList from '../vcSearchList';
import VcSelectList from '../vcSelectList';
import VcSelectListMulti from '../vcSelectListMulti';
import VcSelectPage from '../vcSelectPage';
import { VcTimePicker } from '../vcTimePicker';
import { ExpandField } from './Fields/expandField';
import { InputBarcode } from './Fields/inputBarcode';
import { InputField } from './Fields/inputField';
import { TextField } from './Fields/textField';
import { useBoundField } from './hooks/useBoundField';
import { FormState } from './hooks/useFormState';
import { FormContext } from './schemaUIEngine';
import { ICON_REGISTRY, IField, IRowsColsField } from './types';

export const dummyFormState: FormState<Record<string, any>> = {
    state: { values: {} },
    update: () => { },
    updateMany: () => { },
    reset: () => { },
};

interface IProps {
    field: IField;
    index: number;
}

const ViewComponent: React.FC<IProps> = ({
    field,
    index,
}) => {
    const key = `${field.bind || field.type}-${index}`;
    // Dùng placeholder value + setter
    const formState = useContextSelector(FormContext, (ctx) => ctx!.formState);
    const configExpression = useContextSelector(FormContext, (ctx) => ctx!.configExpression);
    const onChangeItemData = useContextSelector(FormContext, (ctx) => ctx!.onChangeItemData);
    const evalExpr = useContextSelector(FormContext, (ctx) => ctx!.evalExpr);
    const handleAction = useContextSelector(FormContext, (ctx) => ctx!.handleAction);
    const errors = useContextSelector(FormContext, (ctx) => ctx!.errors);
    const dataSource = useContextSelector(FormContext, (ctx) => ctx!.dataSource);

    const { value, getValue, setValue, setValues, onBlurTaxCode } = useBoundField(formState, field.bind || '__none__', onChangeItemData);

    const handleBlur = useCallback((prevValue: React.RefObject<any>) => {
        if (field.type !== "input") return;

        handleAction("onBlur", field.bind);
        if (field.typeInput === "taxCode" && value && value.length >= 10) {
            if (prevValue.current !== value) { // chỉ chạy khi thay đổi giá trị.
                prevValue.current = value;
                console.log('field??>>', configExpression?.expression);
                const fixExpression = configExpression?.expression?.[field.bind!] || field.expression;
                const fixExpressionIfEmpty = configExpression?.expressionIfEmpty?.[field.bind!] || field.expressionIfEmpty;

                const expression: Record<string, string> = typeof fixExpression === "string" ?
                    evalExpr(fixExpression, field.requiredKeys) : fixExpression;
                const expressionIfEmpty = fixExpressionIfEmpty ? (Array.isArray(fixExpressionIfEmpty) ? fixExpressionIfEmpty : evalExpr(fixExpressionIfEmpty, field.requiredKeys)) : [];

                onBlurTaxCode(value, expressionIfEmpty, expression)
            };
        }
    }, [value, field, handleAction, onBlurTaxCode, evalExpr, configExpression]);

    const { colors } = useTheme<VACOMTheme>();
    const { showToast } = useToast();
    const { _ } = useTranslation();

    const disabled = useMemo(() => {
        return field.disabled
            ? typeof field.disabled === "boolean"
                ? field.disabled
                : evalExpr(field.disabled, field.requiredKeys)
            : false;
    }, [field.disabled, evalExpr, field.requiredKeys]);

    const data = useRef<Record<string, any>>({});
    data.current = formState.state;

    const onSelectSearch = useCallback((item: Record<string, any> | null) => {
        if (field.type !== "search") return;
        const fixExpression = configExpression?.expression?.[field.bind!] || field.expression;
        const fixExpressionIfEmpty = configExpression?.expressionIfEmpty?.[field.bind!] || field.expressionIfEmpty;

        const expression: Record<string, string> = typeof fixExpression === "string" ?
            evalExpr(fixExpression, field.requiredKeys) : fixExpression;

        const expressionIfEmpty = fixExpressionIfEmpty ? (Array.isArray(fixExpressionIfEmpty) ? fixExpressionIfEmpty : evalExpr(fixExpressionIfEmpty, field.requiredKeys)) : [];

        let valueChange: any = { [field.bind!]: (item?.[field.fField] ?? "") };
        if (expression && item) {
            Object.keys(expression).map(key => {
                if (item[expression[key]] && (!expressionIfEmpty.includes(key) || !isNotEmpty(data.current[key]))) {
                    valueChange[key] = item[expression[key]];
                }
            });
        }
        setValues(valueChange);
    }, [field, setValues, evalExpr, configExpression]);

    const onSelectList = useCallback((item: IData | null) => {
        if (field.type !== "selectList") return;
        const fixExpression = configExpression?.expression?.[field.bind!] || field.expression;
        const fixExpressionIfEmpty = configExpression?.expressionIfEmpty?.[field.bind!] || field.expressionIfEmpty;

        const expression: Record<string, string> = typeof fixExpression === "string" ?
            evalExpr(fixExpression, field.requiredKeys) : fixExpression;

        const expressionIfEmpty = fixExpressionIfEmpty ? (Array.isArray(fixExpressionIfEmpty) ? fixExpressionIfEmpty : evalExpr(fixExpressionIfEmpty, field.requiredKeys)) : [];

        let valueChange: any = { [field.bind!]: item?.[field.fId ?? "id"] };
        if (expression && item) {
            Object.keys(expression).map(key => {
                if (item[expression[key]] && (!expressionIfEmpty.includes(key) || !isNotEmpty(data.current[key]))) {
                    valueChange[key] = item[expression[key]];
                }
            });
        }
        setValues(valueChange);
    }, [field, setValues, evalExpr, configExpression]);

    const onPressButton = useCallback(() => {
        if (field.type !== "button") return;
        handleAction(field.actionName);
    }, [field, handleAction]);

    const onChangeWidthDisabled = useCallback(
        (val: string) => {
            if (!disabled) setValue(val);
        },
        [disabled, setValue]
    );

    const label = useMemo(() => {
        const fixLabel = configExpression?.caption?.[field.bind || ''] || (field as any).label;
        return fixLabel ? evalExpr(fixLabel, field.requiredKeys) : undefined;
    }, [field, configExpression, evalExpr]);

    const itemView: { view: IRowsColsField, refId?: string, id?: string, value?: string } | undefined = useMemo(() => {
        const config = configExpression?.refId?.[field.bind || ''];
        const typeEditor = config?.TYPE_EDITOR;

        if (!!typeEditor && ['combo', 'richselect'].includes(typeEditor)) return { view: ListItemView.VALUE, refId: config.id };

        const listColumn = config?.LIST_COLUMN;

        if (!listColumn) return undefined;
        const fixListColumn = listColumn.filter(col0 => !col0.hidden);

        if (fixListColumn.length > 1) {
            return { id: fixListColumn[0].id, value: fixListColumn[1].id, view: getListItemView(fixListColumn[0].id, fixListColumn[1].id), refId: config.id };
        } else {
            return undefined;
        }
    }, [configExpression?.refId, field.bind]);

    const isError = useMemo(() => {
        return field.bind && errors[field.bind] ? true : false;
    }, [errors, field.bind])

    switch (field.type) {
        case 'rows':

            const fieldsRows = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <View key={key} style={[{ flexDirection: "row", gap: 5 }, field.style]}>
                    {fieldsRows?.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                        />
                    ))}
                </View>
            );
        case 'cols':
            const fieldsCols = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <View key={key} style={[{ gap: 5 }, field.style]}>
                    {fieldsCols.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                        />
                    ))}
                </View>
            );
        case "card":
            const fieldsCard = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <Card style={[{ padding: 20, backgroundColor: colors.background }, field.style]} contentStyle={{ gap: 5 }}>
                    {fieldsCard.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                        />
                    ))}
                </Card>
            );
        case 'expand':
            return <ExpandField
                field={field}
                index={index}
                _={_}
            />
        case 'actionList':
            const fieldsAction = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            let checkAction: { isError: boolean, message: string } | undefined = undefined;
            if (field.checkAction) {
                const isError = field.checkAction.isError;
                const message = field.checkAction.message;
                checkAction = { isError: evalExpr(isError, field.requiredKeys), message: evalExpr(message, field.requiredKeys) };
            }
            return (
                <Pressable key={key}
                    style={(pressed) => [{ opacity: pressed ? 0.7 : 1, flexDirection: field.typeView === "cols" ? "column" : "row" }, field.typeButton && styles[field.typeButton], field.style]}
                    onPress={() => {
                        if (checkAction && checkAction.isError) {
                            showToast(checkAction.message, { type: "warning" });
                            return;
                        }
                        handleAction(field.actionName, field.param);
                    }}>
                    {fieldsAction.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                        />
                    ))}
                </Pressable>
            );
        case 'text':
            return <TextField
                field={field}
                index={index}
            />
        case 'icon':
            const IconComponent = ICON_REGISTRY[field.iconType];
            // @ts-ignore: next-line
            return <IconComponent key={key} name={field.name} size={field.size ?? 20} color={field.color} />;

        case 'number':
            return (
                <View key={`${key}view`} style={field.style}>
                    <VcNum disabled={disabled} label={_(label)} typeFormat={field.format} key={key} value={value} onChange={setValue} isError={isError} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'date':
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcDatePicker disabled={disabled} label={_(label)} key={key} value={value} onChange={setValue} isError={isError} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case "time":
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcTimePicker disabled={disabled} label={_(label)} key={key} value={value} onChange={setValue} isError={isError} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'input':
            return (
                <InputField
                    value={value}
                    label={label}
                    disabled={disabled}
                    setValue={setValue}
                    handleBlur={handleBlur}
                    texRight={field.texRight}
                    icon={field.leftIcon}
                    typeInput={field.typeInput}
                    style={field.style}
                    upperCase={field.upperCase}
                    autoCapitalize={field.autoCapitalize}
                    height={field.height}
                    msgError={field.bind ? errors?.[field.bind] : undefined}
                />
            );
        case 'inputBarcode':
            return (
                <InputBarcode
                    value={value}
                    label={label}
                    disabled={disabled}
                    setValue={setValue}
                    handleBlur={handleBlur}
                    style={field.style}
                    msgError={field.bind ? errors?.[field.bind] : undefined}
                />
            );
        case 'select':
            return (
                <View key={`${key}view`} style={[{ flexDirection: "row", alignItems: "center", gap: 5 }, field.style]}>
                    {label !== undefined && <Text style={[{ fontWeight: 'bold' }, field.labelStyle]}>{_(label)}</Text>}
                    <View style={{ flex: 1 }}>
                        <SegmentedButtons density="small" key={key} buttons={dataSource[field.keySource || field.bind!] ?? []} value={value} onValueChange={onChangeWidthDisabled} />
                        <ErrorTooltip field={field} errors={errors} />
                    </View>
                </View>
            );
        case 'search':
            return (
                <View key={`${key}view`} style={[{ paddingVertical: 5 }, field.style]}>
                    <VcSearchList value={value} disabled={disabled} label={_(label)} clean={field.clean} itemView={field.itemView || itemView?.view} numCharSearch={field.numCharSearch}
                        idRef={field.idRef || itemView?.refId} tableSearch={field.tableSearch} fField={field.fField} checkSelected={field.checkSelected} onChange={onSelectSearch} isError={isError} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'selectList':
            return (
                <View key={`${key}view`} style={[{ paddingVertical: 5 }, field.style]}>
                    <VcSelectList disabled={disabled} data={dataSource[field.keySource || field.bind!] ?? []} label={_(label)} key={key} clean={field.clean} isError={isError}
                        fValue={field.fValue || itemView?.value} fId={field.fId || itemView?.id} value={value} tableWin={field.tableWin} isNewEdit={field.isNewEdit} checkSelected={field.checkSelected}
                        idRef={field.idRef || itemView?.refId} itemView={field.itemView || itemView?.view} fDisplay={field.fDisplay} typeDisplay={field.typeDisplay} onChange={onSelectList} notFistFilter={field.notFistFilter} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'selectListMulti':
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcSelectListMulti data={dataSource[field.keySource || field.bind!] ?? []} label={_(label)} key={key} isError={isError}
                        idRef={field.idRef || itemView?.refId} itemView={field.itemView} fValue={field.fValue} fId={field.fId} value={value} tableWin={field.tableWin} isNewEdit={field.isNewEdit}
                        fDisplay={field.fDisplay} typeDisplay={field.typeDisplay} onChange={setValue} disabled={disabled} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'selectListPage':
            const display = getValue(field.fValue);
            return (
                <View key={`${key}view`} style={field.style}>
                    <VcSelectPage label={_(label)} key={key} clean={field.clean} disabled={disabled} isError={isError}
                        itemMenuWin={field.itemMenuWin} defaultFilter={field.defaultFilter} isNewEdit={field.isNewEdit}
                        value={value} display={display} onChange={(itemSelected) => {
                            setValues({
                                [field.bind ?? "id"]: (itemSelected as Record<string, any>)?.[field.fId ?? "id"],
                                [field.fValue]: (itemSelected as Record<string, any>)?.[field.fValueRef ?? "name"]
                            });
                        }} />
                    <ErrorTooltip field={field} errors={errors} />
                </View>
            );
        case 'line':
            return <Divider />
        case 'empty':
            return <View style={field.style} />
        case 'checkbox':
            return <View key={`${key}view`} style={field.style}>
                <VcCheckBox disabled={disabled} textStyle={field.textStyle} align={field.align} label={_(label)} value={value}
                    onChange={setValue} type={field.typeView} />
            </View>
        case "option":
            return <View key={`${key}view`} style={field.style}>
                <VcOptions disabled={disabled} textStyle={field.textStyle} label={_(label)} value={value}
                    onChange={setValue} data={dataSource[field.keySource || field.bind!] ?? []} />
            </View>
        case 'button':
            return <View key={`${key}view`} style={field.style}>
                <Button disabled={disabled} style={field.buttonStyle} mode={field.mode} onPress={onPressButton} >{_(label)}</Button>
            </View>
        case 'rating':
            return (
                <View style={[styles.rating, { backgroundColor: colors.background, borderColor: colors.vacom.borderColor }, field.style]}>
                    {label && <Text style={[styles.label, { fontWeight: "bold" }, field.labelStyle]}>{_(label)}</Text>}
                    <StarRating value={value} max={field.max} onChange={setValue} />
                </View>
            );
        default:
            return null;
    }
};
export const FieldRenderer = React.memo(ViewComponent);

interface IErrorTooltip {
    field: IField;
    errors: Record<string, string>;
}
const ErrorTooltip = ({ field, errors }: IErrorTooltip) => {
    const { colors } = useTheme<VACOMTheme>()
    if (!field.bind || errors?.[field.bind] === undefined) return null;
    return (
        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
            <Text style={styles.tooltipText}>{errors[field.bind]}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    rating: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 0.5,
        justifyContent: "space-between"
    },
    label: { color: "#888", fontSize: 13 },
    tooltip: {
        position: 'absolute',
        bottom: -4,
        right: 0,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 0.2
    },
    tooltipText: {
        fontSize: 10,
    },
    btnRight: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    btnRightTop: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10
    },
    btnRightBottom: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 10
    },
    btnCenter: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnLeft: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        paddingRight: 25,
        marginLeft: 20
    },
    btnOnlyOne: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        marginLeft: 50,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    btnOnlyOneTop: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        marginLeft: 50,
        borderTopRightRadius: 10
    },
    btnOnlyOneCenter: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        marginLeft: 50
    },
    btnOnlyOneBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        marginLeft: 50,
        borderBottomRightRadius: 10
    }
});