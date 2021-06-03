import getScore from './getScore.js'

const groupedReviewsByWork = arr => {
  const grouped = arr.reduce((acc, el) => {
    const field = el.work
    acc[field] = [...(acc[field] || []), el]
    return acc
  }, {})

  const mapped = Object.keys(grouped).map(group => ({
    work: group,
    score: getScore(grouped[group]),
    createdAt: grouped[group][0].createdAt
  }))

  return mapped
}

export default groupedReviewsByWork