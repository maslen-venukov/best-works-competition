import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

import connect from './core/db.js'
import usersRouter from './routes/users.js'
import pagesRouter from './routes/pages.js'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.set('view engine', 'ejs')

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/uploads', express.static('uploads'))

app.use('/', pagesRouter)
app.use('/api/users', usersRouter)

const start = () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    connect(MONGO_URI)
  } catch (e) {
    console.log(e)
  }
}

start()