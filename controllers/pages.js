import User from '../models/User.js'
import Work from '../models/Work.js'
import Nomination from '../models/Nomination.js'
import TechnicalExpertise from '../models/TechnicalExpertise.js'
import EvaluationCriterion from '../models/EvaluationCriterion.js'
import ExpertSheet from '../models/ExpertSheet.js'
import ExpertReview from '../models/ExpertReview.js'

import checkAuth from '../utils/checkAuth.js'
import groupReviewsByWork from '../utils/groupReviewsByWork.js'
import getRating from '../utils/getRating.js'
import sendError from '../utils/sendError.js'

class Controller {
  index(req, res) {
    try {
      const user = checkAuth(req)
      return res.render('index', { title: 'Главная', user, dark: true })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async profile(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)

      let users = null
      let works = null
      let technicalExpertise = null

      switch(user.role) {
        case 'USER': {
          works = await Work.find({ author: _id }).sort({ _id: -1 })
          const worksIds = works.map(work => work._id)
          technicalExpertise = await TechnicalExpertise.find({ work: worksIds })
          break
        }

        case 'ADMIN': {
          users = await User.find({ role: { $ne: 'ADMIN' } }).sort({ _id: -1 })
          break
        }

        default:
          break
      }

      const nominations = await Nomination.find()
      return res.render('profile', { title: 'Профиль', user, users, works, nominations, technicalExpertise })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async admitById(req, res) {
    try {
      const { _id: userId } = req.user
      const { id: workId } = req.params

      const user = await User.findById(userId)

      if(user.role !== 'EXPERT') {
        return res.redirect('/')
      }

      const work = await Work.findById(workId)

      if(user.nomination.toString() !== work.nomination.toString()) {
        return res.redirect('/admit')
      }

      return res.render('admitById', { title: 'Допуск работ к конкурсу', user, work })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async admit(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)

      const { role, nomination } = user

      if(role !== 'EXPERT') {
        return res.redirect('/')
      }

      const works = await Work.find({ nomination }).sort({ _id: -1 })
      const worksIds = works.map(work => work._id)
      const technicalExpertise = await TechnicalExpertise.find({ work: worksIds })

      return res.render('admit', { title: 'Допуск работ к конкурсу', user, works, technicalExpertise })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async evaluateById(req, res) {
    try {
      const { _id: userId } = req.user
      const { id: workId } = req.params

      const user = await User.findById(userId)

      if(user.role !== 'EXPERT') {
        return res.redirect('/')
      }

      const work = await Work.findById(workId)

      if(user.nomination.toString() !== work.nomination.toString()) {
        return res.redirect('/evaluate')
      }

      const technicalExpertise = await TechnicalExpertise.findOne({ work: workId })

      if(!technicalExpertise.isAdmitted) {
        return res.redirect('/evaluate')
      }

      const evaluationCriteries = await EvaluationCriterion.find()
      const expertSheets = await ExpertSheet.find()

      const expertTable = expertSheets.map(sheet => {
        const { _id, name } = sheet
        return {
          _id,
          name,
          criteries: evaluationCriteries.filter(criterion => {
            return criterion.expertSheet.toString() === sheet._id.toString()
          })
        }
      })

      return res.render('evaluateById', { title: 'Оценка работ', user, work, expertTable })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async evaluate(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)

      const { role, nomination } = user

      if(role !== 'EXPERT') {
        return res.redirect('/')
      }

      const works = await Work.find({ nomination }).sort({ _id: -1 })
      const worksIds = works.map(work => work._id)
      const technicalExpertise = await TechnicalExpertise.find({ work: worksIds, isAdmitted: true }).sort({ _id: -1 })
      const admittedWorks = technicalExpertise.map(expertise => {
        return works.find(work => expertise.work.toString() === work._id.toString())
      })

      const expertReviews = await ExpertReview.find({ work: worksIds })

      const scores = groupReviewsByWork(expertReviews)

      return res.render(
        'evaluate',
        { title: 'Оценка работ', user, works: admittedWorks, technicalExpertise, expertReviews: scores }
      )
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async rating(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)

      if(user.role !== 'ADMIN') {
        return res.redirect('/')
      }

      const works = await Work.find()
      const nominations = await Nomination.find()
      const users = await User.find()
      const expertReviews = await ExpertReview.find().sort({ _id: -1 })
      const technicalExpertise = await TechnicalExpertise.find().sort({ _id: -1 })

      const scores = groupReviewsByWork(expertReviews)

      const rating = getRating(scores, works, nominations, users, technicalExpertise)

      return res.render('rating', { title: 'Рейтинг', user, rating })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async settings(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)
      const nominations = await Nomination.find()
      return res.render('settings', { title: 'Настройки', user, nominations })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  async sendWork(req, res) {
    try {
      const { _id } = req.user
      const user = await User.findById(_id)

      if(user.role !== 'USER') {
        return res.redirect('/')
      }

      const nominations = await Nomination.find()
      return res.render('send-work', { title: 'Отправить работу', user, nominations })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  login(req, res) {
    try {
      return res.render('login', { title: 'Авторизация' })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  register(req, res) {
    try {
      return res.render('register', { title: 'Регистрация' })
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }

  redirect(req, res) {
    try {
      return res.redirect('/')
    } catch (e) {
      console.log(e)
      return sendError(res)
    }
  }
}

export default new Controller()