"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>('en');

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('reach-language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
            setLanguageState(savedLanguage);
        }
    }, []);

    // Save language to localStorage whenever it changes
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('reach-language', lang);
    }, []);

    const t = useCallback((key: TranslationKey): string => {
        return translations[language][key];
    }, [language]);

    const toggleLanguage = useCallback(() => {
        const newLang = language === 'en' ? 'th' : 'en';
        setLanguage(newLang);
    }, [language, setLanguage]);

    const value: LanguageContextType = {
        language,
        setLanguage,
        t,
        toggleLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export { LanguageContext };
