const getFullName = person => {
  if(!person) {
    return null
  }

  const fullname = `${person.surname || ''} ${person.name || ''} ${person.patronymic || ''}`.trim()

  return fullname ? fullname : null
}

export default getFullName