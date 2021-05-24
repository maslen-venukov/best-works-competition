import { Router } from 'express'

import controller from '../controllers/users.js'
import auth from '../middleware/auth.js'

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/logout', controller.logout)
router.post('/auth', auth, controller.auth)

export default router