import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service'



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
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))


app.get('/', (req, res) => res.send('Hello there'))
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
        await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        res.status(400).send('could not save bug')
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try {
        const bugId = req.params.bugId
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        res.status(400).send('could not get bug')
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