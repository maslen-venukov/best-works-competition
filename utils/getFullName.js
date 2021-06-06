const getFullName = obj => {
  if(!obj) {
    return null
  }
  return `${obj.surname} ${obj.name} ${obj.patronymic}`
}

export default getFullName