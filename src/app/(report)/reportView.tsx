import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function ReportView() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
            <Text>ReportViewer...</Text>
        </View>
    );
}
