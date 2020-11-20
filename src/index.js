import express from 'express'
import { environment } from './setup/environment.js'
import { initDatabase } from './persistence/database.js'
import { map, switchMap } from 'rxjs/operators/index.js'
import { createServices } from './services/create-services.js'
import { Observable } from 'rxjs'
import { createRouters } from './routers/create-routers.js'

export const initExpressApp = routers => new Observable(subscriber => {
  const { usersRouter } = routers

  const app = express()

  app.use('/users', usersRouter)

  app.listen(environment.port, () => {
    console.info(`Listening on port ${environment.port}.`)

    subscriber.next(app)
    subscriber.complete()
  })
})

initDatabase(environment)
  .pipe(
    map(createServices),
    map(createRouters),
    switchMap(initExpressApp)
  )
  .subscribe({
    complete: () => {
      console.info('Application has been successfully initialized.')
    }
  })
