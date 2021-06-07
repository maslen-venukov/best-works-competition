import getScore from '../utils/getScore'

test('getScore should return score of array', () => {
  expect(getScore([{ value: 1 }, { value: 2 }, { value: 12 }])).toBe(15)
  expect(getScore([{ value: 0 }, { value: 20 }, { value: 5 }])).toBe(25)
  expect(getScore([])).toBe(0)
})