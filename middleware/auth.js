import jwt from 'jsonwebtoken'

import errorHandler from '../utils/errorHandler.js'

const auth = (req, res, next) => {
  try {
    const { token } = req.cookies
    if(!token) {
      return res.redirect('/')
    }

    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
    req.user = decoded

    next()
  } catch (e) {
    console.log(e)
    return errorHandler(res, 401, 'Не удалось авторизоваться' )
  }
}

export default auth