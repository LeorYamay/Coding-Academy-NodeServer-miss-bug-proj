import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ms from 'ms'
import path from 'path'
import { bugService } from './services/bug.service.js'



const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}

// Express Config:
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(cors(corsOptions))


// app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch {
        res.status(400).send('could not get bugs')
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        let bugToSave = {
            _id: req.query._id,
            title: req.query.title,
            severity: req.query.severity,
            createdAt: req.query.createdAt
        }
        console.log('bugToSave', bugToSave)
        await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        res.status(400).send('could not save bug')
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try {
        const bugId = req.params.bugId
        let bugLimiter = req.cookies.bugLimiter
        bugLimiter = updateVisitedBugs(bugId, bugLimiter)
        console.log('updateVisitedBugs-bugLimiter', bugLimiter)
        res.cookie('bugLimiter', bugLimiter)
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        if (error.message === 'bugLimit Reached') {
            res.status(401).send('Wait for a bit')
        } else {
            res.status(400).send('could not get bug')
        }
        
    }

})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('deleted')
    } catch (error) {
        res.status(400).send('could not remove bug')
    }
})

const updateVisitedBugs = (bugId, bugLimiter) => {
    const timeout = '7 seconds'
    if (!bugLimiter) {
        bugLimiter = {
            visitedBugs:[],
            lastVisit:Date.now()
        }
    }
    if (bugLimiter.visitedBugs.length < 3) {
        bugLimiter.visitedBugs.push(bugId)
        if (bugLimiter.visitedBugs.length === 3) {
            bugLimiter.lastVisit = Date.now()
        }
    }
    else {
        if (Date.now() - bugLimiter.lastVisit > ms(timeout)) {
            bugLimiter.visitedBugs = []
        }
        else {
            throw new Error('bugLimit Reached')
        }
    }
    console.log(`User visited at the following bugs:${bugLimiter.visitedBugs} within the past ${timeout}`)
    return bugLimiter
}