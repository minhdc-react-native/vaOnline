// app/welcome.tsx
import FlagEn from '@/assets/images/united-kingdom.svg';
import FlagVi from '@/assets/images/vietnam.svg';
import FormWrapper from '@/components/formWrapper';
import { useZodValidation } from '@/components/UIEngine/hooks/useZodValidation';
import { SchemaUIEngine } from '@/components/UIEngine/schemaUIEngine';
import { IRowsColsField } from '@/components/UIEngine/types';
import { useTranslation } from '@/context/TranslationContext';
import { useAuth } from '@/hooks/useAuth';
import { infoLocale } from '@/locales/locale';
import { loginForm } from '@/schemaUI/loginForm';
import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import { getRemember, getSubDomain, saveSubDomain } from '@/utils/vcStorage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
const sloganVacom = require('@/assets/images/splash.png') // Logo

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
    const { colors } = useTheme<VACOMTheme>();
    const { view, zod, dataDefault } = loginForm;
    const [data, setData] = useState<Record<string, string>>({});
    const { validate, errors, setErrors } = useZodValidation(data, zod);
    const { login, listDvcs, getDvcsByUser } = useAuth();
    const { setTranslations } = useTranslation();
    const onChangeLang = async (lang: 'vi' | 'en') => {
        setTranslations(infoLocale[lang]['app-label']);
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
                    const domain = data[value.param];
                    if (!Helper.isEmpty(domain) && !Helper.isEmpty(data.username)) {
                        lastLoad.current = { domain: domain, username: data.username };
                        await getDvcsByUser(data.username);
                    }
                    break;
                case "username":
                    const username = data[value.param];
                    if (!Helper.isEmpty(username) && lastLoad.current.username !== username) {
                        lastLoad.current = { domain: data.domain, username: data.username };
                        await getDvcsByUser(username);
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

            setTranslations(infoLocale[lang ?? 'vi']['app-label']);
            setData({ ..._data, ...remember, domain: domain || '' });
            console.log('_data>>', { ..._data, ...remember, domain: domain || '' });
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
    }, [data, getDvcsByUser]);

    return (
        <FormWrapper style={{ justifyContent: "flex-end", padding: 20 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                <Image source={sloganVacom} style={styles.logo} />
            </View>
            <View style={{ alignSelf: "flex-end", marginBottom: 20 }}>
                <Button icon={'arrow-right-bold-hexagon-outline'} onPress={() => router.navigate({ pathname: '/(auth)/about-us', params: { lang: data.lang } })}>{data.lang === 'vi' ? 'Về chúng tôi' : 'About us'}</Button>
            </View>
            <Card style={{ padding: 20, backgroundColor: colors.background }} contentStyle={{ gap: 20 }}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Text variant='titleLarge' style={{ flex: 1, textAlign: "center" }}>{data.lang === 'vi' ? 'Đăng nhập' : 'Login'}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Pressable style={({ pressed }) => [
                            {
                                opacity: pressed ? 0.7 : (data?.lang === 'vi' ? 1 : 0.4),
                                // borderWidth: 2, borderColor: data?.lang === 'vi' ? colors.primary : colors.backdrop,
                                borderRadius: 5, overflow: "hidden"
                            }
                        ]} onPress={() => onChangeLang('vi')}>
                            <FlagVi width={30} height={30} />
                        </Pressable>
                        <Pressable style={({ pressed }) => [
                            {
                                opacity: pressed ? 0.7 : (data?.lang === 'en' ? 1 : 0.4),
                                // borderWidth: 2, borderColor: data?.lang === 'en' ? colors.primary : colors.secondary,
                                borderRadius: 5, overflow: "hidden"
                            }
                        ]} onPress={() => onChangeLang('en')}>
                            <FlagEn width={30} height={30} />
                        </Pressable>
                    </View>
                </View>

                <SchemaUIEngine schema={view} data={data} errors={errors} onChangeItemData={onChangeItemData} actionMap={actionMap} dataSource={dataSource} />
            </Card>
            <SchemaUIEngine schema={infoVacom} />
            <Text
                variant='labelMedium'
                style={{ textAlign: 'center', color: colors.backdrop }}
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
        width: "100%",
        height: "100%",
    }
});