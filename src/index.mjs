import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container.mjs'

(async () => {
  const {
    getDatabaseClient,
    getI18nService,
    getAuthRouter,
    getUsersRouter
  } = IocContainer({ environment })

  await getDatabaseClient().migrateToLatest()
  await getI18nService().init()
  const t = getI18nService().getT()
  console.log(t)

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
