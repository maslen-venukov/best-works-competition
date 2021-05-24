import { Router } from 'express'

import controller from '../controllers/works.js'

import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = Router()

router.get('/:nomination', auth, controller.getByNomination)
router.post('/', upload.single('file'), auth, controller.create)
// router.put('/:id', auth, controller.update)
router.delete('/:id', auth, controller.remove)

export default router