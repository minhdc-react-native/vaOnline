// app/welcome.tsx
import { VACOMTheme } from '@/theme/theme';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import {
    ExpandingDot
} from 'react-native-animated-pagination-dots';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Appbar, Divider, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const width = Dimensions.get('window').width;

const INTRO_DATA = [
    {
        key: '1',
        img: require('@/assets/animations/about-us1.json'),
        title: 'Gìn giữ sự hài lòng', titleE: 'Maintaining satisfaction',
        description:
            'Chúng tôi tạo ra khách hàng hài lòng. VACOM luôn cho rằng Mỗi khách hàng là 1 sản phẩm đặc biệt và là 1 lời cam kết.',
        descriptionE:
            'We create satisfied customers. VACOM always believes that each customer is a special product and a commitment.',
    },
    {
        key: '2',
        img: require('@/assets/animations/about-us2.json'),
        title: 'Thấu hiểu khách hàng', titleE: 'Understanding customers',
        description:
            "Chúng tôi luôn ưu tiên hiểu được nhu cầu khách hàng, từ đó sẽ luôn có giải pháp tối ưu nhất tư vấn và triển khai cho khách hàng.",
        descriptionE:
            "We always prioritize understanding customer needs, from which we will always have the best solution to advise and implement for customers.",
    },
    {
        key: '3',
        img: require('@/assets/animations/about-us3.json'),
        title: 'Triển khai chuyên nghiệp', titleE: 'Professional implementation',
        description:
            'Đội ngũ triển khai có chuyên môn cao, đáp ứng tuyệt đối nhu cầu của khách hàng.',
        descriptionE:
            'Highly qualified implementation team, absolutely meeting customer needs.',
    },
    {
        key: '4',
        img: require('@/assets/animations/about-us4.json'),
        title: 'Bào hành tận tình', titleE: 'Wholehearted warranty',
        description:
            'Bảo hành, bảo trì trong quá trình sử dụng. Sẵn sàng mở rộng các chức năng theo nhu cầu quản trị trong tương lai.',
        descriptionE:
            'Warranty and maintenance during use. Ready to expand functions according to future administrative needs.',
    },
];

export default function AboutUs() {
    const { lang } = useLocalSearchParams();
    const { colors } = useTheme<VACOMTheme>();
    const insets = useSafeAreaInsets();
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
        <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: colors.vacom.backLayout }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title='VACOM' />
            </Appbar.Header>
            <Divider />
            <PagerView style={styles.pagerView} initialPage={0} onPageScroll={onPageScroll}>
                {INTRO_DATA.map(info => {
                    return (
                        <View key={info.key} style={{
                            borderWidth: 1, borderColor: colors.secondary, borderRadius: 20,
                            margin: 20, backgroundColor: colors.background,
                            gap: 20, alignItems: "center", justifyContent: "center"
                        }}>
                            <LottieView
                                source={info.img}
                                autoPlay
                                loop
                                style={styles.lottie}
                            />
                            <View style={{ flexShrink: 1, paddingHorizontal: 50, top: -50, gap: 10 }}>
                                <Text variant='headlineSmall' style={{ fontWeight: "bold", color: colors.secondary }}>{lang?.toString() === "vi" ? info.title : info.titleE}</Text>
                                <Text variant='titleMedium' >{lang?.toString() === "vi" ? info.description : info.descriptionE}</Text>
                            </View>
                        </View>
                    );
                })}
            </PagerView>
            <View style={styles.dotContainer}>
                <ExpandingDot
                    data={INTRO_DATA}
                    expandingDotWidth={30}
                    //@ts-ignore:next-line
                    scrollX={scrollX}
                    inActiveDotColor={colors.primary}
                    inActiveDotOpacity={0.2}
                    activeDotColor={colors.primary}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 5
                    }}
                />
            </View>
        </View>
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
    },
    pagerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    dotContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        top: -50
    }
});