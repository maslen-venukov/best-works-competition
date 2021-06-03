import Work from '../models/Work.js'
import User from '../models/User.js'
import TechnicalExpertise from '../models/TechnicalExpertise.js'

import errorHandler from '../utils/errorHandler.js'

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

      const {
        request,
        consentProcessPersonalData,
        advancingLetter,
        expertiseAct,
        aboutAuthor,
        competitionWork,
        pressRelease,
        annotation,
        reviews,
        electronicVariant,
        notPrizeWinner
      } = req.body

      if(!request || !consentProcessPersonalData || !advancingLetter || !expertiseAct || !aboutAuthor || !competitionWork || !pressRelease || !annotation || !reviews || !electronicVariant) {
        const technicalExpertise = new TechnicalExpertise({
          work: id,
          expert: user._id,
          isAdmitted: false,
          rejectionReason: 'Не соответствует приказу министерства образования Оренбургской области «Об утверждении требований к выдвигаемым работам на соискание премий Губернатора Оренбургской области в сфере науки и техники»',
          ...req.body
        })
        await technicalExpertise.save()
        return res.json({ message: `Работа не допущена к конкурсу. ${technicalExpertise.rejectionReason}.` })
      }

      if(!notPrizeWinner) {
        const technicalExpertise = new TechnicalExpertise({
          work: id,
          expert: user._id,
          isAdmitted: false,
          rejectionReason: 'Не соответствует п. 20 приложения указа Губернатора Оренбургской области от 12.11.12 № 781-ук «Об учреждении премий Губернатора Оренбургской области в сфере науки и техники»',
          ...req.body
        })
        await technicalExpertise.save()
        return res.json({ message: `Работа не допущена к конкурсу. ${technicalExpertise.rejectionReason}.` })
      }

      const technicalExpertise = new TechnicalExpertise({
        work: id,
        expert: user._id,
        isAdmitted: true,
        ...req.body
      })
      await technicalExpertise.save()
      return res.status(201).json({ message: 'Работа допущена к конкурсу' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()