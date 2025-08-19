// theme/theme.ts
import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';
import { redTheme } from './redTheme';
export type VACOMTheme = MD3Theme & {
    colors: {
        vacom: {
            backLayout: string;
            deepPurple: string;
            borderColor: string;
        }
    }
};
const addProperties = {
    vacom: {
        backLayout: '#EBECF0',
        deepPurple: '#673AB7',
        borderColor: 'rgba(119, 86, 81,0.3)'
    }
};
export const theme: VACOMTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        ...redTheme,
        ...addProperties
    },
};
