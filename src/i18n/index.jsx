import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import en from './locales/en.json'
import bm from './locales/bm.json'
import cn from './locales/cn.json'

const locales = { en, bm, cn }
const LANG_KEY = 'beautybook_lang'

const LangContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(LANG_KEY) || 'en')

  const setLang = useCallback((l) => {
    setLangState(l)
    localStorage.setItem(LANG_KEY, l)
  }, [])

  const t = useCallback((key, params) => {
    let str = locales[lang]?.[key] || locales.en[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      })
    }
    return str
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, languages: ['en', 'bm', 'cn'] }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useT() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useT must be used within LanguageProvider')
  return ctx.t
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
