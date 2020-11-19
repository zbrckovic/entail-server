import express from 'express'
import { environment } from './setup/environment.js'
import { initDatabase } from './persistence/database.js'
import { map, switchMap } from 'rxjs/operators/index.js'
import { createServices } from './services/create-services.js'
import { Observable } from 'rxjs'

export const initExpressApp = services => new Observable(subscriber => {
  const { userService } = services

  const app = express()

  app.get('/', (req, res) => {
    userService.getUsers().then(results => {
      res.send(results)
    })
  })

  app.listen(environment.port, () => {
    console.info(`Listening on port ${environment.port}.`)

    subscriber.next(app)
    subscriber.complete()
  })
})

initDatabase(environment)
  .pipe(
    map(createServices),
    switchMap(initExpressApp)
  )
  .subscribe({
    complete: () => {
      console.info('Application has been successfully initialized.')
    }
  })
