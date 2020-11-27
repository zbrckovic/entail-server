import express from 'express'
import { environment } from './environment.mjs'
import { DatabaseClient } from './persistence/database-client.mjs'
import { UsersService } from './services/users-service.mjs'
import { UsersRouter } from './routers/users-router.mjs'
import { Repository } from './persistence/repository.mjs'

(async () => {
  const databaseClient = DatabaseClient({ environment })

  const repository = Repository({ databaseClient })

  const usersService = UsersService({ repository })

  const usersRouter = UsersRouter({ usersService })

  await databaseClient.migrateToLatest()

  const app = express()

  app.use('/users', usersRouter)

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)

      resolve(app)
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
