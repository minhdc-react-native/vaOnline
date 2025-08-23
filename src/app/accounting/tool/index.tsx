import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function ToolAccounting() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <Text>ToolAccounting</Text>
        </View>
    );
}
