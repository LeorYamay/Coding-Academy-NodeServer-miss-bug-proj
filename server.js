import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'



const app = express()
// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))


app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', async (req, res) => { })
app.get('/api/bug/save', async (req, res) => { })
app.get('/api/bug/:bugId', async (req, res) => { })
app.get('/api/bug/:bugId/remove', async (req, res) => { })