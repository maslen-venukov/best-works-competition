import Work from '../models/Work.js'
import User from '../models/User.js'
import ExpertReview from '../models/ExpertReview.js'

import errorHandler from '../utils/errorHandler.js'
import getScore from '../utils/getScore.js'

class Controller {
  async create(req, res) {
    try {
      const { id: workId } = req.params
      const { _id: userId } = req.user

      const user = await User.findById(userId)
      if(user.role !== 'EXPERT') {
        return errorHandler(res, 400, 'Недостаточно прав')
      }

      const work = await Work.findById(workId)
      if(user.nomination.toString() !== work.nomination.toString()) {
        return errorHandler(res, 400, 'Недостаточно прав')
      }

      const { body } = req

      body.forEach(el => {
        const { evaluationCriterion, value } = el
        if(evaluationCriterion === undefined || value === undefined) {
          return errorHandler(res, 400, 'Неполные данные')
        }
      })

      const data = body.map(el => ({ ...el, work: workId }))
      const score = getScore(data)
      await ExpertReview.insertMany(data)
      return res.status(201).json({ message: `Работа оценена на ${score} баллов` })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()