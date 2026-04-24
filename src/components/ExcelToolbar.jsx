import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n'
import { exportSingleSheet, importFromExcel } from '@/lib/excel'
import { useToast } from '@/components/ToastProvider'

export function ExcelToolbar({ data, sheetName, onImport, fileName }) {
  const t = useT()
  const { addToast } = useToast()
  const fileRef = useRef(null)

  const handleExport = () => {
    exportSingleSheet(data, sheetName, fileName || `${sheetName}.xlsx`)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm(t('excel.importConfirm'))) { e.target.value = ''; return }
    try {
      const sheets = await importFromExcel(file)
      const rows = sheets[Object.keys(sheets)[0]] || []
      onImport(rows)
      addToast(t('excel.importSuccess'), 'success')
    } catch {
      addToast(t('excel.importError'), 'error')
    }
    e.target.value = ''
  }

  return (
    <div className="flex gap-1.5">
      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleExport}>
        📥 {t('excel.export')}
      </Button>
      {onImport && (
        <>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => fileRef.current?.click()}>
            📤 {t('excel.import')}
          </Button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
        </>
      )}
    </div>
  )
}
