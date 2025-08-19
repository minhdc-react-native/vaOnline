// =============================
import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import React, { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Card, Chip, Icon, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import DashedLine from '../dashedLine';
import { useToast } from '../dialog/useToast';
import ExpandableView from '../expandableView';
import { StarRating } from '../starRating';
import VcCheckBox from '../vcCheckbox';
import { VcDatePicker } from '../vcDatePicker';
import VcNum from '../vcNum';
import { VcOptions } from '../vcOptions';
import VcSearchList from '../vcSearchList';
import VcSelectList from '../vcSelectList';
import VcSelectListMulti from '../vcSelectListMulti';
import VcSelectPage from '../vcSelectPage';
import { VcTextLink } from '../vcTextLink';
import { VcTimePicker } from '../vcTimePicker';
import { useBoundField } from './hooks/useBoundField';
import { FormState } from './hooks/useFormState';
import { ICON_REGISTRY, IField } from './types';

interface FieldRendererProps {
    field: IField;
    index: number;
    formState: FormState;
    evalExpr: (expr: string, requiredKeys?: string[]) => any;
    handleAction: (expr: string, param?: any) => void;
    errors: Record<string, string>;
    dataSource: Record<string, any[]>;
    dataSourceMap: Map<string, Map<string, any>>;
    onChangeItemData?: (change: Record<string, any>) => void;
    paramSystem: IParamSystem | null;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    index,
    formState,
    evalExpr,
    handleAction,
    errors,
    onChangeItemData,
    dataSource,
    dataSourceMap,
    paramSystem
}) => {
    const key = `${field.bind || field.type}-${index}`;
    // Dùng placeholder value + setter
    const { value, getValue, setValue, setValues } = useBoundField(formState, field.bind || '__none__', onChangeItemData);
    const { colors } = useTheme<VACOMTheme>();
    const isError = field.bind && errors?.[field.bind] ? true : false;
    const { showToast } = useToast();
    const progs = { ...field.props ?? {}, isError: isError };
    const [showPassword, setShowPassWord] = useState(false);

    const disabled = field.disabled ? (typeof field.disabled === "boolean" ? field.disabled : evalExpr(field.disabled, field.requiredKeys)) : false;

    switch (field.type) {
        case 'rows':
            const fieldsRows = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <View key={key} style={[{ flexDirection: "row", gap: 10 }, field.style]}>
                    {fieldsRows?.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                            formState={formState}
                            evalExpr={evalExpr}
                            handleAction={handleAction}
                            onChangeItemData={onChangeItemData}
                            errors={errors}
                            dataSource={dataSource}
                            dataSourceMap={dataSourceMap}
                            paramSystem={paramSystem}
                        />
                    ))}
                </View>
            );
        case 'cols':
            const fieldsCols = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <View key={key} style={[{ gap: 10 }, field.style]}>
                    {fieldsCols.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                            formState={formState}
                            evalExpr={evalExpr}
                            handleAction={handleAction}
                            onChangeItemData={onChangeItemData}
                            errors={errors}
                            dataSource={dataSource}
                            dataSourceMap={dataSourceMap}
                            paramSystem={paramSystem}
                        />
                    ))}
                </View>
            );
        case "card":
            const fieldsCard = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            return (
                <Card style={[{ padding: 20, backgroundColor: colors.background }, field.style]} contentStyle={{ gap: 10 }}>
                    {fieldsCard.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                            formState={formState}
                            evalExpr={evalExpr}
                            handleAction={handleAction}
                            onChangeItemData={onChangeItemData}
                            errors={errors}
                            dataSource={dataSource}
                            dataSourceMap={dataSourceMap}
                            paramSystem={paramSystem}
                        />
                    ))}
                </Card>
            );
        case 'expand':
            const fieldsExpand = field.fields?.filter((child) => {
                return child.visibleIf ? evalExpr(child.visibleIf, child.requiredKeys) : true;
            }) ?? [];
            const keyExpand = `${field.bind || field.type}-${index}`;
            const _title: any = typeof field.title !== "string" ? <FieldRenderer
                key={`${keyExpand}-title`}
                field={field.title as IField}
                index={index}
                formState={formState}
                evalExpr={evalExpr}
                handleAction={handleAction}
                onChangeItemData={onChangeItemData}
                errors={errors}
                dataSource={dataSource}
                dataSourceMap={dataSourceMap}
                paramSystem={paramSystem}
            /> : field.title;
            const _icon: any = field.icon ? <FieldRenderer
                key={`${keyExpand}-icon`}
                field={field.icon as IField}
                index={index}
                formState={formState}
                evalExpr={evalExpr}
                handleAction={handleAction}
                onChangeItemData={onChangeItemData}
                errors={errors}
                dataSource={dataSource}
                dataSourceMap={dataSourceMap}
                paramSystem={paramSystem}
            /> : undefined;
            return (
                <ExpandableView title={_title} icon={_icon} defaultExpanded={field.defaultExpanded}
                    expanded={field.expanded} style={[{ borderColor: colors.elevation.level5 }, field.style]}
                    containerStyle={[{ padding: 10 }, field.containerStyle]}
                    styleHeader={[{ padding: 5, backgroundColor: colors.elevation.level1 }, field.styleHeader]} type={field.typeExpand}
                    titleStyle={{ fontWeight: "normal" }}
                >
                    {fieldsExpand.map((child, i) => (
                        <FieldRenderer
                            key={i}
                            field={child}
                            index={i}
                            formState={formState}
                            evalExpr={evalExpr}
                            handleAction={handleAction}
                            onChangeItemData={onChangeItemData}
                            errors={errors}
                            dataSource={dataSource}
                            dataSourceMap={dataSourceMap}
                            paramSystem={paramSystem}
                        />
                    ))}
                </ExpandableView>
            );
        case 'text':
            const isBold = (formState.state?.bold === "C");
            let valueText = value;
            let labelText = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            switch (field.format?.type) {
                case "selectMulti":
                    const ids = value ? value.split(field.format?.separator ?? ",") : [];
                    const dataMapMulti = dataSourceMap.get(field.bind!);
                    return (<View style={[{ flexDirection: "row", flexWrap: "wrap", gap: 2 }, field.style]}>
                        {ids.map((id: string) => {
                            return (
                                <Chip mode='outlined' key={`chip${id}`} style={{ borderColor: colors.elevation.level3 }}>
                                    <Text variant='bodySmall'>{dataMapMulti?.get(id)?.[field.format?.fValue ?? "value"] || '???'}</Text>
                                </Chip>
                            );
                        })}
                    </View>)
                case "status":
                    const itemStatus: any = dataSourceMap.get(field.bind!)?.get(value) || { id: '?', value: "???", color: colors.secondary };
                    return (<View style={[
                        {
                            flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5,
                            backgroundColor: colors.elevation.level1, borderWidth: 0.5, borderColor: colors.elevation.level3, maxWidth: 150
                        },
                        field.style
                    ]
                    }>
                        <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: itemStatus.color }} />
                        <Text numberOfLines={1} style={{ fontSize: 12, flexShrink: 1 }}>{itemStatus.value}</Text>
                    </View>)
                case "rating":
                    if (!field.bind) {
                        valueText = labelText;
                        labelText = undefined;
                    }
                    return (
                        <View style={[{ flexDirection: "row", gap: 5, alignItems: "center" }, field.style]}>
                            {labelText && <Text style={[styles.label, field.labelStyle]}>{labelText}</Text>}
                            <StarRating value={valueText} max={field.format.maxRating} isShowAll={field.format.isShowAll} />
                        </View>
                    );
                case "checkbox":
                    const isCheck = (typeof value === "boolean" ? value : (value === "C"));
                    const icon = field.format?.typeCheckBox === "checkbox" ? (isCheck ? "checkbox-marked-outline" : "checkbox-blank-outline") : (isCheck ? "toggle-switch" : "toggle-switch-off")
                    return (
                        <View style={[{ flexDirection: "row", gap: 5, alignItems: "center" }, field.style]}>
                            {labelText && <Text style={[styles.label, field.labelStyle]}>{labelText}</Text>}
                            <Icon source={icon} size={20} color={isCheck ? colors.primary : colors.secondary} />
                        </View>
                    )
                case "link":
                    return (
                        <View style={[field.style]}>
                            {labelText && <Text style={[styles.label, field.labelStyle]}>{labelText}</Text>}
                            <VcTextLink text={valueText} numberOfLines={field.numberOfLines} style={field.textStyle} variant={field.variant} typeLink={field.format?.typeLink} />
                        </View>
                    );
                default:
                    let addStyle: StyleProp<ViewStyle> = null;
                    if (!field.bind) {
                        valueText = labelText;
                        labelText = undefined;
                    }
                    if (field.format?.type === "number") {
                        valueText = Helper.formatAmount(valueText, false, paramSystem?.[field.format.roundNumber ?? "rAmount"])
                    } else if (field.format?.type === "date") {
                        valueText = Helper.getFormattedDate(valueText, field.format.formatDate, field.format.removeTime ?? true)
                    } else if (field.format?.type === "select" && !Helper.isEmpty(value)) {
                        valueText = dataSourceMap.get(field.bind!)?.get(value)?.[field.format.fValue ?? "value"] || '???';
                    } else if (field.format?.type === "tag" && !Helper.isEmpty(value)) {
                        const itemTag = dataSourceMap.get(field.bind!)?.get(value);
                        valueText = itemTag?.[field.format.fValue ?? "value"] || '???';
                        addStyle = { paddingVertical: 2, paddingHorizontal: 5, borderWidth: 0.5, borderColor: colors.elevation.level5, backgroundColor: colors.elevation.level1, borderRadius: 10 };
                    }
                    return (
                        <View style={[field.style]}>
                            {labelText && <Text style={[styles.label, field.labelStyle]}>{labelText}</Text>}
                            <Text key={key} variant={field.variant} numberOfLines={field.numberOfLines}
                                style={[addStyle, field.textStyle, field.format?.type === "number" && Number(valueText) < 0 && { color: colors.primary }, isBold && { fontWeight: "bold" }]} >{valueText}</Text>
                        </View>
                    );
            }
        case 'icon':
            const IconComponent = ICON_REGISTRY[field.iconType];
            // @ts-ignore: next-line
            return <IconComponent key={key} name={field.name} size={field.size} color={field.color} />;
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
                            formState={formState}
                            evalExpr={evalExpr}
                            handleAction={handleAction}
                            onChangeItemData={onChangeItemData}
                            errors={errors}
                            dataSource={dataSource}
                            dataSourceMap={dataSourceMap}
                            paramSystem={paramSystem}
                        />
                    ))}
                </Pressable>
            );
        case 'number':
            const labelNumber = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={field.style}>
                    <VcNum disabled={disabled} label={labelNumber} key={key} value={value} onChange={setValue} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'date':
            const labelDate = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcDatePicker disabled={disabled} label={labelDate} key={key} value={value} onChange={setValue} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case "time":
            const labelTime = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcTimePicker disabled={disabled} label={labelTime} key={key} value={value} onChange={setValue} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'input':
            const labelInput = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            const isMulti = field.typeInput === "multi" ? true : false;
            const isPassword = field.typeInput === "password" ? true : false;
            const rightFix = isPassword ?
                <TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'}
                    onPress={() => setShowPassWord?.(!showPassword)} color={"rgb(119, 86, 81)"} /> : undefined
            return (
                <View key={`${key}view`} style={field.style}>
                    <TextInput
                        label={value ? labelInput : <Text style={{ color: "rgba(59, 45, 43, 0.4)" }}>{labelInput}</Text>}
                        // label={label}
                        mode="outlined"
                        disabled={disabled}
                        readOnly={disabled}
                        secureTextEntry={isPassword && !showPassword}
                        value={value}
                        right={rightFix}
                        multiline={isMulti}
                        onChangeText={(value) => setValue(field.upperCase && value ? value.toUpperCase() : value)}
                        outlineStyle={{ borderWidth: 0.5, margin: 0, backgroundColor: disabled ? colors.elevation.level1 : colors.background, borderColor: 'rgba(119, 86, 81,0.3)' }}
                        style={[{ height: (field.height || (isMulti ? 100 : 40)), top: -1 }, field.upperCase && { textTransform: 'uppercase' }]}
                    />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'select':
            return (
                <View key={`${key}view`} style={[{ flexDirection: "row", alignItems: "center", gap: 5 }, field.style]}>
                    {field.label !== undefined && <Text style={[{ fontWeight: 'bold' }, field.labelStyle]}>{field.label}</Text>}
                    <View style={{ flex: 1 }}>
                        <SegmentedButtons density="small" key={key} buttons={dataSource[field.bind!] ?? []} value={value} onValueChange={(value) => !disabled && setValue(value)} />
                        {field.bind && errors?.[field.bind] !== undefined && (
                            <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                                <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                            </View>
                        )}
                    </View>
                </View>
            );
        case 'search':
            const labelSearch = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={[{ paddingVertical: 5 }, field.style]}>
                    <VcSearchList value={value} disabled={disabled} label={labelSearch} tableSearch={field.tableSearch} fField={field.fField} onChange={(item) => {
                        let valueChange: any = { [field.bind!]: (item?.[field.fField] ?? "") };
                        if (field.expression && item) {
                            Object.keys(field.expression).map(key => {
                                valueChange[key] = item[field.expression ? field.expression[key] : key];
                            });
                        }
                        setValues(valueChange);
                    }} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'selectList':
            const labelList = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={[{ paddingVertical: 5 }, field.style]}>
                    <VcSelectList disabled={disabled} data={dataSource[field.bind!] ?? []} label={labelList} key={key} clean={field.clean}
                        fValue={field.fValue} fId={field.fId} value={value} tableWin={field.tableWin} isNewEdit={field.isNewEdit}
                        fDisplay={field.fDisplay} typeDisplay={field.typeDisplay} onChange={(itemSelected) => {
                            let valueChange: any = { [field.bind!]: itemSelected?.[field.fId ?? "id"] };
                            if (field.expression && itemSelected) {
                                Object.keys(field.expression).map(key => {
                                    valueChange[key] = itemSelected[field.expression ? field.expression[key] : key];
                                });
                            }
                            setValues(valueChange);
                        }} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'selectListMulti':
            const labelListMulti = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={[field.style]}>
                    <VcSelectListMulti data={dataSource[field.bind!] ?? []} label={labelListMulti} key={key}
                        fValue={field.fValue} fId={field.fId} value={value} tableWin={field.tableWin} isNewEdit={field.isNewEdit}
                        fDisplay={field.fDisplay} typeDisplay={field.typeDisplay} onChange={(values) => setValue(values)} disabled={disabled} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'selectListPage':
            const display = getValue(field.fValue);
            const labelListPage = field.label ? evalExpr(field.label, field.requiredKeys) : undefined;
            return (
                <View key={`${key}view`} style={field.style}>
                    <VcSelectPage label={labelListPage} key={key} clean={field.clean} disabled={disabled}
                        menuId={field.menuId} tableWin={field.tableWin} defaultFilter={field.defaultFilter} isNewEdit={field.isNewEdit}
                        value={value} display={display} onChange={(itemSelected) => {
                            setValues({
                                [field.bind ?? "id"]: (itemSelected as Record<string, any>)?.[field.fId ?? "id"],
                                [field.fValue]: (itemSelected as Record<string, any>)?.[field.fValueRef ?? "name"]
                            });
                        }} />
                    {field.bind && errors?.[field.bind] !== undefined && (
                        <View style={[styles.tooltip, { borderColor: colors.vacom.borderColor, backgroundColor: "rgb(255, 218, 214)" }]}>
                            <Text style={styles.tooltipText}>{errors?.[field.bind]}</Text>
                        </View>
                    )}
                </View>
            );
        case 'line':
            return <DashedLine />
        case 'empty':
            return <View style={field.style} />
        case 'checkbox':
            return <View key={`${key}view`} style={field.style}>
                <VcCheckBox disabled={disabled} textStyle={field.textStyle} align={field.align} label={field.label} value={value}
                    onChange={(value) => field.actionName ? handleAction(field.actionName, value) : setValue(value)} type={field.typeView} />
            </View>
        case "option":
            return <View key={`${key}view`} style={field.style}>
                <VcOptions disabled={disabled} textStyle={field.textStyle} label={field.label} value={value}
                    onChange={setValue} data={dataSource[field.bind!] ?? []} />
            </View>
        case 'button':
            return <View key={`${key}view`} style={field.style}>
                <Button disabled={disabled} style={field.buttonStyle} mode={field.mode} onPress={() => handleAction(field.actionName)} >{field.label}</Button>
            </View>
        default:
            return null;
    }
};

const styles = StyleSheet.create({
    label: { color: "#888", fontSize: 13 },
    tooltip: {
        position: 'absolute',
        bottom: -8,
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