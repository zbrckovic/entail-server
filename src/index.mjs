import express from 'express'
import { Observable } from 'rxjs'
import { createRepository } from './persistence/repository.mjs'
import { createRouters } from './routers/create-routers.mjs'
import { createServices } from './services/create-services.mjs'
import { environment } from './environment.mjs'
import { createDBQueryBuilder } from './persistence/database.mjs'

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

const dbQueryBuilder = createDBQueryBuilder(environment)
const repository = createRepository({ dbQueryBuilder, environment })
const services = createServices(repository)
const routers = createRouters(services)

createApp(routers).subscribe({
  complete: () => {
    console.info('Application has been successfully initialized.')
  }
})
