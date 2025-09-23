import { LocaleConfig } from 'react-native-calendars';
import en from './en.json';
import vi from './vi.json';

export const infoLocale = { vi, en };

export const setupCalendarLocales = (lang: 'vi' | 'en' = 'vi') => {
    LocaleConfig.locales['vi'] = vi.calendar;
    LocaleConfig.locales['en'] = en.calendar;
    LocaleConfig.defaultLocale = lang;
};