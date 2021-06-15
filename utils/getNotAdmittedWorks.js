import getFullName from './getFullName.js'

const getNotAdmittedWorks = (technicalExpertise, works, users, nominations) => {
  return technicalExpertise
    .filter(expertise => !expertise.isAdmitted)
    .map(expertise => {
      const { rejectionReason } = expertise
      const work = works.find(work => work._id.toString() === expertise.work.toString())
      const author = users.find(user => user._id.toString() === work.author.toString())
      const expert = users.find(user => user._id.toString() === expertise.expert.toString())
      const nomination = nominations.find(nomination => nomination._id.toString() === work.nomination.toString()).name
      return {
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
        nomination,
        rejectionReason
      }
    })
}

export default getNotAdmittedWorks