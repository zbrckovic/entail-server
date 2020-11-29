import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container'

(async () => {
  const { getDatabaseClient, getUsersRouter } = IocContainer({ environment })

  await getDatabaseClient().migrateToLatest()

  const app = express()

  app.use('/users', getUsersRouter())

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)

      resolve(app)
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
