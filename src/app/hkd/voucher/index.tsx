import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function VoucherHkd() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <Text>VoucherAccounting</Text>
        </View>
    );
}
