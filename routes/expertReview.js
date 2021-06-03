import { Router } from 'express'

import controller from '../controllers/expertReview.js'

import auth from '../middleware/auth.js'

const router = Router()

router.post('/:id', auth, controller.create)

export default router