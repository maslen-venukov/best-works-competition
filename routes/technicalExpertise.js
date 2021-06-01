import { Router } from 'express'

import controller from '../controllers/technicalExpertise.js'

import auth from '../middleware/auth.js'

const router = Router()

router.post('/:id', auth, controller.create)

export default router