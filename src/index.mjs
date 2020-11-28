import express from 'express'
import { environment } from './environment.mjs'
import { DatabaseClient } from './persistence/database-client.mjs'
import { UsersService } from './users/users-service.mjs'
import { UsersRouter } from './users/users-router.mjs'
import { UsersRepository } from './users/users-repository.mjs'

(async () => {
  const databaseClient = DatabaseClient({ environment })
  const usersRepository = UsersRepository({ databaseClient })
  const usersService = UsersService({ usersRepository })
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
