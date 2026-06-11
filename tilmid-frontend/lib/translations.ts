import en from '@/messages/en.json'
import fr from '@/messages/fr.json'
import ar from '@/messages/ar.json'

type Locale = 'en' | 'fr' | 'ar'

const translations: Record<Locale, typeof en> = {
  en,
  fr,
  ar,
}

export function getTranslations(locale: string) {
  return translations[locale as Locale] || translations.en
}

export type { Locale }