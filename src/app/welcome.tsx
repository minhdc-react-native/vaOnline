import { TextZoomIn } from '@/components/vcTextAnimation';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
const sloganVacom = require('@/assets/images/splash.png') // Logo

export default function WelcomeScreen() {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20, paddingBottom: 50 }}>
            {/* <TextCrm text='CRM' /> */}
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 50 }}>
                <Image source={sloganVacom} style={styles.logo} />
                {/* <Text variant='headlineMedium' style={[styles.textProduct, {
                    backgroundColor: colors.elevation.level2,
                    borderColor: colors.elevation.level5
                }]}>Acounting</Text> */}
                <TextZoomIn text='Ứng dụng quản lý kế toán Online' />
                <LottieView
                    source={require('@/assets/animations/login.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>

            <Button mode='contained' style={{ width: "50%" }} onPress={() => router.replace("./(auth)/login")} ><Text variant='titleMedium' style={{ fontWeight: "bold", color: "#fff" }}>Đăng nhập</Text></Button>
        </SafeAreaView>
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
    textProduct: {
        fontWeight: "bold",
        padding: 10,
        marginBottom: 20,
        borderRadius: 50,
        borderWidth: 2
    }
});