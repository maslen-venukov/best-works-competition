import jwt from 'jsonwebtoken'

const checkAuth = req => {
  const { token } = req.cookies
  return token
    ? jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
    : false
}

export default checkAuth