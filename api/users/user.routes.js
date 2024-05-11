import express from 'express'
import { addUser, getUser, getUsers, removeUser, updateUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.delete('/:userId',requireAdmin, removeUser)
router.put('/:userId',requireAdmin, updateUser)
router.post('/',requireAdmin, addUser)

export const userRoutes = router