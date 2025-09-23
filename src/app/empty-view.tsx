// app/(drawer)/dashboard.tsx
import { TextDrop } from '@/components/vcTextAnimation';
import { VACOMTheme } from '@/theme/theme';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
export default function EmptyView() {
    const { colors } = useTheme<VACOMTheme>();
    return (
        <>
            <View style={{ flex: 1, padding: 16, justifyContent: "center", alignItems: "center", backgroundColor: colors.vacom.backLayout }}>
                <TextDrop text='Empty !' textStyle={{ fontSize: 20 }} style={{ backgroundColor: "#fff", paddingHorizontal: 50 }} />
                <LottieView
                    source={require('@/assets/animations/robot.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: 300,
        height: 300
    }
});