export async function generatePdf(element, filename = 'report.pdf') {
  const html2pdf = (await import('html2pdf.js')).default
  return html2pdf().set({
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(element).save()
}
