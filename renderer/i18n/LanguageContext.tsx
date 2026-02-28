'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { locales, type Language, type Locale } from './index';
import { useEditorContext } from '../context/EditorContext';

interface LanguageContextValue {
    language: Language;
    t: Locale;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useEditorContext();
    const language: Language = (settings.language as Language) || 'en';

    const t = useMemo(() => locales[language] ?? locales.en, [language]);

    return (
        <LanguageContext.Provider value={{ language, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
