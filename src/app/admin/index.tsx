import { router } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Divider, IconButton, Text, useTheme } from 'react-native-paper';

export default function AdminScreen() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.Content title="Quản trị" />
                <IconButton icon={'apps'} iconColor={colors.secondary} onPress={() => router.replace("/list-app")} />
            </Appbar.Header>
            <Divider />
            <View style={{ flex: 1, padding: 20, gap: 10 }}>
                <Text>AdminScreen</Text>
            </View>
        </View>
    );
}
