import { Router } from 'express'

import controller from '../controllers/pages.js'

import auth from '../middleware/auth.js'

const router = Router()

router.get('/', controller.index)
router.get('/profile', auth, controller.profile)
router.get('/admit/:id', auth, controller.admitById)
router.get('/admit', auth, controller.admit)
router.get('/evaluate/:id', auth, controller.evaluateById)
router.get('/evaluate', auth, controller.evaluate)
router.get('/settings', auth, controller.settings)
router.get('/send-work', auth, controller.sendWork)
router.get('/login', controller.login)
router.get('/register', controller.register)
router.get('/*', controller.redirect)

export default router