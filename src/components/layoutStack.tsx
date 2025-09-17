// src/app/_layout.tsx

import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
interface IProgs {
    data: Record<string, { headerShown?: boolean, title?: string }>
}
export default function LayoutStack({ data }: IProgs) {
    const { colors } = useTheme();
    return (
        <Stack
            screenOptions={({ route, navigation }: any) => ({
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                // navigationBarHidden: true,
                headerStyle: {
                    backgroundColor: colors.background, // Màu nền header
                },
                // headerTintColor: '#FFFFFF', // Màu chữ và icon back trên header
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                // animation: 'slide_from_right',
                animation: "slide_from_bottom"
            })}
        >
            {Object.entries(data).map(([name, options]) => (
                <Stack.Screen key={name} name={name as keyof typeof data} options={options} />
            ))}
        </Stack>
    )
}
