import { router } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Divider, Text, useTheme } from 'react-native-paper';

export default function CustomScreen() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Custom" />
            </Appbar.Header>
            <Divider />
            <View style={{ flex: 1, padding: 20, gap: 10 }}>
                <Text>CustomScreen</Text>
            </View>
        </View>
    );
}
