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
      surface: '#FFFFFF', // --color-card (pie slice gaps)
      cursor: 'rgba(0, 0, 0, 0.04)',
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
      surface: '#261020', // --color-card in dark
      cursor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}

export function useChartTheme(demo, isDark) {
  return useMemo(() => {
    const theme = THEMES[demo] || THEMES.beautybook
    const p = isDark ? theme.dark : theme.light
    return {
      ...p,
      // Spread onto every <Tooltip>: readable label + values, soft hover band
      tooltip: {
        contentStyle: { background: p.bg, border: `1px solid ${p.grid}`, borderRadius: 12, fontSize: 13 },
        labelStyle: { color: p.text, fontWeight: 600 },
        itemStyle: { color: p.text },
        cursor: { fill: p.cursor },
      },
    }
  }, [demo, isDark])
}
