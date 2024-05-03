import express from 'express'
import { addbug, getbug, getbugs, removebug, updatebug } from './bug.controller.js'

const router = express.Router()

router.get('/', getbugs)
router.get('/:bugId', getbug)
router.delete('/:bugId', removebug)
router.put('/:bugId', updatebug)
router.post('/', addbug)

export const bugRoutes = router