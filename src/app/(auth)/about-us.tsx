// app/welcome.tsx
import { VACOMTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import {
    ScalingDot
} from 'react-native-animated-pagination-dots';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Appbar, Divider, Text, useTheme } from 'react-native-paper';

const width = Dimensions.get('window').width;
const tyLe = (width - 40) / 276;

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

export default function AboutUs() {
    const { colors } = useTheme<VACOMTheme>();
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
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title='VACOM' />
            </Appbar.Header>
            <Divider />
            <PagerView style={styles.pagerView} initialPage={0} onPageScroll={onPageScroll}>
                {INTRO_DATA.map(info => {
                    return (
                        <View key={info.key} style={{
                            gap: 20,
                            alignItems: "center", justifyContent: "center", backgroundColor: '#fff'
                        }}>
                            <Image source={{ uri: info.img }} style={styles.logoSlide} resizeMode='stretch' />
                            <View style={{ flexShrink: 1, paddingHorizontal: 20, top: -180, width: 276 }}>
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

        </View>
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
        marginBottom: 20,
        top: -150
    },
    logoSlide: {
        width: 276,
        height: 459,
    }
});