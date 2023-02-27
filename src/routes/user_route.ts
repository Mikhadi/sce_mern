import express from 'express'
import auth from '../controllers/auth'
const router = express.Router()
import user from '../controllers/user'

router.get('/:id', auth.authenticateMiddleware ,user.getUser)

router.put('/', auth.authenticateMiddleware, user.updateUser)

export = router
