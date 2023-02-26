import express from 'express'
const router = express.Router()
import user from '../controllers/user'

router.get('/', user.getUser)

export = router
