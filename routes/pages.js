import { Router } from 'express'

import User from '../models/User.js'
import Work from '../models/Work.js'
import Nomination from '../models/Nomination.js'

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
  const users = await User.find({ role: { $ne: 'ADMIN' } }).sort({ _id: -1 })
  const works = await Work.find({ author: _id }).sort({ _id: -1 })
  const nominations = await Nomination.find()
  return res.render('profile', { title: 'Профиль', user, users, works, nominations })
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
  const nominations = await Nomination.find()
  return user.role === 'USER'
    ? res.render('send-work', { title: 'Отправить работу', user, nominations })
    : res.redirect('/')
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