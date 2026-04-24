import { useLang } from '@/i18n'
import { Globe } from 'lucide-react'

const labels = { en: 'EN', bm: 'BM', cn: '中文' }

export function LanguageSwitcher() {
  const { lang, setLang, languages } = useLang()

  return (
    <div className="flex items-center gap-1.5 bg-accent/60 rounded-xl px-1.5 py-1">
      <Globe size={13} className="text-muted-foreground ml-1" />
      {languages.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            lang === l
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  )
}
