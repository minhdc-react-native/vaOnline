// src/context/TranslationContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Translation = {
    [key: string]: string; // KEY_LANG: VALUES_LANG
};

type TranslationContextType = {
    translations: Translation;
    setTranslations: (_t: Translation) => void;
    _: (key?: string) => string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
    const [translations, setTrans] = useState<Translation>({});

    const setTranslations = (_t: Translation) => {
        setTrans(prev => ({ ...prev, ..._t }));
    }
    const _ = (key?: string) => {
        return key ? (translations[key] || key) : ''; // nếu chưa có dịch thì fallback = key
    };

    return (
        <TranslationContext.Provider value={{ translations, setTranslations, _ }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    return context;
};
