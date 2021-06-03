import { Router } from 'express'

import User from '../models/User.js'
import Work from '../models/Work.js'
import Nomination from '../models/Nomination.js'
import TechnicalExpertise from '../models/TechnicalExpertise.js'
import EvaluationCriterion from '../models/EvaluationCriterion.js'
import ExpertSheet from '../models/ExpertSheet.js'

import auth from '../middleware/auth.js'

import checkAuth from '../utils/checkAuth.js'

const router = Router()

router.get('/', async (req, res) => {
  const user = checkAuth(req)
  res.render('index', { title: 'Главная', user, dark: true })
})

router.get('/profile', auth, async (req, res) => {
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
})

router.get('/admit/:id', auth, async (req, res) => {
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
})

router.get('/admit', auth, async (req, res) => {
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
})

router.get('/evaluate/:id', auth, async (req, res) => {
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
      criteries: evaluationCriteries.filter(criterion => criterion.expertSheet.toString() === sheet._id.toString())
    }
  })

  return res.render('evaluateById', { title: 'Оценка работ', user, work, expertTable })
})

// TODO спрятать кнопку Оценить у оцененых работ
// TODO отобразить количество баллов у оцененных работ

router.get('/evaluate', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)

  const { role, nomination } = user

  if(role !== 'EXPERT') {
    return res.redirect('/')
  }

  const works = await Work.find({ nomination }).sort({ _id: -1 })
  const worksIds = works.map(work => work._id)
  const technicalExpertise = await TechnicalExpertise.find({ work: worksIds, isAdmitted: true }).sort({ _id: -1 })
  const admittedWorks = technicalExpertise.map(expertise => works.find(work => expertise.work.toString() === work._id.toString()))

  return res.render('evaluate', { title: 'Оценка работ', user, works: admittedWorks, technicalExpertise })
})

router.get('/settings', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)
  const nominations = await Nomination.find()
  return res.render('settings', { title: 'Настройки', user, nominations })
})

router.get('/send-work', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)

  if(user.role !== 'USER') {
    return res.redirect('/')
  }

  const nominations = await Nomination.find()
  return res.render('send-work', { title: 'Отправить работу', user, nominations })
})

router.get('/login', (req, res) => {
  return res.render('login', { title: 'Авторизация' })
})

router.get('/register', (req, res) => {
  return res.render('register', { title: 'Регистрация' })
})

router.get('/*', (req, res) => {
  return res.redirect('/')
})

export default router