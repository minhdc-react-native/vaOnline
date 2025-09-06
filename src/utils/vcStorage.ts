// src/api/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'access_token';
const REMEMBER = 'remember';
const SELECT_YEAR = 'select_year';
const ORG_UNIT = 'org_unit';
const SUB_DOMAIN = 'sub_domain';
const LANGUAGE = 'language';

export const saveSubDomain = async (subDomain: string) => {
    try {
        await AsyncStorage.setItem(SUB_DOMAIN, subDomain);
    } catch (error) { }
};

export const getSubDomain = async () => {
    try {
        return await AsyncStorage.getItem(SUB_DOMAIN);
    } catch (error) {
        return null;
    }
};

export const saveToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) { }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        return null;
    }
};

export const clearToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) { }
};

export const saveRemember = async (data: Record<string, any>) => {
    try {
        const { pass, ...newData } = data; // bỏ thuộc tính password
        await AsyncStorage.setItem(REMEMBER, JSON.stringify(newData));
    } catch (error) { }
};

export const getRemember = async () => {
    try {
        const sData = await AsyncStorage.getItem(REMEMBER);
        return sData ? JSON.parse(sData) : {};
    } catch (error) {
        return {};
    }
};
export const clearRemember = async () => {
    try {
        await AsyncStorage.removeItem(REMEMBER);
    } catch (error) { }
};
export const saveYear = async (year: string) => {
    try {
        await AsyncStorage.setItem(SELECT_YEAR, year);
    } catch (error) { }
};

export const getYear = async () => {
    try {
        return await AsyncStorage.getItem(SELECT_YEAR);
    } catch (error) {
        return null
    }

};
export const saveOrgUnit = async (id: string) => {
    try {
        await AsyncStorage.setItem(ORG_UNIT, id);
    } catch (error) { }
};
export const getOrgUnit = async () => {
    try {
        return await AsyncStorage.getItem(ORG_UNIT);
    } catch (error) {
        return null;
    }
};
export const clearOrgUnit = async () => {
    try {
        await AsyncStorage.removeItem(ORG_UNIT);
    } catch (error) { }
};