import express from 'express'
import { concat, Observable } from 'rxjs'
import { environment } from './environment.mjs'
import { DatabaseClient } from './persistence/database-client.mjs'
import { UsersService } from './services/users-service.mjs'
import { UsersRouter } from './routers/users-router.mjs'
import { UsersRepository } from './repositories.mjs'

export const createApp = ({ usersRouter }) => new Observable(subscriber => {
  const app = express()

  app.use('/users', usersRouter)

  app.listen(environment.port, () => {
    console.info(`Listening on port ${environment.port}.`)

    subscriber.next(app)
    subscriber.complete()
  })
})

console.debug(`Environment: ${environment.mode}`)

const databaseClient = DatabaseClient({ environment })

// repositories
const usersRepository = UsersRepository({ databaseClient })

// services
const usersService = UsersService({ usersRepository })

// routers
const usersRouter = UsersRouter({ usersService })

concat(
  databaseClient.migrateToLatest(),
  createApp({ usersRouter })
).subscribe({
  complete: () => { console.info('Application has been successfully initialized.') }
})
