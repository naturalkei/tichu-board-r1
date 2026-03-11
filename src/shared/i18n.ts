import { resolveTemplate, translator } from '@solid-primitives/i18n'
import type { Language } from '@/domain/types'
import { enDictionary } from './i18n/en'
import { koDictionary } from './i18n/ko'

const dictionaries = {
  en: enDictionary,
  ko: koDictionary,
} as const

type Dictionary = (typeof dictionaries)['en']
export type TranslationKey = keyof Dictionary

export function createTranslator(language: Language) {
  const currentDictionary = dictionaries[language]
  const translate = translator(() => currentDictionary, resolveTemplate)

  return (key: TranslationKey, args?: Record<string, string | number | boolean>) => {
    const value = args ? translate(key, args) : translate(key)
    return typeof value === 'string' ? value : ''
  }
}
