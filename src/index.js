import express from 'express'
import { PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}.`)
})
