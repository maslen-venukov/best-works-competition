import { Router } from 'express'

import User from '../models/User.js'
import auth from '../middleware/auth.js'

import checkAuth from '../utils/checkAuth.js'

const router = Router()

router.get('/', async (req, res) => {
  const user = checkAuth(req)
  res.render('index', { title: 'Главная', user })
})

router.get('/me', auth, async (req, res) => {
  const { id } = req.user
  const user = await User.findById(id)
  console.log(user)
  return res.render('me', { title: 'Профиль', user })
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