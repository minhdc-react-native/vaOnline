// app/welcome.tsx
import FormWrapper from '@/components/formWrapper';
import { useZodValidation } from '@/components/UIEngine/hooks/useZodValidation';
import { SchemaUIEngine } from '@/components/UIEngine/schemaUIEngine';
import { IRowsColsField } from '@/components/UIEngine/types';
import { useTranslation } from '@/context/TranslationContext';
import { useAuth } from '@/hooks/useAuth';
import { loginForm } from '@/schemaUI/loginForm';
import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import { getRemember, getSubDomain, saveSubDomain } from '@/utils/vcStorage';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import {
    ScalingDot
} from 'react-native-animated-pagination-dots';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Card, Text, ToggleButton, useTheme } from 'react-native-paper';

const width = Dimensions.get('window').width;
const INTRO_DATA = [
    {
        key: '1',
        img: 'https://vacom.com.vn/uploads/34/tai-sao-chon-vacom/z4875508460449-be8f4266000de9338282c55311f29ee6.jpg',
        title: 'Gìn giữ sự hài lòng',
        description:
            'Chúng tôi tạo ra khách hàng hài lòng. VACOM luôn cho rằng Mỗi khách hàng là 1 sản phẩm đặc biệt và là 1 lời cam kết',
    },
    {
        key: '2',
        img: 'https://vacom.com.vn/uploads/34/tai-sao-chon-vacom/z4875508460445-546b93255e6f0c562b9debb1c624877b.jpg',
        title: 'Thấu hiểu khách hàng',
        description:
            "Chúng tôi luôn ưu tiên hiểu được nhu cầu khách hàng, từ đó sẽ luôn có giải pháp tối ưu nhất tư vấn và triển khai cho khách hàng",
    },
    {
        key: '3',
        img: 'https://vacom.com.vn/uploads/34/tai-sao-chon-vacom/z4875508466853-07ad63b60dcfd53d184c8cb858a8b4f0.jpg',
        title: 'Triển khai chuyên nghiệp',
        description:
            'Đội ngũ triển khai có chuyên môn cao, đáp ứng tuyệt đối nhu cầu của khách hàng.',
    },
    {
        key: '4',
        img: 'https://vacom.com.vn/uploads/34/tai-sao-chon-vacom/z4889492514482-895ce7a324abae0be44d9a65a04e4383.jpg',
        title: 'Bào hành tận tình',
        description:
            'Bảo hành, bảo trì trong quá trình sử dụng. Sẵn sàng mở rộng các chức năng theo nhu cầu quản trị trong tương lai.',
    },
];

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
    const { colors } = useTheme<VACOMTheme>();
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
    }, [data, getDvcsByUser]);

    const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = useRef(new Animated.Value(0)).current;
    const inputRange = [0, INTRO_DATA.length];
    const scrollX = Animated.add(
        scrollOffsetAnimatedValue,
        positionAnimatedValue
    ).interpolate({
        inputRange,
        outputRange: [0, INTRO_DATA.length * width],
    });

    const onPageScroll = useMemo(
        () =>
            Animated.event<PagerViewOnPageScrollEventData>(
                [
                    {
                        nativeEvent: {
                            offset: scrollOffsetAnimatedValue,
                            position: positionAnimatedValue,
                        },
                    },
                ],
                {
                    useNativeDriver: false,
                }
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <FormWrapper style={{ justifyContent: "flex-end", padding: 20 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                <Image source={sloganVacom} style={styles.logo} />
            </View>
            <PagerView style={styles.pagerView} initialPage={0} onPageScroll={onPageScroll}>
                {INTRO_DATA.map(info => {
                    return (
                        <View key={info.key} style={{
                            flexDirection: "row", gap: 20,
                            alignItems: "center", justifyContent: "center",
                            marginHorizontal: 20, backgroundColor: colors.background, padding: 20, borderRadius: 20, borderColor: colors.vacom.borderColor, borderWidth: 1
                        }}>
                            <Image source={{ uri: info.img }} style={styles.logoSlide} resizeMode='stretch' />
                            <View style={{ flexShrink: 1 }}>
                                <Text variant='titleSmall' style={{ fontWeight: "bold", color: colors.secondary }}>{info.title}</Text>
                                <Text variant='bodySmall' >{info.description}</Text>
                            </View>
                        </View>
                    );
                })}
            </PagerView>
            <View style={styles.dotContainer}>
                <ScalingDot
                    testID={'scaling-dot'}
                    data={INTRO_DATA}
                    //@ts-ignore
                    scrollX={scrollX}
                />
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
                style={{ textAlign: 'center', color: colors.backdrop }}
            >
                VACOM JSC. Copyright © 2025
            </Text>
        </FormWrapper>
    );
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    dotContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    lottie: {
        width: 300,
        height: 300
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    logoSlide: {
        width: 80,
        height: 150,
    }
});