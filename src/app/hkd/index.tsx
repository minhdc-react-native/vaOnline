import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessHousehold() {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 10 }}>
                <Text>HỘ KINH DOANH</Text>
                <Button style={{ width: "50%" }} onPress={() => router.replace("/list-app")} >list app</Button>
            </View>
        </SafeAreaView>
    );
}
