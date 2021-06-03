const getScore = arr => arr.reduce((acc, el) => acc += el.value, 0)

export default getScore