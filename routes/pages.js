import { Router } from 'express'

import User from '../models/User.js'
import Work from '../models/Work.js'
import Nomination from '../models/Nomination.js'
import TechnicalExpertise from '../models/TechnicalExpertise.js'

import auth from '../middleware/auth.js'

import checkAuth from '../utils/checkAuth.js'

const router = Router()

router.get('/', async (req, res) => {
  const user = checkAuth(req)
  res.render('index', { title: 'Главная', user, dark: true })
})

router.get('/profile', auth, async (req, res) => {
  const { _id, role } = req.user
  const user = await User.findById(_id)

  let users = null
  let works = null

  switch(role) {
    case 'USER': {
      works = await Work.find({ author: _id }).sort({ _id: -1 })
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
  return res.render('profile', { title: 'Профиль', user, users, works, nominations })
})

router.get('/admit/:id', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)

  if(user.role !== 'EXPERT') {
    return res.redirect('/')
  }

  const work = await Work.findById(req.params.id)

  if(user.nomination.toString() !== work.nomination.toString()) {
    return res.redirect('/')
  }

  return res.render('admitById', { title: 'Допуск работ к конкурсу', user, work })
})

router.get('/admit', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)

  if(user.role !== 'EXPERT') {
    return res.redirect('/')
  }

  const { nomination } = user
  const works = await Work.find({ nomination }).sort({ _id: -1 })
  const technicalExpertise = await TechnicalExpertise.find({ work: [...works.filter(work => work.nomination.toString() === nomination.toString())] }).sort({ _id: -1 })
  return res.render('admit', { title: 'Допуск работ к конкурсу', user, works, technicalExpertise })
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