import { useMemo } from 'react'

const THEMES = {
  beautybook: {
    light: {
      primary: '#BE185D',
      accent: '#7C3AED',
      danger: '#F43F5E',
      teal: '#0D9488',
      colors: ['#BE185D', '#7C3AED', '#0D9488', '#DB2777', '#A78BFA'],
      bg: '#FFFFFF',
      text: '#1C0F18',
      muted: '#A08898',
      grid: '#EEE0E8',
    },
    dark: {
      primary: '#F472B6',
      accent: '#A78BFA',
      danger: '#FB7185',
      teal: '#2DD4BF',
      colors: ['#F472B6', '#A78BFA', '#2DD4BF', '#EC4899', '#C4B5FD'],
      bg: '#1E293B',
      text: '#F1F5F9',
      muted: '#94A3B8',
      grid: '#334155',
    },
  },
}

export function useChartTheme(demo, isDark) {
  return useMemo(() => {
    const theme = THEMES[demo] || THEMES.beautybook
    return isDark ? theme.dark : theme.light
  }, [demo, isDark])
}
