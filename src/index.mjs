import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container.mjs'

(async () => {
  const {
    getDatabaseClient,
    getI18nService,
    getAuthRouter,
    getUsersRouter,
    getDataInitializer
  } = IocContainer({ environment })

  const databaseClient = getDatabaseClient()
  await databaseClient.migrateToLatest()
  await getDataInitializer().init()

  await getI18nService().init()

  const app = express()

  app.use(express.json({ type: 'application/json' }))

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
