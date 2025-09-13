import { useDataApp } from '@/hooks/zustand/useDataApp';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Divider, Text, useTheme } from 'react-native-paper';

export default function CustomScreen() {
    const { colors } = useTheme();
    const { menuWin } = useLocalSearchParams();
    const itemMenuWin: IMenuWin = JSON.parse(menuWin?.toString());
    const lang = useDataApp((state) => state.lang);
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={lang === 'vi' ? itemMenuWin.label : itemMenuWin.labelE} />
            </Appbar.Header>
            <Divider />
            <View style={{ flex: 1, padding: 20, gap: 10 }}>
                <Text>CustomScreen</Text>
            </View>
        </View>
    );
}
