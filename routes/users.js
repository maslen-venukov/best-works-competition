import { Router } from 'express'

import controller from '../controllers/users.js'
import auth from '../middleware/auth.js'

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.put('/:id', auth, controller.updateById)
router.put('/', auth, controller.updateMyself)
router.delete('/:id', auth, controller.remove)
router.post('/auth', auth, controller.auth)

export default router