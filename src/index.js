import express from 'express'
import { Database } from './database.js'

const PORT = process.env.PORT

const app = express()

Database().then(database => {
  app.get('/', (req, res) => {
    database.getUsers().then(results => {
      res.send(results)
    })
  })

  app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}.`)
  })
})
