const getFullName = person => {
  if(!person || !Object.keys(person).length) {
    return null
  }
  return `${person.surname || ''} ${person.name || ''} ${person.patronymic || ''}`.trim()
}

export default getFullName