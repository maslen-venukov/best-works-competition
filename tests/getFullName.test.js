import getFullName from '../utils/getFullName'

test('getFullName should return fullname of person', () => {
  expect(getFullName({ surname: 'Петров', name: 'Алексей', patronymic: 'Михайлович '})).toBe('Петров Алексей Михайлович')
  expect(getFullName({ surname: 'Сергеев', name: 'Александр' })).toBe('Сергеев Александр')
  expect(getFullName({ name: 'Виктор', patronymic: 'Евгеньевич' })).toBe('Виктор Евгеньевич')
  expect(getFullName({})).toBeNull()
  expect(getFullName(null)).toBeNull()
})