import en from './locales/en';
import tr from './locales/tr';
import de from './locales/de';
import ru from './locales/ru';
import zh from './locales/zh';
import es from './locales/es';
import fr from './locales/fr';
import pt from './locales/pt';
import vi from './locales/vi';
import ar from './locales/ar';
import ja from './locales/ja';
import ko from './locales/ko';
import it from './locales/it';

export type { Locale } from './locales/en';
export type Language = 'en' | 'tr' | 'de' | 'ru' | 'zh' | 'es' | 'fr' | 'pt' | 'vi' | 'ar' | 'ja' | 'ko' | 'it';

export const locales = { en, tr, de, ru, zh, es, fr, pt, vi, ar, ja, ko, it } as const;

export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    tr: 'Türkçe',
    de: 'Deutsch',
    ru: 'Русский',
    zh: '中文',
    es: 'Español',
    fr: 'Français',
    pt: 'Português',
    vi: 'Tiếng Việt',
    ar: 'العربية',
    ja: '日本語',
    ko: '한국어',
    it: 'Italiano',
};
