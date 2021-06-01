import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import Work from '../models/Work.js'
import User from '../models/User.js'

import errorHandler from '../utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class Controller {
  async create(req, res) {
    try {
      const { name, nomination } = req.body
      const { filename: file } = req.file
      const { _id: author } = req.user

      if(!name || !nomination || !req.file) {
        return errorHandler(res, 400, 'Заполните все поля')
      }

      const user = await User.findById(author)

      if(!user.organization || !user.position) {
        return errorHandler(res, 400, 'Укажите организацию и должность в настройках')
      }

      const work = new Work({
        name,
        file,
        nomination,
        author
      })

      await work.save()
      return res.status(201).json({ message: 'Работа успешно отправлена' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params
      const { _id: userId } = req.user

      const work = await Work.findById(id)

      if(work.author.toString() !== userId) {
        return errorHandler(res, 400, 'Недостаточно прав')
      }

      fs.unlinkSync(path.resolve(__dirname, '..', 'uploads', work.file))

      await work.deleteOne()
      return res.json({ message: 'Работа удалена' })
    } catch (e) {
      console.log(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()