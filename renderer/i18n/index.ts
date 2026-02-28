import en from './locales/en';
import tr from './locales/tr';
import de from './locales/de';

export type { Locale } from './locales/en';
export type Language = 'en' | 'tr' | 'de';

export const locales = { en, tr, de } as const;

export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    tr: 'Türkçe',
    de: 'Deutsch',
};
