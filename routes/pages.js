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
  const works = await Work.find({ author: _id })
  const nominations = await Nomination.find()
  return res.render('profile', { title: 'Профиль', user, works, nominations })
})

router.get('/settings', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)
  return res.render('settings', { title: 'Настройки', user })
})

router.get('/send-work', auth, async (req, res) => {
  const { role } = req.user
  const nominatios = await Nomination.find()
  return role === 'USER'
    ? res.render('send-work', { title: 'Отправить работу', nominatios })
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