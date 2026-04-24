import * as XLSX from 'xlsx'

export function exportToExcel(sheets, fileName = 'beautybook_data.xlsx') {
  const wb = XLSX.utils.book_new()
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31))
  })
  XLSX.writeFile(wb, fileName)
}

export function exportSingleSheet(data, sheetName, fileName) {
  exportToExcel([{ name: sheetName, data }], fileName || `${sheetName}.xlsx`)
}

export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const result = {}
        wb.SheetNames.forEach(name => {
          result[name] = XLSX.utils.sheet_to_json(wb.Sheets[name])
        })
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
