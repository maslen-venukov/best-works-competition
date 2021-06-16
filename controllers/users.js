import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../models/User.js'
import Work from '../models/Work.js'
import ExpertReview from '../models/ExpertReview.js'
import TechnicalExpertise from '../models/TechnicalExpertise.js'

import errorHandler from '../utils/errorHandler.js'

const maxAge = 1000 * 3600 * 24

class Controller {
  async register(req, res) {
    try {
      const { surname, name, patronymic, email, password, passwordCheck } = req.body

      if(!surname || !name || !patronymic || !email || !password || !passwordCheck) {
        return errorHandler(res, 400, 'Заполните все поля')
      }

      const emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if(!email.match(emailRegExp)) {
        return errorHandler(res, 400, 'Некорректный email')
      }

      if(password !== passwordCheck) {
        return errorHandler(res, 400, 'Пароли не совпадают')
      }

      const passwordRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
      if(!password.match(passwordRegExp)) {
        return errorHandler(res, 400, 'Пароль должен содержать не менее 6 символов, строчные и заглавные буквы латинского алфавита, хотя бы одно число и специальный символ')
      }

      const candidate = await User.findOne({ email })
      if(candidate) {
        return errorHandler(res, 400, 'Пользователь с таким email уже зарегистрирован')
      }

      const hash = bcrypt.hashSync(password, 7)

      const user = new User({ surname, name, patronymic, email, password: hash })
      const { _id, role } = user

      const token = `Bearer ${jwt.sign({ _id, surname, name, patronymic, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })}`

      await user.save()
      return res
        .status(201)
        .cookie('token', token, {
          httpOnly: true,
          maxAge
        })
        .json({
          token,
          message: 'Пользователь успешно зарегистрирован'
        })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      if(!email || !password)
        return errorHandler(res, 400, 'Заполните все поля')

      const user = await User.findOne({ email })
      if(!user) {
        return errorHandler(res, 400, 'Неверный логин или пароль')
      }

      const isMatch = bcrypt.compareSync(password, user.password)
      if(!isMatch) {
        return errorHandler(res, 400, 'Неверный логин или пароль')
      }

      const { _id, surname, name, patronymic, role } = user
      const token = `Bearer ${jwt.sign({ _id, surname, name, patronymic, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })}`

      return res
        .cookie('token', token, {
          httpOnly: true,
          maxAge
        })
        .json({ token })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async logout(req, res) {
    try {
      return res
        .cookie('token', '', {
          httpOnly: true,
          expires: new Date(0)
        })
        .json({})
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async updateMyself(req, res) {
    try {
      const { _id } = req.user
      const { surname, name, patronymic, email, organization, position, nomination, academic_rank, academic_degree } = req.body

      const user = await User.findById(_id)

      user.surname = surname || user.surname
      user.name = name || user.name
      user.patronymic = patronymic || user.patronymic
      user.email = email || user.email
      user.organization = organization || user.organization
      user.position = position || user.position

      if(user.role === 'EXPERT') {
        user.nomination = nomination || user.nomination
        user.academic_rank = academic_rank || user.academic_rank
        user.academic_degree = academic_degree || user.academic_degree
      }

      await user.save()
      return res.json({ message: 'Изменения сохранены' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async updateById(req, res) {
    try {
      const { _id: currentUserId } = req.user
      const { id } = req.params
      const { surname, name, patronymic, email, organization, position, nomination, academic_rank, academic_degree, role } = req.body

      const currentUser = await User.findById(currentUserId)

      if(currentUser.role !== 'ADMIN') {
        return errorHandler(res, 404, 'Недостаточно прав')
      }

      const user = await User.findById(id)

      user.surname = surname || user.surname
      user.name = name || user.name
      user.patronymic = patronymic || user.patronymic
      user.email = email || user.email
      user.organization = organization || user.organization
      user.position = position || user.position
      user.nomination = nomination || user.nomination
      user.academic_rank = academic_rank || user.academic_rank
      user.academic_degree = academic_degree || user.academic_degree
      user.role = role || user.role

      await user.save()
      return res.json({ message: 'Изменения сохранены' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async remove(req, res) {
    try {
      const { _id: currentUserId } = req.user
      const { id } = req.params

      const currentUser = await User.findById(currentUserId)

      if(currentUser.role !== 'ADMIN') {
        return errorHandler(res, 404, 'Недостаточно прав')
      }

      await User.deleteOne({ _id: id })
      const works = await Work.find({ author: id })

      await Work.deleteMany({ author: id })

      const workIds = works.map(work => work._id)

      await TechnicalExpertise.deleteMany({ work: workIds })
      await ExpertReview.deleteMany({ work: workIds })

      return res.json({ message: 'Пользователь удален' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()