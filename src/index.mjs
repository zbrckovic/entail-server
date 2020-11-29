import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container.mjs'

(async () => {
  const { getDatabaseClient, getAuthRouter, getUsersRouter } = IocContainer({ environment })

  await getDatabaseClient().migrateToLatest()

  const app = express()

  app.use('/auth', getAuthRouter())
  app.use('/users', getUsersRouter())

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)
      resolve()
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
