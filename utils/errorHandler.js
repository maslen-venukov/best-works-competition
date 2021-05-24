const errorHandler = (res, status = 500, message = 'Серверная ошибка') => {
  return res.status(status).json({ message })
}

export default errorHandler