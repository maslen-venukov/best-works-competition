import groupReviewsByWork from '../utils/groupReviewsByWork'

test('groupReviewsByWork should return array of objects with work and their score', () => {
  const reviews = [
    { _id:'60b874f84a5b974f0455b58b', value: 5, work: '60b747d8a9b8583fa8987891', createdAt: new Date(1622701304649) },
    { _id:'60b874f84a5b974f0455b58c', value: 5, work: '60b747d8a9b8583fa8987891', createdAt: new Date(1622701304649) },
    { _id:'60b874f84a5b974f0455b58d', value: 3, work: '60b747d8a9b8583fa8987891', createdAt: new Date(1622701304649) },
    { _id:'60b874f84a5b974f0455b58e', value: 3, work: '60b747d8a9b8583fa8987891', createdAt: new Date(1622701304649) },
    { _id:'60b874f84a5b974f0455b591', value: 20, work: '60b747d8a9b8583fa8987891', createdAt: new Date(1622701304649) },
    { _id:'60b88fb16983b924606d0a64', value: 2, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145556) },
    { _id:'60b88fb16983b924606d0a63', value: 5, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145556) },
    { _id:'60b88fb16983b924606d0a62', value: 0, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145555) },
    { _id:'60b88fb16983b924606d0a61', value: 6, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145555) },
    { _id:'60b88fb16983b924606d0a5e', value: 0, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145555) },
    { _id:'60b88fb16983b924606d0a5c', value: 20, work: '60b747e6a9b8583fa8987892', createdAt: new Date(1622708145555) }
  ]
  const result = [
    {
      work: '60b747d8a9b8583fa8987891',
      score: 36,
      createdAt: new Date('2021-06-03T06:21:44.649Z')
    },
    {
      work: '60b747e6a9b8583fa8987892',
      score: 33,
      createdAt: new Date('2021-06-03T08:15:45.556Z')
    }
  ]
  expect(groupReviewsByWork(reviews)).toEqual(result)
})