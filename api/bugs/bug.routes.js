import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId',requireUser, removeBug)
router.put('/:bugId',requireUser, updateBug)
router.post('/',requireUser, addBug)

export const bugRoutes = router