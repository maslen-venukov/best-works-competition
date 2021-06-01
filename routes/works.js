import { Router } from 'express'

import controller from '../controllers/works.js'

import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = Router()

router.post('/', auth, upload.single('file'), controller.create)
router.delete('/:id', auth, controller.remove)

export default router