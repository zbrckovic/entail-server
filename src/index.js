import express from 'express'
import { Observable } from 'rxjs'
import { createDatabase } from './persistence/database.js'
import { createRouters } from './routers/create-routers.js'
import { createServices } from './services/create-services.js'
import { environment } from './setup/environment.js'

export const createApp = routers => new Observable(subscriber => {
  const { usersRouter } = routers

  const app = express()

  app.use('/users', usersRouter)

  app.listen(environment.port, () => {
    console.info(`Listening on port ${environment.port}.`)

    subscriber.next(app)
    subscriber.complete()
  })
})

const database = createDatabase(environment)
const services = createServices(database)
const routers = createRouters(services)
createApp(routers).subscribe({
  complete: () => {
    console.info('Application has been successfully initialized.')
  }
})
