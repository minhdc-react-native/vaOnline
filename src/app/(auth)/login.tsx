// app/welcome.tsx
import FormWrapper from '@/components/formWrapper';
import { useZodValidation } from '@/components/UIEngine/hooks/useZodValidation';
import { SchemaUIEngine } from '@/components/UIEngine/schemaUIEngine';
import { IRowsColsField } from '@/components/UIEngine/types';
import { useTranslation } from '@/context/TranslationContext';
import { useAuth } from '@/hooks/useAuth';
import { loginForm } from '@/schemaUI/loginForm';
import { Helper } from '@/utils/Helper';
import { getRemember, getSubDomain, saveSubDomain } from '@/utils/vcStorage';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Text, ToggleButton, useTheme } from 'react-native-paper';
const sloganVacom = require('@/assets/images/splash.png') // Logo
const loginTranslations = {
    vi: {
        'Link': 'Liên kết',
        'User Name': 'Tên truy cập',
        'Password': 'Mật khẩu',
        'Select OrgUnit': 'Chọn đơn vị',
        'Remember': 'Ghi nhớ',
        'Forgot Password': 'Quên mật khẩu',
        'Login': 'Đăng nhập',
        'SEARCH': 'Tìm kiếm'
    },
    en: {
        'Link': 'Link',
        'User Name': 'User Name',
        'Password': 'Password',
        'Select OrgUnit': 'Select OrgUnit',
        'Remember': 'Remember',
        'Forgot Password': 'Forgot Password',
        'Login': 'Login',
        'SEARCH': 'Search'
    }
}
const infoVacom: IRowsColsField = {
    type: "rows",
    style: { justifyContent: "center", alignItems: "center" },
    fields: [
        {
            type: 'text',
            label: 'info@vacom.com.vn',
            textStyle: { fontWeight: "bold", color: 'gray' },
            format: { type: "link", typeLink: "mailto" }
        },
        {
            type: 'text',
            label: '0931 133 233',
            textStyle: { fontWeight: "bold", color: 'gray' },
            format: { type: "link", typeLink: "tel" }
        }
    ]
}
export default function LoginScreen() {
    const { colors } = useTheme();
    const { view, zod, dataDefault } = loginForm;
    const [data, setData] = useState<Record<string, string>>({});
    const { validate, errors, setErrors } = useZodValidation(data, zod);
    const { login, listDvcs, getDvcsByUser } = useAuth();
    const { setTranslations } = useTranslation();
    const onChangeLang = async (lang: 'vi' | 'en') => {
        setTranslations(loginTranslations[lang]);
        onChangeItemData({ lang: lang });
    }
    const onChangeItemData = (valueChange: any) => {
        setData(prev => ({ ...prev, ...valueChange }));
    };

    const checkData = () => {
        const isResult = validate();
        if (!isResult) {
            setTimeout(() => {
                setErrors({});
            }, 5000);
        }
        return isResult;
    }

    const actionMap = {
        login: async () => {
            if (!checkData()) return;
            login(data);
        },
        forgotPass: () => { },
        remember: async (value: { param?: boolean }) => {
            onChangeItemData({ remember: value.param });
        },
        onBlur: async (value: { param: string }) => {
            switch (value.param) {
                case "domain":
                    await saveSubDomain(data[value.param]);
                    break;
                case "username":
                    const username = data[value.param];
                    if (!Helper.isEmpty(username) && lastLoad.current.username !== username) {
                        lastLoad.current = { domain: data.domain, username: data.username };
                        getDvcsByUser(username);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    const [dataSource, setDataSource] = useState({ dvcs: listDvcs });

    useEffect(() => {
        setDataSource({ dvcs: listDvcs });
    }, [listDvcs])

    useEffect(() => {
        const getStorage = async () => {
            const _data = dataDefault ?? { captcha_token: '', remember: false, lang: 'vi' };
            const remember = await getRemember();
            const domain = await getSubDomain();
            const lang: 'vi' | 'en' = remember ? remember.lang : _data.lang;
            setTranslations(loginTranslations[lang ?? 'vi']);
            setData({ ..._data, ...remember, domain: domain || '' });
        }
        getStorage();
    }, [])
    const lastLoad = useRef({ domain: data.domain, username: data.username });
    const firstLoad = useRef(false);
    useEffect(() => {
        if (!Helper.isEmpty(data.domain) && !Helper.isEmpty(data.username) && !firstLoad.current) {
            firstLoad.current = true;
            lastLoad.current = { domain: data.domain, username: data.username };
            getDvcsByUser(data.username);
        }
    }, [data, getDvcsByUser])
    return (
        <FormWrapper style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
                <Image source={sloganVacom} style={styles.logo} />
                {/* <TextDrop text='Accounting' heightDrop={400} /> */}
            </View>

            <Card style={{ padding: 20, backgroundColor: colors.background }} contentStyle={{ gap: 20 }}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Text variant='titleLarge' style={{ flex: 1, textAlign: "center" }}>{data.lang === 'vi' ? 'Đăng nhập' : 'Login'}</Text>
                    <ToggleButton.Group
                        onValueChange={onChangeLang}
                        value={data.lang as any}>
                        <ToggleButton icon="alpha-v" value="vi" iconColor={colors.primary}
                            style={[data.lang === "vi" && {
                                backgroundColor: colors.elevation.level1,
                                borderColor: colors.elevation.level5,
                                borderWidth: 5
                            }]} />
                        <ToggleButton icon="alpha-e" value="en" iconColor={'green'}
                            style={[data.lang === "en" && {
                                backgroundColor: colors.elevation.level1,
                                borderColor: colors.elevation.level5,
                                borderWidth: 5
                            }]} />
                    </ToggleButton.Group>
                </View>

                <SchemaUIEngine schema={view} data={data} errors={errors} onChangeItemData={onChangeItemData} actionMap={actionMap} dataSource={dataSource} />
            </Card>
            <SchemaUIEngine schema={infoVacom} />
            <Text
                variant='labelMedium'
                style={{ textAlign: 'center', color: colors.backdrop, paddingBottom: 20 }}
            >
                VACOM JSC. Copyright © 2025
            </Text>
        </FormWrapper>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: 300,
        height: 300
    },
    logo: {
        width: 400,
        height: 150,
    }
});