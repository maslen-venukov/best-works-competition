import getFullName from './getFullName.js'

const getRating = (scores, works, nominations, users, technicalExpertise) => {
  return scores
    .map(el => {
      const work = works.find(work => el.work === work._id.toString())
      const nomination = nominations.find(nomination => work.nomination.toString() === nomination._id.toString()).name
      const author = users.find(user => work.author.toString() === user._id.toString())

      const expertise = technicalExpertise.find(expertise => el.work === expertise.work._id.toString())
      const expert = users.find(user => expertise.expert.toString() === user._id.toString())

      return {
        ...el,
        name: work.name,
        author: author ? {
          fullname: getFullName(author),
          organization: author.organization,
        } : null,
        expert: expert ? {
          fullname: getFullName(expert),
          organization: expert.organization,
          academic_degree: expert.academic_degree,
          academic_rank: expert.academic_rank
        } : null,
        nomination
      }
    })
    .sort((a, b) => b.score - a.score)
}

export default getRating