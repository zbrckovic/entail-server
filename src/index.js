import express from 'express'

const PORT = process.env.PORT

const app = express()

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}.`)
})
