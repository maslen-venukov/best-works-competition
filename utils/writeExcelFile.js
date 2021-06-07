import xlsx from 'xlsx'

const writeExcelFile = (data, path) => {
  const book = xlsx.utils.book_new()
  const sheet = xlsx.utils.json_to_sheet(data)
  xlsx.utils.book_append_sheet(book, sheet, 'Рейтинг')
  xlsx.writeFile(book, path)
}

export default writeExcelFile